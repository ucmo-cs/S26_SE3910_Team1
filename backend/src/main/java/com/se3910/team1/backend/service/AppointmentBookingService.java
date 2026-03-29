package com.se3910.team1.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.se3910.team1.backend.api.dto.BookAppointmentRequest;
import com.se3910.team1.backend.event.AppointmentBookedEvent;
import com.se3910.team1.backend.api.dto.BookAppointmentResponse;
import com.se3910.team1.backend.domain.Appointment;
import com.se3910.team1.backend.domain.AppointmentStatus;
import com.se3910.team1.backend.domain.Branch;
import com.se3910.team1.backend.domain.OfferedService;
import com.se3910.team1.backend.exception.ResourceNotFoundException;
import com.se3910.team1.backend.exception.SlotAlreadyBookedException;
import com.se3910.team1.backend.repository.AppointmentRepository;
import com.se3910.team1.backend.repository.BranchRepository;
import com.se3910.team1.backend.repository.OfferedServiceRepository;

@Service
public class AppointmentBookingService {

	private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_LOCAL_DATE;
	private static final DateTimeFormatter SLOT_PARSE = DateTimeFormatter.ofPattern("h:mm a", Locale.US);
	private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.US);

	private static final List<String> ALL_SLOTS = List.of(
			"9:00 AM",
			"9:30 AM",
			"10:00 AM",
			"10:30 AM",
			"11:00 AM",
			"11:30 AM",
			"1:00 PM",
			"1:30 PM",
			"2:00 PM",
			"2:30 PM",
			"3:00 PM",
			"3:30 PM",
			"4:00 PM",
			"4:30 PM");

	private final AppointmentRepository appointmentRepository;
	private final BranchRepository branchRepository;
	private final OfferedServiceRepository offeredServiceRepository;
	private final ApplicationEventPublisher eventPublisher;

	public AppointmentBookingService(
			AppointmentRepository appointmentRepository,
			BranchRepository branchRepository,
			OfferedServiceRepository offeredServiceRepository,
			ApplicationEventPublisher eventPublisher) {
		this.appointmentRepository = appointmentRepository;
		this.branchRepository = branchRepository;
		this.offeredServiceRepository = offeredServiceRepository;
		this.eventPublisher = eventPublisher;
	}

	public List<String> findAvailableSlots(Long branchId, Long serviceId, LocalDate date) {
		if (!branchRepository.existsById(branchId)) {
			throw new ResourceNotFoundException("Branch not found.");
		}
		if (!offeredServiceRepository.existsById(serviceId)) {
			throw new ResourceNotFoundException("Service not found.");
		}
		if (!branchRepository.existsByIdAndOfferedServices_Id(branchId, serviceId)) {
			throw new IllegalArgumentException("This branch does not offer the selected service.");
		}

		LocalDateTime dayStart = date.atStartOfDay();
		LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
		List<LocalDateTime> booked = appointmentRepository.findBookedTimesForBranchBetween(
				branchId,
				AppointmentStatus.SCHEDULED,
				dayStart,
				dayEnd);
		Set<LocalDateTime> bookedSet = new HashSet<>(booked);

		return ALL_SLOTS.stream()
				.filter(slot -> {
					LocalDateTime at = parseSlot(date, slot);
					return !bookedSet.contains(at);
				})
				.toList();
	}

	@Transactional
	public BookAppointmentResponse book(BookAppointmentRequest request) {
		Branch branch = branchRepository.findById(request.branchId())
				.orElseThrow(() -> new ResourceNotFoundException("Branch not found."));
		OfferedService service = offeredServiceRepository.findById(request.serviceId())
				.orElseThrow(() -> new ResourceNotFoundException("Service not found."));
		if (!branchRepository.existsByIdAndOfferedServices_Id(request.branchId(), request.serviceId())) {
			throw new IllegalArgumentException("This branch does not offer the selected service.");
		}

		LocalDate date = LocalDate.parse(request.date(), ISO_DATE);
		LocalDateTime appointmentAt = parseSlot(date, request.timeSlot());

		if (appointmentRepository.existsByBranch_IdAndAppointmentAtAndStatus(
				request.branchId(), appointmentAt, AppointmentStatus.SCHEDULED)) {
			throw new SlotAlreadyBookedException();
		}

		Appointment appointment = new Appointment();
		appointment.setBranch(branch);
		appointment.setService(service);
		appointment.setAppointmentAt(appointmentAt);
		appointment.setCustomerFirstName(request.firstName().trim());
		appointment.setCustomerLastName(request.lastName().trim());
		appointment.setCustomerEmail(request.email().trim());
		appointment.setCustomerPhone(request.phone().trim());
		appointment.setNotes(request.notes() != null ? request.notes().trim() : null);
		appointment.setStatus(AppointmentStatus.SCHEDULED);

		Appointment saved = appointmentRepository.save(appointment);

		String notes = saved.getNotes() != null ? saved.getNotes() : "";
		eventPublisher.publishEvent(new AppointmentBookedEvent(
				saved.getId(),
				saved.getCustomerEmail(),
				saved.getCustomerFirstName(),
				saved.getCustomerLastName(),
				saved.getCustomerPhone(),
				branch.getName(),
				branch.getAddress() != null ? branch.getAddress() : "",
				service.getName(),
				date.format(DISPLAY_DATE),
				request.timeSlot(),
				notes));

		return new BookAppointmentResponse(
				saved.getId(),
				"Appointment confirmed",
				branch.getName(),
				service.getName(),
				date.format(DISPLAY_DATE),
				request.timeSlot());
	}

	@Transactional
	public void cancelAppointment(Long id) {
		Appointment appointment = appointmentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));
		if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
			return;
		}
		appointment.setStatus(AppointmentStatus.CANCELLED);
	}

	private LocalDateTime parseSlot(LocalDate date, String slotLabel) {
		LocalTime time = LocalTime.parse(slotLabel.trim(), SLOT_PARSE);
		return LocalDateTime.of(date, time);
	}
}
