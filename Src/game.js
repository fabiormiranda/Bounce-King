class Game {
  constructor() {
    this.startForm = document.getElementById("start-form");
    this.gameIntro = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameOverScreen = document.getElementById("game-over");
    this.scoreElement = document.getElementById("score").querySelector("span");
    this.livesElement = document.getElementById("lives").querySelector("span");
    this.endScore = document.getElementById("end-score");

    this.playerName = "";
    this.player = null;
    this.ball = null;
    this.score = 0;
    this.lives = 5;
    this.gameInterval = null;
    this.obstaclesInterval = null;
    this.obstacles = [];

    this.startForm.addEventListener("submit", (event) => this.startGame(event));
  }

  startGame(event) {
    event.preventDefault();
    this.playerName = document.getElementById("player").value.trim();
    this.gameIntro.style.display = "none";
    this.gameScreen.style.display = "block";
    this.resetGame();
    this.beginGame();
  }

  resetGame() {
    this.score = 0;
    this.lives = 5;
    this.scoreElement.textContent = this.score;
    this.livesElement.textContent = this.lives;
    this.obstacles = [];
  }

  beginGame() {
    this.player = new Player(this.gameScreen);
    this.ball = new Ball(this.gameScreen, this.player, () => this.loseLife(), () => this.increaseScore());
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    this.gameInterval = setInterval(() => this.gameLoop(), 16);
    this.obstaclesInterval = setInterval(() => this.spawnObstacle(), 3000);
  }

  handleKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") this.player.movingLeft = true;
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") this.player.movingRight = true;
    if (event.key === " " || event.key === "Spacebar") this.player.jumpPlayer();
  }

  handleKeyUp(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") this.player.movingLeft = false;
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") this.player.movingRight = false;
  }

  gameLoop() {
    this.ball.moveBall();
    this.updateObstacles();
    this.obstacles = this.obstacles.filter((obstacle) => !obstacle.checkCollision(this.player, () => this.loseLife()));
  }

  increaseScore() {
    this.score++;
    this.scoreElement.textContent = this.score;
  }

  loseLife() {
    this.lives--;
    this.livesElement.textContent = this.lives;
    if (this.lives <= 0) {
      clearInterval(this.gameInterval);
      this.gameOver();
    }
  }

  spawnObstacle() {
    const obstacleTypes = ["Pepe", "Ramos"];
    const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = new Obstacle(this.gameScreen, randomType);
    this.obstacles.push(obstacle);
  }

  updateObstacles() {
    this.obstacles.forEach((obstacle, index) => {
      obstacle.moveObstacle();
      if (obstacle.isOutOfScreen()) {
        obstacle.remove();
        this.obstacles.splice(index, 1);
      }
    });
  }

  gameOver() {
    this.player.element.remove();
    this.obstacles.forEach((obstacle) => obstacle.element.remove());
    this.livesElement.innerHTML = "";
    this.gameScreen.style.display = "none";
    this.gameOverScreen.style.display = "flex";
    this.endScore.innerText = this.score;
    clearInterval(this.gameInterval);
    clearInterval(this.obstaclesInterval);
    document.getElementById("restart-button").addEventListener("click", () => location.reload());
  }
} 
document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
