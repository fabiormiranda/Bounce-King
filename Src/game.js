document.addEventListener("DOMContentLoaded", () => {
  const startForm = document.getElementById("start-form");
  const gameIntro = document.getElementById("game-intro");
  const gameScreen = document.getElementById("game-screen");
  const scoreElement = document.getElementById("score").querySelector("span");
  const livesElement = document.getElementById("lives").querySelector("span");

  let player;
  let ball;
  let score = 0;
  let lives = 2;

  startForm.addEventListener("submit", (event) => {
    event.preventDefault();

    gameIntro.style.display = "none";
    gameScreen.style.display = "block";
    scoreElement.textContent = score;
    livesElement.textContent = lives;

    startGame();
  });

  function startGame() {
    console.log("Jogo iniciado!");
    player = new Player(gameScreen);
    ball = new Ball(gameScreen, loseLife);

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        player.movePlayer(-30);
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        player.movePlayer(30);
      }
      if (event.key === " " || event.key === "Spacebar") {
        player.jumpPlayer();
      }
    });

    gameLoop();
  }

  function gameLoop() {
    ball.moveBall();
    ball.checkCollision(player);
    requestAnimationFrame(gameLoop);
  }

  function loseLife() {
    lives--;
    livesElement.textContent = lives;
    if (lives <= 0) {
      location.reload();
    }
  }
});
