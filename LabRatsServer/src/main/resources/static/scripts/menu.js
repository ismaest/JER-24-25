class MenuScene extends Phaser.Scene {
	
    constructor() {
        super({ key: "MenuScene" });
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
		
		//Creamos el texto donde apareceran los jugadores conectados al server
		var usersConnectedTextContainer = document.createElement("h3");
		var pUsersConnectedText = document.createTextNode("USUARIOS CONECTADOS:");
		usersConnectedTextContainer.appendChild(pUsersConnectedText);
		document.body.appendChild(usersConnectedTextContainer);
		
		var usersConnectedCointainer = document.createElement("p");
		this.pUsersConnected = document.createTextNode("X");
		usersConnectedCointainer.appendChild(this.pUsersConnected);
		document.body.appendChild(usersConnectedCointainer);
		
    }

    update() {
		
		$.ajax({	
			method: "GET",
			url: "/user/connected-users",
			async: false
		}).done(function(data) {
			this.pUsersConnected.nodeValue = data;
		})

	}

	
    //CARGA DE ASSETS
    
    loadAssets() {
        
        this.load.setPath('assets/');
        
        //Imágenes
        this.load.image('background', 'MenuBackground.png');
        this.load.image('startBtn', 'ejemplo.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.image('creditsBtn', 'btnCréditos.png');
        
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
        this.startBtn = this.add.image(400, 300, 'startBtn').setScale(0.5).setInteractive();
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