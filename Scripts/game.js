class GameScene extends Phaser.Scene {
    
    constructor(){
        super({key: "GameScene"});
    }
    
    preload() {
        
        // Cargar aquí las imágenes o sprites necesarios

        this.load.setPath('assets/');

        this.load.image('scenery', 'gameBackground.png');
        
        this.load.image('rat', 'rata.png');
        this.load.image('hand', 'hand.png');

    }

    create() {

        this.add.image(400, 300, 'scenery');
        
        //Crear la mano
        this.hand = this.add.image(400, 500, 'hand');
        this.hand.setScale(0.5);
        //this.hand.setCollideWorldBounds(true);
        
        //Crear la rata
        //this.rat = this.add.image(100, 100, 'rat');
        this.rat = this.physics.add.sprite(100,100, 'rat');
        this.rat.setScale(0.5);
        this.rat.setCollideWorldBounds(true);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }); //Se crea la opcion de usar las teclas W A S D. 
    }

    update() {
        
        //MOVIMIENTO DE LA RATA

        if (this.keys.W.isDown) {
            this.rat.setVelocityY(-200); // Arriba
        } else if (this.keys.S.isDown) {
            this.rat.setVelocityY(200); // Abajo
        } else {
            this.rat.setVelocityY(0); // Detener en Y si no hay input
        }

        if (this.keys.A.isDown) {
            this.rat.setVelocityX(-200); // Izquierda
        } else if (this.keys.D.isDown) {
            this.rat.setVelocityX(200); // Derecha
        } else {
            this.rat.setVelocityX(0); // Detener en X si no hay input
        }
        
            
        //MOVIMIENTO DE LA MANO
        if (this.cursors.left.isDown){
            this.hand.x -= 1;
        }

        if (this.cursors.right.isDown){
            this.hand.x += 1;
        }
        
        //Al pulsar la tecla espacio...
        
    }
}