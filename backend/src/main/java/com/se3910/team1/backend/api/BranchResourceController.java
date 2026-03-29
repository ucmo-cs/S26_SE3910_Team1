package com.se3910.team1.backend.api;

import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se3910.team1.backend.api.dto.BranchResponse;
import com.se3910.team1.backend.domain.Branch;
import com.se3910.team1.backend.repository.BranchRepository;

@RestController
@RequestMapping("/api/branches")
public class BranchResourceController {

	private final BranchRepository branchRepository;

	public BranchResourceController(BranchRepository branchRepository) {
		this.branchRepository = branchRepository;
	}

	@GetMapping
	public List<BranchResponse> listBranches(@RequestParam(required = false) Long serviceId) {
		List<Branch> branches = serviceId == null
				? branchRepository.findAll()
				: branchRepository.findByOfferedServiceId(serviceId);
		return branches.stream()
				.sorted(Comparator.comparing(Branch::getName))
				.map(this::toResponse)
				.toList();
	}

	private BranchResponse toResponse(Branch b) {
		return new BranchResponse(
				b.getId(),
				b.getCode(),
				b.getName(),
				b.getAddress(),
				b.getPhone(),
				b.getHours());
	}
}
