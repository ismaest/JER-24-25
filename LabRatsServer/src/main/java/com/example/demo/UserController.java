package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

public class UserController {
	
	//VARIABLES
	
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
	
	@Autowired
	private User user;
	
	
	//METHODS
	
	//Method called when trying to access an existing user. The method requires a password and a name to find said user
	@GetMapping
	public User GetUser(String name, String password) {
		
		String encodedPass = encoder.encode(password);
		
		boolean success = encoder.matches(password,  encodedPass);
		
		
		User userToFind = new User(name, password);
		
		
		if(user.UserExists(userToFind)){
			return userToFind;
		}
		
		return new User("", ""); //Returns an empty user, meaning it didn't find a user with the specified name and password
		
	}
	
	
	//Method called when trying to create a new User. The method needs a password and a name to create a user
	@PostMapping
	public User CreateUser(String name, String password) {
		
		User newUser = new User(name, password);
		
		if(!user.UserExists(newUser)) {
			return newUser; //Returns the created user because it didn't exist an exact one
		}
		
		return new User("", ""); //Returns an empty user, meaning there was already a username with the same name
		
	}
	
}
