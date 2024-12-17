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
        try {
            // Registrar al usuario
            boolean userCreated = userService.addUser(newUser);
            if (!userCreated) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
            }

            // Conectar al jugador después de crear el usuario, usando el nombre
            boolean connectionStatus = userService.connectPlayer(newUser.getName());  // Usamos el nombre en lugar del id
            if (connectionStatus) {
                return ResponseEntity.status(HttpStatus.CREATED).body("User created and connected successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error connecting the player");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing the request");
        }
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

    // Nuevas rutas para gestionar conexiones
    @PostMapping("/connect")
    public ResponseEntity<String> connectPlayer(@RequestParam String playerName) {
        if (userService.connectPlayer(playerName)) {
            return ResponseEntity.ok("Jugador conectado");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al conectar jugador");
    }

    @PostMapping("/disconnect")
    public ResponseEntity<String> disconnectPlayer(@RequestParam String playerName) {
        if (userService.disconnectPlayer(playerName)) {
            return ResponseEntity.ok("Jugador desconectado");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al desconectar jugador");
    }

    @GetMapping("/connection-status/{playerName}")
    public ResponseEntity<Boolean> getPlayerConnectionStatus(@PathVariable String playerName) {
        Boolean isConnected = userService.getPlayerConnectionStatus(playerName);
        if (isConnected != null) {
            return ResponseEntity.ok(isConnected);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
