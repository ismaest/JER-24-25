package com.example.demo;

import org.springframework.web.socket.*;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
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
 // Mapa para almacenar las posiciones de las manos de cada jugador
    private static final ConcurrentMap<String, HandPosition> handPositions = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, GameRoom> gameRooms = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = "user_" + session.getId();
        activeSessions.put(userId, session);
        System.out.println("Usuario conectado: " + userId);

        // Enviar mensaje de conexión al cliente
        session.sendMessage(new TextMessage("{\"type\": \"CONNECTED\", \"userId\": \"" + userId + "\"}"));

        // Enviar las posiciones actuales de todos los jugadores al cliente recién conectado
        for (PlayerPosition position : playerPositions.values()) {
            GameMessage positionMessage = new GameMessage();
            positionMessage.setType("POSITION_UPDATE");
            positionMessage.setPlayerId(position.getPlayerId());
            positionMessage.setX(position.getX());
            positionMessage.setY(position.getY());
            positionMessage.setTimestamp(position.getTimestamp());

            String serializedMessage = objectMapper.writeValueAsString(positionMessage);
            session.sendMessage(new TextMessage(serializedMessage));
        }
    }

    private void handleJoinRoom(GameMessage message, WebSocketSession session) throws Exception {
        String roomId = message.getPlayerId(); // Puedes usar un ID específico para la sala o generar uno dinámico
        GameRoom room = gameRooms.computeIfAbsent(roomId, id -> new GameRoom(id));

        if (room.addPlayer(message.getPlayerId())) {
            // Notificar a los jugadores de la sala
            for (String playerId : room.getPlayers()) {
                WebSocketSession playerSession = activeSessions.get(playerId);
                if (playerSession != null && playerSession.isOpen()) {
                    playerSession.sendMessage(new TextMessage(
                        "{\"type\": \"ROOM_UPDATE\", \"roomId\": \"" + roomId + "\", \"players\": " + room.getPlayers().size() + "}"
                    ));
                }
            }

            // Si la sala está completa, habilitar la opción de jugar
            if (room.isFull()) {
                for (String playerId : room.getPlayers()) {
                    WebSocketSession playerSession = activeSessions.get(playerId);
                    if (playerSession != null && playerSession.isOpen()) {
                        playerSession.sendMessage(new TextMessage(
                            "{\"type\": \"ROOM_FULL\", \"roomId\": \"" + roomId + "\"}"
                        ));
                    }
                }
            }
        } else {
            // Sala llena, notificar al cliente
            session.sendMessage(new TextMessage(
                "{\"type\": \"ROOM_FULL_ERROR\", \"roomId\": \"" + roomId + "\"}"
            ));
        }
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
                
            case "HAND_POSITION_UPDATE":
                updateHandPosition(gameMessage); // Actualiza el estado del servidor
                broadcastMessage(gameMessage, session); // Retransmite el mensaje a los demás
                break;
                
            case "JOIN_ROOM":
                handleJoinRoom(gameMessage, session);
                break;
                
            default:
                System.out.println("Tipo de mensaje desconocido: " + gameMessage.getType());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = "user_" + session.getId();
        activeSessions.remove(userId);

        // Eliminar al jugador de las salas
        for (GameRoom room : gameRooms.values()) {
            room.removePlayer(userId);

            // Notificar a los jugadores restantes
            for (String playerId : room.getPlayers()) {
                WebSocketSession playerSession = activeSessions.get(playerId);
                if (playerSession != null && playerSession.isOpen()) {
                    playerSession.sendMessage(new TextMessage(
                        "{\"type\": \"ROOM_UPDATE\", \"roomId\": \"" + room.getRoomId() + "\", \"players\": " + room.getPlayers().size() + "}"
                    ));
                }
            }
        }

        System.out.println("Usuario desconectado: " + userId);
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
        private Integer handIndex;
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
        
        public Integer getHandIndex() {
            return handIndex;
        }

        public void setHandIndex(Integer handIndex) {
            this.handIndex = handIndex;
        }
    }
    private void updatePlayerPosition(GameMessage message) {
        PlayerPosition position = new PlayerPosition();
        position.setPlayerId(message.getPlayerId());
        position.setX(message.getX());
        position.setY(message.getY());
        position.setTimestamp(message.getTimestamp());
        

        playerPositions.put(message.getPlayerId(), position);
    }
    private void updateHandPosition(GameMessage message) {
        HandPosition handPosition = new HandPosition();
        handPosition.setPlayerId(message.getPlayerId());
        handPosition.setX(message.getX());
        handPosition.setY(message.getY());
        handPosition.setHandIndex(message.getHandIndex()); // Nuevo campo para el índice de la mano
        handPosition.setTimestamp(message.getTimestamp());

        // Guardar la posición de la mano
        handPositions.put(message.getPlayerId(), handPosition);
    }
}
