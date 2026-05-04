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
  no: { subtitle: "Samle diamanter, ta power-ups, overlev fiendene og kom deg gjennom alle nivåene.", startTitle: "Klar?", startInstruction: "Bruk piltastene på PC eller knappene under på mobil.", powerInstruction: "⚡ Power-up gjør fiender spiselige i noen sekunder.", portalInstruction: "🌀 Portal åpnes når alle diamanter er samlet.", startButton: "🚀 Spill mot data", playComputer: "🚀 Spill mot data", playFriend: "🌍 Spill mot venn", restartButton: "Restart", tipsTitle: "Tips:", tipsText: "Trykk <kbd>P</kbd> for pause. Ta ⚡ og jakt på fiender for bonuspoeng.", messageStart: "Trykk Start Game", searchPlaceholder: "Søk språk eller land...", levelComplete: "Level fullført!", gameOver: "GAME OVER", won: "DU VANT! 🎉", paused: "Pause aktivert. Trykk P igjen for å fortsette.", resumed: "Spillet fortsetter!", nice: "Nice! Combo", power: "⚡ Power Mode! Nå kan du spise fiender!", powerEnd: "Power Mode ferdig. Fortsett å samle diamanter!", shield: "🛡️ Skjold aktivert! Én kollisjon blir reddet.", shieldSaved: "Skjoldet reddet deg!", portalOpen: "🌀 Portalen er åpen! Gå til midten for neste level.", enemyEat: "Boom! Du spiste en fiende! +bonus", lostLife: "Du mistet et liv!", livesLeft: "liv igjen. Level starter på nytt.", levelDoneDesc: "Bra jobba! Neste nivå blir raskere og mer kaotisk.", noResults: "Ingen språk funnet.", difficultyEasy: "😄 Enkel", difficultyNormal: "😎 Middels", difficultyHard: "🔥 Vanskelig", difficultyExtreme: "💀 Ekstrem", difficultyMessage: "Vanskelighet", friendKicker: "ONLINE MULTIPLAYER", friendModalTitle: "Spill mot venn", friendModalSubtitle: "Lag et privat rom, send koden til kompisen din og start når begge er klare.", friendTabCreate: "Lag rom", friendTabJoin: "Bli med", createRoomButton: "✨ Generer romkode", friendHelp: "Koden vises her og kan sendes på Teams, Messenger, WhatsApp osv.", roomCodeLabel: "Skriv inn romkode fra vennen din", joinRoomButton: "Bli med", ownRoomCodeLabel: "Din romkode", copyButton: "Kopier", youLabel: "Du", friendLabel: "Venn", notReady: "Ikke klar", waitingFriend: "Venter på venn ...", connecting: "Kobler ...", disconnected: "Frakoblet", readyButton: "✅ Jeg er klar", onlineStatusStart: "Velg Lag rom eller Bli med.", soundOn: "🔊 Arcade sound: ON", soundOff: "🔇 Arcade sound: OFF" },
  en: { subtitle: "Collect diamonds, grab power-ups, survive the enemies and clear every level.", startTitle: "Ready?", startInstruction: "Use arrow keys on PC or the buttons below on mobile.", powerInstruction: "⚡ Power-up makes enemies edible for a few seconds.", portalInstruction: "🌀 The portal opens when all diamonds are collected.", startButton: "🚀 Play vs computer", playComputer: "🚀 Play vs computer", playFriend: "🌍 Play with friend", restartButton: "Restart", tipsTitle: "Tip:", tipsText: "Press <kbd>P</kbd> to pause. Grab ⚡ and chase enemies for bonus points.", messageStart: "Press Start Game", searchPlaceholder: "Search language or country...", levelComplete: "Level Complete!", gameOver: "GAME OVER", won: "YOU WON! 🎉", paused: "Paused. Press P again to continue.", resumed: "Game continues!", nice: "Nice! Combo", power: "⚡ Power Mode! You can eat enemies now!", powerEnd: "Power Mode ended. Keep collecting diamonds!", shield: "🛡️ Shield activated! One collision will be saved.", shieldSaved: "The shield saved you!", portalOpen: "🌀 Portal is open! Go to the center for the next level.", enemyEat: "Boom! You ate an enemy! +bonus", lostLife: "You lost a life!", livesLeft: "lives left. Level restarts.", levelDoneDesc: "Good job! The next level is faster and more chaotic.", noResults: "No languages found.", difficultyEasy: "😄 Easy", difficultyNormal: "😎 Medium", difficultyHard: "🔥 Hard", difficultyExtreme: "💀 Extreme", difficultyMessage: "Difficulty", friendKicker: "ONLINE MULTIPLAYER", friendModalTitle: "Play with friend", friendModalSubtitle: "Create a private room, send the code to your friend and start when both are ready.", friendTabCreate: "Create room", friendTabJoin: "Join", createRoomButton: "✨ Generate room code", friendHelp: "The code appears here and can be sent on Teams, Messenger, WhatsApp etc.", roomCodeLabel: "Enter the room code from your friend", joinRoomButton: "Join", ownRoomCodeLabel: "Your room code", copyButton: "Copy", youLabel: "You", friendLabel: "Friend", notReady: "Not ready", waitingFriend: "Waiting for friend ...", connecting: "Connecting ...", disconnected: "Disconnected", readyButton: "✅ I am ready", onlineStatusStart: "Choose Create room or Join.", soundOn: "🔊 Arcade sound: ON", soundOff: "🔇 Arcade sound: OFF" }
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
  translations[code] = { ...translations.en, subtitle: values[0], startTitle: values[1], startInstruction: values[2], startButton: values[3], playComputer: `🚀 ${values[3]}`, messageStart: values[3] };
}

