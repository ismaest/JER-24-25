class MatchmakingScene extends Phaser.Scene {

    constructor(socket) {
        super({key: "MatchmakingScene"});
		this.socket = socket;
		this.connectedUsers = 0;
    }
	
	init(data) {
			this.players = {};
			this.targetPositions = {};
		        // Asegúrate de que el socket esté disponible
		        if (data && data.socket instanceof WebSocket) {
		            this.socket = data.socket;

		            // Verificar si el WebSocket está abierto antes de hacer algo
		            if (this.socket.readyState !== WebSocket.OPEN) {
		                console.error("El WebSocket no está conectado.");
		                return;
		            }
		        } else {
		            console.error("Socket no válido en GameScene");
		            return;
		        }
		    }

    preload() {
        //Cargamos los assets necesarios
        this.loadAssets();
    }

    create() {
		
		this.lobbyId;
		this.host = false;
		
        this.userName = sessionStorage.getItem('userName');
        //Configuramos los sonidos
        this.setupSounds();

        //Creamos el escenario
        this.add.image(400, 300, 'backgroundMenu');

        this.createConnectedUsersDisplay();
		
		this.createPlayButton();
		
        this.checkConnection();
		
        // Contenedor del chat (inicialmente oculto)
        this.createChatContainer();
		
        // Iniciar polling para obtener mensajes cada 1 segundo
        //this.startPolling();

		this.socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log("Mensaje recibido:", data);
			
			if (data.type == "START_GAME" && this.host == false) {
				console.log("PARTIDA INICIADA");
				
				this.connectedUsers = 0;
				clearInterval(this.checkCurrentPlayers);
				
				this.scene.stop("MatchmakingScene");
				this.scene.start('GameScene', { socket: this.socket, rol: data.rolId });
			
			} else if (data.type == "PLAYER_LOBBY_CONNECT"){
				console.log("JUGADOR CONECTADO AL LOBBY");
				this.connectedUsers = data.numOfPlayersLobby;
				this.lobbyId = data.roomId;
				this.usersText.setText(`USUARIOS CONECTADOS: ${this.connectedUsers}/2`);
				
			} else if (data.type == "PLAYER_LOBBY_DISCONNECT"){
				console.log("JUGADOR DESCONECTADO DEL LOBBY");
				this.connectedUsers = data.numOfPlayersLobby;
			
			} else if (data.type == "UPDATE_LOBBY_PLAYERS"){
				this.connectedUsers = data.numOfPlayersLobby;
				this.lobbyId = data.roomId;
				this.usersText.setText(`USUARIOS CONECTADOS: ${this.connectedUsers}/2`);
		}});
		
		this.checkCurrentPlayers = 
			setInterval(() => {
				this.usersText.setText(`USUARIOS CONECTADOS: ${this.connectedUsers}/2`);
				this.socket.send(JSON.stringify({type: "UPDATE_LOBBY_PLAYERS", numOfPlayersLobby : this.connectedUsers, roomId : this.lobbyId}));
			}, 1000);  // Verificar cada 500 milisegundos
    }
	
    // Crear el indicador de conexión
    createConnectionIndicator() {
        // Crear el cuadrado verde (inicialmente desconectado)
        this.connectionIndicator = this.add.rectangle(67, 568, 25, 25, 0xff0000); // Cuadrado rojo por defecto
        this.connectionIndicator.setOrigin(0);

        // Crear el texto "Conectado"
        this.connectionText = this.add.text(37, 550, 'Conectado', {
            fontSize: '16px',
            fill: '#000',
        });

        // Alineamos el texto al lado del cuadrado
        this.connectionText.setOrigin(0);

        // Función que cambiará el color según la conexión
        this.updateConnectionStatus(true); // Llamamos con 'true' para simular conexión al principio
    }

    // Actualizar el estado de la conexión
    // Método para actualizar el estado de la conexión
    updateConnectionStatus(isConnected) {
        if (isConnected) {
            // Cuadrado verde
            this.connectionIndicator.setFillStyle(0x00ff00);  // Cambiar color a verde
            this.connectionText.setText('Conectado');
        } else {
            // Cuadrado rojo
            this.connectionIndicator.setFillStyle(0xff0000);  // Cambiar color a rojo
            this.connectionText.setText('Desconectado');
        }
    }

    // Función para revisar la conexión al servidor
    checkConnection() {
        setInterval(() => {
            fetch('/user/check-server-status')  // Endpoint que verifica el estado del servidor
                .then(response => {
                    if (response.ok) {
						if(this.connectionIndicator == undefined){
							this.createConnectionIndicator();
						}
						this.updateConnectionStatus(true);  // El servidor está disponible
                    } else {
                        this.updateConnectionStatus(false);  // El servidor no está disponible
                    }
                })
                .catch(error => {
                    console.error('Error al comprobar la conexión:', error);
                    this.updateConnectionStatus(false);  // En caso de error, asumimos que el servidor está desconectado
                });
        }, 1000);  // Verificar cada 500 milisegundos
    }
	

    createConnectedUsersDisplay() {
        // Fondo negro para el área de usuarios conectados
        this.usersContainer = this.add.container(300, 350);
        const usersBackground = this.add.rectangle(0, 0, 180, 90, 0x000000, 0.8).setOrigin(0);
        this.usersContainer.add(usersBackground);

        // Texto de usuarios conectados
        this.usersText = this.add.text(10, 10, 'USUARIOS CONECTADOS: Esperando jugador...', {
            fontSize: '16px',
            fill: '#fff',
            wordWrap: { width: 180, useAdvancedWrap: true }
        });
        this.usersContainer.add(this.usersText);
    }

    // Crear botón para abrir el chat
    createChatButton() {
        const chatButton = this.add.image(740, 575, 'acceptBtn').setScale(0.5).setInteractive();
        chatButton.on('pointerdown', () => {
            this.toggleChat();
        });
    }

	createPlayButton() {
	    const startBtn = this.add.image(385, 550, 'jugarBtn').setScale(0.5).setInteractive();
	    startBtn.on('pointerdown', () => {
				this.host = true;
				
				this.socket.send(JSON.stringify({type: "START_GAME", rolId : 1, roomId : this.lobbyId}));
				
				clearInterval(this.checkCurrentPlayers);
				
				// Cambiar a la escena de juego para este jugador
				this.scene.stop("MatchmakingScene");
				this.scene.start('GameScene', { socket: this.socket, rol : 0 });
	    });
	}
	
    // Crear el contenedor del chat
    createChatContainer() {
        this.chatContainer = this.add.container(180, 180).setVisible(false);

        // Fondo del chat
        const chatBackground = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.8).setOrigin(0);
        this.chatContainer.add(chatBackground);

        // Zona de mensajes
        this.messagesText = this.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#fff',
            wordWrap: { width: 380, useAdvancedWrap: true }  // Configurar wordWrap al crear el texto
        });
        this.chatContainer.add(this.messagesText);

        // Input para escribir mensaje
        this.inputBackground = this.add.rectangle(10, 260, 380, 30, 0x222222).setOrigin(0).setInteractive();
        this.chatContainer.add(this.inputBackground);

        this.inputText = this.add.text(15, 265, '', {
            fontSize: '16px',
            fill: '#fff',
            wordWrap: { width: 360, useAdvancedWrap: true }  // También configuramos wordWrap para el texto de entrada
        });
        this.chatContainer.add(this.inputText);

        // Detectar teclas para entrada de texto
        this.input.keyboard.on('keydown', (event) => {
            if (!this.chatContainer.visible) return;

            if (event.key === 'Backspace') {
                this.inputText.text = this.inputText.text.slice(0, -1); // Eliminar último carácter
            } else if (event.key === 'Enter') {
                this.sendMessage();
            } else if (event.key.length === 1) {
                this.inputText.text += event.key; // Agregar carácter al texto
            }
        });

        // Botón para enviar mensajes (fuera del cuadro de texto)
        this.sendButton = this.add.image(460, 265, 'acceptBtn') // Botón fuera del cuadro
            .setScale(0.5)
            .setInteractive()
            .on('pointerdown', () => this.sendMessage());
        this.chatContainer.add(this.sendButton);
    }

    // Método para enviar un mensaje
    sendMessage() {
        const message = this.inputText.text.trim();  // Usar inputText.text directamente
        if (message) {
            //this.displayMessage(`Tú: ${message}`);
            const sender = this.userName || this.userId;
            this.inputText.text = ''; // Limpiar el inputText

            // Aquí puedes enviar el mensaje al servidor
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Date.now(), // Generar un ID basado en el timestamp o de alguna otra manera
                    sender: sender ,
                    content: message,
                    timestamp: Date.now(),
                }),
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Mensaje enviado correctamente");
                    } else {
                        console.error("Error al enviar el mensaje");
                    }
                })
                .catch(error => console.error('Error al enviar el mensaje:', error));
        }
    }

    // Mostrar el mensaje en la interfaz
    displayMessage(message) {
        // Añadir el nuevo mensaje en la parte superior
        let currentText = this.messagesText.text.split("\n");

        // Si tenemos más de 10 mensajes, eliminar el más antiguo
        if (currentText.length >= this.maxMessages) {
            currentText.shift();  // Eliminar el mensaje más antiguo
        }

        // Agregar el nuevo mensaje al principio
        currentText.push(message);

        // Actualizar el texto del contenedor
        this.messagesText.setText(currentText.join("\n"));

        // Desplazar el contenedor para que siempre se vea el último mensaje
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // Hacer que el chat se muestre o se oculte
    toggleChat() {
        const isVisible = this.chatContainer.visible;
        this.chatContainer.setVisible(!isVisible);
    }

    // Iniciar polling para obtener mensajes nuevos cada 1 segundo
    startPolling() {
        setInterval(() => {
            fetch(`/api/messages?lastMessageId=${this.lastMessageId}`)  // Solicitar mensajes con un ID mayor al último
                .then(response => response.json())
                .then(messages => {
                    if (messages.length > 0) {
                        this.lastMessageId = messages[messages.length - 1].id;  // Actualizar el último ID recibido
                        this.updateMessages(messages);  // Actualizar la interfaz con los nuevos mensajes
                    }
                })
                .catch(error => console.error('Error al obtener los mensajes:', error));
        }, 100);  // Polling cada 1 segundo
    }

    // Actualizar la interfaz con los nuevos mensajes
    updateMessages(messages) {
        messages.forEach(message => {
            const formattedMessage = `${message.sender}: ${message.content}`;
            this.displayMessage(formattedMessage);
        });
    }
    loadAssets() {
        this.load.setPath('assets/');
        this.load.image('backgroundMenu', 'MenuMatchmaking.png');
		this.load.image('jugarBtn', 'btnJugar.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('click', 'click.wav');
    }

    //CONFIGURACIÓN DE SONIDOS
    setupSounds() {
        this.game.click = this.sound.add('click');
        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }
    }
}