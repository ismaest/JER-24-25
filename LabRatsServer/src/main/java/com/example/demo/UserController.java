package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import java.lang.*;

@Controller
public class UserController {
	
	//VARIABLES
	
	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
	
	@Autowired
	private User user;
	
	
	//METHODS
	
	
	//Method called when trying to access an existing user. The method requires a password and a name to find said user
	@GetMapping
	public User GetUser(String name, String password) {
		
		User userToFind = new User(name, password);
		
		if(user.UserExists(userToFind)){
			return user.GetUser(userToFind); //if the user as found, the method return the user that was being asked for
		}
		
		return new User("", ""); //Returns an empty user, meaning it didn't find a user with the specified name and password
		
	}
	
	
	//Method called when trying to create a new User. The method needs a password and a name to create a user
	@PostMapping
	public User CreateUser(String name, String password) {
		
		User newUser = new User(name, password);
		
		if(!user.UserExists(newUser)) {
			user.AddUser(newUser); //The user is added to the userArray
			return user.GetUser(newUser); //Returns the created user because
		}
		
		return new User("", ""); //Returns an empty user, meaning there was already a user name with the same name
		
	}
	
	
	//Method called when trying to update a player with a new user name and password
	@PutMapping
	public User UpdateUser(String oldName, String oldPass, String newName, String newPass) {
		
		User oldUser = new User(oldName, oldPass);
		User newUser = new User(newName, newPass);
		
		user.UpdateUser(user.GetUser(oldUser), newUser); //It takes the old user and updates it with the new one
		
		if(user.UserExists(newUser)) {
			return user.GetUser(newUser); //It returns the newly updated user
		}
		
		return new User("", ""); //If there hasn't been an update, the method return an empty User
		
	}
	
	
	//Method called when trying to delete a user
	@DeleteMapping
	public void DeleteUser(String name, String password) {
		
		user.DeleteUser(new User(name, password)); //Calls to the deletion method with the specified user to delete
		
	}
	
}
