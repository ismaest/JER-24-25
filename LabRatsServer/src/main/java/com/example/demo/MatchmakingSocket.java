package com.example.demo;

import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.websocket.CloseReason;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/matchmaking")
public class MatchmakingSocket {

    private static Set<Session> players = new LinkedHashSet<>(); // Para mantener el orden de llegada

    @OnOpen
    public void onOpen(Session session) {
        if (players.size() < 2) {
            players.add(session);
            updatePlayerCount();
        } else {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.GOING_AWAY, "El matchmaking está lleno"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        players.remove(session);
        updatePlayerCount();
    }

    private void updatePlayerCount() {
        // Enviar el número de jugadores conectados a todos los clientes
        for (Session player : players) {
            try {
                player.getBasicRemote().sendText("USUARIOS CONECTADOS: " + players.size() + "/2");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    @OnMessage
    public void onMessage(Session session, String message) {
        try {
            // Comprobar si el mensaje recibido es de tipo "START_GAME"
            if ("START_GAME".equals(message)) {
                // Crear el mensaje de inicio de juego que se enviará a todos los jugadores
                String startGameMessage = "START_GAME";

                // Enviar el mensaje a todos los jugadores conectados
                for (Session player : players) {
                    try {
                        player.getBasicRemote().sendText(startGameMessage);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
