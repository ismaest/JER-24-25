package com.example.demo;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import org.springframework.stereotype.Component;


@Component
public class User {
	
	//Class VARIABLES
	
	private String name;
	private String password;
	
	private static int arrayCount; //The length of the user array
	private static User[] userArray; //The array of users
	
	
	//CLASS METHODS
	
	
	//Main method
	public static void main(String[] args) {
		
		//Read and split all elements in the array of users by commas and spaces
		String[] documentElements = ReadUsers().split(",\\s");
		
		//Create the user array with the already existing users in the UserList.txt document, this way this information is persistent
		arrayCount = documentElements.length * 2; //Set the arrayCount to the amount of user already existing times two
		userArray = new User[arrayCount]; //Create the array of users with the previously specified length
		
		System.out.println(arrayCount);
		
		//variables to specify which line to read in order to get the proper names and passwords
		int nameInt = 0;
		int passInt = 1;
		
		for(int i = 0; i < arrayCount; i++) {
			
			//We assign to each element of the array the user and password of each and every user in the text file
			userArray[i] = new User(documentElements[nameInt], documentElements[passInt]);
			
			//This updated the amount of lines the code has to keep through to get to each new name and password
			nameInt += 3;
			passInt += 3;
			
		}
		
		
	}
	
	
	//Class constructor with two strings
	public User(String name, String password) {
		this.name = name;
		this.password = password;
	}
	
	//Empty class constructor
	public User() {}
	
	
	//Method called when trying to add a new user to the userArray. If it already exists, it stops. If the array is full, it extends
	public void AddUser(User userToAdd) {
		
		if(!UserExists(userToAdd)) { //Check if the user that wants to  be added already exists, if not, proceed
			
			if (userArray.length == arrayCount) { //if the array hits the limit, create a new one
				
				User[] newArray = new User[2 * arrayCount]; //Create a new array with double the length
				
				for (int i = 0; i < arrayCount; i++) {
					newArray[i] = userArray[i]; //Copy all of the elements of the previous array to the new one
				}
				
				userArray = newArray; //Set the previous array to be the new one
				
			}
			
			userArray[arrayCount++] = userToAdd; //Add the element to the array
			
		}

	}
	
	
	//Method called when trying to delete a user from the array
	public void DeleteUser(User userToDelete) {
		
		boolean found = false; //variable for checking if a coincidence has been found
		
		for(int i = 0; i < arrayCount; i++) { //Check the whole user array for a coincidence
			
			if(!found) { //if it hasn't been found yet...
				
				found = UserExists(userArray[i]);
				
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
				
				if(userArray[i] == oldUser) { //If the user name to replace has been identified...
					
					userArray[i] = newUser; //Replace the user in that position to the new User
					
				}
			}
			
		}
		
	}
	
	
	//Method called when trying to get a specified user
	public User GetUser(User userToFind) {
		
		for(int i = 0; i < arrayCount; i++) { //Check the whole array for the user name
			
			if(userArray[i].name == userToFind.name){ //If there is a coincidence, return the specified user
				return userArray[i];
			}
		}
		
		return new User("", ""); //If there hasn't been a coincidence, return an empty User
		
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
	
	
	//Method called to Read the UserList document in order to get all the users saved 
	public static String ReadUsers() {
		
		try(BufferedReader br =  new BufferedReader(new FileReader("/UserList.txt"))){
			
			StringBuilder sb = new StringBuilder();
			String line = br.readLine();
			
			while (line != null) {
				sb.append(line);
				sb.append(System.lineSeparator());
			}
			
			String everything = sb.toString();
			
			return everything;
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return "NULL";
		
	}
	
	
	//Method called to save all of the users in the array list into the UserList text document for the next time the server is opened
	public static void WriteUsers() {
		
		try(BufferedWriter wr = new BufferedWriter(new FileWriter("/UserList.txt"))) {
			
			for(int i = 0; i < arrayCount; i++) {
				wr.write(userArray[i].name + "," + userArray[i].password + " ");
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
}