// Ekstra UI-tekster for knapper som kom etter språkvelgeren ble laget.
// Uten dette vil vanskelighetsknapper og multiplayer-knapper bli stående på norsk.
const quickLanguageUiText = {
  de: { playComputer: "🚀 Gegen Computer", playFriend: "🌍 Mit Freund spielen", difficultyEasy: "😄 Einfach", difficultyNormal: "😎 Mittel", difficultyHard: "🔥 Schwer", difficultyExtreme: "💀 Extrem", friendModalTitle: "Mit Freund spielen", friendTabCreate: "Raum erstellen", friendTabJoin: "Beitreten", createRoomButton: "✨ Raumcode erstellen", joinRoomButton: "Beitreten", copyButton: "Kopieren", readyButton: "✅ Ich bin bereit" },
  fr: { playComputer: "🚀 Jouer contre l'ordinateur", playFriend: "🌍 Jouer avec un ami", difficultyEasy: "😄 Facile", difficultyNormal: "😎 Moyen", difficultyHard: "🔥 Difficile", difficultyExtreme: "💀 Extrême", friendModalTitle: "Jouer avec un ami", friendTabCreate: "Créer une salle", friendTabJoin: "Rejoindre", createRoomButton: "✨ Générer un code", joinRoomButton: "Rejoindre", copyButton: "Copier", readyButton: "✅ Je suis prêt" },
  es: { playComputer: "🚀 Jugar contra PC", playFriend: "🌍 Jugar con amigo", difficultyEasy: "😄 Fácil", difficultyNormal: "😎 Medio", difficultyHard: "🔥 Difícil", difficultyExtreme: "💀 Extremo", friendModalTitle: "Jugar con amigo", friendTabCreate: "Crear sala", friendTabJoin: "Unirse", createRoomButton: "✨ Generar código", joinRoomButton: "Unirse", copyButton: "Copiar", readyButton: "✅ Estoy listo" },
  ta: { playComputer: "🚀 Computer-க்கு எதிராக", playFriend: "🌍 நண்பருடன் விளையாடு", difficultyEasy: "😄 எளிது", difficultyNormal: "😎 நடுத்தரம்", difficultyHard: "🔥 கடினம்", difficultyExtreme: "💀 மிக கடினம்", friendModalTitle: "நண்பருடன் விளையாடு", friendTabCreate: "Room உருவாக்கு", friendTabJoin: "சேர்", createRoomButton: "✨ Room code உருவாக்கு", joinRoomButton: "சேர்", copyButton: "Copy", readyButton: "✅ நான் தயார்" },
  sv: { playComputer: "🚀 Spela mot dator", playFriend: "🌍 Spela med vän", difficultyEasy: "😄 Enkel", difficultyNormal: "😎 Medel", difficultyHard: "🔥 Svår", difficultyExtreme: "💀 Extrem", friendModalTitle: "Spela med vän", friendTabCreate: "Skapa rum", friendTabJoin: "Gå med", createRoomButton: "✨ Skapa rumskod", joinRoomButton: "Gå med", copyButton: "Kopiera", readyButton: "✅ Jag är redo" },
  da: { playComputer: "🚀 Spil mod computer", playFriend: "🌍 Spil med ven", difficultyEasy: "😄 Let", difficultyNormal: "😎 Middel", difficultyHard: "🔥 Svær", difficultyExtreme: "💀 Ekstrem", friendModalTitle: "Spil med ven", friendTabCreate: "Lav rum", friendTabJoin: "Deltag", createRoomButton: "✨ Generer rumkode", joinRoomButton: "Deltag", copyButton: "Kopiér", readyButton: "✅ Jeg er klar" },
  nl: { playComputer: "🚀 Speel tegen computer", playFriend: "🌍 Speel met vriend", difficultyEasy: "😄 Makkelijk", difficultyNormal: "😎 Normaal", difficultyHard: "🔥 Moeilijk", difficultyExtreme: "💀 Extreem", friendModalTitle: "Speel met vriend", friendTabCreate: "Kamer maken", friendTabJoin: "Meedoen", createRoomButton: "✨ Code maken", joinRoomButton: "Meedoen", copyButton: "Kopiëren", readyButton: "✅ Ik ben klaar" },
  pl: { playComputer: "🚀 Graj z komputerem", playFriend: "🌍 Graj ze znajomym", difficultyEasy: "😄 Łatwy", difficultyNormal: "😎 Średni", difficultyHard: "🔥 Trudny", difficultyExtreme: "💀 Ekstremalny", friendModalTitle: "Graj ze znajomym", friendTabCreate: "Utwórz pokój", friendTabJoin: "Dołącz", createRoomButton: "✨ Wygeneruj kod", joinRoomButton: "Dołącz", copyButton: "Kopiuj", readyButton: "✅ Jestem gotowy" }
};
for (const [code, extra] of Object.entries(quickLanguageUiText)) {
  translations[code] = { ...(translations[code] || translations.en), ...extra };
}


