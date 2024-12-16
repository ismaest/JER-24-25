package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private List<User> userList = new ArrayList<>(); //simulamos la base de datos en memoria

    public List<User> getAllUsers() {
        return userList;
    }

    public User getUser(String name, String password) {
        return userList.stream()
            .filter(user -> user.getName().equals(name) && user.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }

    public boolean addUser(User newUser) {
        if (getUser(newUser.getName(), newUser.getPassword()) == null) {
            userList.add(newUser);
            return true;
        }
        return false;
    }

    public boolean updateUser(String oldName, String oldPass, User updatedUser) {
        User existingUser = getUser(oldName, oldPass);
        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            existingUser.setPassword(updatedUser.getPassword());
            return true;
        }
        return false;
    }

    public boolean deleteUser(String name, String password) {
        return userList.removeIf(user -> user.getName().equals(name) && user.getPassword().equals(password));
    }
}
