package com.se3910.team1.backend.event;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.se3910.team1.backend.service.AppointmentMailService;

@Component
public class AppointmentConfirmationMailListener {

	private final AppointmentMailService appointmentMailService;

	public AppointmentConfirmationMailListener(AppointmentMailService appointmentMailService) {
		this.appointmentMailService = appointmentMailService;
	}

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void onAppointmentBooked(AppointmentBookedEvent event) {
		appointmentMailService.sendAppointmentConfirmation(event);
	}
}
