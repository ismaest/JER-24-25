# GDD - LABRATS

![PORTADA](https://github.com/user-attachments/assets/6f8a6e2c-2bb6-4277-863f-e4bb4e89a232)
> Portada del juego

LABRATS es un juego arcade 1vs1 en el que ambos jugadores tomarán el rol de una rata o un científico. La rata deberá sobrevivir a los intentos del científico por acabar con ella.

  - Iván de Castilla Guitián, i.decastilla.2022@alumnos.urjc.es, smartwastaken
  - Ismael Esteban Liberal, i.esteban.2022@alumnos.urjc.es, ismaest
  - Javier San Juan Ledesma, j.sanjuan.2021@alumnos.urjc.es, KaZeRHD
  - Xabier López Aguilera, x.lopez.2022@alumnos.urjc.es, ReibaxL

## ÍNDICE

```
1. Introducción
  1.1 Título del juego
  1.2 Concepto principal
  1.3 Características Principales
  1.4 Género
  1.5 Propósito y público objetivo
  1.6 Jugabilidad
  1.7 Estilo Visual
  1.8 Alcance
  1.9 Plataforma
  1.10 Licencia
  1.11 Análisis DAFO
  1.12 Metas del proyecto
  1.13 Fases de desarrollo
  1.14 Riesgos Técnicos y Desafíos
2. Diseño del juego
  2.1 Guion
  2.2 Mecánicas
  2.2.1 Controles iniciales
  2.2.2 Balance de roles	
  2.3 Estados
  2.4 Interfaces
3. Desarrollo del Juego
  3.1 Niveles
  3.2 Personajes
  3.3 Ítems
  3.4 Logros
4. Apartado Artístico
  4.1 Música y Sonidos
  4.2 Arte y concept art
    4.2.1 Paleta de colores
    4.2.2 Concept art
5. Equipo Autor
  5.1 Javier San Juan Ledesma
    5.1.1. Primera fase de desarrollo: Javier
  5.2 Iván De Castilla Guitián
    5.2.1. Primera fase de desarrollo: Iván
  5.3 Ismael Esteban Liberal
    5.3.1. Primera fase de desarrollo: Ismael
  5.4 Xabier López Aguilera
    5.4.1. Primera fase de desarrollo: Xabier
6. Créditos
7. Anexos
  7.1. Futuras Características
```

## Introducción

En este documento se detallan todos los requisitos y especificaciones del videojuego “Labrats”, creado para la asignatura Juegos en Red del grado en Diseño y Desarrollo de Videojuegos de la Universidad Rey Juan Carlos.

**1.1 Título del juego**

El título del juego es “Labrats”. Se ha elegido este título a raíz de la ambientación elegida para el mismo, donde se nos presentan dos roles jugables: Unas ratas de laboratorio o un científico loco.


**1.2 Concepto principal**

Un videojuego en el que dos jugadores deben competir el uno contra el otro en una especie de carrera de obstáculos. Mientras que uno de los jugadores debe llegar hasta la meta esquivando obstáculos mortales, el otro jugador es quien controla la activación de dichos obstáculos, con el objetivo de detener el avance del jugador contrario.


**1.3 Características Principales**

  - División del juego en niveles: El juego contará con varios niveles, o carreras, para que los jugadores puedan elegir qué circuito quieren jugar.

  - Frenetismo: El juego será rápido y frenético, exigiendo a ambos jugadores que estén atentos el uno del otro para poder lograr sus objetivos personales.

  - Diversión: La idea principal del juego siempre está en divertir a los jugadores. El estilo desenfadado del juego y su inmediatez dan pie a partidas rápidas y divertidas donde la competitividad desemboca en momentos de diversión.

  - Competitividad: Uno de los componentes principales también es la competitividad entre jugadores, dado que, al fin y al cabo, solo puede ganar uno.


**1.4 Género**

Se trata de un juego de género Death Run, caracterizado por dividir a los jugadores en roles, teniendo generalmente uno de ellos escapar con vida como objetivo, mientras que el contrario debe activar trampas mortales para acabar con el primero. Debido a la propia característica del género, también se puede considerar como un juego multijugador. Además, se puede categorizar como juego 2D debido a la estética escogida.


**1.5 Propósito y público objetivo**

Es un juego divertido y competitivo que busca un desafío para ambos jugadores, apto para todos los públicos por encima de los 7 años.


**1.6 Jugabilidad**

La jugabilidad dependerá del rol que tome cada jugador en función de la partida. En caso de ser “La Rata” se deberá avanzar por el mapa saltando por diferentes plataformas evitando las trampas mortales. En el caso de tomar el rol del “El Científico” debes observar la trayectoria que sigue “La Rata” y activar las trampas por las que pase en el momento idóneo para terminar con su vida.


**1.7 Estilo Visual**

Es un juego 2D con un estilo comiquero y de esbozo como si estuviera dibujado en un cuaderno.


**1.8 Alcance**

Este proyecto se plantea únicamente como un prototipo jugable sin la posibilidad de ser ampliado hasta un producto final ni comercial.


**1.9 Plataforma**

El juego estará disponible tan solo en ordenador. Se podrá jugar tanto de forma local, como en dos ordenadores de forma online.


**1.10 Licencia**

La licencia del proyecto es Apache-2.0 license


**1.11 Análisis DAFO**

![DAFO](https://github.com/user-attachments/assets/23be39b4-e0c7-4482-b1da-6e2402f4d56b)
> Análisis DAFO

**1.12 Metas del proyecto**

Es un proyecto académico, realizado con el fin de profundizar en el tema de juegos en redes, y con la intención de aprender todo lo posible dentro de este área, para ampliar nuestro conocimientos y ser capaces de aplicarlos en nuestro futuro.


**1.13 Fases de desarrollo**

El desarrollo del videojuego se dividirá en 5 fases:

  - Fase 1: formación del equipo de desarrollo, elección de la temática del juego, diseño de las mecánicas e identificación y descripción de las funcionalidades principales. El objetivo de esta fase será la creación del GDD.

  - Fase 2: desarrollo de juego en local.

  - Fase 3: extensión del juego incluyendo un back-end que utilice tecnología REST.

  - Fase 4: extensión del juego utilizando REST y WebSockets.

  - Fase 5 (opcional): Mejoras finales / Publicación del juego


**1.14 Riesgos Técnicos y Desafíos**

A lo largo del desarrollo del juego, en cuanto a la adaptación de las diferentes fases, se ha considerado que se encontrarán posibles desafíos, y se ha tenido en cuenta una serie de riesgos técnicos, que se deberán de abordar a lo largo de dicho desarrollo.

Entre ellos, nos encontramos con desafíos como:

  - Dificultad para entender la teoría, y por lo tanto, dificultad al implementar el código para la realización del ejercicio.

  - Dificultad a la hora de implementar dicha teoría en base a la idea que se ha concretado.

  - Falta de tiempo para poder refinar aspectos más técnicos dentro de las mecánicas y la jugabilidad.


## Diseño del juego


**2.1 Guion**

El juego transcurrirá en un laboratorio en el que un científico está experimentando con ratas para poner a prueba su inteligencia. Durante este experimento, este las coloca en un laberinto que cuenta con pruebas mortales, buscando poner a prueba la capacidad de deducción de estos animales.


**2.2 Mecánicas**

El juego se desarrolla en partidas rápidas, donde un jugador debe esquivar las trampas activadas por su rival. Un jugador se mueve por un escenario lleno de trampas, mientras que el otro avanza sin preocupación por un escenario con botones y otros mecanismos que puede utilizar para activar dichas trampas.

Las trampas tienen el objetivo de matar a las ratas, y estas deben esquivarlas para evitar morir. Si mueren menos de 3 ratas antes de llegar a la meta, ese jugador habrá ganado. Si por el contrario, el científico que activa las trampas logra matar 3 veces al contrario, él será el ganador.


2.2.1 Controles

  - La Rata: 

    - W: Avanzar hacia arriba.
    - A: Avanzar hacia la izquierda.
    - D: Avanzar hacia ala derecha.
    - S: Avanzar hacia abajo.

  - El Científico:

    - ESPACIO: Accionar la trampa que se corresponde con la posición en la que te encuentras. 
    - Flecha izquierda Desplazarse a la izquierda.
    - Flecha derecha: Desplazarse a la derecha.


2.2.2 Balance de roles

La Rata: No sabe cuándo el científico accionará la trampa. Debe intentar engañarlo para forzarle a activar la trampa cuando él esté fuera de peligro.

El Científico: Existe un retardo desde que se acciona el botón hasta que ocurre la acción, por lo tanto, este debe anticiparse a los movimientos de la rata, sabiendo que le puede engañar dicha rata.


**2.3 Estados**

Entre los diferentes estados del juego, se plantean:

  - Menú de inicio
  - Menú de pausa
  - Menú de configuración
  - Selección de rol
  - Juego
  - Pantalla de victoria/derrota
  - Créditos

**2.4 Interfaces**

![MENU PRINCIPAL](https://github.com/user-attachments/assets/33678f96-d86a-4faf-b8e9-fdc64a9d1270)
> Menú Principal

![PAUSA](https://github.com/user-attachments/assets/1749d80f-314c-41a0-ba14-0de7622efd33)
> Menú de pausa

![CONFIGURACION](https://github.com/user-attachments/assets/45219d1b-4b2b-40c0-9027-0cc01f3bb83c)
> Menú de configuración

![SELECCION DE ROL](https://github.com/user-attachments/assets/e80c9d4c-b6c6-4baa-b47c-594c2abbcabe)
> Selección de Rol

![VICTORIA DERROTA](https://github.com/user-attachments/assets/51ba7636-8fd9-406f-9fc2-3a8aad2f3cd9)
> Pantalla de victoria/derrota

![CREDITOS](https://github.com/user-attachments/assets/22cf41cd-047c-4c67-9958-0eea79446f46)
> Pantalla de créditos


## Desarrollo del Juego


**3.1 Niveles**

Se van a diseñar 2 carreras para dar a los jugadores un poco de variedad y que no se aburran rápidamente del juego. Dichas carreras contarán con trampas únicas y una estética propia.

  - Laboratorio 1: Se desarrolla dentro de un centro de control donde se evalúa el comportamiento de la rata y tiene que llegar a una trampilla (objetivo). Dicha rata deberá escapar del centro de control sorteando trampas que se encuentran dispuestas por toda la sala (objetos punzantes, sustancias químicas peligrosas, entre otras).

  - Laboratorio 2: Después de escapar por la trampilla del primer laboratorio, nos encontramos dentro del sótano que lleva directamente a las alcantarillas del laboratorio (objetivo). En el sótano nos encontramos con aparatos peligrosos que fueron diseñados con un fin pero que fueron descartados y guardados en dicho sótano.


**3.2 Personajes**

El juego cuenta con dos personajes:

  - La Rata, que es el jugador que debe esquivar las trampas para sobrevivir.

  - El Científico, que es el jugador que activa las trampas del escenario.


**3.3 Ítems**

  - Clonación: Cuando mueres, pierdes una rata, pero a lo largo del espacio nos podemos encontrar con un ítem de clonación, permitiendo clonar una de las ratas y aumentando tus probabilidades de ganar.


**3.4 Logros**


  - El Escapista: Escapa del laboratorio sin perder una rata.

  - Manny Manitas: Acaba con las 3 ratas en menos de 3 mins.

  - Tanto en la tierra como en el cielo: Revive 3 veces.

  - Houdini: Consigue que el científico no active una de las trampas.

  - Me gusta el queso, pero no tanto: Escapa del laboratorio en menos de 10 mins.

  - Ratatouille: Sé cocinar, no escapar (muere 3 veces sin clonación).

  - Victor Frank: Acaba con todas las ratas.


## Apartado Artístico


**4.1 Música y Sonidos**

Los sonidos de ambiente serán propios de un laboratorio, como sonidos de máquinas probetas y otros instrumentos comúnmente encontrados en laboratorios.

Las ratas harán ruidos característicos con su movimiento, y, las trampas y los botones, también harán sonidos para dar feedback a los jugadores de lo que está sucediendo.


**4.2 Arte y concept art**

Estilo comiquero y de esbozo como si estuviera dibujado en un cuaderno, basándonos en un estilo caricaturesco como el de Cuphead, Borderlands, entre otros. Pero teniendo en cuenta el minimalismo, no queremos hacerlo muy complicado, queremos hacerlo fácil de ver y entender. Por lo tanto, no tendrá colores tan llamativos y texturas tan bien hechas como las de los juegos mencionados anteriormente.


4.2.1 Paleta de colores


> Paleta de colores principal

El negro y el blanco son los que van a predominar, manteniendo ese estilo comiquero y de esbozo, mientras que el amarillo se utilizará para objetos interactuables y haciendo referencia al queso.

4.2.2 Concept art

![JUEGO](https://github.com/user-attachments/assets/1741e759-afd5-468b-9c68-839305c35039)
> Escena de juego

## Equipo Autor

**5.1 Javier San Juan Ledesma**

Artista y programador.
	
  - 5.1.1. Primera fase de desarrollo: Javier
Se ha encargado de detallar el aspecto visual y conceptual del videojuego, entre ellos, la paleta de colores, interfaces y estética del juego.

**5.2 Iván De Castilla Guitián**

Guionista, programación.

  - 5.2.1. Primera fase de desarrollo: Iván
Se ha encargado de diferentes aspectos dentro del gdd, entre ellos las metas, definir las fases de desarrollo, los logros, mecánicas concretas y roles de cada equipo, habiendo sido previamente elegidos por cada miembro del grupo de manera democrática.

**5.3 Ismael Esteban Liberal**

Game Designer y programación.
	
  - 5.3.1. Primera fase de desarrollo: Ismael
Ha sido el autor de la idea principal del juego, y se ha centrado en gran parte de la introducción, guion, niveles del juego y personajes.

**5.4 Xabier López Aguilera**

Game Designer y programación.

  - 5.4.1. Primera fase de desarrollo: Xabier
Se ha ocupado del análisis DAFO, los estados y parte de las interfaces. Dentro del apartado artístico, la música y los sonidos y de buscar gran parte de las referencias que vamos a utilizar para la realización de nuestro juego.

## Créditos

Aquí se listan los créditos del juego, como personas que han apoyado el desarrollo o assets de uso externos que deban de ser apropiadamente acreditados.

## Anexos

En este apartado se mostrarán los anexos.

**7.1. Futuras Características**

Como se ha concretado en este GDD, a medida que se avance con las fases de desarrollo, se irán creando diferentes niveles. 

La idea inicial son dos niveles, comenzando con el nivel inicial y ampliándose en futuras fases.
