class Obstacle {
  constructor(gameScreen, type) {
    this.gameScreen = gameScreen;
    this.type = type;
    this.width = 90;
    this.height = 75;
    this.speed = 5.5;

    this.element = document.createElement("img");
    this.element.src = `Images/${type}.png`;
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    if (this.type === "Pepe") {
      this.left = gameScreen.offsetWidth;
      this.speed = -this.speed;
    } else if (this.type === "Ramos") {
      this.left = -this.width;
      this.speed = Math.abs(this.speed);
    }

    this.top = gameScreen.offsetHeight - this.height - 50;
    this.gameScreen.appendChild(this.element);
    this.updatePosition();
  }

  moveObstacle() {
    this.left += this.speed;
    this.updatePosition();
  }

  checkCollision(player, loseLife) {
    const obstacleRect = this.element.getBoundingClientRect();
    const playerRect = player.element.getBoundingClientRect();

    if (
        obstacleRect.left < playerRect.right &&
        obstacleRect.right > playerRect.left &&
        obstacleRect.top < playerRect.bottom &&
        obstacleRect.bottom > playerRect.top
    ) {
        loseLife(false); 
        this.remove(); 
        return true;
    }
    return false;
}

  isOutOfScreen() {
    return (
      this.left + this.width < 0 || this.left > this.gameScreen.offsetWidth
    );
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  remove() {
    this.element.remove();
  }
}
