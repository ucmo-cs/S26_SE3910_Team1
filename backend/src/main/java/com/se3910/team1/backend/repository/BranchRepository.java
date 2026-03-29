package com.se3910.team1.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.se3910.team1.backend.domain.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {

	@Query("SELECT DISTINCT b FROM Branch b JOIN b.offeredServices s WHERE s.id = :serviceId ORDER BY b.name")
	List<Branch> findByOfferedServiceId(@Param("serviceId") Long serviceId);

	boolean existsByIdAndOfferedServices_Id(Long branchId, Long serviceId);
}
