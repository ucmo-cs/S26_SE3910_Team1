package com.se3910.team1.backend.api.dto;

public record BranchResponse(
		Long id,
		String code,
		String name,
		String address,
		String phone,
		String hours) {
}
