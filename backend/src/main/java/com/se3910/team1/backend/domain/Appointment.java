package com.se3910.team1.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointments")
public class Appointment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "service_id", nullable = false)
	private OfferedService service;

	@Column(nullable = false)
	private LocalDateTime appointmentAt;

	@Column(nullable = false, length = 128)
	private String customerFirstName;

	@Column(nullable = false, length = 128)
	private String customerLastName;

	@Column(nullable = false, length = 256)
	private String customerEmail;

	@Column(nullable = false, length = 64)
	private String customerPhone;

	@Column(length = 2000)
	private String notes;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private AppointmentStatus status = AppointmentStatus.SCHEDULED;

	public Long getId() {
		return id;
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
	}

	public OfferedService getService() {
		return service;
	}

	public void setService(OfferedService service) {
		this.service = service;
	}

	public LocalDateTime getAppointmentAt() {
		return appointmentAt;
	}

	public void setAppointmentAt(LocalDateTime appointmentAt) {
		this.appointmentAt = appointmentAt;
	}

	public String getCustomerFirstName() {
		return customerFirstName;
	}

	public void setCustomerFirstName(String customerFirstName) {
		this.customerFirstName = customerFirstName;
	}

	public String getCustomerLastName() {
		return customerLastName;
	}

	public void setCustomerLastName(String customerLastName) {
		this.customerLastName = customerLastName;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public AppointmentStatus getStatus() {
		return status;
	}

	public void setStatus(AppointmentStatus status) {
		this.status = status;
	}
}
