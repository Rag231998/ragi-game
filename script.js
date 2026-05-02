// Ragi Joy Maze Deluxe
// Enkel struktur: 1 = vegg, 0 = tomt, 2 = diamant, 3 = power-up, 4 = skjold, 5 = portal.
// Målet er å samle alle diamantene. Da åpnes portalen til neste level.

const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const highscoreText = document.getElementById("highscore");
const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");
const comboText = document.getElementById("combo");
const messageBar = document.getElementById("messageBar");
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const levelScreen = document.getElementById("levelScreen");
const finalScore = document.getElementById("finalScore");
const finalHighscore = document.getElementById("finalHighscore");
const endTitle = document.getElementById("endTitle");
const levelTitle = document.getElementById("levelTitle");
const levelDescription = document.getElementById("levelDescription");

const TILE = {
  EMPTY: 0,
  WALL: 1,
  DOT: 2,
  POWER: 3,
  SHIELD: 4,
  PORTAL: 5
};

const levels = [
  {
    name: "Happy Start",
    speed: 520,
    enemies: [{ x: 11, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222222222221",
      "1211121111121",
      "1230020200221",
      "1210111010121",
      "1220222220221",
      "1211101110121",
      "1222200200221",
      "1210111011121",
      "1222222222421",
      "1111111111111"
    ]
  },
  {
    name: "Diamond Rush",
    speed: 430,
    enemies: [{ x: 11, y: 1 }, { x: 11, y: 9 }],
    player: { x: 1, y: 9 },
    map: [
      "1111111111111",
      "1222220222221",
      "1211101110121",
      "1220200200221",
      "1010111011101",
      "1222232222221",
      "1211101011121",
      "1220200220221",
      "1210111010121",
      "1422222222221",
      "1111111111111"
    ]
  },
  {
    name: "Power Party",
    speed: 360,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222222222221",
      "1210111010121",
      "1230200203221",
      "1011101110101",
      "1222222222221",
      "1210111010121",
      "1220200200221",
      "1011101110101",
      "1422222222221",
      "1111111111111"
    ]
  },
  {
    name: "Chaos Castle",
    speed: 310,
    enemies: [{ x: 11, y: 1 }, { x: 11, y: 9 }, { x: 1, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222202222221",
      "1011101011101",
      "1220222220221",
      "1210111010121",
      "1222223222221",
      "1210111010121",
      "1220222220221",
      "1011101011101",
      "1222220222241",
      "1111111111111"
    ]
  },
  {
    name: "Turbo Tunnel",
    speed: 260,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 11, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222222222221",
      "1211110111121",
      "1222200222221",
      "1010101010101",
      "1232222222321",
      "1010101010101",
      "1222220022221",
      "1211110111121",
      "1422222222221",
      "1111111111111"
    ]
  },
  {
    name: "Final Joy",
    speed: 220,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 11, y: 9 }, { x: 6, y: 5 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222223222221",
      "1210101010121",
      "1220222220221",
      "1011101110101",
      "1222224222221",
      "1011101110101",
      "1220222220221",
      "1210101010121",
      "1222223222221",
      "1111111111111"
    ]
  }
];

let score = 0;
let levelIndex = 0;
let lives = 3;
let combo = 1;
let highscore = Number(localStorage.getItem("ragiJoyHighscore")) || 0;
let map = [];
let player = { x: 1, y: 1 };
let enemies = [];
let gameRunning = false;
let paused = false;
let powerMode = false;
let shield = false;
let enemyTimer = null;
let powerTimer = null;
let diamondsLeft = 0;
let portalOpen = false;

function cloneMap(levelMap) {
  return levelMap.map(row => row.split("").map(Number));
}

function loadLevel(index) {
  const level = levels[index];
  map = cloneMap(level.map);
  player = { ...level.player };
  enemies = level.enemies.map(enemy => ({ ...enemy, startX: enemy.x, startY: enemy.y }));
  combo = 1;
  powerMode = false;
  shield = false;
  portalOpen = false;
  diamondsLeft = countTiles(TILE.DOT);
  clearInterval(enemyTimer);
  enemyTimer = setInterval(moveEnemies, level.speed);
  messageBar.textContent = `Level ${index + 1}: ${level.name}`;
  drawGame();
}

function countTiles(tileType) {
  let total = 0;
  for (const row of map) {
    for (const tile of row) {
      if (tile === tileType) total++;
    }
  }
  return total;
}

function startGame() {
  score = 0;
  levelIndex = 0;
  lives = 3;
  gameRunning = true;
  paused = false;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  levelScreen.classList.add("hidden");
  loadLevel(levelIndex);
}

function restartGame() {
  clearInterval(enemyTimer);
  clearTimeout(powerTimer);
  startGame();
}

function drawGame() {
  game.innerHTML = "";

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (map[y][x] === TILE.WALL) cell.classList.add("wall");
      if (map[y][x] === TILE.DOT) cell.classList.add("dot");
      if (map[y][x] === TILE.POWER) cell.classList.add("power");
      if (map[y][x] === TILE.SHIELD) cell.classList.add("shield");
      if (map[y][x] === TILE.PORTAL) cell.classList.add("portal");

      const enemyHere = enemies.find(enemy => enemy.x === x && enemy.y === y);
      if (enemyHere) {
        cell.className = powerMode ? "cell enemy scared" : "cell enemy";
      }

      if (player.x === x && player.y === y) {
        cell.className = "cell player";
      }

      game.appendChild(cell);
    }
  }

  scoreText.textContent = score;
  highscoreText.textContent = highscore;
  levelText.textContent = levelIndex + 1;
  livesText.textContent = "❤️".repeat(lives);
  comboText.textContent = `x${combo}`;
}

