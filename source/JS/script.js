// Achtergrond scrollsnelheid
let move_speed = 3;
  
// Gravitatie constante waarde
let gravity = 0.5;

// Highscore
let highScore = 0;

// Schild 
let shield = false;

// Hartjes
let hearts = 1;
  
// Referentie naar het vogel element (ervan uitgaande dat het een <img> is)
let bird = document.querySelector('.bird');

// Instellen van de afbeeldingsbronnen voor BatUp en BatDown
let batUpSrc = 'images/BatUp.png'; // Pad naar je BatUp afbeelding
let batDownSrc = 'images/BatDown.png'; // Pad naar je BatDown afbeelding

// Verkrijgen van eigenschappen van het vogel element
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
  
// Verkrijgen van referentie naar het score element
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
  
// Instellen van de initiële game status naar starten
let game_state = 'Start';
  
// Voeg een eventlistener toe voor toetsindrukken
document.addEventListener('keydown', (e) => {
  
  // Start het spel als de spatiebalk is ingedrukt
  if (e.key == ' ' && game_state != 'Play') {
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
      e.remove();
    });
    bird.style.top = '40vh';
    bird.style.left = '50vw';  // Zet de vleermuis in het horizontale midden van het scherm
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score: ';
    score_val.innerHTML = '0';
    play();
  }
  
  // Controleer of de spatiebalk is ingedrukt om de afbeelding naar BatDown te veranderen
  if (e.key == ' ') { // Spatiebalk toets
    bird.src = batDownSrc; // Verander naar BatDown
    bird_dy = -7.6; // Pas opwaartse kracht toe
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key == ' ') { // Wanneer de spatiebalk wordt losgelaten
    bird.src = batUpSrc; // Verander terug naar BatUp
  }
});

function play() {
  function move() {
    
    // Detecteer of het spel is geëindigd
    if (game_state != 'Play') return;
    
    // Verkrijgen van referentie naar alle pijpelementen
    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
      
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();
      
      // Verwijder de pijpen als ze uit het scherm zijn verplaatst
      // om geheugen te besparen
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Botsingdetectie met vogel en pijpen
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          
          // Verander game status en eindig het spel als er een botsing plaatsvindt
          game_state = 'End';
          message.innerHTML = 'Druk op Spatie om opnieuw te starten';
          message.style.left = '28vw';
          return;
        } else {
          // Verhoog de score als de speler de pijp succesvol heeft ontweken
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
          }
          element.style.left = pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy = bird_dy + gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -7.6;
      }
    });

    // Botsingdetectie met vogel en boven- en onderkant van het venster
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = 'End';
      message.innerHTML = 'Druk op Enter om opnieuw te starten';
      message.style.left = '28vw';
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;
  
  // Constante waarde voor de ruimte tussen twee pijpen
  let pipe_gap = 35;
  function create_pipe() {
    if (game_state != 'Play') return;
    
    // Maak een andere set pijpen als de afstand tussen twee pijpen is overschreden
    if (pipe_seperation > 115) {
      pipe_seperation = 0;
      
      // Bereken willekeurige positie van pijpen op de y-as
      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      
      // Voeg het gemaakte pijpelement toe in de DOM
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      
      // Voeg het gemaakte pijpelement toe in de DOM
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}


// Buggs:
// Als je het plafond/grond raakt, kan je niet opnieuw spawnen.
// Hitbox van de Vleermuis is niet goed. (Te Groot)
// Score op de goede manier laten toepassen.
