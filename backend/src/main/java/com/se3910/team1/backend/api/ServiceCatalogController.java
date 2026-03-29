package com.se3910.team1.backend.api;

import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se3910.team1.backend.api.dto.ServiceResponse;
import com.se3910.team1.backend.domain.OfferedService;
import com.se3910.team1.backend.repository.OfferedServiceRepository;

@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {

	private final OfferedServiceRepository offeredServiceRepository;

	public ServiceCatalogController(OfferedServiceRepository offeredServiceRepository) {
		this.offeredServiceRepository = offeredServiceRepository;
	}

	@GetMapping
	public List<ServiceResponse> listServices() {
		return offeredServiceRepository.findAll().stream()
				.sorted(Comparator.comparing(OfferedService::getName))
				.map(this::toResponse)
				.toList();
	}

	private ServiceResponse toResponse(OfferedService s) {
		return new ServiceResponse(
				s.getId(),
				s.getCode(),
				s.getName(),
				s.getDescription(),
				s.getDurationLabel(),
				s.getIconKey());
	}
}
