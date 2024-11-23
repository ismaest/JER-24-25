class MenuScene extends Phaser.Scene {

    constructor(){
        super({key: "MenuScene"});
    }
    
    preload(){
        
        this.load.setPath('assets/');
        
        this.load.image('background', 'MenuBackground.png');
        
        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('deathMusic', 'deathMusic.ogg');
        this.load.audio('click', 'click.wav');
    }
    
    create(){

        this.game.click = this.sound.add('click');
        
        this.add.image(400, 300, 'background');
        
        if (!this.game.mainMenuMusic) {
            this.game.mainMenuMusic = this.sound.add('mainMenuMusic', { loop: true });
            this.game.mainMenuMusic.play();
        }
        
        var startBtn = this.add.image(400, 400, 'startBtn');
        startBtn.setScale(0.5);
        startBtn.setInteractive();
        startBtn.on('pointerdown', () => {
        this.game.click.play();
        this.scene.stop("MenuScene");
        this.scene.start('GameScene');
        this.scene.launch("RoleInfo");
        });
        
        var optionsBtn = this.add.image(400, 500, 'optionsBtn');
        optionsBtn.setScale(0.5);
        optionsBtn.setInteractive();
        optionsBtn.on('pointerdown', () => {
            this.game.click.play();
            this.scene.start('OptionsMenu');
        });
        
    }
    
    update(){
    }
}