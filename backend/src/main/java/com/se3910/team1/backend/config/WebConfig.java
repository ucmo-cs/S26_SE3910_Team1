package com.se3910.team1.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// A mismatched browser Origin on POST often surfaces as HTTP 403 Forbidden (CORS).
		// allowCredentials must stay false when using "*" origin pattern.
		registry.addMapping("/api/**")
				.allowedOriginPatterns("*")
				.allowedMethods("GET", "POST", "DELETE", "OPTIONS", "HEAD", "PUT", "PATCH")
				.allowedHeaders("*")
				.maxAge(3600);
	}
}