// V12: Tekster for customizer/figur/musikk. Disse legges på alle språk slik at nye menyer ikke blir stående på norsk.
const customizerUiText = {
  no: { customizeButton: "🎨 Velg figur, emoji og musikk", customizeKicker: "PLAYER STYLE", customizeTitle: "Gjør spillet ditt personlig", customizeSubtitle: "Velg emoji, last opp eget bilde, slå på random fiender og velg musikkrytme før du starter.", customizeEmojiTitle: "1. Velg spiller-emoji", customizeImageTitle: "2. Eller last opp eget bilde", clearAvatarButton: "Fjern bilde", avatarNote: "Bildet lagres kun i nettleseren din. Bruk et kvadratisk bilde for best resultat.", customizeEnemyTitle: "3. Fiender", randomEnemyLabel: "Random fiende-emoji på hvert brett 👾💀😈🤡", customizeMusicTitle: "4. Musikk / rytme", musicTheme: "Auto etter brett", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Test rytme", saveCustomizeButton: "✅ Lagre valg" },
  en: { customizeButton: "🎨 Choose character, emoji and music", customizeKicker: "PLAYER STYLE", customizeTitle: "Make the game yours", customizeSubtitle: "Choose an emoji, upload your own picture, enable random enemies and select music before you start.", customizeEmojiTitle: "1. Choose player emoji", customizeImageTitle: "2. Or upload your own picture", clearAvatarButton: "Remove picture", avatarNote: "The picture is saved only in your browser. Use a square image for best result.", customizeEnemyTitle: "3. Enemies", randomEnemyLabel: "Random enemy emoji on every board 👾💀😈🤡", customizeMusicTitle: "4. Music / rhythm", musicTheme: "Auto by board", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Test rhythm", saveCustomizeButton: "✅ Save choices" },
  ta: { customizeButton: "🎨 உருவம், emoji, இசை தேர்வு", customizeTitle: "உங்கள் விளையாட்டை தனிப்பயனாக்குங்கள்", customizeSubtitle: "Emoji தேர்வு செய்யவும், உங்கள் படம் upload செய்யவும், random enemies மற்றும் இசை தேர்வு செய்யவும்.", customizeEmojiTitle: "1. Player emoji தேர்வு", customizeImageTitle: "2. உங்கள் படம் upload செய்யவும்", clearAvatarButton: "படத்தை நீக்கு", avatarNote: "படம் உங்கள் browser-இல் மட்டும் சேமிக்கப்படும். Square image சிறந்தது.", customizeEnemyTitle: "3. எதிரிகள்", randomEnemyLabel: "ஒவ்வொரு board-லும் random enemy emoji 👾💀😈🤡", customizeMusicTitle: "4. இசை / rhythm", musicTheme: "Board படி auto", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Rhythm test", saveCustomizeButton: "✅ தேர்வை சேமி" },
  de: { customizeButton: "🎨 Figur, Emoji und Musik wählen", customizeTitle: "Mach das Spiel persönlich", customizeSubtitle: "Wähle Emoji, lade ein Bild hoch, aktiviere zufällige Gegner und wähle Musik.", customizeEmojiTitle: "1. Spieler-Emoji wählen", customizeImageTitle: "2. Oder eigenes Bild hochladen", clearAvatarButton: "Bild entfernen", avatarNote: "Das Bild wird nur im Browser gespeichert. Ein quadratisches Bild ist am besten.", customizeEnemyTitle: "3. Gegner", randomEnemyLabel: "Zufällige Gegner-Emojis auf jedem Brett 👾💀😈🤡", customizeMusicTitle: "4. Musik / Rhythmus", musicTheme: "Auto nach Brett", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Rhythmus testen", saveCustomizeButton: "✅ Auswahl speichern" },
  fr: { customizeButton: "🎨 Choisir personnage, emoji et musique", customizeTitle: "Personnalise ton jeu", customizeSubtitle: "Choisis un emoji, ajoute ton image, active les ennemis aléatoires et choisis la musique.", customizeEmojiTitle: "1. Choisir l’emoji joueur", customizeImageTitle: "2. Ou ajouter ton image", clearAvatarButton: "Retirer l’image", avatarNote: "L’image est enregistrée seulement dans ton navigateur. Une image carrée est idéale.", customizeEnemyTitle: "3. Ennemis", randomEnemyLabel: "Emoji ennemi aléatoire à chaque plateau 👾💀😈🤡", customizeMusicTitle: "4. Musique / rythme", musicTheme: "Auto selon plateau", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Tester le rythme", saveCustomizeButton: "✅ Enregistrer" },
  es: { customizeButton: "🎨 Elegir personaje, emoji y música", customizeTitle: "Personaliza tu juego", customizeSubtitle: "Elige emoji, sube tu imagen, activa enemigos aleatorios y elige música.", customizeEmojiTitle: "1. Elige emoji del jugador", customizeImageTitle: "2. O sube tu imagen", clearAvatarButton: "Quitar imagen", avatarNote: "La imagen se guarda solo en tu navegador. Usa una imagen cuadrada.", customizeEnemyTitle: "3. Enemigos", randomEnemyLabel: "Emoji enemigo aleatorio en cada tablero 👾💀😈🤡", customizeMusicTitle: "4. Música / ritmo", musicTheme: "Auto por tablero", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Probar ritmo", saveCustomizeButton: "✅ Guardar" },
  sv: { customizeButton: "🎨 Välj figur, emoji och musik", customizeTitle: "Gör spelet personligt", customizeSubtitle: "Välj emoji, ladda upp bild, slå på slumpade fiender och välj musik.", customizeEmojiTitle: "1. Välj spelar-emoji", customizeImageTitle: "2. Eller ladda upp egen bild", clearAvatarButton: "Ta bort bild", avatarNote: "Bilden sparas bara i din webbläsare. Fyrkantig bild fungerar bäst.", customizeEnemyTitle: "3. Fiender", randomEnemyLabel: "Slumpad fiende-emoji på varje bana 👾💀😈🤡", customizeMusicTitle: "4. Musik / rytm", musicTheme: "Auto efter bana", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Testa rytm", saveCustomizeButton: "✅ Spara val" },
  da: { customizeButton: "🎨 Vælg figur, emoji og musik", customizeTitle: "Gør spillet personligt", customizeSubtitle: "Vælg emoji, upload billede, slå tilfældige fjender til og vælg musik.", customizeEmojiTitle: "1. Vælg spiller-emoji", customizeImageTitle: "2. Eller upload eget billede", clearAvatarButton: "Fjern billede", avatarNote: "Billedet gemmes kun i din browser. Et kvadratisk billede virker bedst.", customizeEnemyTitle: "3. Fjender", randomEnemyLabel: "Tilfældig fjende-emoji på hvert bræt 👾💀😈🤡", customizeMusicTitle: "4. Musik / rytme", musicTheme: "Auto efter bræt", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Test rytme", saveCustomizeButton: "✅ Gem valg" },
  pl: { customizeButton: "🎨 Wybierz postać, emoji i muzykę", customizeTitle: "Dostosuj swoją grę", customizeSubtitle: "Wybierz emoji, wgraj zdjęcie, włącz losowych wrogów i wybierz muzykę.", customizeEmojiTitle: "1. Wybierz emoji gracza", customizeImageTitle: "2. Lub wgraj swoje zdjęcie", clearAvatarButton: "Usuń zdjęcie", avatarNote: "Zdjęcie zapisuje się tylko w przeglądarce. Najlepszy jest obraz kwadratowy.", customizeEnemyTitle: "3. Wrogowie", randomEnemyLabel: "Losowe emoji wroga na każdej planszy 👾💀😈🤡", customizeMusicTitle: "4. Muzyka / rytm", musicTheme: "Auto według planszy", musicHappy: "Happy arcade", musicTurbo: "Turbo chase", musicChill: "Chill diamonds", musicBoss: "Boss mode", previewMusicButton: "▶️ Test rytmu", saveCustomizeButton: "✅ Zapisz" }
};
const customizerFallbackByCode = {
  it: "en", pt: "en", nl: "en", fi: "en", tr: "en", ar: "en", hi: "en", ur: "en", bn: "en", zh: "en", ja: "en", ko: "en", ru: "en", uk: "en", ro: "en", cs: "en", el: "en", id: "en", th: "en", vi: "en", si: "en"
};
for (const language of languageOptions) {
  const baseCode = customizerUiText[language.code] ? language.code : (customizerFallbackByCode[language.code] || "en");
  translations[language.code] = { ...(translations[language.code] || translations.en), ...customizerUiText[baseCode] };
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
  // Flere brett-varianter. Alle brett er 13 x 11 ruter.
  // 1=vegg, 0=tomt, 2=diamant, 3=power-up, 4=skjold, 5=portal.
  {
    name: "Happy Start",
    theme: "neon",
    speed: 610,
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
    theme: "candy",
    speed: 585,
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
    theme: "electric",
    speed: 560,
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
    name: "Spiral Smile",
    theme: "sunset",
    speed: 540,
    enemies: [{ x: 11, y: 1 }, { x: 11, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222222222221",
      "1011111111201",
      "1022222221201",
      "1021111121201",
      "1021230021201",
      "1021111121201",
      "1022222221201",
      "1021111111201",
      "1422222222221",
      "1111111111111"
    ]
  },
  {
    name: "Bridge Blitz",
    theme: "ocean",
    speed: 520,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 11, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222022202221",
      "1211010101121",
      "1222022202221",
      "1011110111101",
      "1222232222221",
      "1011110111101",
      "1222022202221",
      "1211010101121",
      "1222022202421",
      "1111111111111"
    ]
  },
  {
    name: "Ghost Garden",
    theme: "forest",
    speed: 500,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 6, y: 5 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222223222221",
      "1210101010121",
      "1220202020221",
      "1010101010101",
      "1222224222221",
      "1010101010101",
      "1220202020221",
      "1210101010121",
      "1222223222221",
      "1111111111111"
    ]
  },
  {
    name: "Turbo Tunnel",
    theme: "lava",
    speed: 485,
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
    name: "Snake Arena",
    theme: "purple",
    speed: 470,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 11, y: 9 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222222222221",
      "1011111111101",
      "1222222222201",
      "1211111111201",
      "1222234222201",
      "1021111111121",
      "1022222222221",
      "1011111111101",
      "1222222222221",
      "1111111111111"
    ]
  },
  {
    name: "Rocket Cross",
    theme: "rocket",
    speed: 455,
    enemies: [{ x: 11, y: 1 }, { x: 1, y: 9 }, { x: 11, y: 9 }, { x: 6, y: 1 }],
    player: { x: 1, y: 1 },
    map: [
      "1111111111111",
      "1222220222221",
      "1211101011121",
      "1222203022221",
      "1110101010111",
      "1222224222221",
      "1110101010111",
      "1222220302221",
      "1211101011121",
      "1222220222221",
      "1111111111111"
    ]
  },
  {
    name: "Final Fiesta",
    theme: "fiesta",
    speed: 440,
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


// Vanskelighetsvalg påvirker kun spill mot data.
// Dette gjør at spilleren kan velge brettfølelse uten at online-rommet blir ustabilt.
const difficultySettings = {
  easy: { label: "Enkel", labelKey: "difficultyEasy", lives: 4, speedBonus: 85, enemyLimit: -1, scoreBonus: 1 },
  normal: { label: "Middels", labelKey: "difficultyNormal", lives: 3, speedBonus: 35, enemyLimit: 0, scoreBonus: 1.15 },
  hard: { label: "Vanskelig", labelKey: "difficultyHard", lives: 3, speedBonus: -10, enemyLimit: 1, scoreBonus: 1.35 },
  extreme: { label: "Ekstrem", labelKey: "difficultyExtreme", lives: 2, speedBonus: -45, enemyLimit: 1, scoreBonus: 1.65 }
};
let selectedDifficulty = localStorage.getItem("ragiJoyDifficulty") || "normal";
let soundEnabled = localStorage.getItem("ragiJoySound") !== "off";

// Personlige valg før spillstart.
// Lagres lokalt i nettleseren, så spilleren kan ha egen emoji/bilde uten server.
let selectedPlayerEmoji = localStorage.getItem("ragiJoyPlayerEmoji") || "😄";
let selectedPlayerImage = localStorage.getItem("ragiJoyPlayerImage") || "";
let randomEnemyEmojis = localStorage.getItem("ragiJoyRandomEnemies") !== "off";
let selectedMusicTrack = localStorage.getItem("ragiJoyMusicTrack") || "theme";
const enemyEmojiPool = ["👾", "💀", "😈", "🤡", "👻", "🦖", "🧟", "🐙", "🦹", "🔥"];


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
let roomPollTimer = null;
let lastOnlineSyncAt = 0;
let pendingOnlineSync = null;
let lastRemoteFingerprint = "";
// Unik ID per nettleserfane/enhet.
// Viktig: sessionStorage gjør at to faner på samme PC også kan teste som to ulike spillere.
let playerId = sessionStorage.getItem("ragiJoyPlayerId");
if (!playerId) {
  playerId = "player-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
  sessionStorage.setItem("ragiJoyPlayerId", playerId);
}
let joinInProgress = false;
let levelStartTime = 0;

function firebaseReady() {
  return Boolean(window.FirebaseGame && window.FirebaseGame.database);
}

function roomPath(code) {
  return `rooms/${code}`;
}

// Fast database-URL brukt som REST fallback. Dette gjør multiplayer mer stabilt på
// GitHub Pages, iOS/Safari og lokale Live Server-tester hvis Firebase SDK-cache krangler.
const FIREBASE_DATABASE_URL = "https://rag-game-default-rtdb.europe-west1.firebasedatabase.app";

function firebaseRestUrl(path) {
  return `${FIREBASE_DATABASE_URL}/${path}.json`;
}

async function restGet(path) {
  const response = await fetch(firebaseRestUrl(path), { cache: "no-store" });
  if (!response.ok) throw new Error(`REST GET feilet: ${response.status}`);
  return response.json();
}

async function restPut(path, data) {
  const response = await fetch(firebaseRestUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`REST PUT feilet: ${response.status}`);
  return response.json();
}

async function restPatch(path, data) {
  const response = await fetch(firebaseRestUrl(path), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`REST PATCH feilet: ${response.status}`);
  return response.json();
}

async function restDelete(path) {
  const response = await fetch(firebaseRestUrl(path), { method: "DELETE" });
  if (!response.ok) throw new Error(`REST DELETE feilet: ${response.status}`);
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
  enemies = level.enemies.map(enemy => ({ ...enemy, startX: enemy.x, startY: enemy.y, face: getEnemyFace() }));
  applyLevelTheme(level);
  applyDifficultyToEnemies();
  combo = 1;
  powerMode = false;
  shield = false;
  portalOpen = false;
  diamondsLeft = countTiles(TILE.DOT);
  levelStartTime = Date.now();
  clearInterval(enemyTimer);
  enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
  messageBar.textContent = `Level ${index + 1}: ${level.name}`;
  drawGame();
  if (gameRunning) startMusic();
}

function getEnemyDelay() {
  // Fiendene starter roligere på hvert level og øker gradvis.
  // Lavere tall = raskere fiender. Dette gjør level 4+ spillbart, men fortsatt spennende.
  const level = levels[levelIndex] || levels[0];
  const difficulty = difficultySettings[selectedDifficulty] || difficultySettings.normal;
  const secondsPlayed = Math.floor((Date.now() - levelStartTime) / 1000);
  // Gradvis økning: rolig i starten, litt raskere etter hvert.
  const gradualBoost = Math.min(95, secondsPlayed * 2.2);
  const levelBoost = Math.min(55, levelIndex * 5.5);
  const delay = level.speed + difficulty.speedBonus - gradualBoost - levelBoost;
  return Math.max(selectedDifficulty === "extreme" ? 245 : 300, delay);
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
  lives = difficultySettings[selectedDifficulty].lives;
  hypeStart();
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
        cell.dataset.emoji = powerMode ? "😵" : (enemyHere.face || "👾");
      }

      if (onlineMode && remotePlayer && remotePlayer.x === x && remotePlayer.y === y) {
        cell.className = "cell player-two";
        applyAvatarToCell(cell, remotePlayer.avatarEmoji || "😎", remotePlayer.avatarImage || "");
      }

      if (player.x === x && player.y === y) {
        cell.className = playerSlot === "p2" ? "cell player-two" : "cell player";
        applyAvatarToCell(cell, selectedPlayerEmoji, selectedPlayerImage);
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
    spawnPop("💎", x, y);
    playSfx("coin");
  }

  if (tile === TILE.POWER) {
    score += 50;
    activatePowerMode();
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = t("power");
    spawnPop("⚡", x, y);
    playSfx("power");
  }

  if (tile === TILE.SHIELD) {
    shield = true;
    score += 30;
    map[y][x] = TILE.EMPTY;
    messageBar.textContent = t("shield");
    spawnPop("🛡️", x, y);
    playSfx("shield");
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
  spawnCenterBurst("🌀 PORTAL!");
  playSfx("portal");
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

  clearInterval(enemyTimer);
  if (gameRunning && !paused) {
    enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
  }
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
    spawnCenterBurst("👾 +BONUS");
    playSfx("enemy");
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
  spawnCenterBurst("🎉 LEVEL UP!");
  playSfx("level");

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
  stopMusic();

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("ragiJoyHighscore", highscore);
  }

  endTitle.textContent = won ? t("won") : t("gameOver");
  finalScore.textContent = score;
  finalHighscore.textContent = highscore;
  endScreen.classList.remove("hidden");
  playSfx(won ? "win" : "lose");
  drawGame();
}


function applyLevelTheme(level) {
  document.body.dataset.theme = level.theme || "neon";
}

function applyDifficultyToEnemies() {
  const difficulty = difficultySettings[selectedDifficulty] || difficultySettings.normal;
  if (difficulty.enemyLimit < 0 && enemies.length > 1) {
    enemies = enemies.slice(0, Math.max(1, enemies.length + difficulty.enemyLimit));
  }
  if (difficulty.enemyLimit > 0 && enemies.length < 5) {
    const level = levels[levelIndex] || levels[0];
    const cloneSource = level.enemies[level.enemies.length - 1] || { x: 11, y: 9 };
    enemies.push({ ...cloneSource, x: Math.max(1, cloneSource.x - 1), startX: Math.max(1, cloneSource.x - 1), startY: cloneSource.y, face: getEnemyFace() });
  }
}

function setDifficulty(mode) {
  if (!difficultySettings[mode]) return;
  selectedDifficulty = mode;
  localStorage.setItem("ragiJoyDifficulty", mode);
  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.difficulty === mode);
  });
  const selected = difficultySettings[mode];
  messageBar.textContent = `${t("difficultyMessage")}: ${t(selected.labelKey)}`;
  playSfx("select");
}

function spawnPop(text, x, y) {
  const rect = game.getBoundingClientRect();
  const cellWidth = rect.width / (map[0]?.length || 13);
  const cellHeight = rect.height / (map.length || 11);
  const pop = document.createElement("div");
  pop.className = "pop-effect";
  pop.textContent = text;
  pop.style.left = `${rect.left + x * cellWidth + cellWidth / 2}px`;
  pop.style.top = `${rect.top + y * cellHeight + cellHeight / 2}px`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 760);
}

function spawnCenterBurst(text) {
  const burst = document.createElement("div");
  burst.className = "center-burst";
  burst.textContent = text;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1050);
}

let audioContext = null;
let musicTimer = null;
let musicStep = 0;
const musicTracks = {
  neon: [392, 523, 659, 784, 659, 523],
  candy: [440, 554, 659, 880, 659, 554],
  electric: [330, 660, 494, 740, 554, 831],
  lava: [196, 392, 466, 587, 466, 392],
  fiesta: [523, 659, 784, 1046, 784, 659],
  happy: [523, 659, 784, 1046, 880, 784, 659, 523],
  turbo: [330, 392, 494, 659, 988, 659, 494, 392],
  chill: [262, 330, 392, 523, 392, 330],
  boss: [196, 233, 262, 330, 392, 330, 262, 233]
};

function getAudioContext() {
  if (!soundEnabled) return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioContext = audioContext || new AudioCtx();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(freq, duration = 0.08, type = "square", volume = 0.035) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

function playSfx(name) {
  if (!soundEnabled) return;
  const patterns = {
    select: [[420, .04], [620, .05]],
    coin: [[880, .035], [1175, .05]],
    power: [[392, .06], [784, .08], [988, .08]],
    shield: [[330, .06], [440, .06], [660, .08]],
    portal: [[523, .07], [659, .07], [1046, .12]],
    enemy: [[130, .06], [220, .08], [440, .08]],
    level: [[523, .06], [659, .06], [784, .06], [1046, .12]],
    win: [[523, .08], [659, .08], [784, .08], [1046, .18]],
    lose: [[220, .12], [165, .16]],
    start: [[392, .07], [523, .07], [659, .07], [784, .12]]
  };
  (patterns[name] || patterns.select).forEach(([f, d], i) => setTimeout(() => tone(f, d), i * 65));
}

function startMusic() {
  stopMusic();
  if (!soundEnabled) return;
  const currentTheme = (levels[levelIndex] && levels[levelIndex].theme) || "neon";
  const trackName = selectedMusicTrack === "theme" ? currentTheme : selectedMusicTrack;
  const track = musicTracks[trackName] || musicTracks[currentTheme] || musicTracks.neon;
  musicStep = 0;
  musicTimer = setInterval(() => {
    if (!gameRunning || paused || !soundEnabled) return;
    const freq = track[musicStep % track.length];
    tone(freq, 0.045, "triangle", 0.018);
    musicStep++;
  }, 420);
}

function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}

function toggleGameSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("ragiJoySound", soundEnabled ? "on" : "off");
  const btn = document.getElementById("soundButton");
  if (btn) btn.textContent = soundEnabled ? t("soundOn") : t("soundOff");
  if (soundEnabled) { playSfx("select"); if (gameRunning) startMusic(); }
  else stopMusic();
}

function hypeStart() {
  spawnCenterBurst("🚀 GO GO GO!");
  playSfx("start");
  startMusic();
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  messageBar.textContent = paused ? t("paused") : t("resumed");
  if (paused) {
    clearInterval(enemyTimer);
  } else {
    clearInterval(enemyTimer);
    enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
  }
}

document.addEventListener("keydown", event => {
  // Windows/PC: hindrer at piltastene scroller nettsiden mens du spiller.
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowUp") movePlayer(0, -1);
  if (event.key === "ArrowDown") movePlayer(0, 1);
  if (event.key === "ArrowLeft") movePlayer(-1, 0);
  if (event.key === "ArrowRight") movePlayer(1, 0);
  if (event.key.toLowerCase() === "p") togglePause();
}, { passive: false });


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
  setHtml("startButton", t("playComputer"));
  setHtml("friendModeButton", t("playFriend"));
  setText("restartButton", t("restartButton"));
  setText("tipsTitle", t("tipsTitle"));
  setHtml("tipsText", t("tipsText"));

  const difficultyButtonText = {
    easy: t("difficultyEasy"),
    normal: t("difficultyNormal"),
    hard: t("difficultyHard"),
    extreme: t("difficultyExtreme")
  };
  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    const mode = btn.dataset.difficulty;
    if (difficultyButtonText[mode]) btn.innerHTML = difficultyButtonText[mode];
  });

  setText("friendModalTitle", t("friendModalTitle"));
  const friendKicker = document.querySelector("#friendModal .friend-kicker");
  if (friendKicker) friendKicker.textContent = t("friendKicker");
  const friendSubtitle = document.querySelector("#friendModal .friend-subtitle");
  if (friendSubtitle) friendSubtitle.textContent = t("friendModalSubtitle");
  setText("friendTabCreate", t("friendTabCreate"));
  setText("friendTabJoin", t("friendTabJoin"));
  setHtml("createRoomButton", t("createRoomButton"));
  const friendHelp = document.querySelector("#createRoomPanel .friend-help");
  if (friendHelp) friendHelp.textContent = t("friendHelp");
  const labels = document.querySelectorAll(".friend-label");
  if (labels[0]) labels[0].textContent = t("roomCodeLabel");
  if (labels[1]) labels[1].textContent = t("ownRoomCodeLabel");
  setText("joinRoomButton", t("joinRoomButton"));
  setText("copyRoomButton", t("copyButton"));
  setHtml("readyButton", t("readyButton"));
  const readyCards = document.querySelectorAll(".ready-card span");
  if (readyCards[0]) readyCards[0].textContent = t("youLabel");
  if (readyCards[1]) readyCards[1].textContent = t("friendLabel");
  if (onlineStatus && onlineStatus.textContent === "Velg Lag rom eller Bli med.") onlineStatus.textContent = t("onlineStatusStart");
  const soundBtn = document.getElementById("soundButton");
  if (soundBtn) soundBtn.textContent = soundEnabled ? t("soundOn") : t("soundOff");

  // V12: Oppdater alle nye customizer-tekster når språk byttes.
  setHtml("customizeButton", t("customizeButton"));
  setText("customizeKicker", t("customizeKicker"));
  setText("customizeTitle", t("customizeTitle"));
  setText("customizeSubtitle", t("customizeSubtitle"));
  setText("customizeEmojiTitle", t("customizeEmojiTitle"));
  setText("customizeImageTitle", t("customizeImageTitle"));
  setText("clearAvatarButton", t("clearAvatarButton"));
  setText("avatarNote", t("avatarNote"));
  setText("customizeEnemyTitle", t("customizeEnemyTitle"));
  setText("randomEnemyLabel", t("randomEnemyLabel"));
  setText("customizeMusicTitle", t("customizeMusicTitle"));
  setHtml("previewMusicButton", t("previewMusicButton"));
  setHtml("saveCustomizeButton", t("saveCustomizeButton"));
  const musicSelect = document.getElementById("musicSelect");
  if (musicSelect) {
    const selectedMusicValue = musicSelect.value || selectedMusicTrack || "theme";
    const musicLabels = { theme: t("musicTheme"), happy: t("musicHappy"), turbo: t("musicTurbo"), chill: t("musicChill"), boss: t("musicBoss") };
    Array.from(musicSelect.options).forEach(option => {
      if (musicLabels[option.value]) option.textContent = musicLabels[option.value];
    });
    musicSelect.value = selectedMusicValue;
  }

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
    setOnlineStatus(createIsActive ? t("createRoomButton") : t("roomCodeLabel"));
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
    ? t("onlineStatusStart")
    : "Firebase kobler til ... Last siden på nytt hvis dette ikke endrer seg."
  );
}

