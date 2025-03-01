class Ball {
  constructor(gameScreen, player, loseLifeCallback, increaseScoreCallback) {
    this.gameScreen = gameScreen;
    this.player = player;
    this.loseLife = loseLifeCallback;
    this.increaseScore = increaseScoreCallback;

    this.width = 60;
    this.height = 60;
    this.gravity = 0.005; 
    this.bounceStrength = -3;
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
      clearInterval(this.movementInterval);
    }

    this.movementInterval = setInterval(() => {
      if (!this.isPaused) {
        this.moveBall();
      }
    },);
  }

  moveBall() {
    this.velocityY += this.gravity;
    this.top += this.velocityY;
    this.left += this.velocityX;

    if (this.top <= 0) {
      this.top = 0;
      this.velocityY *= -1;
    }

    if (
      this.left <= 0 ||
      this.left + this.width >= this.gameScreen.offsetWidth
    ) {
      this.velocityX *= -1;
    }

    if (!this.collisionCooldown && this.didCollide()) {
      this.velocityY = this.bounceStrength ;
      this.velocityX = (Math.random() > 0.5 ? 1 : -1) * 2;
      this.collisionCooldown = true;
      setTimeout(() => {
        this.collisionCooldown = false;
      }, 200);
    }

    if (this.top + this.height >= this.gameScreen.offsetHeight) {
      this.loseLife(true);
      this.resetPosition(true);
      this.player.resetPosition();
    }

    this.updatePosition();
  }

  didCollide() {
    const ballRect = this.element.getBoundingClientRect();
    const playerRect = this.player.element.getBoundingClientRect();

    const collision =
      ballRect.left < playerRect.right &&
      ballRect.right > playerRect.left &&
      ballRect.bottom >= playerRect.top &&
      ballRect.top < playerRect.top + playerRect.height / 4;

    if (collision && this.increaseScore) {
      this.increaseScore();
    }

    return collision;
  }

  resetPosition(paused = false) {
    this.top = 20;
    this.left = (this.gameScreen.offsetWidth - this.width) / 2;
    this.velocityY = 0;
    this.velocityX = 0;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }
}
