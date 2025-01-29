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
    	
        if(!activeSessions.containsKey(userId)) {
        	activeSessions.put(userId, session);
            System.out.println("Usuario conectado: " + userId);
            
            // Enviar mensaje de conexión al cliente
            session.sendMessage(new TextMessage("{\"type\": \"CONNECTED\", \"userId\": \"" + userId + "\"}"));
            
            for(WebSocketSession sessions : activeSessions.values()){
            	UpdatePlayerJoined(sessions);
            }
        }
    }
    

    private void handleJoinRoom(GameMessage message, WebSocketSession session) throws Exception {
    	String userId = "user_" + session.getId();
    	
    	int roomIdInt = gameRooms.size();
        
    	if(roomIdInt == 0) { roomIdInt = 1; }
    	
    	 // Puedes usar un ID específico para la sala o generar uno dinámico
        String roomId = Integer.toString(roomIdInt);
        GameRoom room;
        
        System.out.println("ID DEL LOBBY:" + roomId);
        
        if(gameRooms.containsKey(roomId)) {
        	room = gameRooms.get(roomId);
        } else {
        	room = new GameRoom(roomId);
        	gameRooms.put(roomId, room);
        }
        
        
        if (room.addPlayer(userId)) {
            // Notificar a los jugadores de la sala
            for (String playerId : room.getPlayers()) {
                WebSocketSession playerSession = activeSessions.get(playerId);
                playerSession.sendMessage(new TextMessage(
            		"{\"type\": \"PLAYER_LOBBY_CONNECT\", \"roomId\": \"" + roomId + "\", \"numOfPlayersLobby\": " + room.getPlayers().size() + "}"
            	));
                if (playerSession != null && playerSession.isOpen()) {
                	
                }
            }
            /* RESOLVER MAS TARDE
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
            }*/
        } else {
        	
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
            	broadcastMessage(gameMessage, session);
                break;
                
            case "HAND_POSITION_UPDATE":
                broadcastMessage(gameMessage, session); // Retransmite el mensaje a los demás
                break;
                
            case "JOIN_ROOM":
                handleJoinRoom(gameMessage, session);
                broadcastMessage(gameMessage, session);
                break;
                
            case "START_GAME":
            	HandleStartGame(gameMessage, session);
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
            	
            case "PLAYER_LOBBY_CONNECT":
            	broadcastMessage(gameMessage, session);
            	break;
            
            case "PLAYER_LOBBY_DISCONNECT":
            	broadcastMessage(gameMessage, session);
            	break;
            	
            case "UPDATE_LOBBY_PLAYERS":
            	broadcastMessage(gameMessage, session);
            	break;
            	
            case "REGEN_CHEESE":
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
                	playerSession.sendMessage(new TextMessage(
                			"{\"type\": \"PLAYER_LOBBY_DISCONNECT\", \"numOfPlayersLobby\": " + room.getPlayers().size() + "}"
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
        private double rotation;
        private Integer handIndex;
        private String timestamp;
        private boolean roomFull;
        private String roomId;
        private Integer numOfPlayersMenu;
        private Integer numOfPlayersLobby;
        private Integer rolId; //0: Rata / 1: Cientifico

        // Getters y setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getPlayerId() { return playerId; }
        public void setPlayerId(String playerId) { this.playerId = playerId; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }
        
        public double getRotation() { return rotation; }
        public void setRotation(double rotation) { this.rotation = rotation; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        
        public boolean getRoomFull() { return roomFull; }
        public void setRoomFull(boolean full) { this.roomFull = full; }
        
        public String getRoomId() { return roomId; }
        public void setRoomId(String roomID) { this.roomId = roomID; }
        
        public Integer getHandIndex() {return handIndex; }
        public void setHandIndex(Integer handIndex) { this.handIndex = handIndex; }
        
        public Integer getNumOfPlayersMenu() {return numOfPlayersMenu; }
        public void setNumOfPlayersMenu(Integer numOfPlayersMenu) { this.numOfPlayersMenu = numOfPlayersMenu; }
        
        public Integer getNumOfPlayersLobby() {return numOfPlayersLobby; }
        public void setNumOfPlayersLobby(Integer numOfPlayersLobby) { this.numOfPlayersLobby = numOfPlayersLobby; }
        
        public Integer getRolId() {return rolId; }
        public void setRolId(Integer rolId) { this.rolId = rolId; }
        
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
    
    
    private void HandleStartGame(GameMessage message, WebSocketSession session) throws Exception {
        
    	//Vaciar la sala
    	String roomId = message.roomId;
        GameRoom room = gameRooms.get(roomId);
        room.clearRoom();
    	
    	//Asignar el rol
    	session.sendMessage(new TextMessage(
                "{\"type\": \"START_GAME\", \"rolId\": " + message.rolId + "}"
        ));
    }
    
    private void UpdatePlayerLeft(WebSocketSession session) throws Exception {
        session.sendMessage(new TextMessage(
                "{\"type\": \"PLAYER_DISCONECT\", \"numOfPlayersMenu\": " + activeSessions.size() + "}"
        ));
    }
    
    private void UpdatePlayerJoined(WebSocketSession session) throws Exception {
    	session.sendMessage(new TextMessage(
                "{\"type\": \"PLAYER_CONNECT\", \"numOfPlayersMenu\": " + activeSessions.size() + "}"
        ));
    }
}