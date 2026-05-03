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

const friendModal = document.getElementById("friendModal");
const friendModalClose = document.getElementById("friendModalClose");
const friendTabCreate = document.getElementById("friendTabCreate");
const friendTabJoin = document.getElementById("friendTabJoin");
const createRoomPanel = document.getElementById("createRoomPanel");
const joinRoomPanel = document.getElementById("joinRoomPanel");
const createRoomButton = document.getElementById("createRoomButton");
const joinRoomButton = document.getElementById("joinRoomButton");
const copyRoomButton = document.getElementById("copyRoomButton");
const lobbyPanel = document.getElementById("lobbyPanel");
const readySelf = document.getElementById("readySelf");
const readyOther = document.getElementById("readyOther");
const roomCodeInput = document.getElementById("roomCodeInput");
const roomInfo = document.getElementById("roomInfo");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const onlineStatus = document.getElementById("onlineStatus");
const readyButton = document.getElementById("readyButton");

const languageButton = document.getElementById("languageButton");
const currentLanguageFlag = document.getElementById("currentLanguageFlag");
const currentLanguageName = document.getElementById("currentLanguageName");
const languagePanel = document.getElementById("languagePanel");
const languageSearch = document.getElementById("languageSearch");
const languageList = document.getElementById("languageList");