function closeFriendLobby() {
  if (friendModal && typeof friendModal.close === "function") friendModal.close();
  else if (friendModal) friendModal.removeAttribute("open");
}

async function createFriendRoom() {
  // Stabil room creation:
  // 1) Finn ledig kode
  // 2) Skriv rommet til Firebase
  // 3) Les rommet tilbake via både SDK/REST før koden vises
  setOnlineStatus("Lager romkode ...");
  if (createRoomButton) createRoomButton.disabled = true;

  try {
    const ready = await waitForFirebase();
    if (!ready) {
      setOnlineStatus("Firebase ble ikke klar. Last siden på nytt og sjekk internett.");
      alert("Firebase er ikke klar. Last siden på nytt og prøv igjen.");
      return;
    }

    const fb = window.FirebaseGame;
    let savedRoomCode = generateRoomCode();

    for (let attempts = 0; attempts < 12; attempts++) {
      const existing = await restGet(roomPath(savedRoomCode));
      if (!existing) break;
      savedRoomCode = generateRoomCode();
    }

    const now = Date.now();
    const roomData = {
      code: savedRoomCode,
      createdAt: now,
      updatedAt: now,
      status: "waiting",
      hostId: playerId,
      createdFromUrl: window.location.href,
      players: {
        p1: {
          id: playerId,
          slot: "p1",
          ready: false,
          connected: true,
          x: levels[0].player.x,
          y: levels[0].player.y,
          score: 0,
          lives: 3,
          avatarEmoji: selectedPlayerEmoji,
          avatarImage: selectedPlayerImage,
          joinedAt: now,
          updatedAt: now
        }
      }
    };

    setOnlineStatus("Lagrer rommet i Firebase ...");

    // REST først gjør at rommet er synlig fra andre enheter med en gang.
    await restPut(roomPath(savedRoomCode), roomData);

    // SDK set i tillegg, slik at onValue/listeners får helt samme datastruktur.
    const newRoomRef = fb.ref(fb.database, roomPath(savedRoomCode));
    await fb.set(newRoomRef, roomData);

    // Verifiser via REST. Dette er samme sti mobilen leser fra.
    const verifiedRoom = await restGet(roomPath(savedRoomCode));
    if (!verifiedRoom || verifiedRoom.code !== savedRoomCode) {
      throw new Error("Rommet ble ikke verifisert etter lagring.");
    }

    roomCode = savedRoomCode;
    playerSlot = "p1";
    onlineMode = true;
    showRoomInfo();

    try {
      fb.onDisconnect(fb.ref(fb.database, `${roomPath(roomCode)}/players/p1/connected`)).set(false);
    } catch (error) {
      console.log("onDisconnect kunne ikke settes:", error);
    }

    listenToRoom();
    setOnlineStatus(`Rommet er lagret i Firebase ✅ Kode: ${roomCode}. Hold denne siden åpen og send koden til vennen din.`);
  } catch (error) {
    console.error("Kunne ikke lage rom:", error);
    setOnlineStatus("Kunne ikke lage rom. Sjekk Firebase Rules/Test mode og prøv igjen.");
    alert("Kunne ikke lage rom. Sjekk Firebase Rules, internett og at databaseURL er riktig.");
  } finally {
    if (createRoomButton) createRoomButton.disabled = false;
  }
}

