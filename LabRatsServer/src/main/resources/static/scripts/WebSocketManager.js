class WebSocketManager {
    constructor() {
        this.socket = null;
        this.playerId = null; // Almacena el ID del jugador
    }

    connect(url, playerId) {
        this.socket = new WebSocket(url);
        this.playerId = playerId; // Establece el ID del jugador al conectar

        this.socket.onopen = () => {
            console.log(`WebSocket conectado para el jugador: ${this.playerId}`);
        };

        this.socket.onclose = () => {
            console.log("WebSocket desconectado");
        };

        this.socket.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                callback(data);
            };
        }
    }
}

export const webSocketManager = new WebSocketManager();
