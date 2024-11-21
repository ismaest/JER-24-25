class RoleInfo extends Phaser.Scene {

    constructor(){
        super({key: "RoleInfo"});
    }

    preload(){

        this.load.setPath('assets/');

        this.load.image('background', 'MenuBackground.png'); //Cambiar assets

        this.load.image('acceptBtn', 'btnJugar.png'); //Boton de aceptar (esconde escena)
        //this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
    }

    create(){

        var bg = this.add.image(200, 150, 'background');
        bg.setScale(0.75);
        bg.setOrigin(0.15, 0.2);

        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }

        var acceptBtn = this.add.image(400, 400, 'acceptBtn');
        acceptBtn.setScale(0.5);
        acceptBtn.setInteractive();
        acceptBtn.on('pointerdown', () => {this.scene.stop('RoleInfo');});

    }

    update(){
    }
}