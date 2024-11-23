class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: "MenuScene" });
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.setupSounds();
        this.setupBackground();
        this.createStartButton();
        this.createOptionsButton();
        this.createCreditsButton();
        this.buttonAnims();
    }

    update() {

    }
    loadAssets() {
        this.load.setPath('assets/');
        this.load.image('background', 'MenuBackground.png');
        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.image('creditsBtn', 'btnCréditos.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('deathMusic', 'deathMusic.ogg');
        this.load.audio('click', 'click.wav');
    }

    setupSounds() {
        this.game.click = this.sound.add('click');
        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }
    }

    setupBackground() {
        this.add.image(400, 300, 'background');
    }

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