// Språkene under vises som land/flagg. Du kan legge til flere senere ved å kopiere en linje.
const languageOptions = [
  { code: "no", flag: "🇳🇴", name: "Norsk", country: "Norge", search: "norway norge norwegian norsk" },
  { code: "en", flag: "🇬🇧", name: "English", country: "United Kingdom", search: "english england uk united kingdom" },
  { code: "ta", flag: "🇱🇰", name: "தமிழ் / Tamil", country: "Sri Lanka", search: "tamil sri lanka இலங்கை தமிழ்" },
  { code: "si", flag: "🇱🇰", name: "සිංහල / Sinhala", country: "Sri Lanka", search: "sinhala sri lanka sinhalese" },
  { code: "de", flag: "🇩🇪", name: "Deutsch", country: "Deutschland", search: "german germany deutsch deutschland" },
  { code: "fr", flag: "🇫🇷", name: "Français", country: "France", search: "french france français" },
  { code: "es", flag: "🇪🇸", name: "Español", country: "España", search: "spanish spain español" },
  { code: "it", flag: "🇮🇹", name: "Italiano", country: "Italia", search: "italian italy italiano" },
  { code: "pt", flag: "🇵🇹", name: "Português", country: "Portugal", search: "portuguese portugal português" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands", country: "Nederland", search: "dutch netherlands nederlands holland" },
  { code: "sv", flag: "🇸🇪", name: "Svenska", country: "Sverige", search: "swedish sweden svenska sverige" },
  { code: "da", flag: "🇩🇰", name: "Dansk", country: "Danmark", search: "danish denmark dansk danmark" },
  { code: "fi", flag: "🇫🇮", name: "Suomi", country: "Finland", search: "finnish finland suomi" },
  { code: "pl", flag: "🇵🇱", name: "Polski", country: "Polska", search: "polish poland polski polska" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe", country: "Türkiye", search: "turkish turkey türkiye" },
  { code: "ar", flag: "🇸🇦", name: "العربية / Arabic", country: "Saudi Arabia", search: "arabic arabia saudi العربية" },
  { code: "hi", flag: "🇮🇳", name: "हिन्दी / Hindi", country: "India", search: "hindi india हिन्दी" },
  { code: "ur", flag: "🇵🇰", name: "اردو / Urdu", country: "Pakistan", search: "urdu pakistan اردو" },
  { code: "bn", flag: "🇧🇩", name: "বাংলা / Bengali", country: "Bangladesh", search: "bengali bangla bangladesh বাংলা" },
  { code: "zh", flag: "🇨🇳", name: "中文 / Chinese", country: "China", search: "chinese china mandarin 中文" },
  { code: "ja", flag: "🇯🇵", name: "日本語 / Japanese", country: "Japan", search: "japanese japan 日本語" },
  { code: "ko", flag: "🇰🇷", name: "한국어 / Korean", country: "South Korea", search: "korean korea 한국어" },
  { code: "ru", flag: "🇷🇺", name: "Русский", country: "Russia", search: "russian russia русский" },
  { code: "uk", flag: "🇺🇦", name: "Українська", country: "Ukraine", search: "ukrainian ukraine українська" },
  { code: "ro", flag: "🇷🇴", name: "Română", country: "România", search: "romanian romania română" },
  { code: "cs", flag: "🇨🇿", name: "Čeština", country: "Czechia", search: "czech czechia čeština" },
  { code: "el", flag: "🇬🇷", name: "Ελληνικά", country: "Greece", search: "greek greece ελληνικά" },
  { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia", country: "Indonesia", search: "indonesian indonesia bahasa" },
  { code: "th", flag: "🇹🇭", name: "ไทย / Thai", country: "Thailand", search: "thai thailand ไทย" },
  { code: "vi", flag: "🇻🇳", name: "Tiếng Việt", country: "Vietnam", search: "vietnamese vietnam tiếng việt" }
];

const translations = {
  no: { subtitle: "Samle diamanter, ta power-ups, overlev fiendene og kom deg gjennom alle nivåene.", startTitle: "Klar?", startInstruction: "Bruk piltastene på PC eller knappene under på mobil.", powerInstruction: "⚡ Power-up gjør fiender spiselige i noen sekunder.", portalInstruction: "🌀 Portal åpnes når alle diamanter er samlet.", startButton: "Start Game", restartButton: "Restart", tipsTitle: "Tips:", tipsText: "Trykk <kbd>P</kbd> for pause. Ta ⚡ og jakt på fiender for bonuspoeng.", messageStart: "Trykk Start Game", searchPlaceholder: "Søk språk eller land...", levelComplete: "Level fullført!", gameOver: "GAME OVER", won: "DU VANT! 🎉", paused: "Pause aktivert. Trykk P igjen for å fortsette.", resumed: "Spillet fortsetter!", nice: "Nice! Combo", power: "⚡ Power Mode! Nå kan du spise fiender!", powerEnd: "Power Mode ferdig. Fortsett å samle diamanter!", shield: "🛡️ Skjold aktivert! Én kollisjon blir reddet.", shieldSaved: "Skjoldet reddet deg!", portalOpen: "🌀 Portalen er åpen! Gå til midten for neste level.", enemyEat: "Boom! Du spiste en fiende! +bonus", lostLife: "Du mistet et liv!", livesLeft: "liv igjen. Level starter på nytt.", levelDoneDesc: "Bra jobba! Neste nivå blir raskere og mer kaotisk.", noResults: "Ingen språk funnet." },
  en: { subtitle: "Collect diamonds, grab power-ups, survive the enemies and clear every level.", startTitle: "Ready?", startInstruction: "Use arrow keys on PC or the buttons below on mobile.", powerInstruction: "⚡ Power-up makes enemies edible for a few seconds.", portalInstruction: "🌀 The portal opens when all diamonds are collected.", startButton: "Start Game", restartButton: "Restart", tipsTitle: "Tip:", tipsText: "Press <kbd>P</kbd> to pause. Grab ⚡ and chase enemies for bonus points.", messageStart: "Press Start Game", searchPlaceholder: "Search language or country...", levelComplete: "Level Complete!", gameOver: "GAME OVER", won: "YOU WON! 🎉", paused: "Paused. Press P again to continue.", resumed: "Game continues!", nice: "Nice! Combo", power: "⚡ Power Mode! You can eat enemies now!", powerEnd: "Power Mode ended. Keep collecting diamonds!", shield: "🛡️ Shield activated! One collision will be saved.", shieldSaved: "The shield saved you!", portalOpen: "🌀 Portal is open! Go to the center for the next level.", enemyEat: "Boom! You ate an enemy! +bonus", lostLife: "You lost a life!", livesLeft: "lives left. Level restarts.", levelDoneDesc: "Good job! The next level is faster and more chaotic.", noResults: "No languages found." }
};

const quickLanguageText = {
  ta: ["வைரங்களை சேகரித்து, power-ups எடுத்து, எதிரிகளை தவிர்த்து எல்லா levels-ஐ முடிக்கவும்.", "தயாரா?", "Arrow keys அல்லது mobile buttons பயன்படுத்தவும்.", "Start Game அழுத்தவும்"],
  si: ["දියමන්ති එකතු කර power-ups ගෙන සතුරන්ගෙන් බේරී සියලු levels අවසන් කරන්න.", "සූදානම්ද?", "Arrow keys හෝ mobile buttons භාවිතා කරන්න.", "Start Game ඔබන්න"],
  de: ["Sammle Diamanten, nutze Power-ups und überlebe alle Level.", "Bereit?", "Nutze Pfeiltasten oder mobile Tasten.", "Spiel starten"],
  fr: ["Collecte les diamants, utilise les bonus et termine tous les niveaux.", "Prêt ?", "Utilise les flèches ou les boutons mobiles.", "Démarrer"],
  es: ["Recoge diamantes, usa poderes y supera todos los niveles.", "¿Listo?", "Usa las flechas o los botones móviles.", "Iniciar juego"],
  it: ["Raccogli diamanti, usa potenziamenti e completa tutti i livelli.", "Pronto?", "Usa le frecce o i pulsanti mobili.", "Avvia gioco"],
  pt: ["Colete diamantes, use poderes e complete todos os níveis.", "Pronto?", "Use as setas ou botões móveis.", "Iniciar jogo"],
  nl: ["Verzamel diamanten, gebruik power-ups en voltooi alle levels.", "Klaar?", "Gebruik pijltjestoetsen of mobiele knoppen.", "Start spel"],
  sv: ["Samla diamanter, använd power-ups och klara alla nivåer.", "Redo?", "Använd piltangenter eller mobilknappar.", "Starta spel"],
  da: ["Saml diamanter, brug power-ups og gennemfør alle baner.", "Klar?", "Brug piletaster eller mobilknapper.", "Start spil"],
  fi: ["Kerää timantteja, käytä voimia ja läpäise kaikki tasot.", "Valmis?", "Käytä nuolinäppäimiä tai mobiilipainikkeita.", "Aloita peli"],
  pl: ["Zbieraj diamenty, używaj bonusów i przejdź wszystkie poziomy.", "Gotowy?", "Użyj strzałek lub przycisków mobilnych.", "Start gry"],
  tr: ["Elmasları topla, güçleri kullan ve tüm seviyeleri bitir.", "Hazır mısın?", "Ok tuşlarını veya mobil düğmeleri kullan.", "Oyunu başlat"],
  ar: ["اجمع الجواهر، استخدم القوى الخاصة وأنهِ كل المستويات.", "جاهز؟", "استخدم الأسهم أو أزرار الهاتف.", "ابدأ اللعبة"],
  hi: ["हीरे इकट्ठा करें, power-ups लें और सभी levels पूरे करें.", "तैयार?", "Arrow keys या mobile buttons इस्तेमाल करें.", "गेम शुरू करें"],
  ur: ["ہیرے جمع کریں، power-ups لیں اور تمام levels مکمل کریں۔", "تیار؟", "Arrow keys یا mobile buttons استعمال کریں۔", "گیم شروع کریں"],
  bn: ["হীরা সংগ্রহ করুন, power-ups নিন এবং সব level শেষ করুন।", "প্রস্তুত?", "Arrow keys বা mobile buttons ব্যবহার করুন।", "গেম শুরু করুন"],
  zh: ["收集钻石，使用能量道具，完成所有关卡。", "准备好了吗？", "使用方向键或手机按钮。", "开始游戏"],
  ja: ["ダイヤを集め、パワーアップを使い、全レベルをクリアしよう。", "準備はいい？", "矢印キーまたはモバイルボタンを使ってください。", "ゲーム開始"],
  ko: ["다이아몬드를 모으고 파워업을 사용해 모든 레벨을 클리어하세요.", "준비됐나요?", "화살표 키 또는 모바일 버튼을 사용하세요.", "게임 시작"],
  ru: ["Собирай алмазы, используй бонусы и пройди все уровни.", "Готов?", "Используй стрелки или кнопки на мобильном.", "Начать игру"],
  uk: ["Збирай діаманти, використовуй бонуси та пройди всі рівні.", "Готовий?", "Використовуй стрілки або мобільні кнопки.", "Почати гру"],
  ro: ["Colectează diamante, folosește bonusuri și termină toate nivelurile.", "Gata?", "Folosește săgețile sau butoanele mobile.", "Pornește jocul"],
  cs: ["Sbírej diamanty, používej bonusy a dokonči všechny úrovně.", "Připraven?", "Použij šipky nebo mobilní tlačítka.", "Spustit hru"],
  el: ["Μάζεψε διαμάντια, χρησιμοποίησε power-ups και πέρασε όλα τα επίπεδα.", "Έτοιμος;", "Χρησιμοποίησε τα βελάκια ή τα κουμπιά κινητού.", "Έναρξη"],
  id: ["Kumpulkan berlian, gunakan power-up, dan selesaikan semua level.", "Siap?", "Gunakan tombol panah atau tombol mobile.", "Mulai Game"],
  th: ["เก็บเพชร ใช้พาวเวอร์อัป และผ่านทุกด่านให้ได้", "พร้อมไหม?", "ใช้ปุ่มลูกศรหรือปุ่มบนมือถือ", "เริ่มเกม"],
  vi: ["Thu thập kim cương, dùng power-up và hoàn thành mọi màn chơi.", "Sẵn sàng?", "Dùng phím mũi tên hoặc nút trên điện thoại.", "Bắt đầu"]
};

for (const [code, values] of Object.entries(quickLanguageText)) {
  translations[code] = { ...translations.en, subtitle: values[0], startTitle: values[1], startInstruction: values[2], startButton: values[3], messageStart: values[3] };
}

let currentLanguage = localStorage.getItem("ragiJoyLanguage") || "no";

function t(key) {
  return (translations[currentLanguage] && translations[currentLanguage][key]) || translations.en[key] || key;
}


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

// -----------------------------
// Online multiplayer beta
// -----------------------------
// Dette er første versjon: Firebase brukes til romkode, klar-status og synk av posisjon/score.
// Singleplayer-delen er beholdt som før.
let onlineMode = false;
let roomCode = null;
let playerSlot = null; // "p1" eller "p2"
let remotePlayer = null;
let roomListenerOff = null;
let playerId = localStorage.getItem("ragiJoyPlayerId");
if (!playerId) {
  playerId = "player-" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("ragiJoyPlayerId", playerId);
}

function firebaseReady() {
  return Boolean(window.FirebaseGame && window.FirebaseGame.database);
}

function roomPath(code) {
  return `rooms/${code}`;
}

function waitForFirebase(timeoutMs = 5000) {
  // Firebase scriptet lastes som module i index.html. Noen ganger er script.js klar før Firebase er ferdig.
  // Denne funksjonen venter litt slik at knappen ikke virker "død".
  if (firebaseReady()) return Promise.resolve(true);

  return new Promise(resolve => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (firebaseReady()) {
        clearInterval(timer);
        resolve(true);
      }

      if (Date.now() - started > timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
}

function generateRoomCode() {
  // Kort kode som er lett å lese over telefon/Teams. Unngår tegn som kan forveksles.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function normalizeRoomCode(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

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
  onlineMode = false;
  remotePlayer = null;
  detachRoomListener();
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

      if (onlineMode && remotePlayer && remotePlayer.x === x && remotePlayer.y === y) {
        cell.className = "cell player-two";
      }

      if (player.x === x && player.y === y) {
        cell.className = playerSlot === "p2" ? "cell player-two" : "cell player";
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
  syncOnlinePlayer();
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
    messageBar.textContent = `${t("nice")} x${combo}`;
  }

  if (tile === TILE.POWER) {
    score += 50;
    activatePowerMode();
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = t("power");
  }

  if (tile === TILE.SHIELD) {
    shield = true;
    score += 30;
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = t("shield");
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
    messageBar.textContent = t("powerEnd");
    drawGame();
  }, 6500);
}

function openPortal() {
  portalOpen = true;
  map[5][6] = TILE.PORTAL;
  messageBar.textContent = t("portalOpen");
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
    messageBar.textContent = t("enemyEat");
    return;
  }

  if (shield) {
    shield = false;
    enemy.x = enemy.startX;
    enemy.y = enemy.startY;
    messageBar.textContent = t("shieldSaved");
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

  messageBar.textContent = `${t("lostLife")} ${lives} ${t("livesLeft")}`;
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
  levelTitle.textContent = `Level ${levelIndex + 1} ${t("levelComplete")}`;
  levelDescription.textContent = t("levelDoneDesc");
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

  endTitle.textContent = won ? t("won") : t("gameOver");
  finalScore.textContent = score;
  finalHighscore.textContent = highscore;
  endScreen.classList.remove("hidden");
  drawGame();
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  messageBar.textContent = paused ? t("paused") : t("resumed");
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
  if (event.key.toLowerCase() === "p") togglePause();
});


function toggleLanguagePanel() {
  if (!languagePanel) return;
  const isHidden = languagePanel.classList.toggle("hidden");
  if (languageButton) languageButton.setAttribute("aria-expanded", String(!isHidden));
  if (!isHidden && languageSearch) {
    languageSearch.value = "";
    renderLanguageList();
    languageSearch.focus();
  }
}

function changeLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("ragiJoyLanguage", language);
  applyLanguage();
  if (languagePanel) languagePanel.classList.add("hidden");
  if (languageButton) languageButton.setAttribute("aria-expanded", "false");
}

function filterLanguageList() {
  renderLanguageList(languageSearch ? languageSearch.value : "");
}

function renderLanguageList(searchText = "") {
  if (!languageList) return;
  const query = searchText.trim().toLowerCase();
  const filtered = languageOptions.filter(language => `${language.name} ${language.country} ${language.search}`.toLowerCase().includes(query));
  languageList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "language-empty";
    empty.textContent = t("noResults");
    languageList.appendChild(empty);
    return;
  }

  filtered.forEach(language => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-option";
    if (language.code === currentLanguage) button.classList.add("active-language");
    button.onclick = () => changeLanguage(language.code);
    button.innerHTML = `
      <span class="flag">${language.flag}</span>
      <span class="language-meta">
        <strong>${language.name}</strong>
        <span class="country">${language.country}</span>
      </span>
    `;
    languageList.appendChild(button);
  });
}

