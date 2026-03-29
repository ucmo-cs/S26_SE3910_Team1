package com.se3910.team1.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.se3910.team1.backend.domain.Appointment;
import com.se3910.team1.backend.domain.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	boolean existsByBranch_IdAndAppointmentAtAndStatus(
			Long branchId,
			LocalDateTime appointmentAt,
			AppointmentStatus status);

	@Query("SELECT a.appointmentAt FROM Appointment a WHERE a.branch.id = :branchId "
			+ "AND a.status = :status AND a.appointmentAt >= :start AND a.appointmentAt < :end")
	List<LocalDateTime> findBookedTimesForBranchBetween(
			@Param("branchId") Long branchId,
			@Param("status") AppointmentStatus status,
			@Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end);
}
