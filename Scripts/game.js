class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        //cargar aquí las imágenes o sprites necesarios

        this.load.setPath('assets/');

        this.load.image('scenery', 'gameBackground.png');

        this.load.image('rat', 'rata.png');
        this.load.image('hand', 'hand.png');
        this.load.image('clon', 'clon.png');
        this.load.image('tp', 'tp.png');
        this.load.image('queso', 'queso.png');
        this.load.image('vacuna', 'vacuna.png');
        this.load.image('trapdoor', 'trapdoor.png');
        
        this.load.image("roleInfo", "btnOpciones.png") //cambiar a btn de menu
        
        this.load.image('lifeIcon', 'lifeIcons.png');
    }

    create() {
        this.add.image(400, 300, 'scenery');
        
        //crear el boton de arriba de opciones
        var btnOpt = this.add.image(700, 40, 'roleInfo').setScale(0.5);
        btnOpt.setInteractive();
        btnOpt.on('pointerdown', () => {
            this.scene.launch("RoleInfo");
        });

        //crear la mano
        this.hand = this.add.image(400, 500, 'hand');
        this.hand.setScale(0.5);
        //this.hand.setCollideWorldBounds(true);

        //crear array y cooldown para la mano
        this.handcoords = [150, 400, 650];
        this.index = 0;
        this.lastMove = 0;

        //crear la rata
        //this.rat = this.add.image(100, 100, 'rat');
        this.rat = this.physics.add.sprite(100, 100, 'rat');
        this.rat.setScale(0.1);
        this.rat.setCollideWorldBounds(true);

        //contador de vidas para las ratas
        this.lives = 3; //por defecto empieza en 3
        
        //crear la clonacion
        this.clon = this.add.image(300, 200, 'clon');
        this.clon.setScale(0.3);

        //crear los tps dinámicamente
        this.tps = [
            this.createTeleport(400, 200),
            this.createTeleport(100, 200),
            this.createTeleport(600, 400), // Añade más TPs aquí si lo necesitas
        ];
        this.exitCollider = true;

        //crear quesos dinámicamente
        this.cheeses = [
            this.createCheese(250, 100),
            this.createCheese(300, 300),
            this.createCheese(700, 400), // Añade más posiciones si lo necesitas
        ];
        this.cheeseCollider = false;
        this.cheeseTime = 0;

        //crear vidas dinámicamente
        //this.lives = [
        //    this.createLives(20, 20),
        //    this.createLives(60, 20),
        //    this.createLives(100, 20), // Añade más posiciones si lo necesitas
        //];

        //crear boton jeringuilla
        this.createButton(150, 500, 'vacuna', 'bvacuna');

        //crear boton trampilla
        this.createButton(400, 500, 'trapdoor', 'btrapdoor');

        //crear boton queso
        this.createButton(650, 500, 'queso', 'bqueso');

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
        if (this.cheeseCollider == false) {
            this.handleRatMovement(100);

            //comprobar colisiones con los quesos
            this.cheeses.forEach((cheese, index) => {
                if (this.checkCollision(this.rat, cheese, 50)) {
                    cheese.destroy(); // Elimina el queso del juego
                    this.cheeses.splice(index, 1); // Elimina el queso de la lista
                    this.cheeseCollider = true;
                    this.cheeseTime = time;
                }
            });
        } else {
            //EFECTOS DEL QUESO
            if (Math.abs(time - this.cheeseTime) > 10000) {
                this.cheeseCollider = false;
            }
            this.handleRatMovement(50);
        }

        //MOVIMIENTO DE LA MANO
        this.handleHandMovement(time);

        //USO DE BOTONES
        if (this.cursors.up.isDown && this.index == 0) {
            this.bvacuna = true;
            this.rat.x = 150;
        } else if (this.cursors.up.isDown && this.index == 1) {
            this.btrapdoor = true;
            this.rat.x = 300;
        } else if (this.cursors.up.isDown && this.index == 2) {
            this.bqueso = true;
            this.rat.x = 200;
        }

        //MANEJO DE VIDAS
        if (this.rat.x > 250) { //HAY QUE CAMBIAR LA CONDICIÓN DE DERROTA DE VIDAS 
            this.lives--;
            this.rat.x = 100;
            this.rat.y = 100; //devolvemos a la posicion inicial
        }
        if (this.lives == 0) {
            { this.scene.start('GameOverScene'); } //HAY QUE CAMBIARLO POR PANTALLA DE DERROTA
        }

        //COLISION CON LA CLONACION
        if (this.checkCollision(this.rat, this.clon, 50)) {
            this.clon.x = 10000; //habria que ocultar el objeto en lugar de moverlo
            this.lives++;
        }

        //TP ENTRE LAS ALCANTARILLAS
        this.tps.forEach(tp => {
            if (this.checkCollision(this.rat, tp, 50) && this.exitCollider) {
                this.rat.x = tp.targetX;
                this.rat.y = tp.targetY;
                this.exitCollider = false;
            }
        });

        if (
            this.tps.every(
                tp => !this.checkCollision(this.rat, tp, 50)
            ) && !this.exitCollider
        ) {
            this.exitCollider = true;
        }
    }

    
    //Crea un teleport con posición y destino.
    
    createTeleport(x, y) {
        const tp = this.add.image(x, y, 'tp').setScale(0.3);
        tp.targetX = x + 200; // Cambia esto según dónde quieres que lleve
        tp.targetY = y + 200;
        return tp;
    }

    
    //Crea un queso en la posición especificada.
    
    createCheese(x, y) {
        const cheese = this.add.image(x, y, 'queso').setScale(0.3);
        return cheese;
    }

    createLives(x, y) {
        const lifeIcon = this.add.image(x, y, 'lifeIcon').setScale(0.01);
        return lifeIcon;
    }



    //Crea un botón interactivo.
    
    createButton(x, y, texture, name) {
        this[name] = this.add.image(x, y, texture).setScale(0.3);
        this[name] = false;
    }

    
    //Maneja el movimiento de la rata según la velocidad.
    
    handleRatMovement(speed) {
        if (this.keys.W.isDown) {
            this.rat.setVelocityY(-speed); // Arriba
        } else if (this.keys.S.isDown) {
            this.rat.setVelocityY(speed); // Abajo
        } else {
            this.rat.setVelocityY(0); // Detener en Y si no hay input
        }

        if (this.keys.A.isDown) {
            this.rat.setVelocityX(-speed); // Izquierda
        } else if (this.keys.D.isDown) {
            this.rat.setVelocityX(speed); // Derecha
        } else {
            this.rat.setVelocityX(0); // Detener en X si no hay input
        }
    }

    
    //Maneja el movimiento de la mano.
    
    handleHandMovement(time) {
        if (this.cursors.left.isDown) {
            if (this.index > 0 && time - this.lastMove > 150) {
                this.index--;
                this.hand.x = this.handcoords[this.index];
                this.lastMove = time;
            }
        }

        if (this.cursors.right.isDown) {
            if (this.index < this.handcoords.length - 1 && time - this.lastMove > 150) {
                this.index++;
                this.hand.x = this.handcoords[this.index];
                this.lastMove = time;
            }
        }
    }
    
    //comprueba colisiones entre dos objetos.
    
    checkCollision(obj1, obj2, range) {
        const dx = Math.abs(obj1.x - obj2.x);
        const dy = Math.abs(obj1.y - obj2.y);
        return dx < range && dy < range;
    }
}