function applyLanguage() {
  const selected = languageOptions.find(language => language.code === currentLanguage) || languageOptions[0];
  document.documentElement.lang = currentLanguage;
  if (currentLanguageFlag) currentLanguageFlag.textContent = selected.flag;
  if (currentLanguageName) currentLanguageName.textContent = selected.name;
  if (languageSearch) languageSearch.placeholder = t("searchPlaceholder");

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const setHtml = (id, value) => { const el = document.getElementById(id); if (el) el.innerHTML = value; };
  setText("subtitle", t("subtitle"));
  setText("startTitle", t("startTitle"));
  setText("startInstruction", t("startInstruction"));
  setText("powerInstruction", t("powerInstruction"));
  setText("portalInstruction", t("portalInstruction"));
  setText("startButton", t("startButton"));
  setText("restartButton", t("restartButton"));
  setText("tipsTitle", t("tipsTitle"));
  setHtml("tipsText", t("tipsText"));
  if (messageBar && !gameRunning) messageBar.textContent = t("messageStart");
  renderLanguageList(languageSearch ? languageSearch.value : "");
}

document.addEventListener("click", event => {
  const picker = document.querySelector(".language-picker");
  if (picker && !picker.contains(event.target) && languagePanel) {
    languagePanel.classList.add("hidden");
    if (languageButton) languageButton.setAttribute("aria-expanded", "false");
  }
});


