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

            case "ACTION":
                // Lógica para manejar acciones de juego
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
        private String content;
        private String sender;

        // Getters y setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
    }
}