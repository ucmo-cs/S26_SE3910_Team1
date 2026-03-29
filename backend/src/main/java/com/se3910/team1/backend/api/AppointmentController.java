package com.se3910.team1.backend.api;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.se3910.team1.backend.api.dto.AvailableTimesResponse;
import com.se3910.team1.backend.api.dto.BookAppointmentRequest;
import com.se3910.team1.backend.api.dto.BookAppointmentResponse;
import com.se3910.team1.backend.service.AppointmentBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

	private final AppointmentBookingService appointmentBookingService;

	public AppointmentController(AppointmentBookingService appointmentBookingService) {
		this.appointmentBookingService = appointmentBookingService;
	}

	@GetMapping("/available-times")
	public AvailableTimesResponse availableTimes(
			@RequestParam Long branchId,
			@RequestParam Long serviceId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return new AvailableTimesResponse(
				appointmentBookingService.findAvailableSlots(branchId, serviceId, date));
	}

	@PostMapping("/book")
	@ResponseStatus(HttpStatus.CREATED)
	public BookAppointmentResponse book(@Valid @RequestBody BookAppointmentRequest request) {
		return appointmentBookingService.book(request);
	}

	@DeleteMapping("/{id}/cancel")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void cancel(@PathVariable Long id) {
		appointmentBookingService.cancelAppointment(id);
	}
}