async function waitForRoomSnapshot(roomRef, code, maxAttempts = 12) {
  // iOS/Safari og GitHub Pages kan av og til bruke litt tid etter oppdatering/cache.
  // Derfor prøver vi flere ganger før vi sier at rommet ikke finnes.
  const fb = window.FirebaseGame;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const snapshot = await fb.get(roomRef);
    if (snapshot.exists()) return snapshot;
    setOnlineStatus(`Søker etter rom ${code} ... forsøk ${attempt}/${maxAttempts}`);
    await new Promise(resolve => setTimeout(resolve, 550));
  }
  return null;
}

async function joinFriendRoom() {
  if (joinInProgress) return;
  joinInProgress = true;
  if (joinRoomButton) joinRoomButton.disabled = true;
  setOnlineStatus("Kobler til rommet ...");

  try {
    const ready = await waitForFirebase();
    if (!ready) {
      setOnlineStatus("Firebase er ikke klar. Last siden på nytt og prøv igjen.");
      alert("Firebase er ikke klar. Last siden på nytt og prøv igjen.");
      return;
    }

    const fb = window.FirebaseGame;
    const typedCode = normalizeRoomCode(roomCodeInput ? roomCodeInput.value : "");
    if (!typedCode || typedCode.length < 6) {
      setOnlineStatus("Skriv inn hele romkoden på 6 tegn.");
      alert("Skriv inn hele romkoden først.");
      return;
    }

    const roomRef = fb.ref(fb.database, roomPath(typedCode));

    // Først prøver vi SDK flere ganger. Hvis SDK ikke ser rommet, prøver vi REST direkte.
    let roomCheck = await waitForRoomSnapshot(roomRef, typedCode, 6);
    let currentRoom = roomCheck && roomCheck.exists() ? roomCheck.val() : null;

    if (!currentRoom) {
      setOnlineStatus(`SDK fant ikke ${typedCode}. Prøver direkte database-lesing ...`);
      for (let attempt = 1; attempt <= 8; attempt++) {
        currentRoom = await restGet(roomPath(typedCode));
        if (currentRoom) break;
        setOnlineStatus(`Søker direkte etter rom ${typedCode} ... forsøk ${attempt}/8`);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    if (!currentRoom) {
      setOnlineStatus(`Fant ikke rommet ${typedCode}. Lag ny kode på PC-en og vent til det står lagret i Firebase.`);
      alert(`Fant ikke rommet ${typedCode}. Sjekk at du skrev riktig kode, og se i Firebase → Realtime Database → Data → rooms om koden finnes.`);
      return;
    }

    const now = Date.now();
    const players = currentRoom.players || {};

    if (players.p1 && players.p1.id === playerId) {
      playerSlot = "p1";
    } else if (players.p2 && players.p2.id === playerId) {
      playerSlot = "p2";
    } else if (!players.p1) {
      playerSlot = "p1";
    } else if (!players.p2) {
      playerSlot = "p2";
    } else {
      setOnlineStatus("Rommet har allerede to spillere.");
      alert("Rommet har allerede to spillere.");
      return;
    }

    const startPos = playerSlot === "p2" ? { x: 11, y: 9 } : levels[0].player;
    const playerData = {
      id: playerId,
      slot: playerSlot,
      ready: false,
      connected: true,
      x: startPos.x,
      y: startPos.y,
      score: 0,
      lives: 3,
      avatarEmoji: selectedPlayerEmoji,
      avatarImage: selectedPlayerImage,
      joinedAt: players[playerSlot]?.joinedAt || now,
      updatedAt: now
    };

    // Oppdater via REST og SDK. Dette gir best kompatibilitet på iOS/GitHub Pages.
    await restPatch(`${roomPath(typedCode)}/players/${playerSlot}`, playerData);
    await restPatch(roomPath(typedCode), { updatedAt: now, lastJoinSlot: playerSlot });
    await fb.update(fb.ref(fb.database, `${roomPath(typedCode)}/players/${playerSlot}`), playerData);
    await fb.update(roomRef, { updatedAt: now, lastJoinSlot: playerSlot });

    roomCode = typedCode;
    onlineMode = true;

    try {
      fb.onDisconnect(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}/connected`)).set(false);
    } catch (error) {
      console.log("onDisconnect kunne ikke settes:", error);
    }

    showRoomInfo();
    listenToRoom();
    setOnlineStatus(`Du er koblet til som ${playerSlot === "p1" ? "Spiller 1" : "Spiller 2"}. Trykk klar når du er klar.`);
  } catch (error) {
    console.error("Kunne ikke bli med i rom:", error);
    setOnlineStatus("Kunne ikke bli med i rommet. Sjekk Firebase Rules og internett.");
    alert("Kunne ikke bli med i rommet. Sjekk F12/Console for feilmelding.");
  } finally {
    joinInProgress = false;
    if (joinRoomButton) joinRoomButton.disabled = false;
  }
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
  await fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`), {
    ready: true,
    connected: true,
    updatedAt: Date.now()
  });
  setOnlineStatus(`${t("readyButton")} ${t("waitingFriend")}`);
}

function updateReadyCards(selfPlayer, otherPlayer) {
  if (readySelf) {
    if (!selfPlayer) readySelf.textContent = t("connecting");
    else readySelf.textContent = selfPlayer.ready ? "Klar ✅" : t("notReady");
  }
  if (readyOther) {
    if (!otherPlayer) readyOther.textContent = t("waitingFriend");
    else if (otherPlayer.connected === false) readyOther.textContent = t("disconnected");
    else readyOther.textContent = otherPlayer.ready ? "Klar ✅" : t("notReady");
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

    applyRoomState(room);

    const players = room.players || {};
    const p1 = players.p1;
    const p2 = players.p2;

    if (p1 && p2 && p1.ready && p2.ready && room.status === "waiting") {
      await fb.runTransaction(fb.ref(fb.database, roomPath(roomCode)), currentRoom => {
        if (!currentRoom || currentRoom.status !== "waiting") return currentRoom;
        const cp1 = currentRoom.players && currentRoom.players.p1;
        const cp2 = currentRoom.players && currentRoom.players.p2;
        if (cp1 && cp2 && cp1.ready && cp2.ready) {
          currentRoom.status = "running";
          currentRoom.startedAt = Date.now();
          currentRoom.updatedAt = Date.now();
        }
        return currentRoom;
      });
    }
  });

  // Ekstra sikkerhet: direkte REST-polling gjør at live-posisjon fungerer også i Safari/iOS
  // hvis Firebase SDK-listeneren blir treg eller ikke fyrer på små posisjonsendringer.
  startRoomPolling();
}

function detachRoomListener() {
  if (roomListenerOff) {
    roomListenerOff();
    roomListenerOff = null;
  }
  stopRoomPolling();
}

function applyRoomState(room) {
  // Felles funksjon brukt både av Firebase onValue og REST polling.
  // Dette gjør at posisjonene oppdateres på PC, iOS/Safari og GitHub Pages selv hvis én av metodene henger.
  if (!room || !room.players || !playerSlot) return;

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
    if (p1 && p2) setOnlineStatus(`Begge er koblet til. Spiller 1: ${p1Status} | Spiller 2: ${p2Status}`);
    else setOnlineStatus(`Venter på to spillere. Spiller 1: ${p1Status} | Spiller 2: ${p2Status}`);
  }

  if (room.status === "running" && !gameRunning) {
    setOnlineStatus("Begge er klare ✅ Starter kamp ...");
    closeFriendLobby();
    startOnlineGame();
    return;
  }

  if (onlineMode && gameRunning) {
    const fingerprint = otherPlayer ? `${otherSlot}:${otherPlayer.x},${otherPlayer.y}:${otherPlayer.score}:${otherPlayer.lives}:${otherPlayer.updatedAt}:${otherPlayer.avatarEmoji || ""}` : "none";
    if (fingerprint !== lastRemoteFingerprint) {
      lastRemoteFingerprint = fingerprint;
      drawGame();
    }
  }
}

