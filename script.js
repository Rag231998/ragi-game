const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const highscoreText = document.getElementById("highscore");
const levelText = document.getElementById("level");

let score = 0;
let level = 1;
let highscore = localStorage.getItem("highscore") || 0;

let gameOver = false;

let map = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,2,1],
  [1,2,1,2,1,1,2,2,2,1],
  [1,2,1,2,2,2,2,1,2,1],
  [1,2,2,2,1,1,2,1,2,1],
  [1,2,1,2,2,2,2,2,2,1],
  [1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1]
];

let player = { x: 1, y: 1 };

let enemy = { x: 8, y: 8 };

function drawGame() {
  game.innerHTML = "";

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (map[y][x] === 1) {
        cell.classList.add("wall");
      }

      if (map[y][x] === 2) {
        cell.classList.add("dot");
      }

      if (enemy.x === x && enemy.y === y) {
        cell.className = "cell enemy";
      }

      if (player.x === x && player.y === y) {
        cell.className = "cell player";
      }

      game.appendChild(cell);
    }
  }

  scoreText.textContent = score;
  highscoreText.textContent = highscore;
  levelText.textContent = level;
}

function checkGameOver() {
  if (player.x === enemy.x && player.y === enemy.y) {
    gameOver = true;

    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore);
    }

    alert("Game Over! Score: " + score);
  }
}

function movePlayer(dx, dy) {
  if (gameOver) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (map[newY][newX] !== 1) {
    player.x = newX;
    player.y = newY;

    if (map[newY][newX] === 2) {
      map[newY][newX] = 0;
      score += 10;
    }
  }

  checkGameOver();
  drawGame();
}

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
});

setInterval(function() {
  if (gameOver) return;

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  const possibleMoves = directions.filter(function(move) {
    const newX = enemy.x + move[0];
    const newY = enemy.y + move[1];

    return map[newY][newX] !== 1;
  });

  if (possibleMoves.length > 0) {
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    enemy.x += move[0];
    enemy.y += move[1];
  }

  checkGameOver();
  drawGame();
}, 500);

function restartGame() {
  location.reload();
}

drawGame();