function movePlayer(dx, dy) {
  if (!gameRunning || paused) return;

  const newX = player.x + dx;
  const newY = player.y + dy;
  if (!canMoveTo(newX, newY)) return;

  player.x = newX;
  player.y = newY;
  collectTile(newX, newY);
  checkEnemyCollision();
  drawGame();
}

function canMoveTo(x, y) {
  return map[y] && map[y][x] !== undefined && map[y][x] !== TILE.WALL;
}

function collectTile(x, y) {
  const tile = map[y][x];

  if (tile === TILE.DOT) {
    score += 10 * combo;
    combo = Math.min(combo + 1, 9);
    diamondsLeft--;
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = `Nice! Combo x${combo}`;
  }

  if (tile === TILE.POWER) {
    score += 50;
    activatePowerMode();
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = "⚡ Power Mode! Nå kan du spise fiender!";
  }

  if (tile === TILE.SHIELD) {
    shield = true;
    score += 30;
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = "🛡️ Skjold aktivert! Én kollisjon blir reddet.";
  }

  if (diamondsLeft === 0 && !portalOpen) {
    openPortal();
  }

  if (tile === TILE.PORTAL && portalOpen) {
    nextLevel();
  }
}

function activatePowerMode() {
  powerMode = true;
  clearTimeout(powerTimer);
  powerTimer = setTimeout(() => {
    powerMode = false;
    combo = 1;
    messageBar.textContent = "Power Mode ferdig. Fortsett å samle diamanter!";
    drawGame();
  }, 6500);
}

function openPortal() {
  portalOpen = true;
  map[5][6] = TILE.PORTAL;
  messageBar.textContent = "🌀 Portalen er åpen! Gå til midten for neste level.";
}

function moveEnemies() {
  if (!gameRunning || paused) return;

  enemies.forEach(enemy => {
    const possibleMoves = getPossibleEnemyMoves(enemy);
    if (possibleMoves.length === 0) return;

    // Fienden prøver ofte å gå nærmere spilleren, men ikke alltid. Da føles spillet mer levende.
    const chaseChance = powerMode ? 0.20 : 0.70;
    let chosenMove;

    if (Math.random() < chaseChance) {
      chosenMove = possibleMoves.sort((a, b) => {
        const distA = distanceToPlayer(enemy.x + a.dx, enemy.y + a.dy);
        const distB = distanceToPlayer(enemy.x + b.dx, enemy.y + b.dy);
        return distA - distB;
      })[0];
    } else {
      chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    enemy.x += chosenMove.dx;
    enemy.y += chosenMove.dy;
  });

  checkEnemyCollision();
  drawGame();
}

function getPossibleEnemyMoves(enemy) {
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 }
  ];
  return directions.filter(move => canMoveTo(enemy.x + move.dx, enemy.y + move.dy));
}

function distanceToPlayer(x, y) {
  return Math.abs(player.x - x) + Math.abs(player.y - y);
}

function checkEnemyCollision() {
  const enemy = enemies.find(e => e.x === player.x && e.y === player.y);
  if (!enemy) return;

  if (powerMode) {
    score += 150 * combo;
    combo = Math.min(combo + 1, 9);
    enemy.x = enemy.startX;
    enemy.y = enemy.startY;
    messageBar.textContent = "Boom! Du spiste en fiende! +bonus";
    return;
  }

  if (shield) {
    shield = false;
    enemy.x = enemy.startX;
    enemy.y = enemy.startY;
    messageBar.textContent = "Skjoldet reddet deg!";
    return;
  }

  loseLife();
}

function loseLife() {
  lives--;
  combo = 1;

  if (lives <= 0) {
    endGame(false);
    return;
  }

  messageBar.textContent = `Du mistet et liv! ${lives} liv igjen. Level starter på nytt.`;
  loadLevel(levelIndex);
}

function nextLevel() {
  clearInterval(enemyTimer);
  clearTimeout(powerTimer);
  score += 250 + (levelIndex + 1) * 100;

  if (levelIndex === levels.length - 1) {
    endGame(true);
    return;
  }

  gameRunning = false;
  levelTitle.textContent = `Level ${levelIndex + 1} Complete!`;
  levelDescription.textContent = "Bra jobba! Neste nivå blir raskere og mer kaotisk.";
  levelScreen.classList.remove("hidden");

  setTimeout(() => {
    levelIndex++;
    gameRunning = true;
    levelScreen.classList.add("hidden");
    loadLevel(levelIndex);
  }, 1600);
}

function endGame(won) {
  gameRunning = false;
  clearInterval(enemyTimer);
  clearTimeout(powerTimer);

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("ragiJoyHighscore", highscore);
  }

  endTitle.textContent = won ? "DU VANT! 🎉" : "GAME OVER";
  finalScore.textContent = score;
  finalHighscore.textContent = highscore;
  endScreen.classList.remove("hidden");
  drawGame();
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  messageBar.textContent = paused ? "Pause aktivert. Trykk P igjen for å fortsette." : "Spillet fortsetter!";
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
  if (event.key.toLowerCase() === "p") togglePause();
});

// Tegner første level bak startskjermen slik at spillet ser levende ut før start.
highscoreText.textContent = highscore;
loadLevel(0);
gameRunning = false;
clearInterval(enemyTimer);
