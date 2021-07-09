const miModulo = (() => {        // Patron de modulo, de esta forma el codigo queda protegido.
    'use strict'

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],          // tipos de cartas
          especiales = ['A', 'J', 'Q', 'K'];    // cartas especiales
    
    let puntosJugadores = [];
    
    // Referencias del HTML
    const btnPedir             = document.querySelector('#btnPedir'),
          btnDetener           = document.querySelector('#btnDetener'),
          btnNuevo             = document.querySelector('#btnNuevo');
    
    const divCartasJugadores   = document.querySelectorAll('.divCartas'),
          puntosHTML           = document.querySelectorAll('small'); // Referencia a todos los elementos small
    
          // Esta funcion inicializa el deck
    const inicializarJuego = ( numJugadores = 2 ) => {
       deck = crearDeck();

       puntosJugadores = [];
       for ( let i = 0; i < numJugadores; i++) {
           puntosJugadores.push(0);
       }

       puntosHTML.forEach(elem => elem.innerText = 0);
       divCartasJugadores.forEach(elem => elem.innerHTML = ''); 
    
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    
    // Esta funcion crea una nueva baraja
    const crearDeck = () => {
        deck = [];

        for ( let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
    
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo)
            }
        }
      
        return _.shuffle(deck);
    }
    
    crearDeck();
    
    // Esta funcion me permite tomar una carta
    const pedirCarta = () => {
    
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }
                  
        return deck.pop();  // Pop remueve el ultimo elemento del arreglo y lo regresa
    }
    
    // pedirCarta();
    // Funcion para obtener el valor de la carta entregada.
    // Siempre se reparte desde la ultima carta, para eso se usa el shuffle
    // que simula la mezcla del mazo.
    
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length -1);// Regresa un nuevo string en base a la posicion inicial
        return ( isNaN(valor) ) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;
    }

    // Turno: 0 = primer jugador y el ultimo sera la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];   // Puntos HTML, en su primera posicion, innerText para representar el contenido
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img'); 
            imgCarta.src = `assets/cartas/${ carta }.png`;      
            imgCarta.classList.add('carta');  
            divCartasJugadores[turno].append(imgCarta);
    }
    
    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {              // Callback para esperar 10ms luego de que se ejecuten las instrucciones de arriba
    
            if ( puntosComputadora === puntosMinimos ) {
                alert('Nadie gana =(');
            } else if ( puntosMinimos > 21 ){
                alert('La computadora gana');
            } else if ( puntosComputadora > 21) {
                alert('El jugador gana! =)');
            } else {
                alert('La computadora gana')
            }
        }, 100);
    }

    // Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;

       do {
            const carta  = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
    
        } while ( (puntosComputadora < puntosMinimos) && ( puntosMinimos <= 21) );

        determinarGanador();
    }
    
    // Eventos
    btnPedir.addEventListener('click', () => {          
        
        const carta  = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );
     
        crearCarta( carta, 0 );

        /* const imgCarta = document.createElement('img');  // Crear cartas aleatoreamente al momento de pedir una carta
        imgCarta.src = `assets/cartas/${ carta }.png`;      // Elegir una carta desde las imagenes ya cargadas, debe declararse con backticks para poder insertar la declaracion en js
        imgCarta.classList.add('carta');                    // Agregar clase de css a la constante imgCarta
        divCartasJugador.append(imgCarta); */
    
        if ( puntosJugador > 21) {
            console.warn('Perdiste');
            btnPedir.disabled = true;   // atributo disabled, para deshabilitar el boton si el jugador se pasa de 21
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
    
        } else if ( puntosJugador === 21) {
            console.warn('21, genial!');
            btnPedir.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });
    
    btnDetener.addEventListener('click', () => {
    
        btnPedir.disabled = true;
        btnDetener.disabled = true;
    
        turnoComputadora(puntosJugadores[0]);
    });
    
    btnNuevo.addEventListener('click', () => {
    
        inicializarJuego();
    });
    
    return {
       nuevoJuego: inicializarJuego
    };

})();