function setPanelHidden(element, hidden) {
  if (!element) return;
  element.classList.toggle("hidden", hidden);
  element.hidden = hidden;
}

function setOnlineStatus(text) {
  if (onlineStatus) onlineStatus.textContent = text;
}

function switchFriendTab(tab) {
  const createIsActive = tab === "create";

  if (friendTabCreate) {
    friendTabCreate.classList.toggle("is-active", createIsActive);
    friendTabCreate.setAttribute("aria-selected", String(createIsActive));
  }
  if (friendTabJoin) {
    friendTabJoin.classList.toggle("is-active", !createIsActive);
    friendTabJoin.setAttribute("aria-selected", String(!createIsActive));
  }

  setPanelHidden(createRoomPanel, !createIsActive);
  setPanelHidden(joinRoomPanel, createIsActive);

  if (!roomCode) {
    setPanelHidden(roomInfo, true);
    setPanelHidden(lobbyPanel, true);
  }

  if (!firebaseReady()) {
    setOnlineStatus("Firebase kobler til ... Last siden på nytt hvis den ikke blir klar.");
  } else {
    setOnlineStatus(createIsActive ? "Trykk Generer romkode for å lage et privat rom." : "Skriv inn romkoden fra vennen din.");
  }

  if (!createIsActive && roomCodeInput) roomCodeInput.focus();
}

