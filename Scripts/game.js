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
        this.load.image('tp', 'tp.png');
        this.load.image('queso', 'queso.png');
        this.load.image('vacuna', 'vacuna.png');
        this.load.image('trapdoor', 'trapdoor.png');
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
        
        //crear el tp
        this.tp=this.add.image(400,200,'tp');
        this.tp2=this.add.image(100,200,'tp');
        this.tp.setScale(0.3);
        this.tp2.setScale(0.3);
        this.exitCollider=true;
        
        //crear queso
        this.queso=this.add.image(500,200,'queso');
        this.queso.setScale(0.3);
        this.cheeseTime=0;
        this.cheeseCollider=false;
        
        //crear boton jeringuilla
        this.bvacuna=this.add.image(150,500,'vacuna');
        this.bvacuna.setScale(0.3);
        this.bvacuna=false;
        
        //crear boton trampilla
        this.btrapdoor=this.add.image(400,500,'trapdoor');
        this.btrapdoor.setScale(0.3)
        this.btrapdoor=false;
        
        //crear boton queso
        this.bqueso=this.add.image(650,500,'queso');
        this.bqueso.setScale(0.3);
        this.bqueso=false;
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }); //Se crea la opcion de usar las teclas W A S D. 
    }

    update(time, delta) {
        //calculos queso
        this.difcoordx4= Math.abs(this.queso.x-this.rat.x);
        this.difcoordy4= Math.abs(this.queso.y-this.rat.y);
        
        //MOVIMIENTO DE LA RATA
    if (this.cheeseCollider==false) {
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
        if (this.difcoordx4<50 && this.difcoordy4<50) {
            this.cheeseCollider=true;
            this.cheeseTime=time;
        }
    } else {
        //EFECTOS DEL QUESO
        
        if (Math.abs(time-this.cheeseTime)>10000) {
            this.cheeseCollider=false;
        }
        if (this.keys.W.isDown) {
            this.rat.setVelocityY(-50); // Arriba
        } else if (this.keys.S.isDown) {
            this.rat.setVelocityY(50); // Abajo
        } else {
            this.rat.setVelocityY(0); // Detener en Y si no hay input
        }
        if (this.keys.A.isDown) {
            this.rat.setVelocityX(-50); // Izquierda
        } else if (this.keys.D.isDown) {
            this.rat.setVelocityX(50); // Derecha
        }
        else {
            this.rat.setVelocityX(0); // Detener en X si no hay input
        }
        
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
        
        //USO DE BOTONES
        if (this.cursors.up.isDown && this.index == 0 ) {
            this.bvacuna=true;
            this.rat.x=150;
        } else if (this.cursors.up.isDown && this.index==1) {
            this.btrapdoor=true;
            this.rat.x=300;
        } else if (this.cursors.up.isDown && this.index==2) {
            this.bqueso=true;
            this.rat.x=200;
        }
        
        //MANEJO DE VIDAS
        if (this.rat.x >600) { //HAY QUE CAMBIAR LA CONDICIÓN DE DERROTA DE VIDAS 
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
        
        //TP ENTRE LAS ALCANTARILLAS
        this.difcoordx2= Math.abs(this.tp.x-this.rat.x);
        this.difcoordy2= Math.abs(this.tp.y-this.rat.y);
        this.difcoordx3= Math.abs(this.tp2.x-this.rat.x);
        this.difcoordy3= Math.abs(this.tp2.y-this.rat.y);

        if (this.difcoordx2<50 && this.difcoordy2<50 && this.exitCollider==true) {
            this.rat.x=this.tp2.x;
            this.rat.y=this.tp2.y;
            this.exitCollider=false;
        }

        if (this.difcoordx3<50 && this.difcoordy3<50 && this.exitCollider==true) {
            this.rat.x=this.tp.x;
            this.rat.y=this.tp.y;
            this.exitCollider=false;
        }

        if (this.difcoordx2>50 && this.difcoordy2>50 && this.exitCollider==false && this.difcoordx3>50 && this.difcoordy3>50 ) {
            this.exitCollider=true;
        }

        
        //Al pulsar la tecla espacio...
        
    }
}