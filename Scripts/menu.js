class MenuScene extends Phaser.Scene {

    constructor(){
        super({key: "MenuScene"});
    }
    
    preload(){
        
        this.load.setPath('assets/');
        
        this.load.image('background', 'MenuBackground.png');
        
        this.load.image('startBtn', 'btnJugar.png');
        this.load.image('optionsBtn', 'btnOpciones.png');
    }
    
    create(){
        
        this.add.image(400, 300, 'background');
        
        var startBtn = this.add.image(400, 400, 'startBtn');
        startBtn.setScale(0.5);
        startBtn.setInteractive();
        startBtn.on('pointerdown', () => {this.scene.start('GameScene');});
        
        var optionsBtn = this.add.image(400, 500, 'optionsBtn');
        optionsBtn.setScale(0.5);
        optionsBtn.on('pointerdown', () => {alert("OPCIONES")});
        
    }
    
    update(){
    }
}