class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 120;
    this.height = 200;
    this.isJumping = false;
    this.speed = 3;
    this.movingLeft = false;
    this.movingRight = false;
    this.movementInterval = null;

    this.element = document.createElement("img");
    this.element.src = "Images/Ronaldinho.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    this.gameScreen.appendChild(this.element);
    this.resetPosition();
    this.addKeyboardListeners();
  }

  resetPosition() {
    this.top = this.gameScreen.offsetHeight - this.height - 50;
    this.left = this.gameScreen.offsetWidth / 2 - this.width / 2;
    this.updatePosition();
  }

  updatePosition() {
    if (this.element) {
      this.element.style.top = `${this.top}px`;
      this.element.style.left = `${this.left}px`;
    }
  }

  addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        this.movingLeft = true;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        this.movingRight = true;
      }
      if (event.key === " ") {
        this.jumpPlayer();
      }
      this.startMoving();
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        this.movingLeft = false;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        this.movingRight = false;
      }
      if (!this.movingLeft && !this.movingRight) {
        this.stopMoving();
      }
    });
  }

  startMoving() {
    if (!this.movementInterval) {
      this.movementInterval = setInterval(() => this.updateMovement());
    }
  }

  stopMoving() {
    clearInterval(this.movementInterval);
    this.movementInterval = null;
  }

  updateMovement() {
    if (this.movingLeft && this.left > 0) {
      this.movePlayer(-this.speed);
    }
    if (
      this.movingRight &&
      this.left < this.gameScreen.offsetWidth - this.width
    ) {
      this.movePlayer(this.speed);
    }
  }

  movePlayer(movementSpeed) {
    this.left += movementSpeed;
    this.left = Math.max(
      0,
      Math.min(this.left, this.gameScreen.offsetWidth - this.width)
    );
    this.updatePosition();
  }

  jumpPlayer() {
    if (this.isJumping) return;
    this.isJumping = true;

    const jumpHeight = 250;
    const jumpDuration = 450;
    const startTop = this.top;
    const startTime = Date.now();

    let jumpInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let progress = elapsedTime / jumpDuration;

      if (progress < 0.5) {
        this.top = startTop - jumpHeight * (progress * 2);
      } else if (progress < 1) {
        this.top = startTop - jumpHeight * (1 - (progress - 0.5) * 2);
      } else {
        this.top = startTop;
        clearInterval(jumpInterval);
        this.isJumping = false;
      }

      this.updatePosition();
    });
  }
}
