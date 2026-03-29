package com.se3910.team1.backend.api.dto;

public record ServiceResponse(
		Long id,
		String code,
		String name,
		String description,
		String duration,
		String icon) {
}
