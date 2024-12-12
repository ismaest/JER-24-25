package com.example.demo;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EndingController {

	//method called when the game is finished
	@PostMapping 
	public void EndGame() {
		//
	}
}
