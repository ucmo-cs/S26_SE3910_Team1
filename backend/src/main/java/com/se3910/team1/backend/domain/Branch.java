package com.se3910.team1.backend.domain;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "branches")
public class Branch {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 64)
	private String code;

	@Column(nullable = false)
	private String name;

	@Column(length = 512)
	private String address;

	@Column(length = 64)
	private String phone;

	@Column(length = 128)
	private String hours;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "branch_offered_services",
			joinColumns = @JoinColumn(name = "branch_id"),
			inverseJoinColumns = @JoinColumn(name = "service_id"))
	private Set<OfferedService> offeredServices = new HashSet<>();

	public Long getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getHours() {
		return hours;
	}

	public void setHours(String hours) {
		this.hours = hours;
	}

	public Set<OfferedService> getOfferedServices() {
		return offeredServices;
	}

	public void setOfferedServices(Set<OfferedService> offeredServices) {
		this.offeredServices = offeredServices;
	}
}
