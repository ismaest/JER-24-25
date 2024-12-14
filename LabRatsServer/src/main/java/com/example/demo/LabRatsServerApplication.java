package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LabRatsServerApplication {
	
	@Bean
	public User user() {
		return new User("", "");
	}
	
	public static void main(String[] args) {
		SpringApplication.run(LabRatsServerApplication.class, args);
	}

}
