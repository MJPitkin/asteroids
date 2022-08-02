// starship fill: #092b1f
//starship edge: #00ffa5
//starship glow: #00fc97
//projectile fill: #ccffe1
//projectile edge: #00ff69
//asteroid edge: #d102fa
//asteroid fill: #31013b

function init() {
  const canvas = document.querySelector("#gameWindow");
  const ctx = canvas.getContext("2d");
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
  //initialises canvas
  let upPressed = false;
  let downPressed = false;
  let leftPressed = false;
  let rightPressed = false;
  let bulletFired = false;
  let bulletCounter = 0;
  // initialises variables for direction control
  let playerX = 220;
  let playerY = 140;
  let bulletX = playerX;
  let bulletY = playerY;
  let playerLives = 3;
  let playerScore = 0;
  // initialises player position variables
  let playerWidth = 20;
  let playerHeight = 20;
  //initialises player size variables
  let mouseX = 0;
  let mouseY = 0;
  let crosshairX = 0;
  let crosshairY = 0;
  let posX = 0;
  let posY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let firingAngle = 0;
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
  //initialises mouse position variables to be used to calculate player rotation
  function drawPlayer() {
    //draws player ship
    //needed to be done on this line rather than during the beginpath to prevent massive trails being left (although some are still remaining... possibly side effect of the whole canvas spinning.)
    ctx.beginPath();
    ctx.arc(playerX, playerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#092b1f";
    ctx.strokeStyle = "#00ffa5";
    ctx.shadowColor = "#00fc97";
    ctx.shadowBlur = 2;
    ctx.fill();
    ctx.stroke();
    //I suspect that what's causing the constant SPEEEEEN bug is that rotate is rotating the rectangle BY the angle it's being fed, rather than TO that angle. Of note is that I'm pretty sure it stops spinning when atan is 0. It's also not pulling the position to determine the angle by from the centre of the ship, but from the origin of the canvas. ALSO you're rotating the entire bloody canvas not the ship.
    ctx.closePath();
  }
  // function drawTarget() {
  //   //draws incoming enemy craft
  // }

  function drawPlayerBullet(bulletX, bulletY) {
    //draws player fire
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#ccffe1";
    ctx.strokeStyle = "#00ff69";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    // console.log("test");
  }
  function drawPlayerCursor(bulletX, bulletY) {
    //draws player fire
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#00ff69";
    ctx.stroke();
    ctx.closePath();
    // console.log("test");
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
        console.log("target down! Score is now:" + playerScore);
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
        console.log("you got hit! " + playerLives + " left!");
      }
    }
  }

  function draw() {
    //main renderer
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.resetTransform();
    if (playerLives <= 0) {
      alert(`Game over! Your final score was ${playerScore}!`);
      playerLives = 3;
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
      if (playerY < playerHeight) {
        playerY = playerHeight;
      }
    }
    if (downPressed === true) {
      playerY += 3;
      if (playerY > canvas.height - playerHeight) {
        playerY = canvas.height - playerHeight;
      }
    }

    //Why all these ifs, you ask? Lets them be non mutually exclusive, letting you have diagonal movement. Make sure to mention this as intended in the readme.

    // if (mousePressed === true) {
    //   drawPlayerBullet();
    // }
    requestAnimationFrame(draw);
  }

  //working on keyboard controls for the ship, creating controllers for keyup/keydown

  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("click", mouseDownHandler, false);
  // document.addEventListener("mouseup", mouseUpHandler, false);

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
    crosshairX = e.pageX - canvas.getBoundingClientRect().left;
    crosshairY = e.pageY - canvas.getBoundingClientRect().top;
  }

  function mouseDownHandler(e) {
    console.log("click");
    if (bulletFired === false) {
      bulletFired = true;
      mouseX = e.pageX - canvas.getBoundingClientRect().left;
      mouseY = e.pageY - canvas.getBoundingClientRect().top;
      posX = playerX;
      posY = playerY;
      deltaX = mouseX - posX;
      deltaY = mouseY - posY;
      firingAngle = Math.atan2(deltaY, deltaX);
    }
  }

  // function mouseUpHandler(e) {
  //   // bulletFired = false;
  // }
  //consider refactoring key handlers to be switch statements
}

window.addEventListener("DOMContentLoaded", init);
