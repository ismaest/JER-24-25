package com.example.demo;



public class HandPosition {

    private String playerId;  // ID del jugador, se usará para asociar la mano con un jugador
    private double x;         // Coordenada X de la mano
    private double y;         // Coordenada Y de la mano
    private int handIndex;    // Índice de la mano (si es izquierda, derecha, etc.)
    private String timestamp; // Timestamp de la última actualización

    // Getters y Setters
    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public int getHandIndex() {
        return handIndex;
    }

    public void setHandIndex(int handIndex) {
        this.handIndex = handIndex;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}