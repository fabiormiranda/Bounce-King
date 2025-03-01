class Ball {
    constructor(gameScreen, player, loseLifeCallback) {
      this.gameScreen = gameScreen;
      this.player = player;
      this.loseLife = loseLifeCallback;
      
      // Definições de tamanho e posição inicial da bola
      this.width = 60;
      this.height = 60;
      this.resetPosition(true);
      
      // Propriedades de movimento
      this.gravity = 0.02; // Gravidade reduzida ainda mais para queda mais lenta
      this.bounceStrength = -5; // Mantendo a força do salto
      this.isPaused = false; // Flag para controlar pausa inicial
      
      // Criar o elemento da bola no DOM
      this.element = document.createElement("img");
      this.element.src = "./Images/ball.png";
      this.element.style.position = "absolute";
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
    
      this.gameScreen.appendChild(this.element);
      this.updatePosition();
    
      // Inicia o loop de movimento da bola
      this.startMoving();
    }
  
    startMoving() {
      const move = () => {
        if (!this.isPaused) {
          this.moveBall();
        }
        requestAnimationFrame(move);
      };
      requestAnimationFrame(move);
    }
  
    moveBall() {
      // Aplicação da gravidade
      this.velocityY += this.gravity;
      this.top += this.velocityY;
      this.left += this.velocityX;
  
      // Rebater no teto
      if (this.top <= 0) {
        this.top = 0;
        this.velocityY *= -1; // Rebote normal no teto
      }
  
      // Rebater nas laterais
      if (this.left <= 0 || this.left + this.width >= this.gameScreen.offsetWidth) {
        this.velocityX *= -1;
      }
  
      // Verifica colisão com o jogador
      if (this.didCollide()) {
        console.log("Bola bateu no jogador!");
        this.velocityY = this.bounceStrength;
        this.velocityX = (Math.random() > 0.5 ? 1 : -1) * 3; // Movimento lateral fixo
      }
  
      // Se a bola tocar o chão, reinicia no topo da tela
      if (this.top + this.height >= this.gameScreen.offsetHeight) {
        this.loseLife();
        this.resetPosition(true);
      }
  
      this.updatePosition();
    }
  
    didCollide() {
      const ballRect = this.element.getBoundingClientRect();
      const playerRect = this.player.element.getBoundingClientRect();
  
      return (
        ballRect.left < playerRect.right &&
        ballRect.right > playerRect.left &&
        ballRect.bottom >= playerRect.top &&
        ballRect.top < playerRect.top + playerRect.height /4
      );
    }
  
    resetPosition(paused = false) {
      // Reinicia a posição no topo da tela
      this.top = 20; 
      this.left = (this.gameScreen.offsetWidth - this.width) / 2;
      this.velocityY = 0; 
      this.velocityX = 0;
      
      if (paused) {
        this.isPaused = true;
        setTimeout(() => {
          this.isPaused = false;
          this.velocityY = 1; // Inicia a queda após pausa
        }, 3000); // Espera 3 segundos antes de começar a cair
      }
    }
  
    updatePosition() {
      // Atualiza a posição da bola na tela
      this.element.style.top = `${this.top}px`;
      this.element.style.left = `${this.left}px`;
    }
  } 