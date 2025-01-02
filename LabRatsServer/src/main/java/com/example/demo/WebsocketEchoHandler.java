package com.example.demo;

import org.springframework.web.socket.*;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebsocketEchoHandler extends TextWebSocketHandler {
    private ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        System.out.println("New connection: " + session.getId());

        // Envía un mensaje de bienvenida al cliente
        try {
            session.sendMessage(new TextMessage("Welcome! Your session ID is: " + session.getId()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Message received: " + payload);

        // Parsear el mensaje JSON
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> messageData = mapper.readValue(payload, Map.class);

        String type = (String) messageData.get("type");
        switch (type) {
            case "join":
                handleJoin(session, messageData);
                break;
            case "move":
                //handleMove(session, messageData);
                break;
            case "chat":
                //broadcastMessage(session, payload); // Broadcast a todos los jugadores
                break;
            default:
                System.out.println("Unknown message type: " + type);
        }
    }
    
 //ejemplo del 'join'
    private void handleJoin(WebSocketSession session, Map<String, Object> data) {
        String playerId = (String) data.get("playerId");
        System.out.println("Player joined: " + playerId);
        //aquí podria registrar al jugador en una lista o base de datos
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        System.out.println("Connection closed: " + session.getId());
    }
}
