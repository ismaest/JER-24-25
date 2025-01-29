class WinScene extends Phaser.Scene {

    constructor(){
        super({key: "WinScene"});
    }

    preload(){

        this.load.setPath('assets/');

        this.load.image('winBackground', 'winBackground.png');

        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('exitBtn', 'btnSalir.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
    }

    create(){

        this.add.image(400, 300, 'winBackground');

        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }

        this.exitBtn = this.add.image(400, 540, 'exitBtn');
        this.exitBtn.setScale(0.5);
        this.exitBtn.setInteractive();
        this.exitBtn.on('pointerdown', () => {this.scene.stop("WinScene"); this.scene.start('MenuScene');});
        this.exitBtn.on('pointerover', () => {this.exitBtn.setScale(0.55);});
        this.exitBtn.on('pointerout', () => {this.exitBtn.setScale(0.5);});

    }
}