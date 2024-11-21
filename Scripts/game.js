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
        this.load.image('clon', 'clon.png');
    }

    create() {

        this.add.image(400, 300, 'scenery');
        
        //Crear la mano
        this.hand = this.add.image(400, 500, 'hand');
        this.hand.setScale(0.5);
        //this.hand.setCollideWorldBounds(true);
        
        //crear array y cooldown para la mano
        this.handcoords = [150, 400, 650];
        this.index = 0; 
        this.lastMove = 0;
        
        
        //Crear la rata
        //this.rat = this.add.image(100, 100, 'rat');
        this.rat = this.physics.add.sprite(100,100, 'rat');
        this.rat.setScale(0.1);
        this.rat.setCollideWorldBounds(true);
        
        //contador de vidas para las ratas
        this.lives=3; //por defecto empieza en 3
        
        this.difcoordx; //diferencia de coordenadas entre objetos para colisiones
        this.difcoordy; //diferencia de coordenadas entre objetos para colisiones
        
        //crear la clonacion
        this.clon= this.add.image (300,200, 'clon');
        this.clon.setScale(0.3);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }); //Se crea la opcion de usar las teclas W A S D. 
    }

    update(time, delta) {
        
        //MOVIMIENTO DE LA RATA

        if (this.keys.W.isDown) {
            this.rat.setVelocityY(-100); // Arriba
        } else if (this.keys.S.isDown) {
            this.rat.setVelocityY(100); // Abajo
        } else {
            this.rat.setVelocityY(0); // Detener en Y si no hay input
        }

        if (this.keys.A.isDown) {
            this.rat.setVelocityX(-100); // Izquierda
        } else if (this.keys.D.isDown) {
            this.rat.setVelocityX(100); // Derecha
        } else {
            this.rat.setVelocityX(0); // Detener en X si no hay input
        }
        
        //MANEJO DE VIDAS
        if (this.rat.x >400) { //HAY QUE CAMBIAR LA CONDICIÓN DE DERROTA DE VIDAS 
            this.lives--;
            this.rat.x=100;
            this.rat.y=100; //devolvemos a la posicion inicial
        }
        if (this.lives == 0) {
            {this.scene.start('MenuScene');} //HAY QUE CAMBIARLO POR PANTALLA DE DERROTA
        }
        
        //COLISION CON LA CLONACION
        
        //DEFINIMOS UN RANGO COMO COLLIDER
        this.difcoordx= Math.abs(this.clon.x-this.rat.x);
        this.difcoordy= Math.abs(this.clon.y-this.rat.y); //pilla la diferencia (valor absoluto) entre la coordenada de los dos objetos y si es menor a un rango establecido se activa
        
        if (this.difcoordx<50 && this.difcoordy<50) {
            this.clon.x=10000; //habria que ocultar el objeto en lugar de moverlo
            this.lives++;
        }
        
        //MOVIMIENTO DE LA MANO
        if (this.cursors.left.isDown){
            if (this.index > 0 && time-this.lastMove > 150) {
                this.index--;
                this.hand.x = this.handcoords[this.index];
                this.lastMove=time;
            }
        }

        if (this.cursors.right.isDown){
            if (this.index < 2 && time-this.lastMove > 150) {
                this.index++;
                this.hand.x = this.handcoords[this.index];
                this.lastMove=time;
            }
        }
        
        //Al pulsar la tecla espacio...
        
    }
}