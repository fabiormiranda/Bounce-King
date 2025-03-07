class Ball {
  constructor(gameScreen, player, loseLifeCallback, increaseScoreCallback) {
    this.gameScreen = gameScreen;
    this.player = player;
    this.loseLife = loseLifeCallback;
    this.increaseScore = increaseScoreCallback;

    this.width = 60;
    this.height = 60;
    this.gravity = 0.12;  // Gravidade mais suave
    this.bounceStrength = -15;  // Força de bounce ajustada para ser mais suave
    this.isPaused = false;
    this.movementInterval = null;
    this.collisionCooldown = false;

    this.element = document.createElement("img");
    this.element.src = "./Images/Ball.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    this.gameScreen.appendChild(this.element);

    this.resetPosition(true);
    this.startMoving();
  }

  startMoving() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval); // Limpa intervalo anterior
    }

    // Ajustar para 50ms para um movimento mais fluido
    this.movementInterval = setInterval(() => {
      if (!this.isPaused) {
        this.moveBall();
      }
    }, 50);  // Intervalo de 50ms (20 quadros por segundo)
  }

  moveBall() {
    // A cada iteração, a gravidade e velocidade da bola são atualizadas
    this.velocityY += this.gravity;  // A gravidade continua afetando a velocidade vertical
    this.top += this.velocityY;
    this.left += this.velocityX;

    // Verificar se a bola tocou o topo
    if (this.top <= 0) {
      this.top = 0;
      this.velocityY *= -1;  // Inverte a direção ao bater no topo
    }

    // Verificar colisão com as bordas laterais
    if (this.left <= 0 || this.left + this.width >= this.gameScreen.offsetWidth) {
      this.velocityX *= -1;  // Inverte a direção ao bater nas bordas laterais
    }

    // Verificar colisão com o jogador
    if (!this.collisionCooldown && this.didCollide()) {
      this.velocityY = this.bounceStrength;  // Aplica a força de pulo vertical
      // Direção horizontal aleatória para a bola
      this.velocityX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 3);  // Aleatório entre 3 e 7
      this.collisionCooldown = true;
      setTimeout(() => {
        this.collisionCooldown = false;
      }, 200); // Tempo de cooldown da colisão
    }

    // Verifica se a bola caiu para fora da tela
    if (this.top + this.height >= this.gameScreen.offsetHeight) {
      this.loseLife(true);
      this.resetPosition(true);
      this.player.resetPosition();
    }

    // Atualiza a posição da bola
    this.updatePosition();
  }

  // Verifica se a bola colidiu com o jogador
  didCollide() {
    const ballRect = this.element.getBoundingClientRect();
    const playerRect = this.player.element.getBoundingClientRect();

    // Verifica a colisão com a parte superior da cabeça do jogador
    const collision =
      ballRect.left < playerRect.right &&
      ballRect.right > playerRect.left &&
      ballRect.bottom >= playerRect.top &&
      ballRect.top < playerRect.top + playerRect.height / 4; // Ajuste para garantir que pegue a parte superior da cabeça

      if (collision && this.increaseScore) {
        this.increaseScore();
      }
    return collision;
  }

  // Reseta a posição da bola
  resetPosition(paused = false) {
    this.top = 20;
    this.left = (this.gameScreen.offsetWidth - this.width) / 2;
    this.velocityY = 0;  // Resetando a velocidade vertical
    this.velocityX = 0;  // Resetando a velocidade horizontal
    this.updatePosition();
    this.isPaused = paused;
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  // Método para despausar a bola quando o jogo começa
  unpauseBall() {
    this.isPaused = false;
    this.startMoving();
  }
}
