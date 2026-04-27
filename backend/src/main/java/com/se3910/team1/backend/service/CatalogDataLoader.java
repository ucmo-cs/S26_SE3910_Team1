package com.se3910.team1.backend.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.se3910.team1.backend.domain.Branch;
import com.se3910.team1.backend.domain.OfferedService;
import com.se3910.team1.backend.repository.BranchRepository;
import com.se3910.team1.backend.repository.OfferedServiceRepository;

@Component
public class CatalogDataLoader implements CommandLineRunner {

	private final OfferedServiceRepository offeredServiceRepository;
	private final BranchRepository branchRepository;

	public CatalogDataLoader(
			OfferedServiceRepository offeredServiceRepository,
			BranchRepository branchRepository) {
		this.offeredServiceRepository = offeredServiceRepository;
		this.branchRepository = branchRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		if (offeredServiceRepository.count() > 0) {
			return;
		}

		List<OfferedService> services = List.of(
				service("account", "Open Account", "Open a new checking or savings account", "30 min", "CreditCard"),
				service("loan", "Loan Consultation", "Personal, auto, or home loan discussions", "45 min", "Home"),
				service("investment", "Investment Advice", "Meet with a financial advisor", "60 min", "TrendingUp"),
				service("business", "Business Banking", "Business accounts and services", "45 min", "Users"),
				service("mortgage", "Mortgage Services", "Mortgage applications and refinancing", "60 min", "FileText"),
				service("general", "General Inquiry", "General banking questions and support", "15 min", "Banknote"));
		offeredServiceRepository.saveAll(services);

		Map<String, OfferedService> servicesByCode = offeredServiceRepository.findAll().stream()
				.collect(Collectors.toMap(OfferedService::getCode, Function.identity()));

		Branch downtown = branch(
				"downtown",
				"Downtown Branch",
				"123 Main Street, Suite 100, City, ST 12345",
				"(555) 123-4567",
				"Mon-Fri: 9:00 AM - 5:00 PM");
		Branch westside = branch(
				"westside",
				"Westside Branch",
				"456 Oak Avenue, City, ST 12346",
				"(555) 234-5678",
				"Mon-Fri: 9:00 AM - 5:00 PM");
		Branch northgate = branch(
				"northgate",
				"Northgate Branch",
				"789 Pine Road, City, ST 12347",
				"(555) 345-6789",
				"Mon-Fri: 8:30 AM - 5:30 PM");
		Branch southpark = branch(
				"southpark",
				"Southpark Branch",
				"321 Elm Boulevard, City, ST 12348",
				"(555) 456-7890",
				"Mon-Fri: 9:00 AM - 5:00 PM");

		assignServices(downtown, servicesByCode, "account", "general", "loan", "business");
		assignServices(westside, servicesByCode, "account", "general", "mortgage");
		assignServices(northgate, servicesByCode, "investment", "business", "mortgage", "general");
		assignServices(southpark, servicesByCode, "loan", "mortgage", "investment", "account");

		branchRepository.saveAll(List.of(downtown, westside, northgate, southpark));
	}

	private static void assignServices(
			Branch branch, Map<String, OfferedService> servicesByCode, String... serviceCodes) {
		Set<OfferedService> assigned = new LinkedHashSet<>();
		for (String code : serviceCodes) {
			OfferedService service = servicesByCode.get(code);
			if (service == null) {
				throw new IllegalStateException(
						"Unknown service code '" + code + "' for branch '" + branch.getCode()
								+ "'. Known codes: " + servicesByCode.keySet());
			}
			assigned.add(service);
		}
		branch.getOfferedServices().addAll(assigned);
	}

	private static OfferedService service(
			String code, String name, String description, String durationLabel, String iconKey) {
		OfferedService s = new OfferedService();
		s.setCode(code);
		s.setName(name);
		s.setDescription(description);
		s.setDurationLabel(durationLabel);
		s.setIconKey(iconKey);
		return s;
	}

	private static Branch branch(String code, String name, String address, String phone, String hours) {
		Branch b = new Branch();
		b.setCode(code);
		b.setName(name);
		b.setAddress(address);
		b.setPhone(phone);
		b.setHours(hours);
		return b;
	}
}
