package com.example.demo;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArraySet;

public class WebsocketEchoHandler extends TextWebSocketHandler {

	// Map para gestionar usuarios conectados
    private static final ConcurrentMap<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final ConcurrentMap<String, PlayerPosition> playerPositions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Añadir usuario con un ID único
        String userId = "user_" + session.getId();
        activeSessions.put(userId, session);
        System.out.println("Usuario conectado: " + userId);

        // Enviar un mensaje al cliente para confirmar la conexión
        session.sendMessage(new TextMessage("{\"type\": \"CONNECTED\", \"userId\": \"" + userId + "\"}"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Mensaje recibido: " + message.getPayload());

        // Parsear el mensaje recibido (asumiendo JSON)
        GameMessage gameMessage = objectMapper.readValue(message.getPayload(), GameMessage.class);

        switch (gameMessage.getType()) {
            case "CHAT":
                broadcastMessage(gameMessage, session);
                break;

            case "POSITION_UPDATE":
            	updatePlayerPosition(gameMessage);
            	broadcastMessage(gameMessage, session);
                break;

            default:
                System.out.println("Tipo de mensaje desconocido: " + gameMessage.getType());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        activeSessions.values().remove(session);
        System.out.println("Usuario desconectado: " + session.getId());
    }

    private void broadcastMessage(GameMessage message, WebSocketSession sender) throws Exception {
        String serializedMessage = objectMapper.writeValueAsString(message);
        for (WebSocketSession session : activeSessions.values()) {
            if (session.isOpen() && session != sender) {
                session.sendMessage(new TextMessage(serializedMessage));
            }
        }
    }

    // Clase auxiliar para manejar mensajes
    private static class GameMessage {
        private String type;
        private String playerId;
        private double x;
        private double y;
        private String timestamp;

        // Getters y setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getPlayerId() { return playerId; }
        public void setPlayerId(String playerId) { this.playerId = playerId; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }
    private void updatePlayerPosition(GameMessage message) {
        PlayerPosition position = new PlayerPosition();
        position.setPlayerId(message.getPlayerId());
        position.setX(message.getX());
        position.setY(message.getY());
        position.setTimestamp(message.getTimestamp());

        playerPositions.put(message.getPlayerId(), position);
    }
}