function showFriendLobby() {
  switchFriendTab("create");
  if (friendModal) {
    if (typeof friendModal.showModal === "function") friendModal.showModal();
    else friendModal.setAttribute("open", "open");
  }
  setOnlineStatus(firebaseReady()
    ? "Velg Lag rom, eller trykk Bli med og skriv inn koden du har fått."
    : "Firebase kobler til ... Last siden på nytt hvis dette ikke endrer seg."
  );
}

function closeFriendLobby() {
  if (friendModal && typeof friendModal.close === "function") friendModal.close();
  else if (friendModal) friendModal.removeAttribute("open");
}

async function createFriendRoom() {
  // Gir umiddelbar respons i UI, slik at knappen aldri føles død.
  setOnlineStatus("Lager romkode ...");
  if (createRoomButton) createRoomButton.disabled = true;

  try {
    const ready = await waitForFirebase();
    if (!ready) {
      setOnlineStatus("Firebase ble ikke klar. Sjekk internett, åpne siden via Live Server, eller last siden på nytt.");
      alert("Firebase er ikke klar. Tips: åpne prosjektet via Live Server i VS Code, ikke bare dobbeltklikk på index.html.");
      return;
    }

    const fb = window.FirebaseGame;
    let newCode = generateRoomCode();
    let attempts = 0;

    while (attempts < 8) {
      const snapshot = await fb.get(fb.ref(fb.database, roomPath(newCode)));
      if (!snapshot.exists()) break;
      newCode = generateRoomCode();
      attempts++;
    }

    roomCode = newCode;
    playerSlot = "p1";
    onlineMode = true;

    // Vis koden med en gang. Deretter lagres rommet i Firebase.
    showRoomInfo();
    setOnlineStatus("Romkode laget. Lagrer rommet i Firebase ...");

    const roomData = {
      createdAt: Date.now(),
      status: "waiting",
      hostId: playerId,
      level: 1,
      players: {
        p1: {
          id: playerId,
          ready: false,
          x: levels[0].player.x,
          y: levels[0].player.y,
          score: 0,
          lives: 3,
          joinedAt: Date.now()
        }
      }
    };

    await fb.set(fb.ref(fb.database, roomPath(roomCode)), roomData);

    try {
      fb.onDisconnect(fb.ref(fb.database, `${roomPath(roomCode)}/players/p1`)).remove();
    } catch (error) {
      console.log("onDisconnect kunne ikke settes:", error);
    }

    listenToRoom();
    setOnlineStatus("Rommet er laget ✅ Kopier koden og send den til vennen din.");
  } catch (error) {
    console.error("Kunne ikke lage rom:", error);
    setOnlineStatus("Kunne ikke lage rom. Sjekk Firebase Rules/Test mode og prøv igjen.");
    alert("Kunne ikke lage rom. Åpne Developer Console/F12 for detaljer. Vanlig årsak: Firebase rules, internett eller at siden ikke kjøres via Live Server.");
  } finally {
    if (createRoomButton) createRoomButton.disabled = false;
  }
}

