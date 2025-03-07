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

    this.introMusic = document.getElementById("intro-music"); // Música de introdução
    this.inGameMusic = document.getElementById("ingame-music");
    this.gameOverMusic = document.getElementById("gameover-music");

    this.introMusic.volume = 0.05;
    this.inGameMusic.volume = 0.2;
    this.gameOverMusic.volume = 0.2;

    this.introMusic.loop = true;
    
    this.startForm.addEventListener("submit", (event) => this.startGame(event));
    document.getElementById("restart-button").addEventListener("click", () => this.restartGame());
    this.instructionButton = document.getElementById("instruction-button");
    this.instructions = document.getElementById("instructions");

    this.instructionButton.addEventListener("click", () => this.toggleInstructions());

    // Tocar a música de introdução quando a página for carregada
    this.playIntroMusic();
  }

  toggleInstructions() {
    if (this.instructions.style.display === "none" || this.instructions.style.display === "") {
      this.instructions.style.display = "block";
    } else {
      this.instructions.style.display = "none";
    }
  }

  startGame(event) {
    event.preventDefault();
    this.playerName = document.getElementById("player").value.trim();
    this.gameIntro.style.display = "none";
    this.gameScreen.style.display = "block";
    this.resetGame();
    this.beginGame();

    // Parar a música de introdução quando o jogo começar
    this.introMusic.pause();
    this.introMusic.currentTime = 0; // Reinicia a música

    // Tocar a música do jogo
    this.playInGameMusic();
  }

  resetGame() {
    this.score = 0;
    this.lives = 5;
    this.obstacles = [];
    this.scoreElement.textContent = this.score;
    this.livesElement.textContent = this.lives;
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

    // Parar a música do jogo
    this.inGameMusic.pause();
    this.inGameMusic.currentTime = 0; // Reinicia a música para quando o jogo começar de novo

    // Tocar música de game over
    this.playGameOverMusic();
}


  restartGame() {
    this.resetGame();
    this.gameOverScreen.style.display = "none";
    this.gameIntro.style.display = ""; 
    
    if (this.ball) {
      this.ball.element.remove(); 
    }
    
    if (this.player) {
      this.player.element.remove(); 
    }
    
    this.obstacles.forEach(obstacle => obstacle.remove());
    this.obstacles = [];
    
    clearInterval(this.gameInterval);
    clearInterval(this.obstaclesInterval);

    // Reiniciar a música de introdução
    this.playIntroMusic();
  }

  // Função para tocar a música de introdução
  playIntroMusic() {
    this.introMusic.currentTime = 0; // Reiniciar a música
    this.introMusic.play().catch((error) => {
      console.log("Erro ao tentar tocar a música de introdução:", error);
    });
  }

  // Função para tocar a música do jogo
  playInGameMusic() {
    this.inGameMusic.play().catch((error) => {
      console.log("Erro ao tentar tocar a música de jogo:", error);
    });
  }

  // Função para tocar a música de Game Over
  playGameOverMusic() {
    this.gameOverMusic.currentTime = 0; // Reiniciar a música de game over
    this.gameOverMusic.play().catch((error) => {
      console.log("Erro ao tentar tocar a música de game over:", error);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
