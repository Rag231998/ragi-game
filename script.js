const game = document.getElementById("game");
const scoreText = document.getElementById("score");

let score = 0;

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

let player = {
  x: 1,
  y: 1
};

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

      if (player.x === x && player.y === y) {
        cell.className = "cell player";
      }

      game.appendChild(cell);
    }
  }

  scoreText.textContent = score;
}

function movePlayer(dx, dy) {
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

  drawGame();
}

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
});

drawGame();