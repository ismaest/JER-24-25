package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private List<User> userList = new ArrayList<>(); // Simulamos la base de datos en memoria
    private Map<String, Boolean> playerConnections = new HashMap<>(); // Mapa para gestionar el estado de conexión de los jugadores

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userList;
    }

    // Obtener un usuario por nombre y contraseña
    public User getUser(String name, String password) {
        return userList.stream()
            .filter(user -> user.getName().equals(name) && user.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }

    // Agregar un nuevo usuario
    public boolean addUser(User newUser) {
        if (getUser(newUser.getName(), newUser.getPassword()) == null) {
            userList.add(newUser);
            return true;
        }
        return false;
    }

    // Actualizar un usuario
    public boolean updateUser(String oldName, String oldPass, User updatedUser) {
        User existingUser = getUser(oldName, oldPass);
        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            existingUser.setPassword(updatedUser.getPassword());
            return true;
        }
        return false;
    }

    // Eliminar un usuario
    public boolean deleteUser(String name, String password) {
        return userList.removeIf(user -> user.getName().equals(name) && user.getPassword().equals(password));
    }

    // Conectar un jugador (marcar como conectado)
    public boolean connectPlayer(String playerId) {
        if (playerConnections.containsKey(playerId)) {
            return false; // El jugador ya está conectado
        }
        playerConnections.put(playerId, true);
        return true;
    }

    // Desconectar un jugador (marcar como desconectado)
    public boolean disconnectPlayer(String playerId) {
        if (!playerConnections.containsKey(playerId)) {
            return false; // El jugador no está conectado
        }
        playerConnections.put(playerId, false);
        return true;
    }

    // Obtener el estado de conexión de un jugador
    public Boolean getPlayerConnectionStatus(String playerId) {
        return playerConnections.get(playerId);
    }
    
    //Obtener cuantos usuarios estan conectados al MAP para saber cuantos usuarios hay ximultaneos
    public int getConnectedPlayersAmmount() {
    	return playerConnections.size();
    }
}
