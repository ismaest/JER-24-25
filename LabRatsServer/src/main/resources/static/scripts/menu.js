class MenuScene extends Phaser.Scene {
	
    constructor() {
        super({ key: "MenuScene" });
        this.userId = `user_${Math.floor(Math.random() * 10000)}`; // Generar un ID único temporal
        this.usersConnectedContainer = null; // Contenedor del texto
    }

    preload() {
        
        //Cargamos los assets necesarios
        this.loadAssets();
    }
	
    create() {
        
        //Configuramos los sonidos
        this.setupSounds();
    
        //Creamos el escenario
        this.add.image(400, 300, 'background');
        
        ///Creamos los botones básicos
        this.createStartButton();
        this.createOptionsButton();
        this.createCreditsButton();
        
        //Configuramos los botones
        this.buttonAnims();
		
        // Iniciar actualización periódica de usuarios conectados
        this.sendHeartbeat(); // Enviar heartbeat periódicamente
        this.updateConnectedUsers(); // Actualizar usuarios conectados periódicamente
    }

    sendHeartbeat() {
        setInterval(() => {
            console.log(`Enviando heartbeat para el usuario: ${this.userId}`);
            fetch(`/user/heartbeat?userId=${this.userId}`, { method: "POST" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al enviar heartbeat");
                    }
                    console.log("Heartbeat enviado correctamente");
                })
                .catch(error => console.error("Error en heartbeat:", error));
        }, 2000); // Cada 2 segundos
    }

    updateConnectedUsers() {
        // Actualizar usuarios conectados cada 5 segundos
        setInterval(() => {
            fetch("/user/connected-users")
                .then(response => response.json())
                .then(data => {
                    document.getElementById("UsuariosConectados").innerHTML = `USUARIOS CONECTADOS: ${data}`;
                })
                .catch(error => console.error("Error al obtener usuarios conectados:", error));
        }, 1000); // 1 segundos
    }
	
	
    //CARGA DE ASSETS
    
    loadAssets() {
        
        this.load.setPath('assets/');
        
        //Imágenes
        this.load.image('background', 'MenuBackground.png');
        this.load.image('startBtn', 'ejemplo.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.image('creditsBtn', 'btnCréditos.png');
        this.load.image('acceptBtn', 'btnAceptar.png');
        this.load.image('menuBtn', 'btnMenu.png');
        this.load.image('backButton', 'btnVolver.png');
        
        //Audio
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('deathMusic', 'deathMusic.ogg');
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
    
    //CREACIÓN DE BOTONES
    
    createStartButton() {
        this.startBtn = this.add.image(400, 300, 'acceptBtn').setScale(0.5).setInteractive();
        this.startBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.stop("MenuScene");
            this.scene.start('GameScene');
            this.scene.launch("RoleInfo");
        });
    }

    createOptionsButton() {
        this.optionsBtn = this.add.image(400, 400, 'optionsBtn').setScale(0.5).setInteractive();
        this.optionsBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('OptionsMenu');
        });
    }
    
    createCreditsButton() {
        this.creditsBtn = this.add.image(400, 500, 'creditsBtn').setScale(0.5).setInteractive();
        this.creditsBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('Credits');
        });
    }
    
    //CONFIGURACIÓN DE BOTONES
    
    buttonAnims(){
        [this.startBtn, this.optionsBtn, this.creditsBtn].forEach(button => {
            button.on('pointerover', ()=>this.onButtonHover(button));
            button.on('pointerout', ()=>this.onButtonOut(button));
        });
    }
    
    onButtonHover(button){
        button.setScale(0.55);
    }
    
    onButtonOut(button){
        button.setScale(0.5);
    }
}