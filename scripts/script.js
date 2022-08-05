//starship fill: #092b1f
//starship edge: #00ffa5
//starship glow: #00fc97
//projectile fill: #ccffe1
//projectile edge: #00ff69
//asteroid edge: #d102fa
//asteroid fill: #31013b

function init() {
  const canvas = document.querySelector("#gameWindow");
  const ctx = canvas.getContext("2d");
  // Initialises canvas

  const startButton = document.querySelector("#startGame");
  startOptions = {
    once: true,
  };
  startButton.addEventListener("click", draw, startOptions);
  startButton.addEventListener("click", () =>
    canvas.classList.add("hideMouse")
  );
  const scoreCount = document.querySelector("#score");
  const lifeCount = document.querySelector("#lives");
  let playerLives = 3;
  let playerScore = 0;
  // Sets up the start button (engage) to set the game running but also only run once no matter how many times the user clicks it. Additionally brings the score and lives UI elements into the DOM.

  let upPressed = false;
  let downPressed = false;
  let leftPressed = false;
  let rightPressed = false;
  let playerX = 240;
  let playerY = 160;
  // Initialises variables for direction control and the player's starting position
  let bulletFired = false;
  let bulletCounter = 0;
  let bulletX = playerX;
  let bulletY = playerY;
  // Initialises variables for controlling the ship's weapon. bulletCounter is used to determine the maximum life of a projectile after being fired
  let playerWidth = 20;
  //initialises player size variables
  let mouseX = 0;
  let mouseY = 0;
  let crosshairX = 0;
  let crosshairY = 0;
  let posX = 0;
  let posY = 0;
  let firingAngle = 0;
  //Initialises variables for painting the crosshair and enabling mouse controlled aiming of the ship's weapon
  const asteroidStartPoints = [
    { x: -30, y: -30 },
    { x: 240, y: -30 },
    { x: 510, y: -30 },
    { x: -30, y: 160 },
    { x: 510, y: 160 },
    { x: -30, y: 350 },
    { x: 240, y: 350 },
    { x: 510, y: 350 },
  ];
  let asteroids = [
    {
      angle: 0,
      speed: 1,
      x: 0,
      y: 0,
      counter: 0,
      status: false,
    },
    {
      angle: 0,
      speed: 1,
      x: 0,
      y: 0,
      counter: 0,
      status: false,
    },
    {
      angle: 0,
      speed: 1,
      x: 0,
      y: 0,
      counter: 0,
      status: false,
    },
  ];
  let newPos = 0;
  //Initialises the coordinates 8 starting points where asteroids spawn offscreen (in an array to make random selection easier), as well as an array of objects representing the properties of each of the three asteroids that may be in motion at any given time. Newpos is a variable used as part of the drawAsteroids() function to determine the new position of an asteroid after it gets shot down.
  function drawPlayer() {
    //draws player ship
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerWidth, 0, 2 * Math.PI);
    ctx.fillStyle = "#092b1f";
    ctx.strokeStyle = "#00ffa5";
    ctx.shadowColor = "#00fc97";
    ctx.shadowBlur = 2;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  function drawPlayerBullet(bulletX, bulletY) {
    //draws player fire
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#ccffe1";
    ctx.strokeStyle = "#00ff69";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  function drawPlayerCursor(crosshairX, crosshairY) {
    //draws player crosshair
    ctx.beginPath();
    ctx.arc(crosshairX, crosshairY, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#00ff69";
    ctx.stroke();
    ctx.closePath();
  }

  function drawAsteroids() {
    for (i = 0; i < asteroids.length; i++) {
      if (asteroids[i].status === true) {
        asteroids[i].speed = 3;
        asteroids[i].x += asteroids[i].speed * Math.cos(asteroids[i].angle);
        asteroids[i].y += asteroids[i].speed * Math.sin(asteroids[i].angle);
        asteroids[i].counter++;
        ctx.beginPath();
        ctx.arc(asteroids[i].x, asteroids[i].y, 30, 0, Math.PI * 2);
        ctx.fillStyle = "#31013b";
        ctx.strokeStyle = "#d102fa";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      } else {
        //choose new start position from array of 8 position objects
        newPos = Math.floor(Math.random() * 8);
        asteroids[i].x = asteroidStartPoints[newPos].x;
        asteroids[i].y = asteroidStartPoints[newPos].y;
        //calculate new angle based on current player position
        asteroids[i].angle = Math.atan2(
          playerY - asteroids[i].y,
          playerX - asteroids[i].x
        );
        asteroids[i].counter = 0;
        //reset counter
        //set status to true
        asteroids[i].status = true;
      }
    }
  }

  function collisionDetection() {
    for (i = 0; i < asteroids.length; i++) {
      if (
        Math.sqrt(
          (asteroids[i].x - bulletX) ** 2 + (asteroids[i].y - bulletY) ** 2
        ) <= 40 //||
        // asteroids[i].counter > 300
      ) {
        asteroids[i].status = false;
        bulletFired = false;
        bulletCounter = 0;
        playerScore++;
        scoreCount.innerHTML = `SCORE: ${playerScore}`;
        // console.log("target down! Score is now:" + playerScore);
      } else if (asteroids[i].counter > 300) {
        asteroids[i].status = false;
      } else if (
        Math.sqrt(
          (asteroids[i].x - playerX) ** 2 + (asteroids[i].y - playerY) ** 2
        ) <= 50
      ) {
        asteroids[i].status = false;
        playerLives--;
        lifeCount.innerHTML = `LIVES: ${playerLives}`;
        // console.log("you got hit! " + playerLives + " left!");
      }
    }
  }

  function draw() {
    //main drawing function. Brings all the others together.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (playerLives <= 0) {
      alert(`Game over! Your final score was ${playerScore}!`);
      playerLives = 3; // For some reason, playerLives won't reset properly when the reload is called, leading to an infinite set of alerts. Has to be reset manually. Want to do deeper dive to understand why.
      document.location.reload();
    } else if (bulletFired === false) {
      bulletX = playerX;
      bulletY = playerY;
    } else if (bulletCounter < 60) {
      bulletX += 10 * Math.cos(firingAngle);
      bulletY += 10 * Math.sin(firingAngle);
      bulletCounter += 1;
    } else if (bulletCounter >= 60) {
      bulletFired = false;
      bulletCounter = 0;
    }
    collisionDetection();
    drawPlayer();
    drawPlayerBullet(bulletX, bulletY);
    drawAsteroids();
    drawPlayerCursor(crosshairX, crosshairY);

    if (rightPressed === true) {
      playerX += 3;
      if (playerX > canvas.width - playerWidth) {
        playerX = canvas.width - playerWidth;
      }
    }
    if (leftPressed === true) {
      playerX -= 3;
      if (playerX < playerWidth) {
        playerX = playerWidth;
      }
    }
    if (upPressed === true) {
      playerY -= 3;
      if (playerY < playerWidth) {
        playerY = playerWidth;
      }
    }
    if (downPressed === true) {
      playerY += 3;
      if (playerY > canvas.height - playerWidth) {
        playerY = canvas.height - playerWidth;
      }
    }

    //Why all these ifs and not a switch, you ask? Lets them be non mutually exclusive, letting you have diagonal movement. Make sure to mention this as intended in the readme.
    requestAnimationFrame(draw); // repeats draw according to the framerate of the browser
  }

  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("keydown", keyDownHandler, false);
  canvas.addEventListener("mousemove", mouseMoveHandler, false);
  canvas.addEventListener("click", mouseDownHandler, false);

  function keyUpHandler(e) {
    if (
      e.key === "Up" ||
      e.key === "ArrowUp" ||
      e.key === "w" ||
      e.key === "W"
    ) {
      upPressed = false;
    } else if (
      e.key === "Down" ||
      e.key === "ArrowDown" ||
      e.key === "s" ||
      e.key === "S"
    ) {
      downPressed = false;
    } else if (
      e.key === "Left" ||
      e.key === "ArrowLeft" ||
      e.key === "a" ||
      e.key === "A"
    ) {
      leftPressed = false;
    } else if (
      e.key === "Right" ||
      e.key === "ArrowRight" ||
      e.key === "d" ||
      e.key === "D"
    ) {
      rightPressed = false;
    }
  }
  function keyDownHandler(e) {
    if (
      e.key === "Up" ||
      e.key === "ArrowUp" ||
      e.key === "w" ||
      e.key === "W"
    ) {
      upPressed = true;
    } else if (
      e.key === "Down" ||
      e.key === "ArrowDown" ||
      e.key === "s" ||
      e.key === "S"
    ) {
      downPressed = true;
    } else if (
      e.key === "Left" ||
      e.key === "ArrowLeft" ||
      e.key === "a" ||
      e.key === "A"
    ) {
      leftPressed = true;
    } else if (
      e.key === "Right" ||
      e.key === "ArrowRight" ||
      e.key === "d" ||
      e.key === "D"
    ) {
      rightPressed = true;
    }
  }
  function mouseMoveHandler(e) {
    crosshairX = e.pageX - canvas.getBoundingClientRect().left; //necessary to subtract the actual position of the canvas element from the page x/y coordinates in order to compensate for the canvas coordinates not matching the page ones.
    crosshairY = e.pageY - canvas.getBoundingClientRect().top;
  }

  function mouseDownHandler(e) {
    // console.log("click");
    if (bulletFired === false) {
      bulletFired = true;
      mouseX = e.pageX - canvas.getBoundingClientRect().left;
      mouseY = e.pageY - canvas.getBoundingClientRect().top;
      posX = playerX;
      posY = playerY;
      firingAngle = Math.atan2(mouseY - posY, mouseX - posX);
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
