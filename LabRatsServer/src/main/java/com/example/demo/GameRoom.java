package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class GameRoom {
    private String roomId;
    private List<String> players = new ArrayList<>();
    private int maxPlayers = 2;

    public GameRoom(String roomId) {
        this.roomId = roomId;
    }

    public boolean addPlayer(String playerId) {
        if (players.size() < maxPlayers) {
            players.add(playerId);
            return true;
        }
        return false;
    }

    public void removePlayer(String playerId) {
        players.remove(playerId);
    }

    public boolean isFull() {
        return players.size() == maxPlayers;
    }

    public List<String> getPlayers() {
        return players;
    }

    public String getRoomId() {
        return roomId;
    }
}