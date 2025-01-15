package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Registro del WebSocket handler en la URL '/echo'
        registry.addHandler(websocketEchoHandler(), "/echo")
                .setAllowedOrigins("*");  // Permite todas las conexiones CORS
    }

    @Bean
    public WebsocketEchoHandler websocketEchoHandler() {
        return new WebsocketEchoHandler();
    }
}
