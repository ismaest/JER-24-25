
class UserScene extends Phaser.Scene {
    constructor() {
        super({ key: "UserScene" });
    }

    preload() {
        this.load.setPath('assets/');
        this.load.image('background', 'MenuBackground.png');
        this.load.audio('mainMenuMusic', 'mainMenuMusic.ogg');
        this.load.audio('click', 'click.wav');
    }

    create() {
        
        this.add.image(400, 300, 'background');

        
        this.game.click = this.sound.add('click');
        
        this.SignUp();
    }

    SignUp() {

        // Crear el formulario
        this.form = document.createElement('form');
        this.form.action = '/user';  // URL a la que se envia el formulario
        this.form.method = 'POST';
        this.form.style.position = 'absolute';
        this.form.style.top = '40%';  // Posición vertical 
        this.form.style.left = '50%'; // Posición horizontal
        this.form.style.transform = 'translateX(-50%)'; // Centrado horizontal
        this.form.style.zIndex = '10';  // posicion z
        this.form.style.display = 'block';

        // Usuario
        let user = document.createElement('input');
        user.type = 'text';  // Entrada para texto
        user.id = "userID";
        user.name = 'username';
        user.placeholder = 'Introduce el nombre de usuario';
        user.value = '';
        user.style.width = '300px';
        user.style.height = '40px';
        user.style.marginBottom = '15px';
        user.style.padding = '10px';
        user.style.backgroundColor = '#d5d3b3';  // Color de fondo
        user.style.color = 'black';

        // Contraseña
        let password = document.createElement('input');
        password.type = 'password';  // Entrada para contraseña
        password.id = "passwordID";
        password.name = 'password';
        password.placeholder = 'Introduce la contraseña';
        password.value = '';
        password.style.width = '300px';
        password.style.height = '40px';
        password.style.padding = '10px';
        password.style.position = 'absolute';
        password.style.left = '50%';
        password.style.top = '100px';
        password.style.transform = 'translateX(-50%)';
        password.style.marginTop = '10px';
        password.style.backgroundColor = '#d5d3b3';  // Color de fondo
        password.style.color = 'black';

        // Botón de registro
        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.innerText = 'Registrarse';
        submitButton.style.width = '320px';
        submitButton.style.height = '50px';
        submitButton.style.fontSize = '18px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.marginTop = '20px';
        submitButton.style.backgroundColor = '#686653';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        submitButton.style.position = 'absolute';
        submitButton.style.left = '50%';
        submitButton.style.top = '180px';
        submitButton.style.transform = 'translateX(-50%)';

        this.form.appendChild(user);
        this.form.appendChild(password);
        this.form.appendChild(submitButton);
        document.body.appendChild(this.form);

        // Añadir indicador de conexión
        let connectionIndicator = document.createElement('div');
        connectionIndicator.id = 'connection-indicator';
        connectionIndicator.style.width = '20px';
        connectionIndicator.style.height = '20px';
        connectionIndicator.style.backgroundColor = 'red'; // Estado inicial (desconectado)
        document.body.appendChild(connectionIndicator);

        // Manejar el submit del formulario
        this.form.onsubmit = (event) => {
            event.preventDefault();
            console.log('Has iniciado sesión');
            this.form.style.display = 'none';
            this.scene.start('MenuScene');

            // Crear objeto JSON con los datos del usuario
            const userData = {
                name: document.getElementById("userID").value,
                password: document.getElementById("passwordID").value
            };

            console.log("Informacion a enviar:", JSON.stringify(userData));

            // Realizar la petición POST usando AJAX con jQuery
            $.ajax({
                method: "POST",
                url: "/user",  // La ruta que maneja el registro y la conexión
                contentType: "application/json",  // Especifica que el contenido es JSON
                data: JSON.stringify(userData),  // Convierte el objeto JS a JSON
                success: function(response) {
                    console.log("Respuesta del servidor:", response);

                    // Si la respuesta indica que el jugador se conectó correctamente
                    if (response.connectionStatus) {
                        // Cambiar el indicador de conexión a verde
                        document.getElementById('connection-indicator').style.backgroundColor = 'green';
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error al enviar los datos:", xhr.responseText);
                }
            });
        };
    }
    
}