function startRoomPolling() {
  stopRoomPolling();
  if (!roomCode) return;
  roomPollTimer = setInterval(async () => {
    if (!onlineMode || !roomCode) return;
    try {
      const room = await restGet(roomPath(roomCode));
      applyRoomState(room);
    } catch (error) {
      console.log("REST polling feilet:", error);
    }
  }, 350);
}

function stopRoomPolling() {
  if (roomPollTimer) clearInterval(roomPollTimer);
  roomPollTimer = null;
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
  if (!onlineMode || !roomCode || !playerSlot) return;

  const now = Date.now();
  const payload = {
    x: player.x,
    y: player.y,
    score,
    lives,
    level: levelIndex + 1,
    avatarEmoji: selectedPlayerEmoji,
    avatarImage: selectedPlayerImage,
    connected: true,
    updatedAt: now
  };

  // Throttle litt slik at vi ikke spammer Firebase ved raske tastetrykk/swipe,
  // men fortsatt føles sanntid. Hvis spilleren trykker raskt, sendes siste posisjon rett etterpå.
  const elapsed = now - lastOnlineSyncAt;
  if (elapsed < 90) {
    clearTimeout(pendingOnlineSync);
    pendingOnlineSync = setTimeout(() => syncOnlinePlayer(), 95 - elapsed);
    return;
  }
  lastOnlineSyncAt = now;

  try {
    // REST først: dette er samme database-sti som den andre enheten poller fra.
    await restPatch(`${roomPath(roomCode)}/players/${playerSlot}`, payload);
  } catch (error) {
    console.log("REST sync feilet:", error);
  }

  try {
    if (firebaseReady()) {
      const fb = window.FirebaseGame;
      await fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/players/${playerSlot}`), payload);
    }
  } catch (error) {
    console.log("SDK sync feilet:", error);
  }
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
    if (roomCodeInput.value.length === 6 && !joinInProgress) {
      setOnlineStatus("Kode fylt inn. Trykk Bli med for å koble til rommet.");
    }
  });
  roomCodeInput.addEventListener("keydown", event => {
    if (event.key === "Enter") joinFriendRoom();
  });
}


function installDeviceCompatibility() {
  // V6: iOS/Safari-safe. Ikke lås hele siden globalt.
  // Vi stopper bare scroll/zoom når fingeren er på selve spillet eller pilknappene.
  const setRealViewportHeight = () => {
    document.documentElement.style.setProperty("--real-vh", `${window.innerHeight * 0.01}px`);
  };

  setRealViewportHeight();
  window.addEventListener("resize", setRealViewportHeight, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(setRealViewportHeight, 250), { passive: true });

  const preventGameGesture = event => {
    if (event.target.closest("#game, #game-wrapper, .controls")) {
      event.preventDefault();
    }
  };
  document.addEventListener("touchmove", preventGameGesture, { passive: false });

  document.querySelectorAll(".move-btn").forEach(button => {
    const dx = Number(button.dataset.dx || 0);
    const dy = Number(button.dataset.dy || 0);
    const move = event => {
      event.preventDefault();
      event.stopPropagation();
      movePlayer(dx, dy);
    };

    // Ikke registrer både pointerdown og touchstart på samme iPhone.
    // Det kunne gi dobbeltbevegelse/kaos i Safari.
    if (window.PointerEvent) {
      button.addEventListener("pointerdown", move, { passive: false });
    } else {
      button.addEventListener("touchstart", move, { passive: false });
    }
    button.addEventListener("click", move, { passive: false });
  });

  // Swipe direkte på brettet: mye bedre på iPhone enn å bare bruke små piler.
  let startX = 0;
  let startY = 0;
  let swipeStarted = false;
  if (game) {
    game.addEventListener("touchstart", event => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      swipeStarted = true;
    }, { passive: true });

    game.addEventListener("touchend", event => {
      if (!swipeStarted) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      swipeStarted = false;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
      event.preventDefault();
      if (Math.abs(dx) > Math.abs(dy)) movePlayer(dx > 0 ? 1 : -1, 0);
      else movePlayer(0, dy > 0 ? 1 : -1);
    }, { passive: false });
  }

  // Dobbeltrykk skal ikke zoome på iPhone mens man trykker raskt i spillet.
  let lastTouchEnd = 0;
  document.addEventListener("touchend", event => {
    const now = Date.now();
    if (now - lastTouchEnd <= 320 && event.target.closest(".controls, #game-wrapper, button")) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

// Liten WebAudio-arcade-effekt. Safari tillater lyd først etter brukertrykk.
let v6AudioContext = null;
function v6Beep(freq = 440, duration = 0.08, type = "square", gainValue = 0.035) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    v6AudioContext = v6AudioContext || new AudioCtx();
    if (v6AudioContext.state === "suspended") v6AudioContext.resume();
    const osc = v6AudioContext.createOscillator();
    const gain = v6AudioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(v6AudioContext.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, v6AudioContext.currentTime + duration);
    osc.stop(v6AudioContext.currentTime + duration);
  } catch (_) {}
}
function v6HypeSound() {
  [392, 523, 659, 784].forEach((f, i) => setTimeout(() => v6Beep(f, 0.07, "square", 0.035), i * 70));
}

const v6OriginalStartGame = startGame;
startGame = function() {
  v6HypeSound();
  return v6OriginalStartGame.apply(this, arguments);
};


// -----------------------------
// V11 Customizer: emoji, eget bilde, fiender og playlist
// -----------------------------
function getEnemyFace() {
  if (!randomEnemyEmojis) return "👾";
  return enemyEmojiPool[Math.floor(Math.random() * enemyEmojiPool.length)];
}

function applyAvatarToCell(cell, emoji, imageData) {
  if (!cell) return;
  if (imageData) {
    cell.classList.add("has-avatar");
    cell.style.backgroundImage = `url(${imageData})`;
    cell.removeAttribute("data-emoji");
  } else {
    cell.classList.remove("has-avatar");
    cell.style.backgroundImage = "";
    cell.dataset.emoji = emoji || "😄";
  }
}

function showCustomizeModal() {
  const modal = document.getElementById("customizeModal");
  updateCustomizerUi();
  if (modal && typeof modal.showModal === "function") modal.showModal();
  else if (modal) modal.setAttribute("open", "open");
  playSfx("select");
}

function closeCustomizeModal() {
  const modal = document.getElementById("customizeModal");
  if (modal && typeof modal.close === "function") modal.close();
  else if (modal) modal.removeAttribute("open");
  drawGame();
}

function setPlayerEmoji(emoji) {
  selectedPlayerEmoji = emoji;
  selectedPlayerImage = "";
  localStorage.setItem("ragiJoyPlayerEmoji", emoji);
  localStorage.removeItem("ragiJoyPlayerImage");
  updateCustomizerUi();
  drawGame();
  playSfx("select");
}

function handleAvatarUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Velg en bildefil.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    selectedPlayerImage = String(reader.result || "");
    localStorage.setItem("ragiJoyPlayerImage", selectedPlayerImage);
    updateCustomizerUi();
    drawGame();
    playSfx("level");
  };
  reader.readAsDataURL(file);
}

function clearAvatarImage() {
  selectedPlayerImage = "";
  localStorage.removeItem("ragiJoyPlayerImage");
  updateCustomizerUi();
  drawGame();
  playSfx("select");
}

function toggleRandomEnemies(value) {
  randomEnemyEmojis = Boolean(value);
  localStorage.setItem("ragiJoyRandomEnemies", randomEnemyEmojis ? "on" : "off");
  enemies.forEach(enemy => enemy.face = getEnemyFace());
  drawGame();
  playSfx("enemy");
}

function setMusicTrack(track) {
  selectedMusicTrack = track || "theme";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  if (gameRunning && soundEnabled) startMusic();
  playSfx("select");
}

function previewMusicTrack() {
  const previousRunning = gameRunning;
  const select = document.getElementById("musicSelect");
  if (select) setMusicTrack(select.value);
  soundEnabled = true;
  localStorage.setItem("ragiJoySound", "on");
  const btn = document.getElementById("soundButton");
  if (btn) btn.textContent = t("soundOn");
  const track = musicTracks[selectedMusicTrack === "theme" ? "happy" : selectedMusicTrack] || musicTracks.happy;
  track.slice(0, 8).forEach((freq, i) => setTimeout(() => tone(freq, 0.07, i % 2 ? "triangle" : "square", 0.03), i * 95));
  if (previousRunning) startMusic();
}

function updateCustomizerUi() {
  const preview = document.getElementById("avatarPreview");
  if (preview) {
    preview.textContent = selectedPlayerImage ? "" : selectedPlayerEmoji;
    preview.style.backgroundImage = selectedPlayerImage ? `url(${selectedPlayerImage})` : "";
  }
  document.querySelectorAll("#playerEmojiGrid button").forEach(btn => {
    btn.classList.toggle("active-choice", btn.textContent.trim() === selectedPlayerEmoji && !selectedPlayerImage);
  });
  const randomToggle = document.getElementById("randomEnemyToggle");
  if (randomToggle) randomToggle.checked = randomEnemyEmojis;
  const musicSelect = document.getElementById("musicSelect");
  if (musicSelect) musicSelect.value = selectedMusicTrack;
}

// Tegner første level bak startskjermen slik at spillet ser levende ut før start.
installDeviceCompatibility();
highscoreText.textContent = highscore;
setDifficulty(selectedDifficulty);
const soundBtn = document.getElementById("soundButton");
if (soundBtn) soundBtn.textContent = soundEnabled ? t("soundOn") : t("soundOff");
loadLevel(0);
gameRunning = false;
applyLanguage();
updateCustomizerUi();
clearInterval(enemyTimer);
