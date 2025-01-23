class MenuSceneLocal extends Phaser.Scene {

    constructor() {
        super({ key: "MenuSceneLocal" });
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
        this.createBackButton();
        this.createMetalPipe();
        this.campeonesinvierno();
        
        //Configuramos los botones
        this.buttonAnims();
    }

    update() {}
    
    //CARGA DE ASSETS
    
    loadAssets() {
        
        this.load.setPath('assets/');
        
        //Imágenes
        this.load.image('background', 'MenuBackground.png');
        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.image('creditsBtn', 'btnCreditos.png');
        this.load.image('metalpipe', 'metalpipe.png');
        this.load.image('interrogacion', 'interrogacion.png');
        this.load.image ('secreto', 'secreto.png');
        this.load.image('backBtn', 'btnVolver.png');
        
        //Audio
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('deathMusic', 'deathMusic.ogg');
        this.load.audio('click', 'click.wav');
        this.load.audio('pipe', 'pipe.wav')
        this.load.audio('atleti', 'himnoatletico.mp3')
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
        this.startBtn = this.add.image(400, 250, 'startBtn').setScale(0.5).setInteractive();
        this.startBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.stop("MenuSceneLocal");
            this.scene.start('GameSceneLocal');
            this.scene.launch("RoleInfoLocal");
        });
    }

    createOptionsButton() {
        this.optionsBtn = this.add.image(400, 350, 'optionsBtn').setScale(0.5).setInteractive();
        this.optionsBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('OptionsMenuLocal');
        });
    }
    
    createCreditsButton() {
        this.creditsBtn = this.add.image(400, 450, 'creditsBtn').setScale(0.5).setInteractive();
        this.creditsBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('CreditsLocal');
        });
    }

    createBackButton() {
        this.backBtn = this.add.image(400, 550, 'backBtn').setScale(0.5).setInteractive();
        this.backBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('ChooseNetType');
        });
    }
    
    //CONFIGURACIÓN DE BOTONES
    
    buttonAnims(){
        [this.startBtn, this.optionsBtn, this.creditsBtn, this.backBtn].forEach(button => {
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
    createMetalPipe() {
        this.metalpipe = this.add.image(750, 400, 'metalpipe').setScale(0.1).setInteractive();
        this.metalpipe.on('pointerdown', () => {
            this.game.pipe = this.sound.add('pipe');
            this.game.pipe.play();
        })
    }
    campeonesinvierno() {
        let primerclick=true;
        this.interrogacion = this.add.image(750, 100, 'interrogacion').setScale(0.2).setInteractive();
        this.interrogacion.on('pointerdown', () => {
            if (primerclick==true) {
                this.secreto = this.add.image(400, 400, 'secreto').setScale(1);
                this.game.atleti = this.sound.add('atleti');
                this.game.atleti.play();
                primerclick=false;
            } else {
                this.secreto.setScale(0);
                this.interrogacion.setScale(0);
                this.game.atleti.setVolume(0);
            }
        })
    }
}