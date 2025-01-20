package com.example.demo;

import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.websocket.CloseReason;
import jakarta.websocket.OnClose;
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
}