async function joinFriendRoom() {
  if (!firebaseReady()) {
    alert("Firebase er ikke klar. Sjekk internett eller last siden på nytt.");
    return;
  }

  const fb = window.FirebaseGame;
  const typedCode = normalizeRoomCode(roomCodeInput ? roomCodeInput.value : "");
  if (!typedCode || typedCode.length < 6) {
    alert("Skriv inn hele romkoden først.");
    return;
  }

  const snapshot = await fb.get(fb.ref(fb.database, roomPath(typedCode)));
  if (!snapshot.exists()) {
    alert("Fant ikke rommet. Sjekk romkoden.");
    return;
  }

  const room = snapshot.val();
  const players = room.players || {};
  if (players.p1 && players.p1.id === playerId) {
    playerSlot = "p1";
  } else if (!players.p2 || players.p2.id === playerId) {
    playerSlot = "p2";
  } else {
    alert("Rommet har allerede to spillere.");
    return;
  }

  roomCode = typedCode;
  onlineMode = true;

  const startPos = playerSlot === "p2" ? { x: 11, y: 9 } : levels[0].player;
  await fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`), {
    id: playerId,
    ready: false,
    x: startPos.x,
    y: startPos.y,
    score: 0,
    lives: 3,
    joinedAt: Date.now()
  });

  try {
    fb.onDisconnect(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`)).remove();
  } catch (error) {
    console.log("onDisconnect kunne ikke settes:", error);
  }

  showRoomInfo();
  listenToRoom();
  setOnlineStatus("Du er inne i rommet. Trykk klar når du er klar.");
}

