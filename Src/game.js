class Game {
  constructor() {
    this.musicPlayed = false;
    this.startForm = document.getElementById("start-form");
    this.gameIntro = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-screen");
    this.gameOverScreen = document.getElementById("game-over");
    this.scoreElement = document.getElementById("score").querySelector("span");
    this.livesElement = document.getElementById("lives").querySelector("span");
    this.endScore = document.getElementById("end-score");
    this.highscoreList = document.querySelector(".high-score-list");

    this.playerName = "";
    this.player = null;
    this.ball = null;
    this.score = 0;
    this.lives = 5;
    this.gameInterval = null;
    this.obstaclesInterval = null;
    this.obstacles = [];

    this.introMusic = document.getElementById("intro-music");
    this.inGameMusic = document.getElementById("ingame-music");
    this.gameOverMusic = document.getElementById("gameover-music");

    this.introMusic.volume = 0.05;
    this.inGameMusic.volume = 0.2;
    this.gameOverMusic.volume = 0.2;

    this.introMusic.loop = true;

    this.startForm.addEventListener("submit", (event) => this.startGame(event));
    document
      .getElementById("restart-button")
      .addEventListener("click", () => this.restartGame());
    this.instructionButton = document.getElementById("instruction-button");
    this.instructions = document.getElementById("instructions");

    this.instructionButton.addEventListener("click", () =>
      this.toggleInstructions()
    );

    document.body.addEventListener("click", () => {
      this.playIntroMusic();
    });
  }

  toggleInstructions() {
    if (
      this.instructions.style.display === "none" ||
      this.instructions.style.display === ""
    ) {
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
    this.introMusic.pause();
    this.introMusic.currentTime = 0;
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
    this.ball = new Ball(
      this.gameScreen,
      this.player,
      () => this.loseLife(),
      () => this.increaseScore()
    );

    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));

    this.gameInterval = setInterval(() => this.gameLoop(), 16);
    this.obstaclesInterval = setInterval(() => this.spawnObstacle(), 3000);
  }

  handleKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a")
      this.player.movingLeft = true;
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d")
      this.player.movingRight = true;
    if (event.key === " " || event.key === "Spacebar") this.player.jumpPlayer();
  }

  handleKeyUp(event) {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a")
      this.player.movingLeft = false;
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d")
      this.player.movingRight = false;
  }

  gameLoop() {
    this.ball.moveBall();
    this.updateObstacles();

    this.obstacles.forEach((obstacle) => {
      if (obstacle.checkCollision(this.player, () => this.loseLife(true))) {
      }
    });
  }

  increaseScore() {
    this.score++;
    this.scoreElement.textContent = this.score;
  }

  loseLife(isCollision = false) {
    this.lives--;
    this.livesElement.textContent = this.lives;

    if (!isCollision) {
      this.obstacles.forEach((obstacle) => obstacle.remove());
      this.obstacles = [];
    }

    if (this.lives <= 0) {
      clearInterval(this.gameInterval);
      this.gameOver();
    }
  }

  spawnObstacle() {
    const obstacleTypes = ["Pepe", "Ramos"];
    const randomType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
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

    this.saveHighScore();
    this.displayHighScores();

    const highScoreContainer = document.querySelector(".high-score-container");
    highScoreContainer.style.display = "flex";

    clearInterval(this.gameInterval);
    clearInterval(this.obstaclesInterval);

    this.inGameMusic.pause();
    this.inGameMusic.currentTime = 0;

    this.playGameOverMusic();
  }

  saveHighScore() {
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    const existingPlayerIndex = highScores.findIndex(
      (score) => score.name === this.playerName
    );

    if (existingPlayerIndex !== -1) {
      if (this.score > highScores[existingPlayerIndex].score) {
        highScores[existingPlayerIndex].score = this.score;
      }
    } else {
      highScores.push({ name: this.playerName, score: this.score });
    }

    highScores.sort((a, b) => b.score - a.score);

    highScores = highScores.slice(0, 3);

    localStorage.setItem("highScores", JSON.stringify(highScores));
  }

  displayHighScores() {
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    this.highscoreList.innerHTML = "";

    highScores.forEach((score, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${score.name} - ${score.score}`;
      this.highscoreList.appendChild(listItem);
    });
  }

  restartGame() {
    this.resetGame();
    this.gameOverScreen.style.display = "none";
    this.gameIntro.style.display = "flex";

    if (this.ball) {
      this.ball.element.remove();
      this.ball = null;
    }

    if (this.player) {
      this.player.element.remove();
      this.player = null;
    }

    this.obstacles.forEach((obstacle) => obstacle.remove());
    this.obstacles = [];

    clearInterval(this.gameInterval);
    clearInterval(this.obstaclesInterval);

    this.musicPlayed = false;
    this.playIntroMusic();
  }

  playIntroMusic() {
    if (!this.musicPlayed) {
      this.introMusic.play();
      this.musicPlayed = true;
    }
  }

  playInGameMusic() {
    this.inGameMusic.play();
  }

  playGameOverMusic() {
    this.gameOverMusic.play();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
});
