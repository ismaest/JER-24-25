class WinScene extends Phaser.Scene {

    constructor(){
        super({key: "WinScene"});
    }

    preload(){

        this.load.setPath('assets/');

        this.load.image('background', 'MenuBackground.png');

        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
    }

    create(){

        this.add.image(400, 300, 'background');

        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }

        var optionsBtn = this.add.image(400, 500, 'optionsBtn');
        optionsBtn.setScale(0.5);
        optionsBtn.setInteractive();
        optionsBtn.on('pointerdown', () => {this.scene.start('OptionsMenu');});

    }

    update(){
    }
}