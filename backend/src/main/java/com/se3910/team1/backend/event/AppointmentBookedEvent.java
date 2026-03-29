package com.se3910.team1.backend.event;

public record AppointmentBookedEvent(
		long appointmentId,
		String customerEmail,
		String customerFirstName,
		String customerLastName,
		String customerPhone,
		String branchName,
		String branchAddress,
		String serviceName,
		String appointmentDateDisplay,
		String appointmentTimeDisplay,
		String notes) {
}
