package com.example.demo;

import org.springframework.stereotype.Component;

@Component
public class User {
	
	//Class VARIABLES
	
	private String name;
	private String password;
	
	private int arrayCount = 5; //The starting length of the user array
	private User[] userArray = new User[arrayCount]; //We create an array of users
	
	
	//CLASS METHODS
	
	//Class constructor
	public User(String name, String password) {
		this.name = name;
		this.password = password;
	}
	
	
	//Method called when trying to add a new user to the userArray. If it already exists, it stops. If the array is full, it extends
	public void AddUser(User userToAdd) {
		
		if (userArray.length == arrayCount) { //if the array hits the limit, create a new one
			
			User[] newArray = new User[2 * arrayCount]; //Create a new array with double the length
			
			for (int i = 0; i < arrayCount; i++) {
				newArray[i] = userArray[i]; //Copy all of the elements of the previous array to the new one
			}
			
			userArray = newArray; //Set the previous array to be the new one
			
		}
		
		userArray[arrayCount++] = userToAdd; //Add the element to the array
		
	}
	
	
	//Method called when trying to delete a user from the array
	public void DeleteUser(User userToDelete) {
		
		boolean found = false; //variable for checking if a coincidence has been found
		
		for(int i = 0; i < arrayCount; i++) { //Check the whole user array for a coincidence
			
			if(!found) { //if it hasn't been found yet...
				
				if(userArray[i].name == userToDelete.name) { //If the user name has been identified...
					
					found = true; //Set found to true
					
				}
				
			}
			
			//This second check is because we want to activate it as soon as the user has been found, otherwise it would go up one more user than wanted
			if(found){ //If the user to delete has been found...
				
				userArray[i] = userArray[i + 1]; //Every single user from that point on moves one way back, removing the user asked to delete
				
			}
			
		}
		
	}
	
	
	//Method called when trying to update a user
	public void UpdateUser(User oldUser, User newUser) {
		
		//First of all, we check if the user that wants to be updated already exists, in order to NOT have duplicates
		if(!UserExists(newUser)) { //if the new user name doesn't already exists, then we find the user we want to update
			
			for(int i = 0; i < arrayCount; i++) { //Check the whole user array for a coincidence
				
				if(userArray[i].name == oldUser.name) { //If the user name to replace has been identified...
					
					userArray[i] = newUser; //Replace the user in that position to the new User
					
				}
			}
			
		}

	}
	
	
	//Method called when trying to find if a specified user exists
	public boolean UserExists(User userToFind) {
		
		//Check if the specified user name already exists in the array of saved users
		for(int i = 0; i < arrayCount; i++) { //Check the whole array for the user name
			
			if(userArray[i].name == userToFind.name){ //If there is a coincidence, return true
				return  true;
			}
		}
		
		return false; //If there hasn't been a coincidence, return false
		
	}
	

}
