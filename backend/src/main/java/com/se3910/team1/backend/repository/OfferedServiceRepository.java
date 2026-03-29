package com.se3910.team1.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.se3910.team1.backend.domain.OfferedService;

public interface OfferedServiceRepository extends JpaRepository<OfferedService, Long> {

	Optional<OfferedService> findByCode(String code);
}
