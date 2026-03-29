package com.se3910.team1.backend.service;

import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.se3910.team1.backend.event.AppointmentBookedEvent;

import org.springframework.beans.factory.ObjectProvider;

@Service
public class AppointmentMailService {

	private static final Logger log = LoggerFactory.getLogger(AppointmentMailService.class);

	private final ObjectProvider<JavaMailSender> mailSenderProvider;

	@Value("${app.mail.from:}")
	private String appMailFrom;

	@Value("${spring.mail.username:}")
	private String springMailUsername;

	public AppointmentMailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
		this.mailSenderProvider = mailSenderProvider;
	}

	public void sendAppointmentConfirmation(AppointmentBookedEvent event) {
		JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
		if (mailSender == null) {
			log.warn(
					"JavaMailSender is not available (set spring.mail.host); skipping confirmation email to {}",
					event.customerEmail());
			return;
		}

		String from = resolveFromAddress();
		if (from == null || from.isBlank()) {
			log.warn(
					"No sender address: set environment variables MAIL_USERNAME (and MAIL_PASSWORD for SMTP auth), "
							+ "or app.mail.from. Skipping confirmation email to {}",
					event.customerEmail());
			return;
		}

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setFrom(from);
			helper.setTo(event.customerEmail());
			helper.setSubject("Bank appointment confirmation — " + event.branchName());
			helper.setText(buildPlainBody(event), buildHtmlBody(event));
			mailSender.send(message);
			log.info("Sent appointment confirmation email to {} for appointment id {}", event.customerEmail(),
					event.appointmentId());
		} catch (MailException | jakarta.mail.MessagingException e) {
			log.error(
					"Failed to send confirmation email to {} for appointment id {} (check MAIL_USERNAME / MAIL_PASSWORD and SMTP settings): {}",
					event.customerEmail(),
					event.appointmentId(),
					e.getMessage());
			log.debug("Mail send failure detail", e);
		}
	}

	private String resolveFromAddress() {
		if (appMailFrom != null && !appMailFrom.isBlank()) {
			return appMailFrom.trim();
		}
		if (springMailUsername != null && !springMailUsername.isBlank()) {
			return springMailUsername.trim();
		}
		return null;
	}

	private static String buildPlainBody(AppointmentBookedEvent e) {
		StringBuilder sb = new StringBuilder();
		sb.append("Hello ").append(e.customerFirstName()).append(",\n\n");
		sb.append("Your bank appointment is confirmed.\n\n");
		sb.append("Confirmation #: ").append(e.appointmentId()).append("\n");
		sb.append("Service: ").append(e.serviceName()).append("\n");
		sb.append("Branch: ").append(e.branchName()).append("\n");
		sb.append("Address: ").append(e.branchAddress()).append("\n");
		sb.append("Date: ").append(e.appointmentDateDisplay()).append("\n");
		sb.append("Time: ").append(e.appointmentTimeDisplay()).append("\n");
		sb.append("Phone on file: ").append(e.customerPhone()).append("\n");
		if (e.notes() != null && !e.notes().isBlank()) {
			sb.append("Notes you provided: ").append(e.notes()).append("\n");
		}
		sb.append("\nIf you need to change or cancel, please contact the branch or use the appointment app.\n");
		return sb.toString();
	}

	private static String buildHtmlBody(AppointmentBookedEvent e) {
		String notesBlock = (e.notes() == null || e.notes().isBlank())
				? ""
				: "<p><strong>Your notes:</strong> " + escapeHtml(e.notes()) + "</p>";
		return """
				<html><body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
				<p>Hello %s,</p>
				<p>Your bank appointment is <strong>confirmed</strong>.</p>
				<table style="border-collapse: collapse; margin: 1rem 0;">
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Confirmation #</strong></td><td>%d</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Service</strong></td><td>%s</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Branch</strong></td><td>%s</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Address</strong></td><td>%s</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Date</strong></td><td>%s</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Time</strong></td><td>%s</td></tr>
				<tr><td style="padding: 4px 12px 4px 0;"><strong>Phone</strong></td><td>%s</td></tr>
				</table>
				%s
				<p style="color: #444; font-size: 0.9rem;">If you need to change or cancel, contact the branch or use the appointment app.</p>
				</body></html>
				"""
				.formatted(
						escapeHtml(e.customerFirstName()),
						e.appointmentId(),
						escapeHtml(e.serviceName()),
						escapeHtml(e.branchName()),
						escapeHtml(e.branchAddress()),
						escapeHtml(e.appointmentDateDisplay()),
						escapeHtml(e.appointmentTimeDisplay()),
						escapeHtml(e.customerPhone()),
						notesBlock);
	}

	private static String escapeHtml(String raw) {
		if (raw == null) {
			return "";
		}
		return raw.replace("&", "&amp;")
				.replace("<", "&lt;")
				.replace(">", "&gt;")
				.replace("\"", "&quot;");
	}
}
