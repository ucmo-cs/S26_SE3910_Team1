package com.se3910.team1.backend.api.dto;

public record BookAppointmentResponse(
		Long id,
		String message,
		String branchName,
		String serviceName,
		String date,
		String time) {
}
