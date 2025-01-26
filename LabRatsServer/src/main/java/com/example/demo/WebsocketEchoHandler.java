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
        
        for(WebSocketSession sessions : activeSessions.values()){
        	UpdatePlayerJoined(sessions);
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
                broadcastMessage(gameMessage, session);
                break;
                
            case "START_GAME":
            	assignRol(gameMessage);
            	broadcastMessage(gameMessage, session);
            	break;
            	
            case "CHECK_ROOM":
            	//checkRoomFull(gameMessage);
                broadcastMessage(gameMessage, session);
            	break;
            	
            case "LIFE_UPDATE":
            	broadcastMessage(gameMessage, session);
            	break;
            	
            case "WIN_SCENE":
            	broadcastMessage(gameMessage, session);
            	break;
            
            case "PLAYER_DISCONECT":
            	broadcastMessage(gameMessage, session);
            	break;
            	
            case "PLAYER_CONNECT":
            	broadcastMessage(gameMessage, session);
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
        
        for(WebSocketSession sessions : activeSessions.values()){
        	UpdatePlayerLeft(sessions);
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
        private boolean roomFull;
        private String roomId;
        private Integer rolId = 0; //0: Rat / 1: Scientist
        private Integer numOfPlayers;

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
        
        public boolean getRoomFull() { return roomFull; }
        public void setRoomFull(boolean full) { this.roomFull = full; }
        
        public String getRoomId() { return roomId; }
        public void setRoomId(String roomID) { this.roomId = roomID; }
        
        public Integer getHandIndex() {return handIndex; }
        public void setHandIndex(Integer handIndex) { this.handIndex = handIndex; }
        
        public Integer getRolId() {return rolId; }
        public void setRolId(Integer rol) { this.rolId = rol; }
        
        public Integer getNumOfPlayers() {return numOfPlayers; }
        public void setNumOfPlayers(Integer num) { this.numOfPlayers = numOfPlayers; }
        
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
        handPosition.setHandIndex(message.getHandIndex());
        handPosition.setTimestamp(message.getTimestamp());

        // Guardar la información en el servidor (si es necesario)
        handPositions.put(message.getPlayerId(), handPosition);
    }
    
    private void assignRol(GameMessage message){
    	message.setRolId(1);
    }
    
    private void checkRoomFull(GameMessage message) {
        String localRoomId = message.getPlayerId(); // Puedes usar un ID específico para la sala o generar uno dinámico
        GameRoom room = null;
        
        if(message.getRoomId() == null) {
        	message.setRoomId(localRoomId);
        }
        
        if(gameRooms.containsKey(message.getRoomId())) {
        	room = gameRooms.get(message.getRoomId());
        } else {
        	room = new GameRoom(message.getRoomId()); 
        }
        
        room.addPlayer(message.getPlayerId());
        
        if(room.isFull()) {
        	message.setRoomFull(true);
        } else {
        	message.setRoomFull(false);
        }
    }
    
    private void UpdatePlayerLeft(WebSocketSession session) throws Exception {
        session.sendMessage(new TextMessage(
                "{\"type\": \"PLAYER_DISCONECT\", \"numOfPlayers\": " + activeSessions.size() + "}"
        ));
    }
    
    private void UpdatePlayerJoined(WebSocketSession session) throws Exception {
    	session.sendMessage(new TextMessage(
                "{\"type\": \"PLAYER_CONNECT\", \"numOfPlayers\": " + activeSessions.size() + "}"
        ));
    }
}