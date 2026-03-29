package com.se3910.team1.backend.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BookAppointmentRequest(
		@NotNull Long branchId,
		@NotNull Long serviceId,
		@NotBlank String date,
		@NotBlank String timeSlot,
		@NotBlank @Size(max = 128) String firstName,
		@NotBlank @Size(max = 128) String lastName,
		@NotBlank @Email @Size(max = 256) String email,
		@NotBlank @Size(max = 64) String phone,
		@Size(max = 2000) String notes) {
}
