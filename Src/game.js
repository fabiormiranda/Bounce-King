document.addEventListener("DOMContentLoaded", () => {
  const startForm = document.getElementById("start-form");
  const gameIntro = document.getElementById("game-intro");
  const gameScreen = document.getElementById("game-screen");
  const scoreElement = document.getElementById("score").querySelector("span");
  const livesElement = document.getElementById("lives").querySelector("span");

  let player;
  let ball;
  let score = 0;
  let lives = 5;
  let gameInterval;
  let obstacles = [];

  function increaseScore() {
    score++;
    scoreElement.textContent = score;
  }

  startForm.addEventListener("submit", (event) => {
    event.preventDefault();

    gameIntro.style.display = "none";
    gameScreen.style.display = "block";
    scoreElement.textContent = score;
    livesElement.textContent = lives;

    startGame();
  });

  function startGame() {
    player = new Player(gameScreen);
    ball = new Ball(gameScreen, player, loseLife, increaseScore);

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        player.movingLeft = true;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        player.movingRight = true;
      }
      if (event.key === " " || event.key === "Spacebar") {
        player.jumpPlayer();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        player.movingLeft = false;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        player.movingRight = false;
      }
    });

    gameInterval = setInterval(gameLoop, 16);
    setInterval(spawnObstacle, 3000); 
  }

  function gameLoop() {
    ball.moveBall();
    updateObstacles();

    obstacles = obstacles.filter((obstacle) => {
      if (obstacle.checkCollision(player, loseLife)) {
        return false;
      }
      return true;
    });
  }

  function loseLife(resetObstacles) {
    lives--;
    livesElement.textContent = lives;

    if (lives <= 0) {
        clearInterval(gameInterval);
        location.reload();
    }

    if (resetObstacles) {
        resetAllObstacles();
    }
}

function resetAllObstacles() {
  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
}

  function spawnObstacle() {
    const obstacleTypes = ["Pepe", "Ramos"];
    const randomType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = new Obstacle(gameScreen, randomType);
    obstacles.push(obstacle);
  }

  function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
      obstacle.moveObstacle();
      if (obstacle.isOutOfScreen()) {
        obstacle.remove();
        obstacles.splice(index, 1);
      }
    });
  }
});
