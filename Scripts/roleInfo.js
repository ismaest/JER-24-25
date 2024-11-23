class RoleInfo extends Phaser.Scene {

    constructor() {
        super({ key: "RoleInfo" });
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.setupSounds();
        this.setupBackground();
        this.createAcceptButton();
        this.createExitButton();
        this.buttonAnims();
    }

    update() {

    }
    loadAssets() {
        this.load.setPath('assets/');
        this.load.image('background', 'MenuBackground.png'); // Cambiar assets
        this.load.image('acceptBtn', 'btnJugar.png'); // Botón de aceptar (esconde escena)
        this.load.image('exitBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
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
        const bg = this.add.image(200, 150, 'background');
        bg.setScale(0.75);
        bg.setOrigin(0.15, 0.2);
    }

    createAcceptButton() {
        this.acceptBtn = this.add.image(300, 400, 'acceptBtn').setScale(0.45).setInteractive();
        this.acceptBtn.on('pointerdown', () => {
            console.log('Accept button pressed');
            this.game.click.play();
            this.scene.stop('RoleInfo');
        });
    }

    createExitButton() {
        this.exitBtn = this.add.image(550, 400, 'exitBtn').setScale(0.45).setInteractive();
        this.exitBtn.on('pointerdown', () => {
            console.log('Exit button pressed');
            this.game.click.play();
            this.scene.stop('RoleInfo'); // Detenemos la escena actual
            this.scene.stop('GameScene'); // Detenemos la escena del juego
            this.scene.start('MenuScene'); // Cambiamos a la escena del menú
        });
    }

    buttonAnims(){
        [this.acceptBtn, this.exitBtn].forEach(button => {
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
