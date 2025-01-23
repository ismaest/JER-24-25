class AccountMenu extends Phaser.Scene {
	
	constructor() {
	       super({key: "AccountMenu"});
	   }
	   preload(){
		this.load.setPath('assets/');
		this.load.image('background', 'MenuBackground.png');
		this.load.image('backBtn', 'btnVolver.png');
		
	   }
	   
	   create(){
		this.add.image(400, 300, 'background');
		
		this.createBackBtn();
		this.buttonAnims();
	   }
	   
	   createBackBtn(){
		this.backBtn = this.add.image(700, 550, 'backBtn').setScale(0.5).setInteractive();
		this.backBtn.on('pointerdown', () => {
			this.game.click.play();
			this.scene.stop('AccountMenu');
			this.scene.start('MenuScene');
		});
	   }
	   
	   buttonAnims(){
	           [this.backBtn].forEach(button => {
	               button.on('pointerover', ()=>this.onButtonHover(button));
	               button.on('pointerout', ()=>this.onButtonOut(button));
	           });
	       }
	       onButtonHover(button){
	           button.setScale(0.65);
	       }

	       onButtonOut(button){
	           button.setScale(0.5);
	       }
}