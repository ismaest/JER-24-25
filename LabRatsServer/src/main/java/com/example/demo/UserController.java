package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getUser(@RequestParam String name, @RequestParam String password) {
        User user = userService.getUser(name, password);
        return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User newUser) {
        if (userService.addUser(newUser)) {
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
    }

    @PutMapping
    public ResponseEntity<String> updateUser(@RequestParam String oldName, @RequestParam String oldPass,
                                             @RequestBody User updatedUser) {
        if (userService.updateUser(oldName, oldPass, updatedUser)) {
            return ResponseEntity.ok("User updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestParam String name, @RequestParam String password) {
        if (userService.deleteUser(name, password)) {
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
