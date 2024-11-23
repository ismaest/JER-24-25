class GameOverScene extends Phaser.Scene {

    constructor(){
        super({key: "GameOverScene"});
    }

    preload(){

        this.load.setPath('assets/');

        this.load.image('background', 'MenuBackground.png');

        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('deathMusic', 'deathMusic.mp3');
    }

    create(){

        this.add.image(400, 300, 'background');

        var optionsBtn = this.add.image(400, 500, 'optionsBtn'); //CAMBIAR A SALIR AL MENU
        optionsBtn.setScale(0.5);
        optionsBtn.setInteractive();
        optionsBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
            if (this.game.deathMusic) {
                this.game.deathMusic.stop(); //se para la musica de muerte
                this.game.mainMenuMusic.play(); //se reinicia la musica principal
            }
        });

    }

    update(){
    }
}