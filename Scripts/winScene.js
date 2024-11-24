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

        var optionsBtn = this.add.image(400, 540, 'exitBtn');
        optionsBtn.setScale(0.5);
        optionsBtn.setInteractive();
        optionsBtn.on('pointerdown', () => {this.scene.start('MenuScene');});

    }

    update(){
    }
}