function showRoomInfo() {
  setPanelHidden(roomInfo, false);
  setPanelHidden(lobbyPanel, false);
  if (roomCodeDisplay) roomCodeDisplay.value = roomCode;
  if (readyButton) readyButton.classList.remove("hidden");
  updateReadyCards(null, null);
}

async function copyRoomCode() {
  if (!roomCode) return;
  try {
    await navigator.clipboard.writeText(roomCode);
    setOnlineStatus("Romkoden er kopiert. Send den til kompisen din.");
  } catch (error) {
    setOnlineStatus(`Romkode: ${roomCode}`);
  }
}

async function setPlayerReady() {
  if (!firebaseReady() || !roomCode || !playerSlot) return;
  const fb = window.FirebaseGame;
  await fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`), { ready: true });
  setOnlineStatus("Du er klar. Venter på den andre spilleren.");
}

function updateReadyCards(selfPlayer, otherPlayer) {
  if (readySelf) readySelf.textContent = selfPlayer && selfPlayer.ready ? "Klar ✅" : "Ikke klar";
  if (readyOther) {
    if (!otherPlayer) readyOther.textContent = "Venter ...";
    else readyOther.textContent = otherPlayer.ready ? "Klar ✅" : "Ikke klar";
  }
}

function listenToRoom() {
  if (!firebaseReady() || !roomCode) return;
  detachRoomListener();
  const fb = window.FirebaseGame;

  roomListenerOff = fb.onValue(fb.ref(fb.database, roomPath(roomCode)), async snapshot => {
    const room = snapshot.val();
    if (!room) {
      setOnlineStatus("Rommet ble lukket.");
      return;
    }

    const players = room.players || {};
    const p1 = players.p1;
    const p2 = players.p2;
    const selfPlayer = players[playerSlot];
    const otherSlot = playerSlot === "p1" ? "p2" : "p1";
    const otherPlayer = players[otherSlot] || null;
    remotePlayer = otherPlayer;

    updateReadyCards(selfPlayer, otherPlayer);

    if (room.status !== "running") {
      const p1Status = p1 ? (p1.ready ? "klar ✅" : "ikke klar") : "venter";
      const p2Status = p2 ? (p2.ready ? "klar ✅" : "ikke klar") : "venter";
      setOnlineStatus(`Spiller 1: ${p1Status} | Spiller 2: ${p2Status}`);
    }

    if (p1 && p2 && p1.ready && p2.ready && room.status === "waiting" && playerSlot === "p1") {
      await fb.update(fb.ref(fb.database, roomPath(roomCode)), { status: "running", startedAt: Date.now() });
    }

    if (room.status === "running" && !gameRunning) {
      closeFriendLobby();
      startOnlineGame();
    }

    if (onlineMode && gameRunning) drawGame();
  });
}

function detachRoomListener() {
  if (roomListenerOff) {
    roomListenerOff();
    roomListenerOff = null;
  }
}

function startOnlineGame() {
  score = 0;
  levelIndex = 0;
  lives = 3;
  combo = 1;
  gameRunning = true;
  paused = false;
  onlineMode = true;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  levelScreen.classList.add("hidden");
  loadLevel(levelIndex);

  if (playerSlot === "p2") {
    player = { x: 11, y: 9 };
  }

  messageBar.textContent = `Online match startet! Du er ${playerSlot === "p1" ? "gul spiller 😄" : "blå spiller 😎"}.`;
  syncOnlinePlayer();
  drawGame();
}

async function syncOnlinePlayer() {
  if (!onlineMode || !firebaseReady() || !roomCode || !playerSlot) return;
  const fb = window.FirebaseGame;
  await fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`), {
    x: player.x,
    y: player.y,
    score,
    lives,
    level: levelIndex + 1,
    updatedAt: Date.now()
  });
}

window.addEventListener("firebase-ready", () => {
  if (onlineStatus && !onlineMode) setOnlineStatus("Firebase klar. Du kan lage eller bli med i rom.");
});

if (friendTabCreate) friendTabCreate.addEventListener("click", () => switchFriendTab("create"));
if (friendTabJoin) friendTabJoin.addEventListener("click", () => switchFriendTab("join"));
if (friendModalClose) friendModalClose.addEventListener("click", closeFriendLobby);
if (roomCodeInput) {
  roomCodeInput.addEventListener("input", () => {
    roomCodeInput.value = normalizeRoomCode(roomCodeInput.value);
  });
  roomCodeInput.addEventListener("keydown", event => {
    if (event.key === "Enter") joinFriendRoom();
  });
}

// Tegner første level bak startskjermen slik at spillet ser levende ut før start.
highscoreText.textContent = highscore;
loadLevel(0);
gameRunning = false;
applyLanguage();
clearInterval(enemyTimer);
