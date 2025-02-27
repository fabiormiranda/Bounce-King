class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = 170;
    this.height = 250;
    this.top = gameScreen.offsetHeight - this.height - 50;
    this.left = gameScreen.offsetWidth / 2 - this.width / 2;
    this.isJumping = false;
    this.speed = 2.5;
    this.movingLeft = false;
    this.movingRight = false;
    this.animationFrame = null;

    this.element = document.createElement("img");
    this.element.src = "Images/Ronaldinho.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    this.gameScreen.appendChild(this.element);

    this.addKeyboardListeners();
  }

  addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a")
        this.movingLeft = true;
      if (event.key === "ArrowRight" || event.key === "d")
        this.movingRight = true;
      if (event.key === " ") this.jumpPlayer();
      this.startMoving();
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a")
        this.movingLeft = false;
      if (event.key === "ArrowRight" || event.key === "d")
        this.movingRight = false;
      
      if (!this.movingLeft && !this.movingRight) this.stopMoving();
    });
  }

  startMoving() {
    if (!this.animationFrame) {
      this.animationFrame = requestAnimationFrame(() => this.updateMovement());
    }
  }

  stopMoving() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
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

    if (this.movingLeft || this.movingRight) {
      this.animationFrame = requestAnimationFrame(() => this.updateMovement());
    } else {
      this.stopMoving();
    }
  }

  movePlayer(movementSpeed) {
    this.left += movementSpeed;
    if (this.left < 0) {
      this.left = 0;
    }
    if (this.left > this.gameScreen.offsetWidth - this.width) {
      this.left = this.gameScreen.offsetWidth - this.width;
    }
    this.element.style.left = `${this.left}px`;
  }

  jumpPlayer() {
    if (this.isJumping) return;
    this.isJumping = true;
    const initialTop = this.top;
    const jumpHeight = 250;
    const jumpDuration = 450;

    let startTime = null;
    const animateJump = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = elapsed / jumpDuration;
      if (progress < 0.5) {
        this.element.style.top = `${
          initialTop - jumpHeight * (progress * 2)
        }px`;
      } else if (progress < 1) {
        this.element.style.top = `${
          initialTop - jumpHeight * (1 - (progress - 0.5) * 2)
        }px`;
      } else {
        this.element.style.top = `${initialTop}px`;
        this.isJumping = false;
        return;
      }
      requestAnimationFrame(animateJump);
    };
    requestAnimationFrame(animateJump);
  }
}
