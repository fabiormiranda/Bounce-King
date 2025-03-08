# Bounce King

## [Play the Game!](https://fabiormiranda.github.io/Bounce-King/)

![Logo](/Images/logo.png)

## Description

2D game where you control a character that must keep the ball in the air by bouncing it with their head. Use the arrow keys to move and prevent the ball from touching the ground.


## MVP
- **Start Screen**  
  - Display game title and start button.
  - Option for player to enter name.

- **Character Movement**  
  - Move left/right using arrow keys.
  - Jump with spacebar.

- **Ball & Head Collision**  
  - Ball bounces off the character’s head to stay in the air.

- **Scoring**  
  - Increase score with each bounce.

- **Game Over**  
  - Game ends when the ball touches the ground.
  - Display final score.

- **Basic Obstacles**  
  - Spawn obstacles that the player must avoid.

## Backlog

1. **Difficulty Levels**  
   Add easy, medium, and hard modes with varying ball speed, obstacles, and lives.

2. **Character Skins**  
   Allow players to switch between different character skins.

3. **Game Over Screen**  
   Show more stats (e.g., total playtime, bounces) along with the high score.

## Data Structure

### Classes & Methods

1. **Game**
   - startGame(event)
   - resetGame()
   - beginGame()
   - gameLoop()
   - increaseScore()
   - loseLife()
   - spawnObstacle()
   - updateObstacles()
   - gameOver()
   - restartGame()
   - playIntroMusic()
   - playInGameMusic()
   - playGameOverMusic()

2. **Player**
   - resetPosition()
   - updatePosition()
   - addKeyboardListeners()
   - startMoving()
   - stopMoving()
   - updateMovement()
   - movePlayer(movementSpeed)
   - jumpPlayer()

3. **Ball**
   - startMoving()
   - moveBall()
   - didCollide()
   - resetPosition()
   - updatePosition()
   - unpauseBall()

4. **Obstacle**
   - moveObstacle()
   - checkCollision()
   - remove()
   - updatePosition()
   - isOutOfScreen()



## States

- **Start Screen**  
  - Displays the game title and basic instructions.

- **Gameplay**  
  - The character moves and interacts with the ball.
  - The scoring system is active.

- **Game Over**  
  - Displays the final score.
  - Option to restart the game.
  - Displays the high scores.


## Priority Tasks

1. **Game Start**
   - Implement start screen and player input.

2. **Player Movement**
   - Implement left/right movement and jumping.

3. **Ball Mechanics**
   - Implement ball bounce, gravity, and collision logic.

4. **Obstacles**
   - Spawn obstacles, move them, and handle collision with player.

5. **Scoring**
   - Track and display score.

6. **Lives**
   - Deduct lives when the ball hits the ground or when an obstacle collides with the player.

7. **Game Over**
   - Show game over screen with the player's score and high scores.

8. **Sound**
   - Add intro, in-game, and game-over music.

9. **Restart**
   - Implement a restart button to reset the game and start over.

10. **High Scores**
    - Save the player's high score locally and display a high score leaderboard.

11. **Instructions**
    - Add instructions button to guide new players on how to play.

## Links

- [Github repository Link](http://github.com)
- [Deployment Link](http://github.com)