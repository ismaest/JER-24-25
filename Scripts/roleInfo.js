class RoleInfo extends Phaser.Scene {

    constructor(){
        super({key: "RoleInfo"});
    }

    preload(){

        this.load.setPath('assets/');

        this.load.image('background', 'MenuBackground.png'); //Cambiar assets

        this.load.image('acceptBtn', 'btnJugar.png'); //Boton de aceptar (esconde escena)
        this.load.image('exitBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('click', 'click.wav');
    }

    create(){

        this.game.click = this.sound.add('click');
        
        var bg = this.add.image(200, 150, 'background');
        bg.setScale(0.75);
        bg.setOrigin(0.15, 0.2);

        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }

        //aceptar
        var acceptBtn = this.add.image(300, 400, 'acceptBtn');
        acceptBtn.setScale(0.45);
        acceptBtn.setInteractive();
        acceptBtn.on('pointerdown', () => {
            console.log('Accept button pressed');
            this.game.click.play();
            this.scene.stop('RoleInfo');
        });

        //salir
        var exitBtn = this.add.image(550, 400, 'exitBtn');
        exitBtn.setScale(0.45);
        exitBtn.setInteractive();
        exitBtn.on('pointerdown', () => {
            console.log('Exit button pressed'); // Mensaje de depuración
            this.game.click.play();
            this.scene.stop('RoleInfo'); // Detenemos la escena actual
            this.scene.stop('GameScene'); // Detenemos la escena actual
            this.scene.start('MenuScene'); // Cambiamos a la escena del menú
        });

    }

    update(){
    }
}