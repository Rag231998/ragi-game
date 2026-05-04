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

/* --------------------------------------------------------------------------
   V26 EXTENDED LEVEL SYSTEM
   Base game had 10 hand-made maps. This expands the campaign to 80 levels.
   The first 10 are original. The rest reuse safe 13x11 maze skeletons with
   new names, themes, enemy sets, power-up placement and gradually increasing pace.
   Multiplayer core is not touched here.
-------------------------------------------------------------------------- */
const LEVEL_TARGET_COUNT = 80;
const v26LevelNames = [
  "Neon Sprint", "Candy Loop", "Electric Alley", "Sunset Ring", "Ocean Dash",
  "Forest Rush", "Lava Lock", "Purple Pulse", "Rocket Grid", "Fiesta Gate",
  "Diamond Drift", "Turbo Bloom", "Pixel Plaza", "Cosmic Curve", "Boss Garden",
  "Lightning Lane", "Emoji Vault", "Golden Circuit", "Crystal Fever", "Night Run"
];
const v26ThemeCycle = ["neon", "candy", "electric", "sunset", "ocean", "forest", "lava", "purple", "rocket", "fiesta"];

function v26CloneLevel(base, index) {
  const rows = base.map.map(row => row.split(""));
  // Vary power-ups/shields without breaking walls or player/enemy spawn areas.
  const safeSpots = [[3,3], [9,3], [6,5], [3,7], [9,7], [1,9], [11,1], [11,9]];
  safeSpots.forEach(([x, y], spotIndex) => {
    if (!rows[y] || rows[y][x] === "1") return;
    if ((index + spotIndex) % 9 === 0) rows[y][x] = "3";
    else if ((index + spotIndex) % 13 === 0) rows[y][x] = "4";
    else if (rows[y][x] === "0") rows[y][x] = "2";
  });

  const enemyCount = Math.min(5, 1 + Math.floor(index / 12));
  const enemySeeds = [
    { x: 11, y: 9 }, { x: 11, y: 1 }, { x: 1, y: 9 }, { x: 6, y: 5 }, { x: 6, y: 1 }
  ];
  return {
    name: `${v26LevelNames[index % v26LevelNames.length]} ${index + 1}`,
    theme: v26ThemeCycle[index % v26ThemeCycle.length],
    speed: Math.max(390, 610 - index * 3),
    enemies: enemySeeds.slice(0, enemyCount).map(enemy => ({ ...enemy })),
    player: { ...(base.player || { x: 1, y: 1 }) },
    map: rows.map(row => row.join(""))
  };
}

function v26ExpandLevels() {
  const baseLevels = levels.map(level => ({
    ...level,
    enemies: level.enemies.map(enemy => ({ ...enemy })),
    player: { ...level.player },
    map: level.map.slice()
  }));
  for (let i = levels.length; i < LEVEL_TARGET_COUNT; i++) {
    levels.push(v26CloneLevel(baseLevels[i % baseLevels.length], i));
  }
}
v26ExpandLevels();

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
let musicVolume = Math.max(0, Math.min(1, Number(localStorage.getItem("ragiJoyMusicVolume") || "0.65")));
let uploadedMusicFiles = [];
let uploadedMusicIndex = 0;
let uploadedMusicUrl = "";
let uploadedMusicAudio = null;
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

/* --------------------------------------------------------------------------
   V31 ENEMY VARIATION
   Enemy count and spawn points now vary every time a level is loaded.
   This is intentionally kept separate from multiplayer core. Host/P1 will sync
   the active enemy positions to P2 through the existing multiplayer code.
-------------------------------------------------------------------------- */
function randomInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffleArray(items) {
  const array = items.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function distanceBetween(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getEnemyCountRangeForLevel(index) {
  const levelNumber = index + 1;
  const difficultyKey = selectedDifficulty || "normal";
  const lateBonus = Math.floor(Math.max(0, levelNumber - 1) / 15);

  const ranges = {
    easy:    { min: 1, max: Math.min(3, 2 + lateBonus) },
    normal:  { min: 1, max: Math.min(4, 3 + lateBonus) },
    hard:    { min: 2, max: Math.min(5, 3 + lateBonus) },
    extreme: { min: 2, max: Math.min(6, 4 + lateBonus) }
  };

  const range = ranges[difficultyKey] || ranges.normal;
  return { min: range.min, max: Math.max(range.min, range.max) };
}

function getWalkableEnemySpots(level) {
  const spots = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];
      if (tile === TILE.WALL || tile === TILE.PORTAL) continue;
      const pos = { x, y };
      if (distanceBetween(pos, player) < 5) continue; // do not spawn on top of the player
      spots.push(pos);
    }
  }

  // Keep original designed enemy spawns as preferred candidates when they are valid.
  const designed = (level.enemies || [])
    .filter(enemy => map[enemy.y] && map[enemy.y][enemy.x] !== TILE.WALL)
    .map(enemy => ({ x: enemy.x, y: enemy.y }));

  const unique = new Map();
  [...designed, ...spots].forEach(pos => unique.set(`${pos.x},${pos.y}`, pos));
  return Array.from(unique.values());
}

function buildRandomEnemySetForLevel(level, index) {
  const { min, max } = getEnemyCountRangeForLevel(index);
  const possibleSpots = shuffleArray(getWalkableEnemySpots(level));
  const wantedCount = Math.min(possibleSpots.length, randomInt(min, max));

  const picked = [];
  for (const spot of possibleSpots) {
    // Spread enemies a bit so they do not all spawn in one corner.
    if (picked.some(existing => distanceBetween(existing, spot) < 3)) continue;
    picked.push({ ...spot });
    if (picked.length >= wantedCount) break;
  }

  // Fallback: if the map is tight, fill remaining slots from any valid spot.
  for (const spot of possibleSpots) {
    if (picked.length >= wantedCount) break;
    if (picked.some(existing => existing.x === spot.x && existing.y === spot.y)) continue;
    picked.push({ ...spot });
  }

  return picked.map(enemy => ({
    x: enemy.x,
    y: enemy.y,
    startX: enemy.x,
    startY: enemy.y,
    face: getEnemyFace()
  }));
}

function loadLevel(index) {
  const level = levels[index];
  map = cloneMap(level.map);
  player = { ...level.player };
  enemies = buildRandomEnemySetForLevel(level, index);
  applyLevelTheme(level);
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

  if (selectedMusicTrack === "uploaded" && uploadedMusicFiles.length > 0) {
    playUploadedMusic(uploadedMusicIndex);
    return;
  }

  const currentTheme = (levels[levelIndex] && levels[levelIndex].theme) || "neon";
  const trackName = selectedMusicTrack === "theme" ? currentTheme : selectedMusicTrack;
  const track = musicTracks[trackName] || musicTracks[currentTheme] || musicTracks.neon;
  musicStep = 0;
  musicTimer = setInterval(() => {
    if (!gameRunning || paused || !soundEnabled) return;
    const freq = track[musicStep % track.length];
    tone(freq, 0.045, "triangle", 0.018 * musicVolume);
    // Small bass pulse every few beats for more arcade energy without external audio files.
    if (musicStep % 4 === 0) tone(Math.max(95, freq / 3), 0.055, "sine", 0.012 * musicVolume);
    musicStep++;
  }, 390);
}

function stopUploadedMusic() {
  if (uploadedMusicAudio) {
    uploadedMusicAudio.pause();
    uploadedMusicAudio.onended = null;
    uploadedMusicAudio = null;
  }
  if (uploadedMusicUrl) {
    URL.revokeObjectURL(uploadedMusicUrl);
    uploadedMusicUrl = "";
  }
}

function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  stopUploadedMusic();
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

/* --------------------------------------------------------------------------
   V18 STABLE ADD-ON
   Ikke rør multiplayer-kjernen over uten ny full test på PC + iOS + GitHub.
   Denne blokken legger bare til:
   1) Tilbake til hovedmeny etter kamp.
   2) Highscore per vanskelighetsgrad som vises i startboksen ved hver lasting.
   -------------------------------------------------------------------------- */

Object.assign(translations.no, {
  bestLabel: "Best",
  mainMenuButton: "🏠 Hovedmeny",
  playAgainButton: "🔁 Spill igjen",
  endSummaryWin: "Konge! Du fullførte kampen.",
  endSummaryLose: "Du er tom for liv. Prøv igjen eller gå tilbake til hovedmenyen.",
  newDifficultyRecord: "Ny rekord på denne vanskelighetsgraden! 🔥"
});

Object.assign(translations.en, {
  bestLabel: "Best",
  mainMenuButton: "🏠 Main menu",
  playAgainButton: "🔁 Play again",
  endSummaryWin: "Nice! You cleared the match.",
  endSummaryLose: "You are out of lives. Try again or go back to the main menu.",
  newDifficultyRecord: "New record on this difficulty! 🔥"
});

const DIFFICULTY_BEST_KEY = "ragiJoyBestByDifficulty";

function loadDifficultyBests() {
  try {
    const stored = JSON.parse(localStorage.getItem(DIFFICULTY_BEST_KEY) || "{}");
    const normalized = { easy: 0, normal: 0, hard: 0, extreme: 0, ...stored };

    // Migrerer gammel global highscore til normal én gang, så boksen ikke blir tom etter oppdatering.
    const oldGlobal = Number(localStorage.getItem("ragiJoyHighscore")) || 0;
    if (!localStorage.getItem(DIFFICULTY_BEST_KEY) && oldGlobal > normalized.normal) {
      normalized.normal = oldGlobal;
      localStorage.setItem(DIFFICULTY_BEST_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (error) {
    return { easy: 0, normal: 0, hard: 0, extreme: 0 };
  }
}

function saveDifficultyBests(bests) {
  localStorage.setItem(DIFFICULTY_BEST_KEY, JSON.stringify(bests));
}

function getDifficultyBest(mode = selectedDifficulty) {
  const bests = loadDifficultyBests();
  return Number(bests[mode]) || 0;
}

function saveDifficultyBest(mode, value) {
  const bests = loadDifficultyBests();
  const current = Number(bests[mode]) || 0;
  if (value > current) {
    bests[mode] = value;
    saveDifficultyBests(bests);
    return true;
  }
  return false;
}

function updateCurrentHighscoreHud() {
  if (highscoreText) {
    highscoreText.textContent = getDifficultyBest(selectedDifficulty);
  }
}

function updateDifficultyScoreBadges() {
  const bests = loadDifficultyBests();
  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    const mode = btn.dataset.difficulty;
    const setting = difficultySettings[mode];
    if (!setting) return;
    const label = t(setting.labelKey);
    const best = Number(bests[mode]) || 0;
    btn.innerHTML = `
      <span class="difficulty-main">${label}</span>
      <span class="difficulty-best">${t("bestLabel")}: ${best}</span>
    `;
  });
  updateCurrentHighscoreHud();
}

const v18OriginalDrawGame = drawGame;
drawGame = function() {
  v18OriginalDrawGame();
  updateCurrentHighscoreHud();
};

const v18OriginalApplyLanguage = applyLanguage;
applyLanguage = function() {
  v18OriginalApplyLanguage();
  const mainMenuButton = document.getElementById("mainMenuButton");
  if (mainMenuButton) mainMenuButton.textContent = t("mainMenuButton");
  const restartButton = document.getElementById("restartButton");
  if (restartButton) restartButton.textContent = t("playAgainButton");
  updateDifficultyScoreBadges();
};

const v18OriginalSetDifficulty = setDifficulty;
setDifficulty = function(mode) {
  v18OriginalSetDifficulty(mode);
  updateDifficultyScoreBadges();
};

const v18OriginalEndGame = endGame;
endGame = function(won) {
  const newDifficultyRecord = saveDifficultyBest(selectedDifficulty, score);
  v18OriginalEndGame(won);
  updateDifficultyScoreBadges();

  const endSummary = document.getElementById("endSummary");
  if (endSummary) {
    endSummary.textContent = newDifficultyRecord
      ? t("newDifficultyRecord")
      : (won ? t("endSummaryWin") : t("endSummaryLose"));
  }

  if (finalHighscore) finalHighscore.textContent = getDifficultyBest(selectedDifficulty);
  const mainMenuButton = document.getElementById("mainMenuButton");
  if (mainMenuButton) mainMenuButton.textContent = t("mainMenuButton");
  const restartButton = document.getElementById("restartButton");
  if (restartButton) restartButton.textContent = t("playAgainButton");
};

function goToMainMenu() {
  clearInterval(enemyTimer);
  clearTimeout(powerTimer);
  stopMusic();
  detachRoomListener();

  onlineMode = false;
  remotePlayer = null;
  roomCode = "";
  playerSlot = null;
  gameRunning = false;
  paused = false;
  powerMode = false;
  shield = false;
  combo = 1;
  score = 0;
  levelIndex = 0;
  lives = difficultySettings[selectedDifficulty].lives;

  endScreen.classList.add("hidden");
  levelScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  messageBar.textContent = t("messageStart");
  loadLevel(0);
  gameRunning = false;
  clearInterval(enemyTimer);
  drawGame();
  updateDifficultyScoreBadges();
}

// Sørger for at rekordene vises med en gang når siden åpnes.
updateDifficultyScoreBadges();
updateCurrentHighscoreHud();

/* --------------------------------------------------------------------------
   V19 MULTIPLAYER PERFORMANCE CORE — IKKE ENDRE UTEN FULL TEST
   Denne blokken erstatter den trege multiplayer-syncen uten å endre tema/design.

   Hvorfor:
   - Tidligere ble hele rommet REST-pollet ofte og rommet ble lest på nytt hele tiden.
   - Det ga unødvendig nettverkstrafikk, redraw og opplevd delay.
   - Nå skjer lokal bevegelse umiddelbart, og Firebase sender kun små spiller-patcher.

   Prinsipp:
   1) Lokal spiller beveger seg alltid først, uten await.
   2) Egen listener på motspillerens player-node, ikke hele rommet for hver posisjon.
   3) Remote spiller tegnes som smooth overlay med CSS transform, ikke ved full DOM-redraw.
   4) REST brukes bare som lavfrekvent sikkerhetsbackup/heartbeat, ikke som hovedmotor.
   -------------------------------------------------------------------------- */

let v19OtherPlayerListenerOff = null;
let v19SelfPlayerListenerOff = null;
let v19HeartbeatTimer = null;
let v19RestBackupTimer = null;
let v19LastMoveSentAt = 0;
let v19LastRestBackupAt = 0;
let v19SendTimer = null;
let v19MoveSeq = 0;
let v19RemoteLastSeenAt = 0;
let v19LastRemoteSeq = -1;
let v19BattlePanel = null;
let v19RemoteOverlay = null;
let v19CountdownRunning = false;

function v19GetOtherSlot() {
  return playerSlot === "p1" ? "p2" : "p1";
}

function v19PlayerPath(slot = playerSlot) {
  if (!roomCode || !slot) return "";
  return `${roomPath(roomCode)}/players/${slot}`;
}

function v19Now() {
  return Date.now();
}

function v19SetText(el, text) {
  if (el) el.textContent = text;
}

function v19EnsureBattlePanel() {
  if (v19BattlePanel) return v19BattlePanel;
  const wrapper = document.getElementById("game-wrapper") || game?.parentElement;
  if (!wrapper) return null;

  const panel = document.createElement("section");
  panel.id = "onlineBattlePanel";
  panel.className = "online-battle-panel hidden";
  panel.innerHTML = `
    <div class="online-battle-card self">
      <span class="battle-label">DU</span>
      <strong id="battleSelfScore">0</strong>
      <small id="battleSelfMeta">❤️❤️❤️</small>
    </div>
    <div class="online-battle-mid">
      <strong>⚔️ DUELL</strong>
      <small id="battleSyncState">Realtime klar</small>
    </div>
    <div class="online-battle-card friend">
      <span class="battle-label">VENN</span>
      <strong id="battleFriendScore">0</strong>
      <small id="battleFriendMeta">venter</small>
    </div>
  `;
  wrapper.parentElement?.insertBefore(panel, wrapper);
  v19BattlePanel = panel;
  return panel;
}

function v19UpdateBattlePanel(other = remotePlayer) {
  const panel = v19EnsureBattlePanel();
  if (!panel) return;
  panel.classList.toggle("hidden", !onlineMode);
  if (!onlineMode) return;

  v19SetText(document.getElementById("battleSelfScore"), String(score || 0));
  v19SetText(document.getElementById("battleSelfMeta"), `${playerSlot || "?"} · ${"❤️".repeat(Math.max(0, lives || 0))}`);
  v19SetText(document.getElementById("battleFriendScore"), String(other?.score || 0));
  v19SetText(document.getElementById("battleFriendMeta"), other ? `${v19GetOtherSlot()} · ${"❤️".repeat(Math.max(0, other.lives || 0))}` : "venter");

  const age = v19RemoteLastSeenAt ? v19Now() - v19RemoteLastSeenAt : null;
  const syncText = !other
    ? "Venter på posisjon ..."
    : age < 1200
      ? "🟢 live"
      : age < 3500
        ? "🟡 treg sync"
        : "🔴 sjekk nett";
  v19SetText(document.getElementById("battleSyncState"), syncText);
}

function v19EnsureRemoteOverlay() {
  if (v19RemoteOverlay) return v19RemoteOverlay;
  const wrapper = document.getElementById("game-wrapper");
  if (!wrapper || !game) return null;
  if (getComputedStyle(wrapper).position === "static") wrapper.style.position = "relative";
  const marker = document.createElement("div");
  marker.id = "remotePlayerOverlay";
  marker.className = "remote-player-overlay hidden";
  marker.setAttribute("aria-hidden", "true");
  wrapper.appendChild(marker);
  v19RemoteOverlay = marker;
  return marker;
}

function v19RenderRemoteOverlay(other = remotePlayer) {
  const marker = v19EnsureRemoteOverlay();
  if (!marker || !game || !other || !onlineMode || !gameRunning) {
    if (marker) marker.classList.add("hidden");
    return;
  }

  const gridRect = game.getBoundingClientRect();
  const wrapperRect = marker.parentElement.getBoundingClientRect();
  const cols = map[0]?.length || 13;
  const rows = map.length || 11;
  const cellW = gridRect.width / cols;
  const cellH = gridRect.height / rows;
  const size = Math.min(cellW, cellH) * 0.86;
  const left = (gridRect.left - wrapperRect.left) + other.x * cellW + (cellW - size) / 2;
  const top = (gridRect.top - wrapperRect.top) + other.y * cellH + (cellH - size) / 2;

  marker.classList.remove("hidden");
  marker.style.width = `${size}px`;
  marker.style.height = `${size}px`;
  marker.style.transform = `translate3d(${left}px, ${top}px, 0)`;

  if (other.avatarImage) {
    marker.textContent = "";
    marker.style.backgroundImage = `url(${other.avatarImage})`;
    marker.classList.add("has-avatar");
  } else {
    marker.style.backgroundImage = "";
    marker.classList.remove("has-avatar");
    marker.textContent = other.avatarEmoji || "😎";
  }
}

function v19HideRemoteOverlay() {
  if (v19RemoteOverlay) v19RemoteOverlay.classList.add("hidden");
}

const v19BaseDrawGame = drawGame;
drawGame = function() {
  // Remote tegnes som overlay i V19. Da slipper vi full redraw bare fordi vennen flytter seg.
  const savedRemote = remotePlayer;
  if (onlineMode && savedRemote) remotePlayer = null;
  v19BaseDrawGame();
  remotePlayer = savedRemote;
  v19RenderRemoteOverlay(savedRemote);
  v19UpdateBattlePanel(savedRemote);
};

function v19BuildPlayerPayload(extra = {}) {
  return {
    id: playerId,
    slot: playerSlot,
    connected: true,
    ready: true,
    x: player.x,
    y: player.y,
    score,
    lives,
    level: levelIndex + 1,
    avatarEmoji: selectedPlayerEmoji,
    avatarImage: selectedPlayerImage,
    seq: ++v19MoveSeq,
    updatedAt: v19Now(),
    ...extra
  };
}

function v19SendPlayerPatch(payload, important = false) {
  if (!onlineMode || !roomCode || !playerSlot) return;

  const fb = window.FirebaseGame;
  if (firebaseReady() && fb) {
    fb.update(fb.ref(fb.database, v19PlayerPath()), payload).catch(error => {
      console.log("V19 SDK sync feilet:", error);
    });
  }

  // REST er bare backup. Ikke bruk REST på hvert tastetrykk, det var en viktig lagg-årsak.
  const now = v19Now();
  if (important || now - v19LastRestBackupAt > 2500) {
    v19LastRestBackupAt = now;
    restPatch(v19PlayerPath(), payload).catch(error => console.log("V19 REST backup feilet:", error));
  }
}

syncOnlinePlayer = function(important = false) {
  if (!onlineMode || !roomCode || !playerSlot) return;

  const now = v19Now();
  const payload = v19BuildPlayerPayload();
  const minInterval = important ? 0 : 42;
  const elapsed = now - v19LastMoveSentAt;

  if (elapsed < minInterval) {
    clearTimeout(v19SendTimer);
    v19SendTimer = setTimeout(() => {
      v19LastMoveSentAt = v19Now();
      v19SendPlayerPatch(v19BuildPlayerPayload(), false);
    }, minInterval - elapsed);
    return;
  }

  v19LastMoveSentAt = now;
  v19SendPlayerPatch(payload, important);
};

function v19DetachPlayerListeners() {
  if (v19OtherPlayerListenerOff) {
    v19OtherPlayerListenerOff();
    v19OtherPlayerListenerOff = null;
  }
  if (v19SelfPlayerListenerOff) {
    v19SelfPlayerListenerOff();
    v19SelfPlayerListenerOff = null;
  }
}

function v19AttachPlayerListeners() {
  if (!firebaseReady() || !roomCode || !playerSlot) return;
  const fb = window.FirebaseGame;
  const otherSlot = v19GetOtherSlot();
  v19DetachPlayerListeners();

  v19OtherPlayerListenerOff = fb.onValue(fb.ref(fb.database, `${roomPath(roomCode)}/players/${otherSlot}`), snapshot => {
    const other = snapshot.val();
    if (!other) {
      remotePlayer = null;
      v19UpdateBattlePanel(null);
      v19HideRemoteOverlay();
      return;
    }

    // Beskytter mot gamle snapshots som kommer ut av rekkefølge.
    if (typeof other.seq === "number" && other.seq < v19LastRemoteSeq) return;
    if (typeof other.seq === "number") v19LastRemoteSeq = other.seq;

    remotePlayer = other;
    v19RemoteLastSeenAt = v19Now();
    requestAnimationFrame(() => {
      v19RenderRemoteOverlay(other);
      v19UpdateBattlePanel(other);
    });
  });

  v19SelfPlayerListenerOff = fb.onValue(fb.ref(fb.database, v19PlayerPath()), snapshot => {
    const self = snapshot.val();
    updateReadyCards(self, remotePlayer);
  });
}

listenToRoom = function() {
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

    // Bare p1 får lov til å starte rommet. Da unngår vi at begge klienter kjører transaction samtidig.
    if (playerSlot === "p1" && p1 && p2 && p1.ready && p2.ready && room.status === "waiting") {
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

  v19AttachPlayerListeners();
  v19StartHeartbeat();
};

detachRoomListener = function() {
  if (roomListenerOff) {
    roomListenerOff();
    roomListenerOff = null;
  }
  v19DetachPlayerListeners();
  v19StopHeartbeat();
  stopRoomPolling();
  v19HideRemoteOverlay();
  if (v19BattlePanel) v19BattlePanel.classList.add("hidden");
};

// REST-polling av hele rommet var hovedårsaken til at V13/V14 kunne føles treg.
// Beholdes som funksjonsnavn for kompatibilitet, men gjør ingenting i V19.
startRoomPolling = function() {};
stopRoomPolling = function() {
  if (roomPollTimer) clearInterval(roomPollTimer);
  roomPollTimer = null;
};

function v19StartHeartbeat() {
  v19StopHeartbeat();
  v19HeartbeatTimer = setInterval(() => {
    if (!onlineMode || !roomCode || !playerSlot || !firebaseReady()) return;
    v19SendPlayerPatch({ connected: true, heartbeatAt: v19Now(), updatedAt: v19Now() }, false);
    v19UpdateBattlePanel(remotePlayer);
  }, 1500);

  // Sjeldnere REST backup slik at Safari/Edge likevel kan hente siste status hvis SDK dropper en event.
  v19RestBackupTimer = setInterval(() => {
    if (!onlineMode || !roomCode || !playerSlot) return;
    restGet(`${roomPath(roomCode)}/players/${v19GetOtherSlot()}`).then(other => {
      if (!other) return;
      remotePlayer = other;
      v19RemoteLastSeenAt = v19Now();
      v19RenderRemoteOverlay(other);
      v19UpdateBattlePanel(other);
    }).catch(() => {});
  }, 2500);
}

function v19StopHeartbeat() {
  if (v19HeartbeatTimer) clearInterval(v19HeartbeatTimer);
  if (v19RestBackupTimer) clearInterval(v19RestBackupTimer);
  v19HeartbeatTimer = null;
  v19RestBackupTimer = null;
}

applyRoomState = function(room) {
  if (!room || !room.players || !playerSlot) return;

  const players = room.players || {};
  const p1 = players.p1;
  const p2 = players.p2;
  const selfPlayer = players[playerSlot];
  const otherPlayer = players[v19GetOtherSlot()] || null;

  if (otherPlayer) {
    remotePlayer = otherPlayer;
    v19RemoteLastSeenAt = v19RemoteLastSeenAt || v19Now();
  }

  updateReadyCards(selfPlayer, otherPlayer);

  if (room.status !== "running") {
    const p1Status = p1 ? (p1.ready ? "klar ✅" : "ikke klar") : "venter";
    const p2Status = p2 ? (p2.ready ? "klar ✅" : "ikke klar") : "venter";
    if (p1 && p2) setOnlineStatus(`Begge er koblet til. Spiller 1: ${p1Status} | Spiller 2: ${p2Status}`);
    else setOnlineStatus(`Venter på to spillere. Spiller 1: ${p1Status} | Spiller 2: ${p2Status}`);
  }

  if (room.status === "running" && !gameRunning && !v19CountdownRunning) {
    v19CountdownRunning = true;
    setOnlineStatus("Begge er klare ✅ Starter kamp ...");
    closeFriendLobby();
    spawnCenterBurst("3... 2... 1... ⚔️");
    playSfx("start");
    setTimeout(() => {
      v19CountdownRunning = false;
      startOnlineGame();
    }, 650);
  }

  if (onlineMode && gameRunning) {
    v19RenderRemoteOverlay(remotePlayer);
    v19UpdateBattlePanel(remotePlayer);
  }
};

setPlayerReady = async function() {
  if (!firebaseReady() || !roomCode || !playerSlot) return;
  const fb = window.FirebaseGame;
  if (readyButton) {
    readyButton.disabled = true;
    readyButton.textContent = "Klar ✅";
  }
  if (readySelf) readySelf.textContent = "Klar ✅";
  setOnlineStatus("Du er klar ✅ Venter på venn ...");

  const readyPayload = {
    ready: true,
    connected: true,
    avatarEmoji: selectedPlayerEmoji,
    avatarImage: selectedPlayerImage,
    updatedAt: Date.now()
  };

  try {
    await Promise.allSettled([
      fb.update(fb.ref(fb.database, v19PlayerPath()), readyPayload),
      restPatch(v19PlayerPath(), readyPayload)
    ]);
  } catch (error) {
    console.log("V19 ready sync feilet:", error);
  }
};

const v19OriginalShowRoomInfo = showRoomInfo;
showRoomInfo = function() {
  v19OriginalShowRoomInfo();
  if (roomCodeDisplay) {
    roomCodeDisplay.value = roomCode || "";
    roomCodeDisplay.setAttribute("size", "8");
  }
  if (readyButton) {
    readyButton.disabled = false;
    readyButton.textContent = t("readyButton");
  }
};

const v19OriginalStartOnlineGame = startOnlineGame;
startOnlineGame = function() {
  v19OriginalStartOnlineGame();
  v19AttachPlayerListeners();
  v19EnsureBattlePanel();
  v19UpdateBattlePanel(remotePlayer);
  syncOnlinePlayer(true);
  spawnCenterBurst("⚔️ ONLINE DUELL!");
};

const v19OriginalMovePlayer = movePlayer;
movePlayer = function(dx, dy) {
  const beforeX = player.x;
  const beforeY = player.y;
  v19OriginalMovePlayer(dx, dy);
  if (onlineMode && gameRunning && (player.x !== beforeX || player.y !== beforeY)) {
    v19UpdateBattlePanel(remotePlayer);
    // Ekstra viktig patch rett etter faktisk posisjonsendring.
    syncOnlinePlayer(false);
  }
};

const v19OriginalCollectTile = collectTile;
collectTile = function(x, y) {
  const beforeScore = score;
  v19OriginalCollectTile(x, y);
  if (onlineMode && score !== beforeScore) syncOnlinePlayer(true);
};

const v19OriginalLoseLife = loseLife;
loseLife = function() {
  v19OriginalLoseLife();
  if (onlineMode) syncOnlinePlayer(true);
};

const v19OriginalGoToMainMenu = goToMainMenu;
goToMainMenu = function() {
  detachRoomListener();
  v19OriginalGoToMainMenu();
};

// Små visuelle konkurranse-effekter uten å endre temaet.
function v19FlashDuelPanel() {
  const panel = v19EnsureBattlePanel();
  if (!panel || panel.classList.contains("hidden")) return;
  panel.classList.remove("duel-pulse");
  void panel.offsetWidth;
  panel.classList.add("duel-pulse");
}

const v19OriginalSpawnPop = spawnPop;
spawnPop = function(text, x, y) {
  v19OriginalSpawnPop(text, x, y);
  if (onlineMode && (text === "💎" || text === "⚡" || text === "🛡️")) v19FlashDuelPanel();
};

window.addEventListener("resize", () => v19RenderRemoteOverlay(remotePlayer), { passive: true });
window.addEventListener("orientationchange", () => setTimeout(() => v19RenderRemoteOverlay(remotePlayer), 250), { passive: true });

// Oppdater panel raskt etter at V19 er lastet.
setTimeout(() => {
  v19EnsureBattlePanel();
  v19UpdateBattlePanel(remotePlayer);
}, 100);

/* --------------------------------------------------------------------------
   V20 MULTIPLAYER HOST STATE — IKKE ENDRE UTEN FULL TEST
   Dette gjør multiplayer mer forståelig:
   - P1 er host for fiendenes posisjon.
   - P2 flytter IKKE fiender lokalt/random lenger.
   - P2 mottar fiender fra Firebase og ser samme fare som P1.
   Dette fjerner mye av følelsen av at begge spiller hvert sitt forskjellige spill.
   -------------------------------------------------------------------------- */

let v20StateListenerOff = null;
let v20LastHostStateSentAt = 0;

function v20EnemySnapshot() {
  return enemies.map(enemy => ({
    x: enemy.x,
    y: enemy.y,
    startX: enemy.startX,
    startY: enemy.startY,
    face: enemy.face || "👾"
  }));
}

function v20ApplyEnemySnapshot(enemySnapshot) {
  if (!Array.isArray(enemySnapshot) || playerSlot === "p1") return;
  enemies = enemySnapshot.map((enemy, index) => ({
    ...(enemies[index] || {}),
    x: Number(enemy.x),
    y: Number(enemy.y),
    startX: Number(enemy.startX ?? enemy.x),
    startY: Number(enemy.startY ?? enemy.y),
    face: enemy.face || enemies[index]?.face || "👾"
  }));
  checkEnemyCollision();
  drawGame();
}

function v20SyncHostState(force = false) {
  if (!onlineMode || playerSlot !== "p1" || !roomCode || !firebaseReady()) return;
  const now = Date.now();
  if (!force && now - v20LastHostStateSentAt < 120) return;
  v20LastHostStateSentAt = now;

  const fb = window.FirebaseGame;
  const payload = {
    host: "p1",
    level: levelIndex + 1,
    enemies: v20EnemySnapshot(),
    powerMode,
    updatedAt: now
  };

  fb.update(fb.ref(fb.database, `${roomPath(roomCode)}/state`), payload).catch(error => {
    console.log("V20 host state SDK feilet:", error);
  });

  // Sjelden REST backup, ikke hovedmotor.
  if (force) restPatch(`${roomPath(roomCode)}/state`, payload).catch(() => {});
}

function v20AttachStateListener() {
  if (!firebaseReady() || !roomCode) return;
  if (v20StateListenerOff) {
    v20StateListenerOff();
    v20StateListenerOff = null;
  }
  const fb = window.FirebaseGame;
  v20StateListenerOff = fb.onValue(fb.ref(fb.database, `${roomPath(roomCode)}/state`), snapshot => {
    const state = snapshot.val();
    if (!state) return;
    v20ApplyEnemySnapshot(state.enemies);
  });
}

function v20DetachStateListener() {
  if (v20StateListenerOff) {
    v20StateListenerOff();
    v20StateListenerOff = null;
  }
}

const v20PreviousAttachPlayerListeners = v19AttachPlayerListeners;
v19AttachPlayerListeners = function() {
  v20PreviousAttachPlayerListeners();
  v20AttachStateListener();
};

const v20PreviousDetachRoomListener = detachRoomListener;
detachRoomListener = function() {
  v20DetachStateListener();
  v20PreviousDetachRoomListener();
};

const v20PreviousStartOnlineGame = startOnlineGame;
startOnlineGame = function() {
  v20PreviousStartOnlineGame();
  v20AttachStateListener();
  if (playerSlot === "p1") v20SyncHostState(true);
};

const v20PreviousMoveEnemies = moveEnemies;
moveEnemies = function() {
  // P2 skal ikke kjøre egen random fiende-AI i online. Det var en stor kilde til kaos.
  if (onlineMode && playerSlot === "p2") return;
  v20PreviousMoveEnemies();
  if (onlineMode && playerSlot === "p1") v20SyncHostState(false);
};

const v20PreviousMovePlayer = movePlayer;
movePlayer = function(dx, dy) {
  const oldX = player.x;
  const oldY = player.y;
  v20PreviousMovePlayer(dx, dy);
  if (onlineMode && playerSlot === "p1" && (player.x !== oldX || player.y !== oldY)) {
    // Hvis P1 spiser fiende/power/resetter fiende, skal P2 se det raskt.
    v20SyncHostState(true);
  }
};

const v20PreviousNextLevel = nextLevel;
nextLevel = function() {
  v20PreviousNextLevel();
  if (onlineMode && playerSlot === "p1") setTimeout(() => v20SyncHostState(true), 120);
};


/* --------------------------------------------------------------------------
   V21 GUI CLEANUP — IKKE LEGG TILBAKE "TRYKK START GAME" PÅ MENYEN
   Formål:
   - Meny viser oppsummering: rekord, valgt vanskelighet, figur og lyd.
   - Vanlig HUD/statuslinje vises bare når kampen faktisk kjører.
   - Egen "Hvordan spille"-popup gjør startsiden enklere for alle aldre.
   -------------------------------------------------------------------------- */
Object.assign(translations.no, {
  summaryBestLabel: "🏆 Best",
  summaryDifficultyLabel: "🎯 Vanskelighet",
  summaryAvatarLabel: "🎨 Figur",
  summarySoundLabel: "🔊 Lyd",
  summaryReady: "Klar",
  soundShortOn: "ON",
  soundShortOff: "OFF",
  howToButton: "❔ Hvordan spille",
  howToKicker: "QUICK GUIDE",
  howToTitle: "Slik spiller du",
  howToDiamonds: "Samle alle diamantene.",
  howToPower: "Ta power-up og spis fiender for bonus.",
  howToShield: "Skjold redder deg én gang.",
  howToPortal: "Portalen åpnes når brettet er tomt.",
  howToCombo: "Combo gir mer poeng.",
  howToOnline: "Multiplayer handler om å samle mer enn vennen din.",
  howToOkButton: "Skjønner ✅",
  scoreLabel: "Score",
  highscoreLabel: "Best",
  levelLabel: "Level",
  livesLabel: "Lives",
  comboLabel: "Combo"
});
Object.assign(translations.en, {
  summaryBestLabel: "🏆 Best",
  summaryDifficultyLabel: "🎯 Difficulty",
  summaryAvatarLabel: "🎨 Avatar",
  summarySoundLabel: "🔊 Sound",
  summaryReady: "Ready",
  soundShortOn: "ON",
  soundShortOff: "OFF",
  howToButton: "❔ How to play",
  howToKicker: "QUICK GUIDE",
  howToTitle: "How to play",
  howToDiamonds: "Collect all diamonds.",
  howToPower: "Grab power-up and eat enemies for bonus.",
  howToShield: "Shield saves you once.",
  howToPortal: "The portal opens when the board is empty.",
  howToCombo: "Combos give more points.",
  howToOnline: "Multiplayer is about collecting more than your friend.",
  howToOkButton: "Got it ✅",
  scoreLabel: "Score",
  highscoreLabel: "Best",
  levelLabel: "Level",
  livesLabel: "Lives",
  comboLabel: "Combo"
});

function v21SetUiMode(mode) {
  document.body.classList.toggle("menu-state", mode === "menu");
  document.body.classList.toggle("playing-state", mode !== "menu");
  if (messageBar && mode === "menu") messageBar.textContent = "";
  updateStartSummary();
}

function updateStartSummary() {
  const difficulty = difficultySettings[selectedDifficulty] || difficultySettings.normal;
  const best = typeof getDifficultyBest === "function" ? getDifficultyBest(selectedDifficulty) : highscore;
  const avatarPreview = selectedPlayerImage ? "🖼️" : (selectedPlayerEmoji || "😄");
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

  set("summaryBestLabel", t("summaryBestLabel"));
  set("summaryBestScore", String(best || 0));
  set("summaryDifficultyLabel", t("summaryDifficultyLabel"));
  set("summaryDifficulty", t(difficulty.labelKey));
  set("summaryAvatarLabel", t("summaryAvatarLabel"));
  set("summaryAvatar", avatarPreview);
  set("summarySoundLabel", t("summarySoundLabel"));
  set("summarySound", soundEnabled ? t("soundShortOn") : t("soundShortOff"));
  const soundCard = document.getElementById("summarySoundCard");
  if (soundCard) {
    soundCard.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
    soundCard.title = soundEnabled ? t("soundOff") : t("soundOn");
  }

  set("scoreLabel", t("scoreLabel"));
  set("highscoreLabel", onlineMode ? t("friendLabel") : t("highscoreLabel"));
  set("levelLabel", t("levelLabel"));
  set("livesLabel", t("livesLabel"));
  set("comboLabel", onlineMode ? "Sync" : t("comboLabel"));
}

function showHowToModal() {
  const modal = document.getElementById("howToModal");
  applyLanguage();
  if (modal) {
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "open");
  }
}

function closeHowToModal() {
  const modal = document.getElementById("howToModal");
  if (modal && typeof modal.close === "function") modal.close();
  else if (modal) modal.removeAttribute("open");
}

const v21PreviousApplyLanguage = applyLanguage;
applyLanguage = function() {
  v21PreviousApplyLanguage();
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("howToButton", t("howToButton"));
  set("howToKicker", t("howToKicker"));
  set("howToTitle", t("howToTitle"));
  set("howToDiamonds", t("howToDiamonds"));
  set("howToPower", t("howToPower"));
  set("howToShield", t("howToShield"));
  set("howToPortal", t("howToPortal"));
  set("howToCombo", t("howToCombo"));
  set("howToOnline", t("howToOnline"));
  set("howToOkButton", t("howToOkButton"));
  updateStartSummary();
};

const v21PreviousStartGame = startGame;
startGame = function() {
  v21SetUiMode("single");
  v21PreviousStartGame();
  v21SetUiMode("single");
};

const v21PreviousStartOnlineGame = startOnlineGame;
startOnlineGame = function() {
  v21SetUiMode("online");
  v21PreviousStartOnlineGame();
  v21SetUiMode("online");
};

const v21PreviousGoToMainMenu = goToMainMenu;
goToMainMenu = function() {
  v21PreviousGoToMainMenu();
  v21SetUiMode("menu");
  updateStartSummary();
};

const v21PreviousSetDifficulty = setDifficulty;
setDifficulty = function(mode) {
  v21PreviousSetDifficulty(mode);
  updateStartSummary();
  if (!gameRunning && messageBar) messageBar.textContent = "";
};

const v21PreviousToggleGameSound = toggleGameSound;
toggleGameSound = function() {
  v21PreviousToggleGameSound();
  updateStartSummary();
};

const v21PreviousUpdateCustomizerUi = updateCustomizerUi;
updateCustomizerUi = function() {
  v21PreviousUpdateCustomizerUi();
  updateStartSummary();
};

// Starttilstand etter at alle eldre add-ons har kjørt.
setTimeout(() => {
  if (!gameRunning) v21SetUiMode("menu");
  updateStartSummary();
}, 0);

/* --------------------------------------------------------------------------
   V23 POWER SHOP + LASER-TÅRN
   Kun for Spill mot data. Multiplayer-koden er bevisst ikke endret/koblet hit.
   - Butikken bruker score som valuta.
   - Laser-tårn kjøpes i butikk og plasseres manuelt på en tom rute.
   - Tårn skyter nærmeste fiende i en kort periode eller til brettet er ryddet.
   -------------------------------------------------------------------------- */
Object.assign(translations.no, {
  shopButton: "🛒 Power-butikk",
  shopKicker: "SINGLEPLAYER POWER SHOP",
  shopTitle: "Power-butikk",
  shopSubtitle: "Bruk poeng du har tjent i kampen. Butikken er kun for Spill mot data.",
  shopWalletLabel: "Saldo",
  shopInventoryLabel: "Utstyr",
  shopLifeTitle: "❤️ Ekstra liv",
  shopLifeDesc: "Få ett ekstra liv med en gang.",
  shopShieldTitle: "🛡️ Skjold",
  shopShieldDesc: "Redder deg én gang hvis fienden treffer deg.",
  shopSlowTitle: "🧊 Slow motion",
  shopSlowDesc: "Gjør fiendene tregere i 12 sekunder.",
  shopTurretTitle: "🔫 Laser-tårn",
  shopTurretDesc: "Kjøp ett tårn og plasser det på en tom rute. Skyter fiender en periode.",
  shopTurretPack: "Kjøp 3 laser",
  shopBuy: "Kjøp",
  shopPlaceTurret: "🎯 Plasser laser-tårn",
  shopHint: "Tips: Kjøp laser-tårn, trykk Plasser og velg en tom rute på brettet.",
  shopOnlySingle: "Butikken er kun aktiv i Spill mot data.",
  shopNeedGame: "Start Spill mot data før du bruker butikken.",
  shopNotEnough: "Ikke nok poeng ennå. Samle flere diamanter!",
  shopBoughtLife: "❤️ Ekstra liv kjøpt!",
  shopBoughtShield: "🛡️ Skjold aktivert!",
  shopBoughtSlow: "🧊 Fiendene er tregere i 12 sekunder!",
  shopBoughtTurret: "🔫 Laser-tårn kjøpt. Trykk Plasser og velg en tom rute.",
  shopBoughtTurretPack: "🔫🔫🔫 Tre laser-tårn kjøpt. Trykk Plasser og sett dem ut etter hverandre.",
  shopPlaceMode: "Velg en tom rute på brettet for laser-tårnet.",
  shopPlaceModeCount: "Velg en tom rute. Laser-tårn igjen:",
  shopInvalidCell: "Velg en tom rute uten vegg, diamant, portal, spiller eller fiende.",
  shopTurretPlaced: "🔫 Laser-tårn plassert!",
  shopTurretPlacedMore: "🔫 Tårn plassert. Velg neste tomme rute. Igjen:",
  shopTurretShot: "💥 Laser-tårn traff en fiende! +75",
  shopNoTurret: "Du må kjøpe et laser-tårn først.",
  shopClosed: "Butikk lukket. Kampen fortsetter!"
});

Object.assign(translations.en, {
  shopButton: "🛒 Power shop",
  shopKicker: "SINGLEPLAYER POWER SHOP",
  shopTitle: "Power shop",
  shopSubtitle: "Spend points earned in this match. The shop is only for Play vs computer.",
  shopWalletLabel: "Balance",
  shopInventoryLabel: "Gear",
  shopLifeTitle: "❤️ Extra life",
  shopLifeDesc: "Get one extra life instantly.",
  shopShieldTitle: "🛡️ Shield",
  shopShieldDesc: "Saves you once if an enemy hits you.",
  shopSlowTitle: "🧊 Slow motion",
  shopSlowDesc: "Slows enemies for 12 seconds.",
  shopTurretTitle: "🔫 Laser turret",
  shopTurretDesc: "Buy a turret and place it on an empty tile. It shoots enemies for a while.",
  shopTurretPack: "Buy 3 lasers",
  shopBuy: "Buy",
  shopPlaceTurret: "🎯 Place laser turret",
  shopHint: "Tip: Buy a laser turret, press Place and choose an empty tile on the board.",
  shopOnlySingle: "The shop is only active in Play vs computer.",
  shopNeedGame: "Start Play vs computer before using the shop.",
  shopNotEnough: "Not enough points yet. Collect more diamonds!",
  shopBoughtLife: "❤️ Extra life bought!",
  shopBoughtShield: "🛡️ Shield activated!",
  shopBoughtSlow: "🧊 Enemies are slower for 12 seconds!",
  shopBoughtTurret: "🔫 Laser turret bought. Press Place and choose an empty tile.",
  shopBoughtTurretPack: "🔫🔫🔫 Three laser turrets bought. Press Place and place them one after another.",
  shopPlaceMode: "Choose an empty tile on the board for the laser turret.",
  shopPlaceModeCount: "Choose an empty tile. Laser turrets left:",
  shopInvalidCell: "Choose an empty tile without wall, diamond, portal, player or enemy.",
  shopTurretPlaced: "🔫 Laser turret placed!",
  shopTurretPlacedMore: "🔫 Turret placed. Choose the next empty tile. Left:",
  shopTurretShot: "💥 Laser turret hit an enemy! +75",
  shopNoTurret: "You need to buy a laser turret first.",
  shopClosed: "Shop closed. Match continues!"
});

// Sikrer at alle språk får shop-tekst. Der vi ikke har oversatt manuelt brukes engelsk fallback.
for (const language of languageOptions) {
  translations[language.code] = translations[language.code] || { ...translations.en };
  for (const key of Object.keys(translations.en)) {
    if (key.startsWith("shop") && !translations[language.code][key]) {
      translations[language.code][key] = translations.en[key];
    }
  }
}

const V23_SHOP_COSTS = {
  life: 1000,
  shield: 650,
  slow: 800,
  turret: 1200,
  turretPack: 3300
};
const V25_TURRET_MAX_INVENTORY = 6;
const V25_TURRET_PACK_COUNT = 3;

let v23TurretInventory = 0;
let v23Turrets = [];
let v23TurretLoop = null;
let v23PlacingTurret = false;
let v23ShopPausedBefore = false;
let v23SlowUntil = 0;
let v23TurretId = 1;

function v23SetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function v23SetHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function v23ShowDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "open");
}

function v23CloseDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function v23UpdateShopTexts() {
  v23SetText("shopButton", t("shopButton"));
  v23SetText("shopKicker", t("shopKicker"));
  v23SetText("shopTitle", t("shopTitle"));
  v23SetText("shopSubtitle", t("shopSubtitle"));
  v23SetText("shopWalletLabel", t("shopWalletLabel"));
  v23SetText("shopInventoryLabel", t("shopInventoryLabel"));
  v23SetText("shopLifeTitle", t("shopLifeTitle"));
  v23SetText("shopLifeDesc", t("shopLifeDesc"));
  v23SetText("shopShieldTitle", t("shopShieldTitle"));
  v23SetText("shopShieldDesc", t("shopShieldDesc"));
  v23SetText("shopSlowTitle", t("shopSlowTitle"));
  v23SetText("shopSlowDesc", t("shopSlowDesc"));
  v23SetText("shopTurretTitle", t("shopTurretTitle"));
  v23SetText("shopTurretDesc", t("shopTurretDesc"));
  v23SetText("shopHint", t("shopHint"));
  v23SetText("placeTurretButton", t("shopPlaceTurret"));
  v23SetText("buyLifeButton", `${t("shopBuy")} ${V23_SHOP_COSTS.life}`);
  v23SetText("buyShieldButton", `${t("shopBuy")} ${V23_SHOP_COSTS.shield}`);
  v23SetText("buySlowButton", `${t("shopBuy")} ${V23_SHOP_COSTS.slow}`);
  v23SetText("buyTurretButton", `${t("shopBuy")} ${V23_SHOP_COSTS.turret}`);
  v23SetText("buyTurretPackButton", `${t("shopTurretPack")} ${V23_SHOP_COSTS.turretPack}`);
}

function v23UpdateShopUi() {
  const shopButton = document.getElementById("shopButton");
  if (shopButton) {
    shopButton.hidden = Boolean(onlineMode);
    shopButton.disabled = Boolean(onlineMode) || !gameRunning;
    shopButton.textContent = t("shopButton");
  }

  document.body.classList.toggle("online-mode-active", Boolean(onlineMode));
  document.body.classList.toggle("turret-placement-active", Boolean(v23PlacingTurret));

  v23UpdateShopTexts();
  v23SetText("shopWalletValue", String(score || 0));
  v23SetText("shopInventoryValue", `🔫 x${v23TurretInventory}/${V25_TURRET_MAX_INVENTORY}`);

  const setDisabled = (id, value) => {
    const button = document.getElementById(id);
    if (button) button.disabled = value;
  };
  const notSingle = onlineMode || !gameRunning;
  setDisabled("buyLifeButton", notSingle || score < V23_SHOP_COSTS.life || lives >= 7);
  setDisabled("buyShieldButton", notSingle || score < V23_SHOP_COSTS.shield || shield);
  setDisabled("buySlowButton", notSingle || score < V23_SHOP_COSTS.slow || Date.now() < v23SlowUntil);
  setDisabled("buyTurretButton", notSingle || score < V23_SHOP_COSTS.turret || v23TurretInventory >= V25_TURRET_MAX_INVENTORY);
  setDisabled("buyTurretPackButton", notSingle || score < V23_SHOP_COSTS.turretPack || v23TurretInventory + V25_TURRET_PACK_COUNT > V25_TURRET_MAX_INVENTORY);
  setDisabled("placeTurretButton", notSingle || v23TurretInventory <= 0 || v23PlacingTurret);
}

function openPowerShop() {
  if (onlineMode) {
    if (messageBar) messageBar.textContent = t("shopOnlySingle");
    return;
  }
  if (!gameRunning) {
    if (messageBar) messageBar.textContent = t("shopNeedGame");
    return;
  }

  const modal = document.getElementById("shopModal");
  v23ShopPausedBefore = paused;
  paused = true;
  clearInterval(enemyTimer);
  v23UpdateShopUi();
  v23ShowDialog(modal);
  playSfx("select");
}

function closePowerShop() {
  const modal = document.getElementById("shopModal");
  v23CloseDialog(modal);

  if (gameRunning && !onlineMode && !v23ShopPausedBefore) {
    paused = false;
    clearInterval(enemyTimer);
    enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
    if (messageBar) messageBar.textContent = t("shopClosed");
  }
  v23UpdateShopUi();
}

function buyShopItem(item) {
  if (onlineMode || !gameRunning) return;
  const cost = V23_SHOP_COSTS[item];
  if (!cost) return;
  if (score < cost) {
    if (messageBar) messageBar.textContent = t("shopNotEnough");
    playSfx("lose");
    return;
  }

  if (item === "life" && lives >= 7) return;
  if (item === "shield" && shield) return;
  if (item === "turret" && v23TurretInventory >= V25_TURRET_MAX_INVENTORY) return;

  score -= cost;

  if (item === "life") {
    lives = Math.min(lives + 1, 7);
    spawnCenterBurst("❤️ +1");
    if (messageBar) messageBar.textContent = t("shopBoughtLife");
    playSfx("shield");
  }

  if (item === "shield") {
    shield = true;
    spawnCenterBurst("🛡️ READY");
    if (messageBar) messageBar.textContent = t("shopBoughtShield");
    playSfx("shield");
  }

  if (item === "slow") {
    v23SlowUntil = Date.now() + 12000;
    spawnCenterBurst("🧊 SLOW");
    if (messageBar) messageBar.textContent = t("shopBoughtSlow");
    clearInterval(enemyTimer);
    enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
    playSfx("power");
  }

  if (item === "turret") {
    v23TurretInventory += 1;
    spawnCenterBurst("🔫 +1");
    if (messageBar) messageBar.textContent = t("shopBoughtTurret");
    playSfx("power");
  }

  drawGame();
  v23UpdateShopUi();
}

function buyTurretPack() {
  if (onlineMode || !gameRunning) return;
  if (v23TurretInventory + V25_TURRET_PACK_COUNT > V25_TURRET_MAX_INVENTORY) return;
  if (score < V23_SHOP_COSTS.turretPack) {
    if (messageBar) messageBar.textContent = t("shopNotEnough");
    playSfx("lose");
    return;
  }

  score -= V23_SHOP_COSTS.turretPack;
  v23TurretInventory += V25_TURRET_PACK_COUNT;
  spawnCenterBurst("🔫 x3");
  if (messageBar) messageBar.textContent = t("shopBoughtTurretPack");
  playSfx("power");
  drawGame();
  v23UpdateShopUi();
}

function activateTurretPlacement() {
  if (onlineMode || !gameRunning) return;
  if (v23TurretInventory <= 0) {
    if (messageBar) messageBar.textContent = t("shopNoTurret");
    return;
  }

  closePowerShop();
  v23PlacingTurret = true;
  document.body.classList.add("turret-placement-active");
  if (messageBar) messageBar.textContent = `${t("shopPlaceModeCount")} ${v23TurretInventory}`;
  playSfx("select");
}

function v23BoardPositionFromPointer(event) {
  const target = event.target && event.target.closest ? event.target.closest(".cell") : null;
  if (!target) return null;
  const cells = Array.from(game.children);
  const index = cells.indexOf(target);
  if (index < 0 || !map.length || !map[0].length) return null;
  const width = map[0].length;
  return { x: index % width, y: Math.floor(index / width) };
}

function v23CanPlaceTurret(x, y) {
  if (!map[y] || map[y][x] === undefined) return false;
  if (map[y][x] !== TILE.EMPTY) return false;
  if (player.x === x && player.y === y) return false;
  if (remotePlayer && remotePlayer.x === x && remotePlayer.y === y) return false;
  if (enemies.some(enemy => enemy.x === x && enemy.y === y)) return false;
  if (v23Turrets.some(turret => turret.x === x && turret.y === y)) return false;
  return true;
}

function v23PlaceTurretAt(x, y) {
  if (!v23CanPlaceTurret(x, y)) {
    if (messageBar) messageBar.textContent = t("shopInvalidCell");
    playSfx("lose");
    return false;
  }

  v23TurretInventory -= 1;
  v23Turrets.push({
    id: v23TurretId++,
    x,
    y,
    expiresAt: Date.now() + 25000,
    lastShotAt: 0
  });

  spawnPop("🔫", x, y);
  playSfx("power");
  v23StartTurretLoop();

  if (v23TurretInventory > 0) {
    v23PlacingTurret = true;
    document.body.classList.add("turret-placement-active");
    if (messageBar) messageBar.textContent = `${t("shopTurretPlacedMore")} ${v23TurretInventory}`;
  } else {
    v23PlacingTurret = false;
    document.body.classList.remove("turret-placement-active");
    if (messageBar) messageBar.textContent = t("shopTurretPlaced");
  }

  drawGame();
  v23UpdateShopUi();
  return true;
}

if (game) {
  game.addEventListener("pointerdown", event => {
    if (!v23PlacingTurret) return;
    event.preventDefault();
    event.stopPropagation();
    const pos = v23BoardPositionFromPointer(event);
    if (!pos) return;
    v23PlaceTurretAt(pos.x, pos.y);
  }, { passive: false });
}

document.addEventListener("keydown", event => {
  if (event.key.toLowerCase() === "t" && gameRunning && !onlineMode) {
    event.preventDefault();
    activateTurretPlacement();
  }
  if (event.key === "Escape" && v23PlacingTurret) {
    v23PlacingTurret = false;
    document.body.classList.remove("turret-placement-active");
    v23UpdateShopUi();
  }
}, { passive: false });

function v23DrawTurrets() {
  if (!game || !map.length) return;
  const width = map[0].length;
  v23Turrets.forEach(turret => {
    const index = turret.y * width + turret.x;
    const cell = game.children[index];
    if (!cell) return;
    cell.classList.add("turret-cell");
    cell.dataset.turret = "🔫";
  });
}

function v23FindNearestEnemy(turret) {
  let best = null;
  let bestDistance = Infinity;
  enemies.forEach(enemy => {
    const distance = Math.abs(enemy.x - turret.x) + Math.abs(enemy.y - turret.y);
    if (distance < bestDistance) {
      best = enemy;
      bestDistance = distance;
    }
  });
  return bestDistance <= 7 ? best : null;
}

function v25CellCenterInWrapper(x, y) {
  if (!game || !map.length || !map[0].length) return null;
  const width = map[0].length;
  const index = y * width + x;
  const cell = game.children[index];
  const wrapper = document.getElementById("game-wrapper");
  if (!cell || !wrapper) return null;
  const cellRect = cell.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  return {
    x: cellRect.left - wrapperRect.left + cellRect.width / 2,
    y: cellRect.top - wrapperRect.top + cellRect.height / 2
  };
}

function v25ShowLaserShot(fromX, fromY, toX, toY) {
  const wrapper = document.getElementById("game-wrapper");
  if (!wrapper) return;
  const from = v25CellCenterInWrapper(fromX, fromY);
  const to = v25CellCenterInWrapper(toX, toY);
  if (!from || !to) return;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(12, Math.sqrt(dx * dx + dy * dy));
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const beam = document.createElement("div");
  beam.className = "laser-beam-effect";
  beam.style.setProperty("--laser-x", `${from.x}px`);
  beam.style.setProperty("--laser-y", `${from.y}px`);
  beam.style.setProperty("--laser-length", `${length}px`);
  beam.style.setProperty("--laser-angle", `${angle}deg`);

  const impact = document.createElement("div");
  impact.className = "laser-impact-effect";
  impact.style.setProperty("--impact-x", `${to.x}px`);
  impact.style.setProperty("--impact-y", `${to.y}px`);

  wrapper.appendChild(beam);
  wrapper.appendChild(impact);
  setTimeout(() => beam.remove(), 320);
  setTimeout(() => impact.remove(), 380);
}

function v23TickTurrets() {
  if (!gameRunning || paused || onlineMode) return;

  const now = Date.now();
  const beforeCount = v23Turrets.length;
  v23Turrets = v23Turrets.filter(turret => now < turret.expiresAt && diamondsLeft > 0);
  let didShoot = beforeCount !== v23Turrets.length;

  v23Turrets.forEach(turret => {
    if (now - turret.lastShotAt < 1250) return;
    const target = v23FindNearestEnemy(turret);
    if (!target) return;

    const hitX = target.x;
    const hitY = target.y;
    v25ShowLaserShot(turret.x, turret.y, hitX, hitY);
    target.x = target.startX;
    target.y = target.startY;
    turret.lastShotAt = now;
    score += 75;
    combo = Math.min(combo + 1, 9);
    if (messageBar) messageBar.textContent = t("shopTurretShot");
    spawnPop("💥", hitX, hitY);
    playSfx("enemy");
    didShoot = true;
  });

  if (didShoot) {
    drawGame();
    v23UpdateShopUi();
  }
}

function v23StartTurretLoop() {
  if (v23TurretLoop) return;
  v23TurretLoop = setInterval(v23TickTurrets, 180);
}

function v23StopTurretLoop() {
  if (v23TurretLoop) clearInterval(v23TurretLoop);
  v23TurretLoop = null;
}

function v23ClearLevelTools() {
  v23Turrets = [];
  v23PlacingTurret = false;
  document.body.classList.remove("turret-placement-active");
}

function v23ResetShopRun() {
  v23TurretInventory = 0;
  v23Turrets = [];
  v23PlacingTurret = false;
  v23SlowUntil = 0;
  v23TurretId = 1;
  document.body.classList.remove("turret-placement-active");
  v23StopTurretLoop();
}

const v23PreviousDrawGame = drawGame;
drawGame = function() {
  v23PreviousDrawGame();
  if (!onlineMode) v23DrawTurrets();
  v23UpdateShopUi();
};

const v23PreviousGetEnemyDelay = getEnemyDelay;
getEnemyDelay = function() {
  const baseDelay = v23PreviousGetEnemyDelay();
  if (!onlineMode && Date.now() < v23SlowUntil) return Math.round(baseDelay * 1.55);
  return baseDelay;
};

const v23PreviousLoadLevel = loadLevel;
loadLevel = function(index) {
  v23ClearLevelTools();
  v23PreviousLoadLevel(index);
  if (!onlineMode && gameRunning) v23StartTurretLoop();
};

const v23PreviousStartGame = startGame;
startGame = function() {
  v23ResetShopRun();
  v23PreviousStartGame();
  v23StartTurretLoop();
  v23UpdateShopUi();
};

const v23PreviousStartOnlineGame = startOnlineGame;
startOnlineGame = function() {
  v23ResetShopRun();
  v23PreviousStartOnlineGame();
  v23UpdateShopUi();
};

const v23PreviousEndGame = endGame;
endGame = function(won) {
  v23ResetShopRun();
  const modal = document.getElementById("shopModal");
  v23CloseDialog(modal);
  v23PreviousEndGame(won);
  v23UpdateShopUi();
};

const v23PreviousGoToMainMenu = goToMainMenu;
goToMainMenu = function() {
  v23ResetShopRun();
  const modal = document.getElementById("shopModal");
  v23CloseDialog(modal);
  v23PreviousGoToMainMenu();
  v23UpdateShopUi();
};

const v23PreviousApplyLanguage = applyLanguage;
applyLanguage = function() {
  v23PreviousApplyLanguage();
  v23UpdateShopTexts();
  v23UpdateShopUi();
};

setTimeout(() => {
  v23UpdateShopTexts();
  v23UpdateShopUi();
}, 0);


/* --------------------------------------------------------------------------
   V26 MUSIC HUB + LEGAL/PRIVACY
   - Built-in music is generated with WebAudio (no external copyrighted songs).
   - User-uploaded music stays local in the browser. It is never uploaded to Firebase.
   - Analytics consent is stored, but analytics is not activated in this build.
-------------------------------------------------------------------------- */
Object.assign(translations.no, {
  musicUploaded: "Min egen playlist",
  musicUploadLabel: "🎵 Last opp egen musikk",
  musicVolumeLabel: "Volum",
  prevTrackButton: "⏮️ Forrige",
  nextTrackButton: "⏭️ Neste",
  musicNoFiles: "Ingen egen musikk valgt. Built-in musikk er WebAudio og trygg å bruke.",
  musicFilesReady: "{count} spor valgt. Nå kan du bruke egen playlist under spillet.",
  aboutButton: "© / Personvern",
  aboutTitle: "Copyright og personvern",
  aboutCopyright: "© 2026 Ragish / Ragi Joy Maze Deluxe. Alle rettigheter forbeholdes.",
  aboutMusic: "Built-in arcade-lyder er generert med WebAudio. Musikk du laster opp spilles lokalt fra din egen enhet og lastes ikke opp til Firebase eller GitHub.",
  aboutPrivacy: "Multiplayer bruker Firebase Realtime Database til romkode, klar-status, score og spillerposisjon. Ikke del privat informasjon i romkode eller spillnavn.",
  aboutCookies: "Spillet bruker localStorage for innstillinger, highscore, avatarvalg og personvernvalg. Analyse skal bare brukes hvis du godtar det.",
  privacyTitle: "Personvern",
  privacyText: "Spillet bruker nødvendig lokal lagring for innstillinger og highscore. Analytics kan brukes kun hvis du godtar det.",
  privacyNecessary: "Kun nødvendige",
  privacyAnalytics: "Godta analyse",
  privacyRead: "Les mer"
});
Object.assign(translations.en, {
  musicUploaded: "My own playlist",
  musicUploadLabel: "🎵 Upload your own music",
  musicVolumeLabel: "Volume",
  prevTrackButton: "⏮️ Previous",
  nextTrackButton: "⏭️ Next",
  musicNoFiles: "No personal music selected. Built-in music is generated with WebAudio and safe to use.",
  musicFilesReady: "{count} tracks selected. Your playlist can now play during the game.",
  aboutButton: "© / Privacy",
  aboutTitle: "Copyright and privacy",
  aboutCopyright: "© 2026 Ragish / Ragi Joy Maze Deluxe. All rights reserved.",
  aboutMusic: "Built-in arcade sounds are generated with WebAudio. Uploaded music is played locally from your own device and is not uploaded to Firebase or GitHub.",
  aboutPrivacy: "Multiplayer uses Firebase Realtime Database to sync room code, ready status, score and player positions. Do not share private information in room codes or game names.",
  aboutCookies: "The game uses localStorage for settings, highscores, avatar choices and privacy choice. Analytics should only run if you accept it.",
  privacyTitle: "Privacy",
  privacyText: "The game uses necessary local storage for settings and highscores. Analytics can be used only if you accept it.",
  privacyNecessary: "Necessary only",
  privacyAnalytics: "Accept analytics",
  privacyRead: "Read more"
});

function v26SetText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

function updateV26Language() {
  v26SetText("musicUploadLabel", t("musicUploadLabel"));
  v26SetText("musicVolumeLabel", t("musicVolumeLabel"));
  v26SetText("prevTrackButton", t("prevTrackButton"));
  v26SetText("nextTrackButton", t("nextTrackButton"));
  v26SetText("aboutButton", t("aboutButton"));
  v26SetText("aboutTitle", t("aboutTitle"));
  v26SetText("aboutCopyright", t("aboutCopyright"));
  v26SetText("aboutMusic", t("aboutMusic"));
  v26SetText("aboutPrivacy", t("aboutPrivacy"));
  v26SetText("aboutCookies", t("aboutCookies"));
  v26SetText("privacyTitle", t("privacyTitle"));
  v26SetText("privacyText", t("privacyText"));
  v26SetText("privacyNecessaryButton", t("privacyNecessary"));
  v26SetText("privacyAnalyticsButton", t("privacyAnalytics"));
  v26SetText("privacyReadButton", t("privacyRead"));
  const musicSelect = document.getElementById("musicSelect");
  const uploadedOption = musicSelect && Array.from(musicSelect.options).find(option => option.value === "uploaded");
  if (uploadedOption) uploadedOption.textContent = t("musicUploaded");
  updateMusicHubUi();
}

const v26PreviousApplyLanguage = applyLanguage;
applyLanguage = function() {
  v26PreviousApplyLanguage();
  updateV26Language();
};

function updateMusicHubUi() {
  const volume = document.getElementById("musicVolume");
  if (volume) volume.value = String(Math.round(musicVolume * 100));
  const info = document.getElementById("musicPlaylistInfo");
  if (info) {
    info.textContent = uploadedMusicFiles.length
      ? t("musicFilesReady").replace("{count}", uploadedMusicFiles.length)
      : t("musicNoFiles");
  }
}

function handleMusicUpload(event) {
  const files = Array.from((event && event.target && event.target.files) || []).filter(file => file.type.startsWith("audio/"));
  uploadedMusicFiles = files;
  uploadedMusicIndex = 0;
  if (files.length > 0) {
    setMusicTrack("uploaded");
    spawnCenterBurst("🎵 PLAYLIST READY");
    playSfx("level");
    if (gameRunning && soundEnabled) startMusic();
  }
  updateMusicHubUi();
}

function playUploadedMusic(index = 0) {
  if (!soundEnabled || uploadedMusicFiles.length === 0) return;
  stopUploadedMusic();
  uploadedMusicIndex = Math.max(0, Math.min(index, uploadedMusicFiles.length - 1));
  uploadedMusicUrl = URL.createObjectURL(uploadedMusicFiles[uploadedMusicIndex]);
  uploadedMusicAudio = new Audio(uploadedMusicUrl);
  uploadedMusicAudio.volume = musicVolume;
  uploadedMusicAudio.onended = () => nextUploadedTrack(true);
  uploadedMusicAudio.play().catch(() => {
    messageBar.textContent = "Trykk Test rytme eller Start Game for å starte musikk på mobil.";
  });
  updateMusicHubUi();
}

function nextUploadedTrack(fromEnded = false) {
  if (uploadedMusicFiles.length === 0) {
    previewMusicTrack();
    return;
  }
  uploadedMusicIndex = (uploadedMusicIndex + 1) % uploadedMusicFiles.length;
  selectedMusicTrack = "uploaded";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  if (soundEnabled && (gameRunning || !fromEnded)) playUploadedMusic(uploadedMusicIndex);
  playSfx("select");
}

function previousUploadedTrack() {
  if (uploadedMusicFiles.length === 0) {
    previewMusicTrack();
    return;
  }
  uploadedMusicIndex = (uploadedMusicIndex - 1 + uploadedMusicFiles.length) % uploadedMusicFiles.length;
  selectedMusicTrack = "uploaded";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  if (soundEnabled) playUploadedMusic(uploadedMusicIndex);
  playSfx("select");
}

function setMusicVolume(value) {
  musicVolume = Math.max(0, Math.min(1, Number(value) / 100));
  localStorage.setItem("ragiJoyMusicVolume", String(musicVolume));
  if (uploadedMusicAudio) uploadedMusicAudio.volume = musicVolume;
}

const v26PreviousPreviewMusicTrack = previewMusicTrack;
previewMusicTrack = function() {
  if (selectedMusicTrack === "uploaded" && uploadedMusicFiles.length > 0) {
    soundEnabled = true;
    localStorage.setItem("ragiJoySound", "on");
    if (typeof updateSummaryCards === "function") updateSummaryCards();
    playUploadedMusic(uploadedMusicIndex);
    return;
  }
  v26PreviousPreviewMusicTrack();
};

function showAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (!modal) return;
  updateV26Language();
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.classList.add("fallback-open");
}

function closeAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (!modal) return;
  if (typeof modal.close === "function") modal.close();
  else modal.classList.remove("fallback-open");
}

function setPrivacyChoice(choice) {
  localStorage.setItem("ragiJoyPrivacyChoice", choice === "analytics" ? "analytics" : "necessary");
  const banner = document.getElementById("privacyBanner");
  if (banner) banner.classList.add("hidden");
  playSfx("select");
}

function initPrivacyBanner() {
  const banner = document.getElementById("privacyBanner");
  if (!banner) return;
  if (!localStorage.getItem("ragiJoyPrivacyChoice")) {
    banner.classList.remove("hidden");
  }
}

const v26PreviousSetMusicTrack = setMusicTrack;
setMusicTrack = function(track) {
  v26PreviousSetMusicTrack(track);
  updateMusicHubUi();
};

updateV26Language();
updateMusicHubUi();
initPrivacyBanner();

/* --------------------------------------------------------------------------
   V27: Bedre personvernvalg + musikkspiller som ikke restarter ved neste level
   - Multiplayer-koden endres ikke her.
   - Opplastet musikk blir på enheten, pauses/resumes uten å miste playlisten.
   - Analytics lastes kun hvis brukeren aktivt godtar analyse.
-------------------------------------------------------------------------- */
Object.assign(translations.no, {
  musicDockLabel: "Musikk",
  musicDockPause: "⏸️ Pause",
  musicDockPlay: "▶️ Spill av",
  musicDockBuiltIn: "Arcade beat",
  musicDockUploaded: "Egen playlist",
  musicDockNoFile: "Ingen egen musikk valgt",
  privacyTitle: "🍪 Personvernvalg",
  privacyText: "Nødvendig lagring brukes til språk, lyd, figur og highscore. Analyse er valgfritt og hjelper utvikleren å se besøk og forbedre spillet.",
  privacyStatusNone: "Ingen valg er lagret ennå.",
  privacyStatusNecessary: "Valg lagret: kun nødvendige. Analyse er av.",
  privacyStatusAnalytics: "Valg lagret: analyse er på. Du kan endre dette under © / Personvern.",
  privacySavedNecessaryBurst: "✅ Kun nødvendige lagret",
  privacySavedAnalyticsBurst: "📊 Analyse godkjent",
  aboutPrivacySettings: "Endre personvernvalg",
  aboutCurrentNecessary: "Gjeldende valg: kun nødvendige. Spillet lagrer bare lokale innstillinger/highscore og bruker Firebase for multiplayer.",
  aboutCurrentAnalytics: "Gjeldende valg: analyse godtatt. Utvikleren kan se anonym bruk som besøk, start av spill og valg av modus.",
  aboutCurrentNone: "Gjeldende valg: ikke valgt ennå.",
  aboutCookies: "Nødvendig localStorage lagrer språk, lyd, figur, musikkvalg, highscore og personvernvalg i denne nettleseren. Analyse er valgfritt og lastes bare hvis du trykker Godta analyse. Opplastet musikk lagres ikke og forsvinner ved refresh av sikkerhetsgrunner i nettleseren.",
  musicFilesReady: "{count} spor valgt. Playlist holder seg til du refresher siden. Lyd av/på pauser nå uten at du må laste opp på nytt.",
  musicNoFiles: "Ingen egen musikk valgt. Built-in musikk er WebAudio og trygg å bruke."
});
Object.assign(translations.en, {
  musicDockLabel: "Music",
  musicDockPause: "⏸️ Pause",
  musicDockPlay: "▶️ Play",
  musicDockBuiltIn: "Arcade beat",
  musicDockUploaded: "My playlist",
  musicDockNoFile: "No personal music selected",
  privacyTitle: "🍪 Privacy choice",
  privacyText: "Necessary storage is used for language, sound, avatar and highscores. Analytics is optional and helps the developer understand visits and improve the game.",
  privacyStatusNone: "No choice saved yet.",
  privacyStatusNecessary: "Choice saved: necessary only. Analytics is off.",
  privacyStatusAnalytics: "Choice saved: analytics is on. You can change this under © / Privacy.",
  privacySavedNecessaryBurst: "✅ Necessary only saved",
  privacySavedAnalyticsBurst: "📊 Analytics accepted",
  aboutPrivacySettings: "Change privacy choice",
  aboutCurrentNecessary: "Current choice: necessary only. The game stores local settings/highscores and uses Firebase for multiplayer.",
  aboutCurrentAnalytics: "Current choice: analytics accepted. The developer can see anonymous usage such as visits, game starts and mode choices.",
  aboutCurrentNone: "Current choice: not selected yet.",
  aboutCookies: "Necessary localStorage stores language, sound, avatar, music choice, highscores and privacy choice in this browser. Analytics is optional and loads only if you accept it. Uploaded music is not saved and disappears after refresh because of browser security.",
  musicFilesReady: "{count} tracks selected. The playlist stays until you refresh the page. Sound on/off now pauses without needing a new upload.",
  musicNoFiles: "No personal music selected. Built-in music is generated with WebAudio and safe to use."
});

const V27_BUILT_IN_ORDER = ["theme", "happy", "turbo", "chill", "boss"];
let v27BuiltInTrackName = "";
let v27MusicManuallyPaused = false;

function getPrivacyChoice() {
  return localStorage.getItem("ragiJoyPrivacyChoice") || "";
}

function updatePrivacyUi() {
  const choice = getPrivacyChoice();
  const status = document.getElementById("privacyStatus");
  if (status) {
    status.textContent = choice === "analytics"
      ? t("privacyStatusAnalytics")
      : choice === "necessary"
        ? t("privacyStatusNecessary")
        : t("privacyStatusNone");
  }
  const current = document.getElementById("aboutCurrentChoice");
  if (current) {
    current.textContent = choice === "analytics"
      ? t("aboutCurrentAnalytics")
      : choice === "necessary"
        ? t("aboutCurrentNecessary")
        : t("aboutCurrentNone");
  }
  const settingsBtn = document.getElementById("aboutPrivacySettingsButton");
  if (settingsBtn) settingsBtn.textContent = t("aboutPrivacySettings");
}

function showPrivacyBanner(force = false) {
  const banner = document.getElementById("privacyBanner");
  if (!banner) return;
  updatePrivacyUi();
  if (force || !getPrivacyChoice()) banner.classList.remove("hidden");
}

function hidePrivacyBanner() {
  const banner = document.getElementById("privacyBanner");
  if (banner) banner.classList.add("hidden");
}

async function enableAnalyticsIfAllowed() {
  if (getPrivacyChoice() !== "analytics") return false;
  if (window.FirebaseAnalytics && window.FirebaseAnalytics.enabled) return true;
  if (typeof window.enableOptionalAnalytics === "function") {
    return await window.enableOptionalAnalytics();
  }
  return false;
}

async function setPrivacyChoice(choice) {
  const safeChoice = choice === "analytics" ? "analytics" : "necessary";
  localStorage.setItem("ragiJoyPrivacyChoice", safeChoice);
  updatePrivacyUi();
  hidePrivacyBanner();
  if (safeChoice === "analytics") await enableAnalyticsIfAllowed();
  if (window.FirebaseAnalytics && window.FirebaseAnalytics.enabled) {
    window.FirebaseAnalytics.logEvent("privacy_choice_saved", { choice: safeChoice });
  }
  spawnCenterBurst(safeChoice === "analytics" ? t("privacySavedAnalyticsBurst") : t("privacySavedNecessaryBurst"));
  playSfx("select");
}

function acceptPrivacyNecessary() { setPrivacyChoice("necessary"); }
function acceptPrivacyAnalytics() { setPrivacyChoice("analytics"); }

function trackGameEvent(name, params = {}) {
  if (getPrivacyChoice() !== "analytics") return;
  if (window.FirebaseAnalytics && window.FirebaseAnalytics.enabled) {
    window.FirebaseAnalytics.logEvent(name, params);
  }
}

function getCurrentMusicTitle() {
  if (selectedMusicTrack === "uploaded") {
    if (uploadedMusicFiles.length === 0) return t("musicDockNoFile");
    const file = uploadedMusicFiles[uploadedMusicIndex];
    return `${t("musicDockUploaded")} ${uploadedMusicIndex + 1}/${uploadedMusicFiles.length}${file ? ` · ${file.name.replace(/\.[^.]+$/, "")}` : ""}`;
  }
  const currentTheme = (levels[levelIndex] && levels[levelIndex].theme) || "neon";
  const trackName = selectedMusicTrack === "theme" ? currentTheme : selectedMusicTrack;
  return `${t("musicDockBuiltIn")} · ${trackName}`;
}

function updateMusicDockUi() {
  const label = document.getElementById("musicDockLabel");
  const title = document.getElementById("musicDockTitle");
  const play = document.getElementById("musicDockPlay");
  const dockVolume = document.getElementById("musicDockVolume");
  const customizeVolume = document.getElementById("musicVolume");
  const volumeLabel = document.getElementById("musicDockVolumeLabel");
  if (label) label.textContent = t("musicDockLabel");
  if (title) title.textContent = getCurrentMusicTitle();
  if (play) play.textContent = (!soundEnabled || v27MusicManuallyPaused) ? t("musicDockPlay") : t("musicDockPause");
  if (dockVolume) dockVolume.value = String(Math.round(musicVolume * 100));
  if (customizeVolume) customizeVolume.value = String(Math.round(musicVolume * 100));
  if (volumeLabel) {
    const input = volumeLabel.querySelector("input");
    volumeLabel.childNodes[0].textContent = `${t("musicVolumeLabel")} `;
    if (input && input.parentElement !== volumeLabel) volumeLabel.appendChild(input);
  }
  const soundBtn = document.getElementById("soundButton");
  if (soundBtn) soundBtn.textContent = soundEnabled ? t("soundOn") : t("soundOff");
  if (typeof updateStartSummary === "function") updateStartSummary();
}

function pauseUploadedMusicOnly() {
  if (uploadedMusicAudio) uploadedMusicAudio.pause();
}

stopUploadedMusic = function(destroy = true) {
  if (uploadedMusicAudio) {
    uploadedMusicAudio.pause();
    if (destroy) uploadedMusicAudio.onended = null;
  }
  if (destroy) {
    uploadedMusicAudio = null;
    if (uploadedMusicUrl) URL.revokeObjectURL(uploadedMusicUrl);
    uploadedMusicUrl = "";
  }
};

playUploadedMusic = function(index = uploadedMusicIndex, restart = false) {
  if (!soundEnabled || uploadedMusicFiles.length === 0 || v27MusicManuallyPaused) return;
  const targetIndex = Math.max(0, Math.min(index, uploadedMusicFiles.length - 1));
  if (uploadedMusicAudio && uploadedMusicIndex === targetIndex && !restart) {
    uploadedMusicAudio.volume = musicVolume;
    uploadedMusicAudio.play().catch(() => {
      messageBar.textContent = "Trykk ▶️ i musikkspilleren for å starte musikk på mobil.";
    });
    updateMusicDockUi();
    return;
  }
  stopUploadedMusic(true);
  uploadedMusicIndex = targetIndex;
  uploadedMusicUrl = URL.createObjectURL(uploadedMusicFiles[uploadedMusicIndex]);
  uploadedMusicAudio = new Audio(uploadedMusicUrl);
  uploadedMusicAudio.volume = musicVolume;
  uploadedMusicAudio.onended = () => nextUploadedTrack(true);
  uploadedMusicAudio.play().catch(() => {
    messageBar.textContent = "Trykk ▶️ i musikkspilleren for å starte musikk på mobil.";
  });
  updateMusicDockUi();
};

stopMusic = function(options = {}) {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  v27BuiltInTrackName = "";
  if (options.destroyUploaded) stopUploadedMusic(true);
  else pauseUploadedMusicOnly();
  updateMusicDockUi();
};

startMusic = function(forceRestart = false) {
  if (!soundEnabled || v27MusicManuallyPaused) return;
  if (selectedMusicTrack === "uploaded" && uploadedMusicFiles.length > 0) {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    playUploadedMusic(uploadedMusicIndex, forceRestart);
    return;
  }
  stopUploadedMusic(false);
  const currentTheme = (levels[levelIndex] && levels[levelIndex].theme) || "neon";
  const trackName = selectedMusicTrack === "theme" ? currentTheme : selectedMusicTrack;
  const track = musicTracks[trackName] || musicTracks[currentTheme] || musicTracks.neon;
  if (musicTimer && v27BuiltInTrackName === trackName && !forceRestart) {
    updateMusicDockUi();
    return;
  }
  if (musicTimer) clearInterval(musicTimer);
  v27BuiltInTrackName = trackName;
  musicStep = 0;
  musicTimer = setInterval(() => {
    if (!gameRunning || paused || !soundEnabled || v27MusicManuallyPaused) return;
    const freq = track[musicStep % track.length];
    tone(freq, 0.045, "triangle", 0.018 * musicVolume);
    if (musicStep % 4 === 0) tone(Math.max(95, freq / 3), 0.055, "sine", 0.012 * musicVolume);
    musicStep++;
  }, 390);
  updateMusicDockUi();
};

const v27PreviousToggleGameSound = toggleGameSound;
toggleGameSound = function() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("ragiJoySound", soundEnabled ? "on" : "off");
  if (!soundEnabled) {
    v27MusicManuallyPaused = true;
    stopMusic({ destroyUploaded: false });
  } else {
    v27MusicManuallyPaused = false;
    playSfx("select");
    if (gameRunning) startMusic(false);
  }
  updateMusicDockUi();
};

function toggleMusicPlayback() {
  if (!soundEnabled) {
    soundEnabled = true;
    localStorage.setItem("ragiJoySound", "on");
  }
  v27MusicManuallyPaused = !v27MusicManuallyPaused;
  if (v27MusicManuallyPaused) stopMusic({ destroyUploaded: false });
  else startMusic(false);
  updateMusicDockUi();
}

function nextTrackSmart() {
  v27MusicManuallyPaused = false;
  if (!soundEnabled) {
    soundEnabled = true;
    localStorage.setItem("ragiJoySound", "on");
  }
  if (uploadedMusicFiles.length > 0 && selectedMusicTrack === "uploaded") {
    nextUploadedTrack(false);
  } else {
    const current = selectedMusicTrack || "theme";
    const nextIndex = (V27_BUILT_IN_ORDER.indexOf(current) + 1) % V27_BUILT_IN_ORDER.length;
    setMusicTrack(V27_BUILT_IN_ORDER[nextIndex < 0 ? 0 : nextIndex]);
    if (gameRunning) startMusic(true);
  }
  updateMusicDockUi();
}

function previousTrackSmart() {
  v27MusicManuallyPaused = false;
  if (!soundEnabled) {
    soundEnabled = true;
    localStorage.setItem("ragiJoySound", "on");
  }
  if (uploadedMusicFiles.length > 0 && selectedMusicTrack === "uploaded") {
    previousUploadedTrack();
  } else {
    const current = selectedMusicTrack || "theme";
    const index = V27_BUILT_IN_ORDER.indexOf(current);
    const prevIndex = (index <= 0 ? V27_BUILT_IN_ORDER.length : index) - 1;
    setMusicTrack(V27_BUILT_IN_ORDER[prevIndex]);
    if (gameRunning) startMusic(true);
  }
  updateMusicDockUi();
}

const v27PreviousSetMusicTrack = setMusicTrack;
setMusicTrack = function(track) {
  selectedMusicTrack = track || "theme";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  v27MusicManuallyPaused = false;
  if (gameRunning && soundEnabled) startMusic(selectedMusicTrack !== "uploaded");
  playSfx("select");
  updateMusicHubUi();
  updateMusicDockUi();
};

const v27PreviousHandleMusicUpload = handleMusicUpload;
handleMusicUpload = function(event) {
  const files = Array.from((event && event.target && event.target.files) || []).filter(file => file.type.startsWith("audio/"));
  uploadedMusicFiles = files;
  uploadedMusicIndex = 0;
  if (files.length > 0) {
    selectedMusicTrack = "uploaded";
    localStorage.setItem("ragiJoyMusicTrack", "uploaded");
    v27MusicManuallyPaused = false;
    spawnCenterBurst("🎵 PLAYLIST READY");
    playSfx("level");
    if (soundEnabled) playUploadedMusic(0, true);
  }
  updateMusicHubUi();
  updateMusicDockUi();
};

nextUploadedTrack = function(fromEnded = false) {
  if (uploadedMusicFiles.length === 0) {
    previewMusicTrack();
    return;
  }
  uploadedMusicIndex = (uploadedMusicIndex + 1) % uploadedMusicFiles.length;
  selectedMusicTrack = "uploaded";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  if (soundEnabled && !v27MusicManuallyPaused) playUploadedMusic(uploadedMusicIndex, true);
  if (!fromEnded) playSfx("select");
  updateMusicDockUi();
};

previousUploadedTrack = function() {
  if (uploadedMusicFiles.length === 0) {
    previewMusicTrack();
    return;
  }
  uploadedMusicIndex = (uploadedMusicIndex - 1 + uploadedMusicFiles.length) % uploadedMusicFiles.length;
  selectedMusicTrack = "uploaded";
  localStorage.setItem("ragiJoyMusicTrack", selectedMusicTrack);
  if (soundEnabled && !v27MusicManuallyPaused) playUploadedMusic(uploadedMusicIndex, true);
  playSfx("select");
  updateMusicDockUi();
};

const v27PreviousSetMusicVolume = setMusicVolume;
setMusicVolume = function(value) {
  musicVolume = Math.max(0, Math.min(1, Number(value) / 100));
  localStorage.setItem("ragiJoyMusicVolume", String(musicVolume));
  if (uploadedMusicAudio) uploadedMusicAudio.volume = musicVolume;
  updateMusicDockUi();
};

const v27PreviousUpdateMusicHubUi = updateMusicHubUi;
updateMusicHubUi = function() {
  v27PreviousUpdateMusicHubUi();
  updateMusicDockUi();
};

const v27PreviousUpdateV26Language = updateV26Language;
updateV26Language = function() {
  v27PreviousUpdateV26Language();
  v26SetText("musicDockLabel", t("musicDockLabel"));
  v26SetText("aboutPrivacySettingsButton", t("aboutPrivacySettings"));
  updatePrivacyUi();
  updateMusicDockUi();
};

const v27PreviousShowAboutModal = showAboutModal;
showAboutModal = function() {
  updatePrivacyUi();
  v27PreviousShowAboutModal();
};

const v27PreviousInitPrivacyBanner = initPrivacyBanner;
initPrivacyBanner = function() {
  updatePrivacyUi();
  showPrivacyBanner(false);
  enableAnalyticsIfAllowed();
};

const v27PreviousStartGame = startGame;
startGame = function() {
  trackGameEvent("game_start", { mode: "computer", difficulty: selectedDifficulty });
  v27MusicManuallyPaused = false;
  v27PreviousStartGame();
  startMusic(false);
  updateMusicDockUi();
};

if (typeof startOnlineGame === "function") {
  const v27PreviousStartOnlineGame = startOnlineGame;
  startOnlineGame = function() {
    trackGameEvent("game_start", { mode: "friend", difficulty: selectedDifficulty });
    v27MusicManuallyPaused = false;
    v27PreviousStartOnlineGame();
    startMusic(false);
    updateMusicDockUi();
  };
}

const v27PreviousEndGame = endGame;
endGame = function(won) {
  trackGameEvent("game_end", { won: Boolean(won), difficulty: selectedDifficulty, score });
  v27PreviousEndGame(won);
  stopMusic({ destroyUploaded: false });
  v27MusicManuallyPaused = true;
  updateMusicDockUi();
};

const v27PreviousGoToMainMenu = goToMainMenu;
goToMainMenu = function() {
  v27PreviousGoToMainMenu();
  stopMusic({ destroyUploaded: false });
  v27MusicManuallyPaused = true;
  updateMusicDockUi();
};

updateV26Language();
updateMusicDockUi();
initPrivacyBanner();


/* --------------------------------------------------------------------------
   V28: CLEAN PRIVACY / COOKIE CHOICE FIX
   - Banner disappears immediately after Necessary only / Accept analytics.
   - Saved choices do not keep the bottom banner visible on refresh.
   - The About modal has a separate “Change privacy choice” action.
   - No gameplay, multiplayer, shop or music logic is changed here.
-------------------------------------------------------------------------- */
(function privacyV28Fix(){
  const PRIVACY_KEY = "ragiJoyPrivacyChoice";

  function privacyChoice() {
    return localStorage.getItem(PRIVACY_KEY) || "";
  }

  function privacyBanner() {
    return document.getElementById("privacyBanner");
  }

  function markPrivacyBodyState() {
    document.body.classList.toggle("privacy-choice-saved", Boolean(privacyChoice()));
  }

  const oldUpdatePrivacyUi = typeof updatePrivacyUi === "function" ? updatePrivacyUi : null;
  window.updatePrivacyUi = updatePrivacyUi = function updatePrivacyUiV28() {
    if (oldUpdatePrivacyUi) oldUpdatePrivacyUi();
    const choice = privacyChoice();
    const status = document.getElementById("privacyStatus");
    if (status) {
      status.textContent = choice === "analytics"
        ? t("privacyStatusAnalytics")
        : choice === "necessary"
          ? t("privacyStatusNecessary")
          : t("privacyStatusNone");
    }
    const current = document.getElementById("aboutCurrentChoice");
    if (current) {
      current.textContent = choice === "analytics"
        ? t("aboutCurrentAnalytics")
        : choice === "necessary"
          ? t("aboutCurrentNecessary")
          : t("aboutCurrentNone");
    }
    const settingsBtn = document.getElementById("aboutPrivacySettingsButton");
    if (settingsBtn) settingsBtn.textContent = t("aboutPrivacySettings");
    markPrivacyBodyState();
  };

  window.hidePrivacyBanner = hidePrivacyBanner = function hidePrivacyBannerV28() {
    const banner = privacyBanner();
    if (!banner) return;
    banner.classList.add("hidden");
    banner.classList.remove("force-open");
    banner.setAttribute("aria-hidden", "true");
    markPrivacyBodyState();
  };

  window.showPrivacyBanner = showPrivacyBanner = function showPrivacyBannerV28(force = false) {
    const banner = privacyBanner();
    if (!banner) return;
    updatePrivacyUi();

    if (force) {
      banner.classList.remove("hidden");
      banner.classList.add("force-open");
      banner.setAttribute("aria-hidden", "false");
      return;
    }

    if (!privacyChoice()) {
      banner.classList.remove("hidden");
      banner.classList.remove("force-open");
      banner.setAttribute("aria-hidden", "false");
    } else {
      hidePrivacyBanner();
    }
  };

  window.setPrivacyChoice = setPrivacyChoice = async function setPrivacyChoiceV28(choice) {
    const safeChoice = choice === "analytics" ? "analytics" : "necessary";
    localStorage.setItem(PRIVACY_KEY, safeChoice);
    updatePrivacyUi();
    hidePrivacyBanner();

    if (safeChoice === "analytics" && typeof enableAnalyticsIfAllowed === "function") {
      await enableAnalyticsIfAllowed();
    }
    if (window.FirebaseAnalytics && window.FirebaseAnalytics.enabled) {
      window.FirebaseAnalytics.logEvent("privacy_choice_saved", { choice: safeChoice });
    }
    if (typeof playSfx === "function") playSfx("select");
    if (typeof spawnCenterBurst === "function") {
      spawnCenterBurst(safeChoice === "analytics" ? t("privacySavedAnalyticsBurst") : t("privacySavedNecessaryBurst"));
    }
  };

  window.acceptPrivacyNecessary = acceptPrivacyNecessary = function acceptPrivacyNecessaryV28() {
    setPrivacyChoice("necessary");
  };

  window.acceptPrivacyAnalytics = acceptPrivacyAnalytics = function acceptPrivacyAnalyticsV28() {
    setPrivacyChoice("analytics");
  };

  window.changePrivacyChoiceFromAbout = function changePrivacyChoiceFromAboutV28() {
    if (typeof closeAboutModal === "function") closeAboutModal();
    setTimeout(() => showPrivacyBanner(true), 80);
  };

  window.initPrivacyBanner = initPrivacyBanner = function initPrivacyBannerV28() {
    updatePrivacyUi();
    showPrivacyBanner(false);
    if (privacyChoice() === "analytics" && typeof enableAnalyticsIfAllowed === "function") {
      enableAnalyticsIfAllowed();
    }
  };

  // Apply once after all older V26/V27 code has run.
  initPrivacyBanner();
})();

/* --------------------------------------------------------------------------
   V29 MUSIC CLEANUP / STABLE PLAYLIST
   - Music dock no longer shows long filenames/song names on the board.
   - Sound OFF pauses music without deleting uploaded playlist.
   - Sound ON resumes uploaded playlist even from the menu/customizer.
   - Game over pauses music but keeps the uploaded playlist in memory until refresh.
   - Main menu hides the dock, but it does not clear uploaded files.
-------------------------------------------------------------------------- */
(function v29MusicCleanup(){
  function setBodyMusicState() {
    document.body.classList.toggle("sound-off", !soundEnabled);
    document.body.classList.toggle("music-paused", Boolean(v27MusicManuallyPaused) || !soundEnabled);
    document.body.classList.toggle("music-session-active", Boolean(gameRunning || document.body.classList.contains("playing-state")));
  }

  const previousUpdateMusicDockUi = typeof updateMusicDockUi === "function" ? updateMusicDockUi : null;
  window.updateMusicDockUi = updateMusicDockUi = function updateMusicDockUiV29() {
    if (previousUpdateMusicDockUi) previousUpdateMusicDockUi();

    const label = document.getElementById("musicDockLabel");
    const title = document.getElementById("musicDockTitle");
    const play = document.getElementById("musicDockPlay");
    const prev = document.getElementById("musicDockPrev");
    const next = document.getElementById("musicDockNext");
    const dockVolume = document.getElementById("musicDockVolume");
    const customizeVolume = document.getElementById("musicVolume");
    const volumeLabel = document.getElementById("musicDockVolumeLabel");

    // Keep the screen clean: no long filenames/titles on top of the game board.
    if (label) label.textContent = "🎵";
    if (title) title.textContent = "";
    if (prev) prev.textContent = "⏮️";
    if (next) next.textContent = "⏭️";
    if (play) play.textContent = (!soundEnabled || v27MusicManuallyPaused) ? "▶️" : "⏸️";
    if (dockVolume) dockVolume.value = String(Math.round(musicVolume * 100));
    if (customizeVolume) customizeVolume.value = String(Math.round(musicVolume * 100));
    if (volumeLabel) {
      const input = volumeLabel.querySelector("input");
      // Remove visible text; CSS shows the speaker icon. Preserve the range input.
      Array.from(volumeLabel.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = "";
      });
      if (input && input.parentElement !== volumeLabel) volumeLabel.appendChild(input);
    }

    const soundBtn = document.getElementById("soundButton");
    if (soundBtn) soundBtn.textContent = soundEnabled ? t("soundOn") : t("soundOff");
    if (typeof updateStartSummary === "function") updateStartSummary();
    setBodyMusicState();
  };

  // Override sound toggle so uploaded music can pause/resume without forcing refresh/re-upload.
  window.toggleGameSound = toggleGameSound = function toggleGameSoundV29() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("ragiJoySound", soundEnabled ? "on" : "off");

    if (!soundEnabled) {
      v27MusicManuallyPaused = true;
      if (typeof stopMusic === "function") stopMusic({ destroyUploaded: false });
    } else {
      v27MusicManuallyPaused = false;
      if (typeof playSfx === "function") playSfx("select");
      // If user uploaded music on the front page/customizer, resume it even before the match starts.
      if (selectedMusicTrack === "uploaded" && uploadedMusicFiles.length > 0) {
        playUploadedMusic(uploadedMusicIndex, false);
      } else if (gameRunning) {
        startMusic(false);
      }
    }
    updateMusicDockUi();
  };

  // Make the play button work both during a match and after game over without losing the file list.
  window.toggleMusicPlayback = toggleMusicPlayback = function toggleMusicPlaybackV29() {
    if (!soundEnabled) {
      soundEnabled = true;
      localStorage.setItem("ragiJoySound", "on");
    }
    v27MusicManuallyPaused = !v27MusicManuallyPaused;
    if (v27MusicManuallyPaused) {
      if (typeof stopMusic === "function") stopMusic({ destroyUploaded: false });
    } else if (selectedMusicTrack === "uploaded" && uploadedMusicFiles.length > 0) {
      playUploadedMusic(uploadedMusicIndex, false);
    } else if (gameRunning) {
      startMusic(false);
    } else {
      // Built-in WebAudio rhythm is only started during gameplay, but the button state should still update.
      if (typeof playSfx === "function") playSfx("select");
    }
    updateMusicDockUi();
  };

  const previousStartGameV29 = typeof startGame === "function" ? startGame : null;
  if (previousStartGameV29) {
    window.startGame = startGame = function startGameV29() {
      document.body.classList.add("music-session-active");
      previousStartGameV29();
      document.body.classList.add("music-session-active");
      updateMusicDockUi();
    };
  }

  if (typeof startOnlineGame === "function") {
    const previousStartOnlineGameV29 = startOnlineGame;
    window.startOnlineGame = startOnlineGame = function startOnlineGameV29() {
      document.body.classList.add("music-session-active");
      previousStartOnlineGameV29();
      document.body.classList.add("music-session-active");
      updateMusicDockUi();
    };
  }

  const previousEndGameV29 = typeof endGame === "function" ? endGame : null;
  if (previousEndGameV29) {
    window.endGame = endGame = function endGameV29(won) {
      previousEndGameV29(won);
      // Pause at match end, but keep playlist and keep mini controller available on end screen.
      v27MusicManuallyPaused = true;
      if (typeof stopMusic === "function") stopMusic({ destroyUploaded: false });
      document.body.classList.add("music-session-active");
      updateMusicDockUi();
    };
  }

  const previousGoToMainMenuV29 = typeof goToMainMenu === "function" ? goToMainMenu : null;
  if (previousGoToMainMenuV29) {
    window.goToMainMenu = goToMainMenu = function goToMainMenuV29() {
      previousGoToMainMenuV29();
      // Hide the mini player on main menu, but do NOT clear uploadedMusicFiles.
      document.body.classList.remove("music-session-active");
      v27MusicManuallyPaused = true;
      if (typeof stopMusic === "function") stopMusic({ destroyUploaded: false });
      updateMusicDockUi();
    };
  }

  const previousHandleMusicUploadV29 = typeof handleMusicUpload === "function" ? handleMusicUpload : null;
  if (previousHandleMusicUploadV29) {
    window.handleMusicUpload = handleMusicUpload = function handleMusicUploadV29(event) {
      previousHandleMusicUploadV29(event);
      // Browser keeps files in memory until refresh. We deliberately do not clear this list on game over/menu.
      updateMusicDockUi();
    };
  }

  const previousSetMusicVolumeV29 = typeof setMusicVolume === "function" ? setMusicVolume : null;
  window.setMusicVolume = setMusicVolume = function setMusicVolumeV29(value) {
    musicVolume = Math.max(0, Math.min(1, Number(value) / 100));
    localStorage.setItem("ragiJoyMusicVolume", String(musicVolume));
    if (uploadedMusicAudio) uploadedMusicAudio.volume = musicVolume;
    const dockVolume = document.getElementById("musicDockVolume");
    const customizeVolume = document.getElementById("musicVolume");
    if (dockVolume) dockVolume.value = String(Math.round(musicVolume * 100));
    if (customizeVolume) customizeVolume.value = String(Math.round(musicVolume * 100));
    updateMusicDockUi();
  };

  updateMusicDockUi();
})();

/* --------------------------------------------------------------------------
   V30 WORLD BUILD
   - Pause button + back to menu only when paused
   - Language selector hidden during active play
   - Extra shop powers for singleplayer
   - More varied boards after level 10
   - Enemy style/animation selector
   Multiplayer sync code above is intentionally untouched.
-------------------------------------------------------------------------- */
Object.assign(translations.no, {
  pauseButton: "⏸️ Pause",
  resumeButton: "▶️ Fortsett",
  menuFromPauseButton: "🏠 Hovedmeny",
  enemyStyleLabel: "Velg fiende-stil / animasjon",
  shopBombTitle: "💣 Diamantbombe",
  shopBombDesc: "Sender alle fiender tilbake til start og gir bonuspoeng.",
  shopFreezeTitle: "❄️ Freeze blast",
  shopFreezeDesc: "Fryser fiendene i noen sekunder så du kan rømme.",
  shopMagnetTitle: "🧲 Diamantmagnet",
  shopMagnetDesc: "Suger inn diamanter rundt deg mens du beveger deg.",
  shopDoubleTitle: "⭐ Dobbel score",
  shopDoubleDesc: "Alle poeng dobles i 20 sekunder.",
  shopTeleportTitle: "🌀 Nødteleport",
  shopTeleportDesc: "Flytter deg til et trygt tilfeldig sted på brettet.",
  shopBoughtBomb: "💣 BOOM! Alle fiender ble sendt tilbake.",
  shopBoughtFreeze: "❄️ Fiendene er fryst i noen sekunder!",
  shopBoughtMagnet: "🧲 Magnet aktivert! Diamanter nær deg trekkes inn.",
  shopBoughtDouble: "⭐ Dobbel score aktivert i 20 sekunder!",
  shopBoughtTeleport: "🌀 Nødteleport aktivert!",
  shopEffectActive: "Aktiv"
});
Object.assign(translations.en, {
  pauseButton: "⏸️ Pause",
  resumeButton: "▶️ Resume",
  menuFromPauseButton: "🏠 Main menu",
  enemyStyleLabel: "Choose enemy style / animation",
  shopBombTitle: "💣 Diamond bomb",
  shopBombDesc: "Sends all enemies back to spawn and gives bonus points.",
  shopFreezeTitle: "❄️ Freeze blast",
  shopFreezeDesc: "Freezes enemies for a few seconds so you can escape.",
  shopMagnetTitle: "🧲 Diamond magnet",
  shopMagnetDesc: "Pulls nearby diamonds in while you move.",
  shopDoubleTitle: "⭐ Double score",
  shopDoubleDesc: "All points are doubled for 20 seconds.",
  shopTeleportTitle: "🌀 Emergency teleport",
  shopTeleportDesc: "Moves you to a safe random tile on the board.",
  shopBoughtBomb: "💣 BOOM! All enemies were sent back.",
  shopBoughtFreeze: "❄️ Enemies are frozen for a few seconds!",
  shopBoughtMagnet: "🧲 Magnet active! Nearby diamonds are pulled in.",
  shopBoughtDouble: "⭐ Double score active for 20 seconds!",
  shopBoughtTeleport: "🌀 Emergency teleport activated!",
  shopEffectActive: "Active"
});
for (const language of languageOptions) {
  translations[language.code] = translations[language.code] || { ...translations.en };
  for (const key of [
    "pauseButton", "resumeButton", "menuFromPauseButton", "enemyStyleLabel",
    "shopBombTitle", "shopBombDesc", "shopFreezeTitle", "shopFreezeDesc",
    "shopMagnetTitle", "shopMagnetDesc", "shopDoubleTitle", "shopDoubleDesc",
    "shopTeleportTitle", "shopTeleportDesc", "shopBoughtBomb", "shopBoughtFreeze",
    "shopBoughtMagnet", "shopBoughtDouble", "shopBoughtTeleport", "shopEffectActive"
  ]) {
    if (!translations[language.code][key]) translations[language.code][key] = translations.en[key];
  }
}

// --- Varied campaign maps after level 10 ---
const V30_LEVEL_NAMES = [
  "Mirror Maze", "Emoji Crossfire", "Laser Garden", "Frozen Loop", "Monster Market",
  "Snake Tunnel", "Diamond Factory", "Fire Temple", "Rocket Box", "Ghost Circuit",
  "Turbo Spiral", "Double Trouble", "Crystal Blocks", "Wild Forest", "Space Panic",
  "Boss Corridor", "Storm Bridge", "Candy Trap", "Night Runner", "Final Party"
];

function v30BuildLevel(index) {
  const width = 13;
  const height = 11;
  const mode = index % 12;
  const rows = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return "1";
    return "2";
  }));
  const wall = (x, y) => { if (x > 0 && y > 0 && x < width - 1 && y < height - 1) rows[y][x] = "1"; };
  const open = (x, y, value = "2") => { if (x > 0 && y > 0 && x < width - 1 && y < height - 1) rows[y][x] = value; };

  if (mode === 0) {
    for (let y = 2; y < 9; y++) { if (y !== 5) { wall(3, y); wall(9, y); } }
    for (let x = 4; x < 9; x += 2) wall(x, 5);
  } else if (mode === 1) {
    for (let x = 2; x < 11; x++) { if (x !== 6) { wall(x, 3); wall(x, 7); } }
    wall(6, 5); wall(2, 5); wall(10, 5);
  } else if (mode === 2) {
    for (let x = 2; x <= 10; x++) wall(x, 2);
    for (let y = 2; y <= 8; y++) wall(10, y);
    for (let x = 3; x <= 10; x++) wall(x, 8);
    for (let y = 4; y <= 8; y++) wall(3, y);
    for (let x = 3; x <= 8; x++) wall(x, 4);
    open(6, 2); open(10, 5); open(6, 8); open(3, 6); open(6, 4);
  } else if (mode === 3) {
    [[3,2],[5,2],[7,2],[9,2],[2,4],[4,4],[8,4],[10,4],[3,6],[5,6],[7,6],[9,6],[2,8],[6,8],[10,8]].forEach(([x,y]) => wall(x,y));
  } else if (mode === 4) {
    for (let y = 2; y <= 8; y++) if (y !== 5) wall(6, y);
    for (let x = 2; x <= 10; x++) if (x !== 6) wall(x, 5);
    open(6, 5, "3"); open(2, 2, "4"); open(10, 8, "3");
  } else if (mode === 5) {
    for (let x = 2; x <= 10; x += 2) {
      for (let y = 2; y <= 8; y++) if ((x + y + index) % 4 !== 0) wall(x, y);
    }
    open(2, 5); open(6, 5); open(10, 5);
  } else if (mode === 6) {
    for (let x = 2; x <= 10; x++) if (x !== 4 && x !== 8) { wall(x, 2); wall(x, 8); }
    for (let y = 3; y <= 7; y++) if (y !== 5) { wall(2, y); wall(10, y); }
    wall(6,3); wall(6,7); open(6,5,"3");
  } else if (mode === 7) {
    for (let y = 2; y <= 8; y += 2) for (let x = 2; x <= 10; x++) if (x !== ((y + index) % 8) + 2) wall(x, y);
  } else if (mode === 8) {
    [[2,2],[3,2],[9,2],[10,2],[2,8],[3,8],[9,8],[10,8],[5,4],[6,4],[7,4],[5,6],[6,6],[7,6]].forEach(([x,y]) => wall(x,y));
    open(6,5,"4");
  } else if (mode === 9) {
    for (let y = 2; y <= 8; y++) { wall(4, y); wall(8, y); }
    open(4, 3); open(8, 7); open(4, 8); open(8, 2);
    for (let x = 2; x <= 10; x++) if (x % 3 === 0) wall(x, 5);
    open(6, 5, "3");
  } else if (mode === 10) {
    [[2,3],[3,3],[4,3],[8,3],[9,3],[10,3],[2,7],[3,7],[4,7],[8,7],[9,7],[10,7],[6,2],[6,4],[6,6],[6,8]].forEach(([x,y]) => wall(x,y));
  } else {
    for (let y = 2; y <= 8; y++) {
      if (y !== 5) { wall(2, y); wall(5, y); wall(8, y); wall(11, y); }
    }
    open(5, 3); open(8, 7); open(2, 5); open(11, 5);
  }

  // Safe player, portal/powerups and enemy spawns.
  [[1,1],[11,9],[11,1],[1,9],[6,5],[6,1],[1,5],[11,5]].forEach(([x,y]) => open(x, y));
  open(3 + (index % 7), 3, "3");
  open(9 - (index % 5), 7, index % 3 === 0 ? "4" : "3");
  open(6, 5, mode % 4 === 0 ? "4" : rows[5][6]);

  const enemySeeds = [
    { x: 11, y: 9 }, { x: 11, y: 1 }, { x: 1, y: 9 }, { x: 6, y: 5 }, { x: 6, y: 1 }
  ];
  const enemyCount = Math.min(5, 2 + Math.floor((index - 10) / 14));
  return {
    name: `${V30_LEVEL_NAMES[index % V30_LEVEL_NAMES.length]} ${index + 1}`,
    theme: v26ThemeCycle[index % v26ThemeCycle.length],
    speed: Math.max(365, 610 - index * 2.5),
    enemies: enemySeeds.slice(0, enemyCount).map(enemy => ({ ...enemy })),
    player: { x: 1, y: 1 },
    map: rows.map(row => row.join(""))
  };
}
for (let i = 10; i < levels.length; i++) {
  levels[i] = v30BuildLevel(i);
}

// --- Pause/menu UI ---
function v30UpdatePlayUi() {
  const active = Boolean(gameRunning);
  document.body.classList.toggle("game-active", active);
  document.body.classList.toggle("paused-state", Boolean(active && paused));
  const pauseButton = document.getElementById("pauseButton");
  if (pauseButton) {
    pauseButton.textContent = paused ? t("resumeButton") : t("pauseButton");
    pauseButton.disabled = !active;
  }
  const menuButton = document.getElementById("menuFromPauseButton");
  if (menuButton) menuButton.textContent = t("menuFromPauseButton");
}

function returnToMainMenuFromPause() {
  if (!gameRunning) return;
  paused = false;
  goToMainMenu();
  v30UpdatePlayUi();
}
window.returnToMainMenuFromPause = returnToMainMenuFromPause;

const v30PreviousTogglePause = togglePause;
togglePause = function() {
  v30PreviousTogglePause.apply(this, arguments);
  v30UpdatePlayUi();
};
window.togglePause = togglePause;

for (const fnName of ["startGame", "startOnlineGame", "goToMainMenu", "endGame", "openPowerShop", "closePowerShop"]) {
  const previous = window[fnName] || globalThis[fnName];
  if (typeof previous === "function") {
    window[fnName] = globalThis[fnName] = function v30StateWrapper() {
      const result = previous.apply(this, arguments);
      setTimeout(v30UpdatePlayUi, 0);
      return result;
    };
  }
}

const v30PreviousApplyLanguage = applyLanguage;
applyLanguage = function() {
  v30PreviousApplyLanguage.apply(this, arguments);
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("pauseButton", paused ? t("resumeButton") : t("pauseButton"));
  set("menuFromPauseButton", t("menuFromPauseButton"));
  set("enemyStyleLabel", t("enemyStyleLabel"));
  set("shopBombTitle", t("shopBombTitle"));
  set("shopBombDesc", t("shopBombDesc"));
  set("shopFreezeTitle", t("shopFreezeTitle"));
  set("shopFreezeDesc", t("shopFreezeDesc"));
  set("shopMagnetTitle", t("shopMagnetTitle"));
  set("shopMagnetDesc", t("shopMagnetDesc"));
  set("shopDoubleTitle", t("shopDoubleTitle"));
  set("shopDoubleDesc", t("shopDoubleDesc"));
  set("shopTeleportTitle", t("shopTeleportTitle"));
  set("shopTeleportDesc", t("shopTeleportDesc"));
  v30UpdateShopTexts();
  v30UpdatePlayUi();
};
window.applyLanguage = applyLanguage;

// --- Enemy style selector ---
const V30_ENEMY_STYLE_KEY = "ragiJoyEnemyStyle";
let selectedEnemyStyle = localStorage.getItem(V30_ENEMY_STYLE_KEY) || "monsters";
const v30EnemyPools = {
  monsters: ["👾", "💀", "😈", "🤡", "👻", "🧟", "🦹"],
  fire: ["🔥", "👹", "💣", "⚡", "🌋", "☄️"],
  ghosts: ["👻", "💀", "🧛", "🦇", "🕷️"],
  boss: ["🧟", "🦹", "👺", "🤖", "🐲"],
  animals: ["🦖", "🐙", "🦈", "🐍", "🦂", "🦇"]
};
function setEnemyStyle(style) {
  if (!v30EnemyPools[style]) style = "monsters";
  selectedEnemyStyle = style;
  randomEnemyEmojis = true;
  localStorage.setItem(V30_ENEMY_STYLE_KEY, selectedEnemyStyle);
  localStorage.setItem("ragiJoyRandomEnemies", "on");
  document.body.dataset.enemyStyle = selectedEnemyStyle;
  enemies.forEach(enemy => enemy.face = getEnemyFace());
  updateCustomizerUi();
  drawGame();
  playSfx("enemy");
}
window.setEnemyStyle = setEnemyStyle;

const v30PreviousGetEnemyFace = getEnemyFace;
getEnemyFace = function() {
  if (!randomEnemyEmojis) return "👾";
  const pool = v30EnemyPools[selectedEnemyStyle] || enemyEmojiPool || v30EnemyPools.monsters;
  return pool[Math.floor(Math.random() * pool.length)];
};
window.getEnemyFace = getEnemyFace;

const v30PreviousUpdateCustomizerUi = updateCustomizerUi;
updateCustomizerUi = function() {
  v30PreviousUpdateCustomizerUi.apply(this, arguments);
  document.body.dataset.enemyStyle = selectedEnemyStyle;
  document.querySelectorAll("#enemyStyleGrid button").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.enemyStyle === selectedEnemyStyle);
  });
};
window.updateCustomizerUi = updateCustomizerUi;

// --- Extra shop powers ---
Object.assign(V23_SHOP_COSTS, {
  bomb: 1500,
  freeze: 1100,
  magnet: 900,
  double: 1300,
  teleport: 700
});
let v30FreezeUntil = 0;
let v30MagnetUntil = 0;
let v30DoubleUntil = 0;

function v30UpdateShopTexts() {
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("shopBombTitle", t("shopBombTitle"));
  set("shopBombDesc", t("shopBombDesc"));
  set("shopFreezeTitle", t("shopFreezeTitle"));
  set("shopFreezeDesc", t("shopFreezeDesc"));
  set("shopMagnetTitle", t("shopMagnetTitle"));
  set("shopMagnetDesc", t("shopMagnetDesc"));
  set("shopDoubleTitle", t("shopDoubleTitle"));
  set("shopDoubleDesc", t("shopDoubleDesc"));
  set("shopTeleportTitle", t("shopTeleportTitle"));
  set("shopTeleportDesc", t("shopTeleportDesc"));
  set("buyBombButton", `${t("shopBuy")} ${V23_SHOP_COSTS.bomb}`);
  set("buyFreezeButton", `${t("shopBuy")} ${V23_SHOP_COSTS.freeze}`);
  set("buyMagnetButton", `${t("shopBuy")} ${V23_SHOP_COSTS.magnet}`);
  set("buyDoubleButton", `${t("shopBuy")} ${V23_SHOP_COSTS.double}`);
  set("buyTeleportButton", `${t("shopBuy")} ${V23_SHOP_COSTS.teleport}`);
}

const v30PreviousShopTexts = v23UpdateShopTexts;
v23UpdateShopTexts = function() {
  v30PreviousShopTexts.apply(this, arguments);
  v30UpdateShopTexts();
};
window.v23UpdateShopTexts = v23UpdateShopTexts;

const v30PreviousShopUi = v23UpdateShopUi;
v23UpdateShopUi = function() {
  v30PreviousShopUi.apply(this, arguments);
  const now = Date.now();
  const notSingle = onlineMode || !gameRunning;
  const setDisabled = (id, value) => { const btn = document.getElementById(id); if (btn) btn.disabled = value; };
  setDisabled("buyBombButton", notSingle || score < V23_SHOP_COSTS.bomb);
  setDisabled("buyFreezeButton", notSingle || score < V23_SHOP_COSTS.freeze || now < v30FreezeUntil);
  setDisabled("buyMagnetButton", notSingle || score < V23_SHOP_COSTS.magnet || now < v30MagnetUntil);
  setDisabled("buyDoubleButton", notSingle || score < V23_SHOP_COSTS.double || now < v30DoubleUntil);
  setDisabled("buyTeleportButton", notSingle || score < V23_SHOP_COSTS.teleport);
};
window.v23UpdateShopUi = v23UpdateShopUi;

function v30Spend(cost) {
  if (onlineMode || !gameRunning) return false;
  if (score < cost) {
    if (messageBar) messageBar.textContent = t("shopNotEnough");
    playSfx("lose");
    return false;
  }
  score -= cost;
  return true;
}

function v30ResetEnemiesWithBonus() {
  enemies.forEach(enemy => { enemy.x = enemy.startX; enemy.y = enemy.startY; });
  score += Math.max(120, enemies.length * 90);
  spawnCenterBurst("💣 BOOM");
  if (messageBar) messageBar.textContent = t("shopBoughtBomb");
  playSfx("enemy");
  drawGame();
}

function v30SafeEmptyTiles() {
  const result = [];
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
      if (map[y][x] === TILE.WALL) continue;
      if (enemies.some(enemy => Math.abs(enemy.x - x) + Math.abs(enemy.y - y) < 5)) continue;
      result.push({ x, y });
    }
  }
  return result;
}

function v30TeleportPlayer() {
  const spots = v30SafeEmptyTiles();
  if (!spots.length) return;
  const pos = spots[Math.floor(Math.random() * spots.length)];
  player.x = pos.x;
  player.y = pos.y;
  collectTile(player.x, player.y);
  spawnCenterBurst("🌀 TELEPORT");
  if (messageBar) messageBar.textContent = t("shopBoughtTeleport");
  playSfx("power");
  drawGame();
}

function v30CollectNearbyDiamonds() {
  if (!gameRunning || onlineMode || Date.now() > v30MagnetUntil) return;
  let picked = 0;
  for (let y = Math.max(1, player.y - 2); y <= Math.min(map.length - 2, player.y + 2); y++) {
    for (let x = Math.max(1, player.x - 2); x <= Math.min(map[y].length - 2, player.x + 2); x++) {
      if (map[y][x] === TILE.DOT && Math.abs(player.x - x) + Math.abs(player.y - y) <= 2) {
        map[y][x] = TILE.EMPTY;
        diamondsLeft--;
        score += Date.now() < v30DoubleUntil ? 20 : 10;
        picked++;
        spawnPop("💎", x, y);
      }
    }
  }
  if (picked) {
    combo = Math.min(combo + picked, 9);
    checkPortal();
    drawGame();
  }
}

const v30PreviousBuyShopItem = buyShopItem;
buyShopItem = function(item) {
  if (!["bomb", "freeze", "magnet", "double", "teleport"].includes(item)) {
    return v30PreviousBuyShopItem.apply(this, arguments);
  }
  const cost = V23_SHOP_COSTS[item];
  if (!v30Spend(cost)) return;

  if (item === "bomb") v30ResetEnemiesWithBonus();
  if (item === "freeze") {
    v30FreezeUntil = Date.now() + 6500;
    spawnCenterBurst("❄️ FREEZE");
    if (messageBar) messageBar.textContent = t("shopBoughtFreeze");
    playSfx("power");
    drawGame();
  }
  if (item === "magnet") {
    v30MagnetUntil = Date.now() + 14000;
    spawnCenterBurst("🧲 MAGNET");
    if (messageBar) messageBar.textContent = t("shopBoughtMagnet");
    v30CollectNearbyDiamonds();
    playSfx("power");
  }
  if (item === "double") {
    v30DoubleUntil = Date.now() + 20000;
    spawnCenterBurst("⭐ 2X SCORE");
    if (messageBar) messageBar.textContent = t("shopBoughtDouble");
    playSfx("level");
    drawGame();
  }
  if (item === "teleport") v30TeleportPlayer();
  v23UpdateShopUi();
};
window.buyShopItem = buyShopItem;

const v30PreviousMoveEnemies = moveEnemies;
moveEnemies = function() {
  if (!onlineMode && gameRunning && !paused && Date.now() < v30FreezeUntil) {
    clearInterval(enemyTimer);
    enemyTimer = setTimeout(moveEnemies, 260);
    return;
  }
  return v30PreviousMoveEnemies.apply(this, arguments);
};
window.moveEnemies = moveEnemies;

const v30PreviousCollectTile = collectTile;
collectTile = function(x, y) {
  const before = score;
  v30PreviousCollectTile.apply(this, arguments);
  if (!onlineMode && Date.now() < v30DoubleUntil && score > before) {
    score += score - before;
  }
};
window.collectTile = collectTile;

const v30PreviousMovePlayer = movePlayer;
movePlayer = function(dx, dy) {
  const beforeX = player.x;
  const beforeY = player.y;
  v30PreviousMovePlayer.apply(this, arguments);
  if (!onlineMode && gameRunning && !paused && (player.x !== beforeX || player.y !== beforeY)) {
    v30CollectNearbyDiamonds();
  }
};
window.movePlayer = movePlayer;

const v30PreviousLoadLevel = loadLevel;
loadLevel = function(index) {
  v30PreviousLoadLevel.apply(this, arguments);
  if (!onlineMode) {
    // Keep temporary shop effects between levels, but never keep old board placements.
    document.body.dataset.enemyStyle = selectedEnemyStyle;
  }
  v30UpdatePlayUi();
};
window.loadLevel = loadLevel;

// Initialize V30 UI state.
document.body.dataset.enemyStyle = selectedEnemyStyle;
setTimeout(() => {
  updateCustomizerUi();
  v30UpdateShopTexts();
  v30UpdatePlayUi();
}, 0);

/* --------------------------------------------------------------------------
   V32: Nedtelling + robust nødteleport + shop-stabilitet
   - Legger til 3-2-1-GO overlay før singleplayer starter.
   - Fikser nødteleport slik at spilleren alltid flyttes til en trygg tom rute.
   - Legger inn manglende portal-check som shop/magnet kan bruke uten feil.
   Multiplayer-sync endres ikke her.
-------------------------------------------------------------------------- */
Object.assign(translations.no, {
  countdownReady: "Gjør deg klar!",
  countdownGo: "KJØR!",
  countdownTip: "Samle 💎, bruk ⚡ smart og overlev fiendene.",
  shopTeleportNoSpot: "Fant ingen trygg rute akkurat nå. Prøv igjen etter at du har flyttet deg litt.",
  shopTeleportMoved: "🌀 Nødteleport fullført! Du er flyttet til trygg rute."
});
Object.assign(translations.en, {
  countdownReady: "Get ready!",
  countdownGo: "GO!",
  countdownTip: "Collect 💎, use ⚡ smartly and survive the enemies.",
  shopTeleportNoSpot: "No safe tile found right now. Move a little and try again.",
  shopTeleportMoved: "🌀 Emergency teleport complete! You moved to a safe tile."
});
for (const language of languageOptions) {
  translations[language.code] = translations[language.code] || { ...translations.en };
  ["countdownReady", "countdownGo", "countdownTip", "shopTeleportNoSpot", "shopTeleportMoved"].forEach(key => {
    if (!translations[language.code][key]) translations[language.code][key] = translations.en[key];
  });
}

function v32EnsureCountdownOverlay() {
  let overlay = document.getElementById("countdownOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "countdownOverlay";
  overlay.className = "countdown-overlay hidden";
  overlay.setAttribute("aria-live", "polite");
  overlay.innerHTML = `
    <div class="countdown-card">
      <div class="countdown-kicker" id="countdownKicker">${t("countdownReady")}</div>
      <div class="countdown-number" id="countdownNumber">3</div>
      <div class="countdown-tip" id="countdownTip">${t("countdownTip")}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function v32ShowCountdown() {
  return new Promise(resolve => {
    const overlay = v32EnsureCountdownOverlay();
    const kicker = document.getElementById("countdownKicker");
    const number = document.getElementById("countdownNumber");
    const tip = document.getElementById("countdownTip");
    if (kicker) kicker.textContent = t("countdownReady");
    if (tip) tip.textContent = t("countdownTip");
    overlay.classList.remove("hidden");
    overlay.classList.remove("countdown-go-state");

    const sequence = ["3", "2", "1", t("countdownGo")];
    let index = 0;
    const tick = () => {
      if (number) {
        number.textContent = sequence[index];
        number.classList.remove("countdown-pop");
        // Restart CSS animation reliably.
        void number.offsetWidth;
        number.classList.add("countdown-pop");
      }
      if (sequence[index] === t("countdownGo")) {
        overlay.classList.add("countdown-go-state");
        if (typeof playSfx === "function") playSfx("level");
      } else if (typeof playSfx === "function") {
        playSfx("select");
      }
      index++;
      if (index < sequence.length) {
        setTimeout(tick, 620);
      } else {
        setTimeout(() => {
          overlay.classList.add("hidden");
          resolve();
        }, 560);
      }
    };
    tick();
  });
}

function checkPortal() {
  if (diamondsLeft <= 0 && !portalOpen && typeof openPortal === "function") openPortal();
}
window.checkPortal = checkPortal;

function v32TileIsSafeForTeleport(x, y) {
  if (!map[y] || map[y][x] === undefined) return false;
  const tile = map[y][x];
  if (tile === TILE.WALL || tile === TILE.PORTAL) return false;
  if (x === player.x && y === player.y) return false;
  if (v23Turrets && v23Turrets.some(turret => turret.x === x && turret.y === y)) return false;
  // En safe rute må ha litt avstand til ALLE fiender, ellers føles teleporten ødelagt.
  return !enemies.some(enemy => Math.abs(enemy.x - x) + Math.abs(enemy.y - y) < 4);
}

function v32SafeTeleportTiles() {
  const safe = [];
  const fallback = [];
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
      if (!map[y] || map[y][x] === TILE.WALL || map[y][x] === TILE.PORTAL) continue;
      if (x === player.x && y === player.y) continue;
      if (v23Turrets && v23Turrets.some(turret => turret.x === x && turret.y === y)) continue;
      const nearestEnemy = enemies.reduce((best, enemy) => Math.min(best, Math.abs(enemy.x - x) + Math.abs(enemy.y - y)), 99);
      if (nearestEnemy >= 4) safe.push({ x, y, nearestEnemy });
      else if (nearestEnemy >= 2) fallback.push({ x, y, nearestEnemy });
    }
  }
  return (safe.length ? safe : fallback).sort((a, b) => b.nearestEnemy - a.nearestEnemy);
}

function v30TeleportPlayer() {
  if (!gameRunning || onlineMode) return false;
  const spots = v32SafeTeleportTiles();
  if (!spots.length) {
    if (messageBar) messageBar.textContent = t("shopTeleportNoSpot");
    if (typeof playSfx === "function") playSfx("lose");
    return false;
  }
  const bestFive = spots.slice(0, Math.min(5, spots.length));
  const pos = bestFive[Math.floor(Math.random() * bestFive.length)];

  player.x = pos.x;
  player.y = pos.y;

  // Samle evt. diamant/power på landingsruten, men ikke kall nextLevel direkte mens butikken er åpen.
  const landedTile = map[player.y][player.x];
  if (landedTile === TILE.DOT || landedTile === TILE.POWER || landedTile === TILE.SHIELD) {
    collectTile(player.x, player.y);
  }
  checkEnemyCollision();
  spawnPop("🌀", player.x, player.y);
  spawnCenterBurst("🌀 TELEPORT");
  if (messageBar) messageBar.textContent = t("shopTeleportMoved");
  if (typeof playSfx === "function") playSfx("power");
  drawGame();
  v23UpdateShopUi();

  // Lukk butikken etter teleport, ellers ser det ut som ingenting skjedde bak dialogen.
  const modal = document.getElementById("shopModal");
  if (modal && typeof modal.close === "function") modal.close();
  else if (modal) modal.removeAttribute("open");
  return true;
}
window.v30TeleportPlayer = v30TeleportPlayer;

// Start singleplayer med ekte nedtelling uten å røre multiplayer-koden.
const v32PreviousStartGame = startGame;
startGame = function startGameV32Countdown() {
  v32PreviousStartGame.apply(this, arguments);
  if (onlineMode || !gameRunning) return;

  paused = true;
  clearInterval(enemyTimer);
  clearTimeout(enemyTimer);
  v30UpdatePlayUi();
  messageBar.textContent = t("countdownReady");

  v32ShowCountdown().then(() => {
    if (!gameRunning || onlineMode) return;
    paused = false;
    levelStartTime = Date.now();
    clearInterval(enemyTimer);
    clearTimeout(enemyTimer);
    enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
    messageBar.textContent = `Level ${levelIndex + 1}: ${(levels[levelIndex] && levels[levelIndex].name) || ""}`;
    v30UpdatePlayUi();
    drawGame();
  });
};
window.startGame = startGame;

// Hvis bruker går til meny eller taper mens nedtelling går, skal overlay bort.
const v32PreviousGoToMainMenu = goToMainMenu;
goToMainMenu = function goToMainMenuV32() {
  const overlay = document.getElementById("countdownOverlay");
  if (overlay) overlay.classList.add("hidden");
  return v32PreviousGoToMainMenu.apply(this, arguments);
};
window.goToMainMenu = goToMainMenu;

/* --------------------------------------------------------------------------
   V33 CAMPAIGN + TELEPORT + WINNER RESULT PATCH
   Viktig: Dette er kun SINGLEPLAYER-fiks/utvidelse.
   - Multiplayer-kjernen er IKKE endret.
   - Powerbutikk beholdes, men Nødteleport gjenopptar spillet riktig.
   - Kampanjen låses til maks 35 level på alle vanskelighetsgrader.
   - Når level 35 fullføres får spilleren gratulasjon og kan lagre navn i Top 10.
   -------------------------------------------------------------------------- */
(function v33CampaignWinnerPatch() {
  const V33_MAX_LEVELS = 35;
  const V33_WINNERS_KEY = "ragiJoyMazeWinnersV33";
  document.title = "Ragish kutty 28 single Joys Maze";

  Object.assign(translations.no, {
    maxLevelInfo: "Maks level: 35",
    levelGrandFinal: "Du klarte alle 35 levelene! 🔥",
    winnerButton: "🏆 Vinnerresultat",
    winnersTitle: "🏆 Top 10 vinnere",
    winnersSubtitle: "Lagres lokalt i denne nettleseren. Fullfør level 35 for å komme på listen.",
    winnersEmpty: "Ingen vinnere ennå. Fullfør level 35 og skriv inn navnet ditt.",
    winnersClose: "Lukk",
    championTitle: "🎉 Gratulerer!",
    championText: "Du fullførte alle 35 levelene. Skriv inn navnet du vil vise på Top 10-listen.",
    championNameLabel: "Navn på vinnerlisten",
    championNamePlaceholder: "Skriv navn",
    championSave: "✅ Lagre på Top 10",
    championSkip: "Hopp over",
    championSaved: "Vinnerresultat lagret! 🏆",
    campaignFinishedSummary: "Legendarisk! Du fullførte hele kampanjen på 35 level.",
    shopTeleportMoved: "🌀 Nødteleport brukt. Spillet fortsetter!",
    levelCountLabel: "Level"
  });

  Object.assign(translations.en, {
    maxLevelInfo: "Max level: 35",
    levelGrandFinal: "You cleared all 35 levels! 🔥",
    winnerButton: "🏆 Winner results",
    winnersTitle: "🏆 Top 10 winners",
    winnersSubtitle: "Saved locally in this browser. Complete level 35 to enter the list.",
    winnersEmpty: "No winners yet. Complete level 35 and enter your name.",
    winnersClose: "Close",
    championTitle: "🎉 Congratulations!",
    championText: "You completed all 35 levels. Enter the name you want shown on the Top 10 list.",
    championNameLabel: "Winner list name",
    championNamePlaceholder: "Enter name",
    championSave: "✅ Save to Top 10",
    championSkip: "Skip",
    championSaved: "Winner result saved! 🏆",
    campaignFinishedSummary: "Legendary! You completed the full 35-level campaign.",
    shopTeleportMoved: "🌀 Emergency teleport used. Game continues!",
    levelCountLabel: "Level"
  });

  // For alle andre språk: bruk engelsk fallback, ikke norsk tekst.
  if (Array.isArray(languageOptions)) {
    for (const language of languageOptions) {
      if (language.code !== "no" && language.code !== "en") {
        translations[language.code] = { ...translations.en, ...(translations[language.code] || {}) };
        for (const key of [
          "maxLevelInfo", "levelGrandFinal", "winnerButton", "winnersTitle", "winnersSubtitle",
          "winnersEmpty", "winnersClose", "championTitle", "championText", "championNameLabel",
          "championNamePlaceholder", "championSave", "championSkip", "championSaved",
          "campaignFinishedSummary", "shopTeleportMoved", "levelCountLabel"
        ]) {
          if (!translations[language.code][key]) translations[language.code][key] = translations.en[key];
        }
      }
    }
  }

  const v33Themes = ["neon", "candy", "electric", "sunset", "ocean", "forest", "lava"];
  const v33Names = [
    "Neon Gate", "Candy Loop", "Thunder Grid", "Sunset Spiral", "Ocean Switch",
    "Forest Rush", "Lava Bridge", "Diamond Drift", "Turbo Smile", "Rocket Maze",
    "Crystal Sprint", "Ghost Garden Pro", "Mirror Run", "Lightning Lanes", "Happy Storm",
    "Portal Dance", "Star Collector", "Firefly Chase", "Blue Circuit", "Boss Alley",
    "Rainbow Lock", "Energy Field", "Diamond Factory", "Ice Panic", "Laser Garden",
    "Midnight Circuit", "Treasure Spiral", "Wild Blocks", "Portal Rush", "Chaos Candy",
    "Turbo Temple", "Rocket Ring", "Electric Finale", "Diamond Crown", "Grand Joy Finale"
  ];

  function v33Seeded(levelNumber, salt = 0) {
    let value = (levelNumber * 9301 + salt * 49297 + 233280) % 233280;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  function v33BuildCampaignMap(levelNumber) {
    const width = 13;
    const height = 11;
    const pattern = levelNumber % 8;
    const rnd = v33Seeded(levelNumber, pattern);
    const grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || y === 0 || x === width - 1 || y === height - 1 ? "1" : "2"))
    );
    const playerStart = levelNumber % 2 === 0 ? { x: 1, y: 9 } : { x: 1, y: 1 };
    const center = { x: 6, y: 5 };

    function setWall(x, y) {
      if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) return;
      if (Math.abs(x - playerStart.x) + Math.abs(y - playerStart.y) < 3) return;
      if (Math.abs(x - center.x) + Math.abs(y - center.y) < 2) return;
      grid[y][x] = "1";
    }

    if (pattern === 0) {
      for (let y = 2; y < 9; y += 2) for (let x = 2; x < 11; x += 3) setWall(x, y);
    } else if (pattern === 1) {
      for (let x = 2; x < 11; x += 2) { setWall(x, 3); setWall(x, 7); }
      for (let y = 2; y < 9; y += 2) { setWall(4, y); setWall(8, y); }
    } else if (pattern === 2) {
      for (let x = 2; x < 11; x++) if (![3, 6, 10].includes(x)) setWall(x, 2);
      for (let x = 2; x < 11; x++) if (![2, 6, 9].includes(x)) setWall(x, 8);
      for (let y = 3; y < 8; y++) if (![4, 5].includes(y)) { setWall(2, y); setWall(10, y); }
    } else if (pattern === 3) {
      for (let y = 2; y < 9; y++) if (y !== 5) { setWall(3, y); setWall(9, y); }
      for (let x = 4; x < 9; x++) if (x !== 6) { setWall(x, 3); setWall(x, 7); }
    } else if (pattern === 4) {
      for (let i = 2; i < 10; i++) { setWall(i, i % 7 + 2); setWall(12 - i, i % 7 + 2); }
    } else if (pattern === 5) {
      for (let x = 2; x < 11; x++) if (x !== 6) setWall(x, 5);
      for (let y = 2; y < 9; y++) if (![3, 7].includes(y)) setWall(6, y);
    } else if (pattern === 6) {
      for (let y = 2; y < 9; y += 2) for (let x = 2; x < 11; x++) if ((x + y + levelNumber) % 4 === 0) setWall(x, y);
    } else {
      for (let i = 0; i < 18; i++) setWall(1 + Math.floor(rnd() * 11), 1 + Math.floor(rnd() * 9));
    }

    // Ekstra åpninger og trygge ruter som hindrer irriterende låste brett.
    [[center.x, center.y], [center.x - 1, center.y], [center.x + 1, center.y], [center.x, center.y - 1], [center.x, center.y + 1],
     [playerStart.x, playerStart.y], [playerStart.x + 1, playerStart.y], [playerStart.x, Math.max(1, playerStart.y - 1)]].forEach(([x, y]) => {
      if (grid[y] && grid[y][x]) grid[y][x] = "0";
    });

    // Power-ups og skjold plasseres variert, men alltid på gangbare ruter.
    const bonusCandidates = [
      { x: 2, y: 2 }, { x: 10, y: 2 }, { x: 2, y: 8 }, { x: 10, y: 8 },
      { x: 5, y: 3 }, { x: 7, y: 7 }, { x: 4, y: 6 }, { x: 8, y: 4 }
    ];
    const power = bonusCandidates[levelNumber % bonusCandidates.length];
    const shieldSpot = bonusCandidates[(levelNumber + 3) % bonusCandidates.length];
    if (grid[power.y][power.x] !== "1") grid[power.y][power.x] = "3";
    if (grid[shieldSpot.y][shieldSpot.x] !== "1") grid[shieldSpot.y][shieldSpot.x] = "4";

    // Fjern diamanter fra start/portalområdet, ellers kan starten føles rotete.
    grid[playerStart.y][playerStart.x] = "0";
    grid[center.y][center.x] = "0";

    // Sørg for at alle diamanter er mulig å nå fra spillerens start.
    const seen = new Set();
    const queue = [{ ...playerStart }];
    const key = (x, y) => `${x},${y}`;
    seen.add(key(playerStart.x, playerStart.y));
    while (queue.length) {
      const current = queue.shift();
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (!grid[ny] || grid[ny][nx] === undefined || grid[ny][nx] === "1") continue;
        const k = key(nx, ny);
        if (!seen.has(k)) {
          seen.add(k);
          queue.push({ x: nx, y: ny });
        }
      }
    }
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] !== "1" && !seen.has(key(x, y))) grid[y][x] = "1";
      }
    }

    // Hvis et brett ble for tomt: legg tilbake noen diamanter på sikre ruter.
    let diamonds = grid.flat().filter(v => v === "2").length;
    if (diamonds < 28) {
      for (let y = 1; y < height - 1 && diamonds < 34; y++) {
        for (let x = 1; x < width - 1 && diamonds < 34; x++) {
          if (grid[y][x] === "0" && !(x === center.x && y === center.y) && !(x === playerStart.x && y === playerStart.y)) {
            grid[y][x] = "2";
            diamonds++;
          }
        }
      }
    }

    return grid.map(row => row.join(""));
  }

  function v33BuildCampaignLevels() {
    const base = levels.slice(0, Math.min(10, levels.length)).map((level, index) => ({
      ...level,
      name: v33Names[index] || level.name,
      speed: Math.max(470, 625 - index * 11),
      theme: v33Themes[index % v33Themes.length]
    }));

    for (let i = base.length; i < V33_MAX_LEVELS; i++) {
      const levelNumber = i + 1;
      const player = levelNumber % 2 === 0 ? { x: 1, y: 9 } : { x: 1, y: 1 };
      base.push({
        name: v33Names[i] || `Joy Level ${levelNumber}`,
        theme: v33Themes[i % v33Themes.length],
        speed: Math.max(420, 580 - Math.floor(i * 3.6)),
        enemies: [
          { x: 11, y: 1 },
          { x: 11, y: 9 },
          { x: 6, y: i % 2 ? 1 : 9 },
          { x: 1, y: i % 3 ? 5 : 9 }
        ],
        player,
        map: v33BuildCampaignMap(levelNumber)
      });
    }
    levels.splice(0, levels.length, ...base.slice(0, V33_MAX_LEVELS));
  }
  v33BuildCampaignLevels();

  // V31 hadde random fiender; her balanseres antallet tydeligere for 35 level.
  getEnemyCountRangeForLevel = function getEnemyCountRangeForLevelV33(index) {
    const levelNumber = index + 1;
    const growth = Math.floor(Math.max(0, levelNumber - 1) / 7);
    const ranges = {
      easy:    { min: 1, max: Math.min(3, 1 + growth) },
      normal:  { min: 1, max: Math.min(4, 2 + growth) },
      hard:    { min: 2, max: Math.min(5, 3 + growth) },
      extreme: { min: 2, max: Math.min(6, 4 + growth) }
    };
    const range = ranges[selectedDifficulty] || ranges.normal;
    return { min: range.min, max: Math.max(range.min, range.max) };
  };

  // Nødteleport skal ikke gjøre at spillet blir hengende i pause etter at butikken lukkes.
  const v33PreviousTeleport = typeof v30TeleportPlayer === "function" ? v30TeleportPlayer : null;
  if (v33PreviousTeleport) {
    v30TeleportPlayer = function v30TeleportPlayerV33() {
      const shouldResumeAfter = Boolean(gameRunning && !onlineMode && !v23ShopPausedBefore);
      const result = v33PreviousTeleport.apply(this, arguments);
      if (result && shouldResumeAfter) {
        paused = false;
        clearInterval(enemyTimer);
        clearTimeout(enemyTimer);
        enemyTimer = setTimeout(moveEnemies, getEnemyDelay());
        if (messageBar) messageBar.textContent = t("shopTeleportMoved");
        if (typeof v30UpdatePlayUi === "function") v30UpdatePlayUi();
        drawGame();
      }
      return result;
    };
    window.v30TeleportPlayer = v30TeleportPlayer;
  }

  function v33LoadWinners() {
    try {
      const winners = JSON.parse(localStorage.getItem(V33_WINNERS_KEY) || "[]");
      return Array.isArray(winners) ? winners.slice(0, 10) : [];
    } catch (error) {
      return [];
    }
  }

  function v33SaveWinners(winners) {
    localStorage.setItem(V33_WINNERS_KEY, JSON.stringify(winners.slice(0, 10)));
  }

  function v33AddWinner(name) {
    const cleanName = String(name || "Player")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 18) || "Player";
    const winners = v33LoadWinners();
    winners.push({
      name: cleanName,
      score: Number(score) || 0,
      difficulty: selectedDifficulty || "normal",
      level: V33_MAX_LEVELS,
      date: new Date().toLocaleDateString()
    });
    winners.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    v33SaveWinners(winners);
    return cleanName;
  }

  function v33EnsureWinnerUi() {
    let showButton = document.getElementById("winnerBoardButton");
    if (!showButton) {
      showButton = document.createElement("button");
      showButton.id = "winnerBoardButton";
      showButton.type = "button";
      showButton.className = "winner-board-button";
      showButton.onclick = () => showWinnerBoard();
      const customize = document.getElementById("customizeButton");
      if (customize && customize.parentElement) customize.insertAdjacentElement("afterend", showButton);
    }

    let winnerDialog = document.getElementById("winnerBoardModal");
    if (!winnerDialog) {
      winnerDialog = document.createElement("dialog");
      winnerDialog.id = "winnerBoardModal";
      winnerDialog.className = "winner-modal";
      winnerDialog.innerHTML = `
        <div class="winner-card">
          <button class="friend-modal-close" type="button" onclick="closeWinnerBoard()" aria-label="Close">✕</button>
          <h2 id="winnersTitle"></h2>
          <p id="winnersSubtitle" class="winner-subtitle"></p>
          <ol id="winnerList" class="winner-list"></ol>
          <button id="winnersCloseButton" class="winner-close-button" type="button" onclick="closeWinnerBoard()"></button>
        </div>
      `;
      document.body.appendChild(winnerDialog);
    }

    let championDialog = document.getElementById("championModal");
    if (!championDialog) {
      championDialog = document.createElement("dialog");
      championDialog.id = "championModal";
      championDialog.className = "winner-modal champion-modal";
      championDialog.innerHTML = `
        <div class="winner-card champion-card">
          <h2 id="championTitle"></h2>
          <p id="championText" class="winner-subtitle"></p>
          <label id="championNameLabel" class="champion-label" for="championNameInput"></label>
          <input id="championNameInput" class="champion-input" maxlength="18" autocomplete="nickname" />
          <div class="champion-actions">
            <button id="championSaveButton" type="button" onclick="saveChampionWinner()"></button>
            <button id="championSkipButton" type="button" onclick="closeChampionModal()"></button>
          </div>
        </div>
      `;
      document.body.appendChild(championDialog);
    }
    v33UpdateWinnerTexts();
  }

  function v33UpdateWinnerTexts() {
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    const placeholder = document.getElementById("championNameInput");
    const showButton = document.getElementById("winnerBoardButton");
    if (showButton) showButton.textContent = t("winnerButton");
    set("winnersTitle", t("winnersTitle"));
    set("winnersSubtitle", t("winnersSubtitle"));
    set("winnersCloseButton", t("winnersClose"));
    set("championTitle", t("championTitle"));
    set("championText", t("championText"));
    set("championNameLabel", t("championNameLabel"));
    set("championSaveButton", t("championSave"));
    set("championSkipButton", t("championSkip"));
    if (placeholder) placeholder.placeholder = t("championNamePlaceholder");
  }

  function v33RenderWinners() {
    const list = document.getElementById("winnerList");
    if (!list) return;
    const winners = v33LoadWinners();
    if (!winners.length) {
      list.innerHTML = `<li class="winner-empty">${t("winnersEmpty")}</li>`;
      return;
    }
    list.innerHTML = winners.map((winner, index) => {
      const diff = difficultySettings[winner.difficulty]?.labelKey ? t(difficultySettings[winner.difficulty].labelKey) : winner.difficulty;
      return `
        <li class="winner-row">
          <span class="winner-rank">#${index + 1}</span>
          <span class="winner-name"></span>
          <span class="winner-meta">${diff} • ${t("levelCountLabel")} ${winner.level || V33_MAX_LEVELS}</span>
          <strong class="winner-score">${Number(winner.score) || 0}</strong>
        </li>`;
    }).join("");
    winners.forEach((winner, index) => {
      const row = list.children[index];
      const nameEl = row && row.querySelector(".winner-name");
      if (nameEl) nameEl.textContent = winner.name || "Player";
    });
  }

  window.showWinnerBoard = function showWinnerBoard() {
    v33EnsureWinnerUi();
    v33RenderWinners();
    const dialog = document.getElementById("winnerBoardModal");
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else if (dialog) dialog.setAttribute("open", "open");
  };

  window.closeWinnerBoard = function closeWinnerBoard() {
    const dialog = document.getElementById("winnerBoardModal");
    if (dialog && typeof dialog.close === "function") dialog.close();
    else if (dialog) dialog.removeAttribute("open");
  };

  window.closeChampionModal = function closeChampionModal() {
    const dialog = document.getElementById("championModal");
    if (dialog && typeof dialog.close === "function") dialog.close();
    else if (dialog) dialog.removeAttribute("open");
  };

  window.saveChampionWinner = function saveChampionWinner() {
    const input = document.getElementById("championNameInput");
    const savedName = v33AddWinner(input ? input.value : "Player");
    localStorage.setItem("ragiJoyLastWinnerName", savedName);
    window.closeChampionModal();
    if (messageBar) messageBar.textContent = t("championSaved");
    window.showWinnerBoard();
  };

  function v33ShowChampionModal() {
    v33EnsureWinnerUi();
    const input = document.getElementById("championNameInput");
    if (input) {
      input.value = localStorage.getItem("ragiJoyLastWinnerName") || "";
      setTimeout(() => input.focus(), 120);
    }
    const dialog = document.getElementById("championModal");
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else if (dialog) dialog.setAttribute("open", "open");
  }

  const v33PreviousApplyLanguage = applyLanguage;
  applyLanguage = function applyLanguageV33() {
    v33PreviousApplyLanguage.apply(this, arguments);
    v33EnsureWinnerUi();
    v33UpdateWinnerTexts();
    v33RenderWinners();
  };
  window.applyLanguage = applyLanguage;

  const v33PreviousEndGame = endGame;
  endGame = function endGameV33(won) {
    v33PreviousEndGame.apply(this, arguments);
    const completedCampaign = Boolean(won && levelIndex >= V33_MAX_LEVELS - 1);
    const endSummary = document.getElementById("endSummary");
    if (completedCampaign && endSummary) endSummary.textContent = t("campaignFinishedSummary");
    if (completedCampaign) {
      if (messageBar) messageBar.textContent = t("levelGrandFinal");
      setTimeout(v33ShowChampionModal, 650);
    }
    v33EnsureWinnerUi();
  };
  window.endGame = endGame;

  const v33PreviousNextLevel = nextLevel;
  nextLevel = function nextLevelV33() {
    if (levelIndex >= V33_MAX_LEVELS - 1) {
      score += 250 + (levelIndex + 1) * 100;
      endGame(true);
      return;
    }
    v33PreviousNextLevel.apply(this, arguments);
  };
  window.nextLevel = nextLevel;

  const v33PreviousLoadLevel = loadLevel;
  loadLevel = function loadLevelV33(index) {
    if (index >= V33_MAX_LEVELS) {
      levelIndex = V33_MAX_LEVELS - 1;
      endGame(true);
      return;
    }
    v33PreviousLoadLevel.apply(this, arguments);
    if (messageBar && gameRunning && !onlineMode) {
      const level = levels[levelIndex] || levels[0];
      messageBar.textContent = `${t("levelCountLabel")} ${levelIndex + 1}/35: ${level.name}`;
    }
  };
  window.loadLevel = loadLevel;

  setTimeout(() => {
    v33EnsureWinnerUi();
    if (messageBar && !gameRunning) messageBar.textContent = `${t("messageStart")} • ${t("maxLevelInfo")}`;
    if (typeof updateDifficultyScoreBadges === "function") updateDifficultyScoreBadges();
  }, 0);
})();

/* --------------------------------------------------------------------------
   V34 GUI + leaderboard polish
   - Moderniserer startmeny-layout.
   - Top 10 er nå basert på høyeste score, ikke bare fullført level 35.
   - Ved god score kan spiller lagre navn på listen etter en kamp.
   -------------------------------------------------------------------------- */
(function v34GuiAndLeaderboardPatch() {
  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const LEGACY_KEY = 'ragiJoyMazeWinnersV33';
  const DEFAULT_NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const MAX_ENTRIES = 10;

  Object.assign(translations.no, {
    winnerButton: '🏆 Vinnerresultat',
    winnersTitle: '🏆 Top 10 vinnerresultat',
    winnersSubtitle: 'De høyeste poengene blir liggende øverst. Listen lagres lokalt i denne nettleseren.',
    winnersEmpty: 'Ingen resultater ennå. Spill en kamp og lagre navnet ditt.',
    championTitle: '🏆 Ny toppscore!',
    championText: 'Du kom inn på Top 10. Skriv inn navnet du vil vise på listen.',
    championSave: '✅ Lagre resultat',
    championSaved: 'Resultatet ble lagret på Top 10! 🏆',
    campaignFinishedSummary: 'Du fullførte hele kampanjen på 35 level. Fantastisk jobbet!',
    leaderboardPromptWin: 'Du kom inn på Top 10. Skriv inn navnet ditt.',
    leaderboardPromptChampion: 'Du fullførte alle 35 levelene og kom inn på Top 10. Skriv inn navnet ditt.',
    leaderboardScope: 'Topplisten viser de 10 høyeste poengene – ikke bare spillere som har fullført level 35.'
  });

  Object.assign(translations.en, {
    winnerButton: '🏆 Top scores',
    winnersTitle: '🏆 Top 10 high scores',
    winnersSubtitle: 'The highest scores stay at the top. The list is saved locally in this browser.',
    winnersEmpty: 'No records yet. Finish a match and save your name.',
    championTitle: '🏆 New top score!',
    championText: 'You made it into the Top 10. Enter the name you want shown on the list.',
    championSave: '✅ Save result',
    championSaved: 'The result was saved to Top 10! 🏆',
    campaignFinishedSummary: 'You completed the full 35-level campaign. Amazing job!',
    leaderboardPromptWin: 'You made it into the Top 10. Enter your name.',
    leaderboardPromptChampion: 'You cleared all 35 levels and made it into the Top 10. Enter your name.',
    leaderboardScope: 'The leaderboard shows the 10 highest scores – not only players who finished level 35.'
  });

  if (Array.isArray(languageOptions)) {
    for (const language of languageOptions) {
      if (language.code !== 'no' && language.code !== 'en') {
        translations[language.code] = { ...translations.en, ...(translations[language.code] || {}) };
        for (const key of [
          'winnerButton', 'winnersTitle', 'winnersSubtitle', 'winnersEmpty', 'championTitle',
          'championText', 'championSave', 'championSaved', 'campaignFinishedSummary',
          'leaderboardPromptWin', 'leaderboardPromptChampion', 'leaderboardScope'
        ]) {
          if (!translations[language.code][key]) translations[language.code][key] = translations.en[key];
        }
      }
    }
  }

  function loadBoard() {
    let data = [];
    try {
      data = JSON.parse(localStorage.getItem(BOARD_KEY) || '[]');
    } catch (_) { data = []; }
    if (!Array.isArray(data) || !data.length) {
      try {
        const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || '[]');
        if (Array.isArray(legacy) && legacy.length) {
          data = legacy.map((entry, index) => ({
            name: entry.name || 'Player',
            score: Number(entry.score) || 0,
            level: Number(entry.level) || 1,
            difficulty: entry.difficulty || 'normal',
            completedCampaign: Boolean((Number(entry.level) || 0) >= 35),
            createdAt: entry.createdAt || Date.now() + index
          }));
          saveBoard(data);
        }
      } catch (_) { data = []; }
    }
    return Array.isArray(data) ? data.slice(0, MAX_ENTRIES) : [];
  }

  function saveBoard(entries) {
    const sorted = (Array.isArray(entries) ? entries : [])
      .filter(Boolean)
      .sort((a, b) => {
        const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
        if (scoreDiff !== 0) return scoreDiff;
        const levelDiff = (Number(b.level) || 0) - (Number(a.level) || 0);
        if (levelDiff !== 0) return levelDiff;
        return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
      })
      .slice(0, MAX_ENTRIES);
    localStorage.setItem(BOARD_KEY, JSON.stringify(sorted));
  }

  function qualifiesForBoard(value) {
    const numeric = Number(value) || 0;
    if (numeric <= 0) return false;
    const current = loadBoard();
    if (current.length < MAX_ENTRIES) return true;
    const weakest = current[current.length - 1];
    return numeric > (Number(weakest.score) || 0);
  }

  function addBoardEntry(name, completedCampaign) {
    const cleanName = String(name || '').trim().slice(0, 18) || localStorage.getItem(DEFAULT_NAME_KEY) || 'Player';
    localStorage.setItem(DEFAULT_NAME_KEY, cleanName);
    const current = loadBoard();
    current.push({
      name: cleanName,
      score: Number(score) || 0,
      level: Math.max(1, Math.min(35, Number(levelIndex) + 1 || 1)),
      difficulty: selectedDifficulty || 'normal',
      completedCampaign: Boolean(completedCampaign),
      createdAt: Date.now()
    });
    saveBoard(current);
    return cleanName;
  }

  function ensureWinnerUiPlacement() {
    const slot = document.getElementById('winnerButtonSlot');
    const button = document.getElementById('winnerBoardButton');
    if (slot && button && button.parentElement !== slot) slot.appendChild(button);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateWinnerTexts() {
    ensureWinnerUiPlacement();
    const btn = document.getElementById('winnerBoardButton');
    if (btn) btn.textContent = t('winnerButton');
    setText('winnersTitle', t('winnersTitle'));
    setText('winnersSubtitle', `${t('winnersSubtitle')} ${t('leaderboardScope')}`);
    setText('winnersCloseButton', t('winnersClose') || 'Close');
  }

  function renderBoard() {
    updateWinnerTexts();
    const list = document.getElementById('winnerList');
    if (!list) return;
    const data = loadBoard();
    if (!data.length) {
      list.innerHTML = `<li class="winner-empty">${t('winnersEmpty')}</li>`;
      return;
    }
    list.innerHTML = data.map((entry, index) => {
      const difficultyLabel = difficultySettings?.[entry.difficulty]?.labelKey ? t(difficultySettings[entry.difficulty].labelKey) : (entry.difficulty || '');
      const crown = index === 0 ? ' 👑' : '';
      return `
        <li class="winner-row ${index === 0 ? 'top-rank' : ''}">
          <span class="winner-rank">#${index + 1}</span>
          <div>
            <span class="winner-name">${escapeHtml(entry.name || 'Player')}${crown}</span>
            <span class="winner-meta">${difficultyLabel} • ${t('levelCountLabel') || 'Level'} ${entry.level || 1}${entry.completedCampaign ? ' • 35/35' : ''}</span>
          </div>
          <strong class="winner-score">${Number(entry.score) || 0}</strong>
        </li>`;
    }).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showDialogById(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', 'open');
  }

  function closeDialogById(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  window.showWinnerBoard = function showWinnerBoardV34() {
    renderBoard();
    showDialogById('winnerBoardModal');
  };
  window.closeWinnerBoard = function closeWinnerBoardV34() {
    closeDialogById('winnerBoardModal');
  };

  let pendingBoardSave = false;
  let pendingCampaignSave = false;

  function openLeaderboardPrompt(isCampaignWin) {
    pendingBoardSave = true;
    pendingCampaignSave = Boolean(isCampaignWin);
    const label = document.getElementById('championNameLabel');
    const title = document.getElementById('championTitle');
    const text = document.getElementById('championText');
    const input = document.getElementById('championNameInput');
    const saveButton = document.getElementById('championSaveButton');
    const skipButton = document.getElementById('championSkipButton');
    if (title) title.textContent = isCampaignWin ? '🎉 ' + (t('won') || 'You won!') : t('championTitle');
    if (text) text.textContent = isCampaignWin ? t('leaderboardPromptChampion') : t('leaderboardPromptWin');
    if (label) label.textContent = t('championNameLabel');
    if (saveButton) saveButton.textContent = t('championSave');
    if (skipButton) skipButton.textContent = t('championSkip') || 'Skip';
    if (input) {
      input.value = localStorage.getItem(DEFAULT_NAME_KEY) || '';
      input.placeholder = t('championNamePlaceholder') || 'Enter name';
    }
    showDialogById('championModal');
    if (input) setTimeout(() => input.focus(), 80);
  }

  window.saveChampionWinner = function saveChampionWinnerV34() {
    if (!pendingBoardSave) {
      closeDialogById('championModal');
      return;
    }
    const input = document.getElementById('championNameInput');
    addBoardEntry(input ? input.value : 'Player', pendingCampaignSave);
    pendingBoardSave = false;
    pendingCampaignSave = false;
    closeDialogById('championModal');
    renderBoard();
    if (messageBar) messageBar.textContent = t('championSaved');
    window.showWinnerBoard();
  };

  window.closeChampionModal = function closeChampionModalV34() {
    pendingBoardSave = false;
    pendingCampaignSave = false;
    closeDialogById('championModal');
  };

  const previousApplyLanguageV34 = applyLanguage;
  applyLanguage = function applyLanguageV34() {
    previousApplyLanguageV34.apply(this, arguments);
    ensureWinnerUiPlacement();
    updateWinnerTexts();
    renderBoard();
  };
  window.applyLanguage = applyLanguage;

  const previousEndGameV34 = endGame;
  endGame = function endGameV34(won) {
    const completedCampaign = Boolean(!onlineMode && won && levelIndex >= 34);
    previousEndGameV34.apply(this, arguments);
    ensureWinnerUiPlacement();
    if (!onlineMode && qualifiesForBoard(score)) {
      setTimeout(() => openLeaderboardPrompt(completedCampaign), completedCampaign ? 760 : 280);
    }
  };
  window.endGame = endGame;

  setTimeout(() => {
    ensureWinnerUiPlacement();
    updateWinnerTexts();
    renderBoard();
  }, 60);
})();

/* --------------------------------------------------------------------------
   V35 Player name registration fix
   - Navn kan registreres direkte fra hovedmenyen før spillet starter.
   - Samme navn fylles automatisk inn i Top 10-lagring etter kamp.
   - Vinnerresultat-dialogen viser hvilket navn som er aktivt.
   -------------------------------------------------------------------------- */
(function v35PlayerNameRegistrationPatch() {
  const DEFAULT_NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const MAX_NAME_LENGTH = 18;

  const nameTexts = {
    no: {
      profileButtonEmpty: '👤 Registrer spillernavn',
      profileButtonNamed: '👤 Spiller: {name}',
      profileTitle: '👤 Spillernavn',
      profileSubtitle: 'Velg navnet som skal brukes på Top 10-listen når du får høy score. Dette lagres kun i denne nettleseren.',
      profileCurrentLabel: 'Aktivt navn',
      profileNoName: 'Ikke valgt ennå',
      profileNameLabel: 'Skriv ønsket navn',
      profileNamePlaceholder: 'F.eks. Ragish',
      profileSave: '✅ Lagre navn',
      profileClear: 'Fjern navn',
      profileSaved: 'Spillernavn lagret: {name}',
      profileCleared: 'Spillernavn fjernet.',
      profileNote: 'Tips: Du kan endre dette senere. Når du kommer inn på Top 10, blir dette navnet foreslått automatisk.',
      winnerActiveName: 'Navn for nye resultater',
      winnerChangeName: 'Endre navn'
    },
    en: {
      profileButtonEmpty: '👤 Register player name',
      profileButtonNamed: '👤 Player: {name}',
      profileTitle: '👤 Player name',
      profileSubtitle: 'Choose the name used on the Top 10 list when you get a high score. It is saved only in this browser.',
      profileCurrentLabel: 'Active name',
      profileNoName: 'Not chosen yet',
      profileNameLabel: 'Enter preferred name',
      profileNamePlaceholder: 'Example: Ragish',
      profileSave: '✅ Save name',
      profileClear: 'Remove name',
      profileSaved: 'Player name saved: {name}',
      profileCleared: 'Player name removed.',
      profileNote: 'Tip: You can change this later. When you reach Top 10, this name is suggested automatically.',
      winnerActiveName: 'Name for new scores',
      winnerChangeName: 'Change name'
    }
  };

  for (const [code, texts] of Object.entries(nameTexts)) {
    translations[code] = { ...(translations[code] || translations.en), ...texts };
  }
  if (Array.isArray(languageOptions)) {
    for (const language of languageOptions) {
      if (!translations[language.code]) translations[language.code] = { ...translations.en };
      const base = language.code === 'no' ? nameTexts.no : nameTexts.en;
      for (const [key, value] of Object.entries(base)) {
        if (!translations[language.code][key]) translations[language.code][key] = value;
      }
    }
  }

  function tr(key, vars = {}) {
    let value = (translations[currentLanguage] && translations[currentLanguage][key]) || translations.en[key] || key;
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, replacement);
    }
    return value;
  }

  function cleanName(value) {
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_NAME_LENGTH);
  }

  function getProfileName() {
    return cleanName(localStorage.getItem(DEFAULT_NAME_KEY) || localStorage.getItem('ragiJoyLastWinnerName') || '');
  }

  function setProfileName(value) {
    const name = cleanName(value);
    if (name) {
      localStorage.setItem(DEFAULT_NAME_KEY, name);
      localStorage.setItem('ragiJoyLastWinnerName', name);
    } else {
      localStorage.removeItem(DEFAULT_NAME_KEY);
      localStorage.removeItem('ragiJoyLastWinnerName');
    }
    updateProfileTexts();
    return name;
  }

  function showDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', 'open');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function ensureProfileButton() {
    let slot = document.getElementById('profileButtonSlot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'profileButtonSlot';
      slot.className = 'profile-button-slot';
      const customize = document.getElementById('customizeButton');
      if (customize && customize.parentElement) customize.insertAdjacentElement('afterend', slot);
    }
    let button = document.getElementById('profileNameButton');
    if (!button) {
      button = document.createElement('button');
      button.id = 'profileNameButton';
      button.className = 'profile-name-button';
      button.type = 'button';
      button.onclick = () => window.showProfileNameModal();
      slot.appendChild(button);
    } else if (slot && button.parentElement !== slot) {
      slot.appendChild(button);
    }
    return button;
  }

  function getPlayerAvatarMarkup() {
    const image = localStorage.getItem('ragiJoyAvatarImage');
    if (image) return `<img src="${image}" alt="" />`;
    return (typeof playerEmoji !== 'undefined' && playerEmoji) || localStorage.getItem('ragiJoyPlayerEmoji') || '😄';
  }

  function ensureProfileDialog() {
    let dialog = document.getElementById('profileNameModal');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'profileNameModal';
      dialog.className = 'winner-modal profile-name-modal';
      dialog.innerHTML = `
        <div class="winner-card profile-card">
          <button class="friend-modal-close" type="button" onclick="closeProfileNameModal()" aria-label="Close">✕</button>
          <p class="friend-kicker">PLAYER PROFILE</p>
          <h2 id="profileTitle"></h2>
          <p id="profileSubtitle" class="winner-subtitle"></p>
          <div class="profile-preview-row">
            <div id="profileAvatarBadge" class="profile-avatar-badge"></div>
            <div>
              <span id="profileCurrentLabel" class="profile-current-label"></span>
              <strong id="profileCurrentName" class="profile-current-name"></strong>
            </div>
          </div>
          <label id="profileNameLabel" class="profile-label" for="profileNameInput"></label>
          <input id="profileNameInput" class="profile-input" maxlength="18" autocomplete="nickname" />
          <p id="profileNote" class="profile-note"></p>
          <div class="profile-actions">
            <button id="profileSaveButton" class="profile-save-button" type="button" onclick="saveProfileNameFromModal()"></button>
            <button id="profileClearButton" class="profile-clear-button" type="button" onclick="clearProfileNameFromModal()"></button>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
      const input = dialog.querySelector('#profileNameInput');
      if (input) {
        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') window.saveProfileNameFromModal();
        });
      }
    }
    return dialog;
  }

  function ensureWinnerProfileStrip() {
    const modal = document.getElementById('winnerBoardModal');
    const card = modal && modal.querySelector('.winner-card');
    if (!card) return;
    let strip = document.getElementById('winnerProfileStrip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'winnerProfileStrip';
      strip.className = 'winner-profile-strip';
      strip.innerHTML = `
        <div>
          <span id="winnerActiveNameLabel"></span>
          <strong id="winnerActiveNameValue"></strong>
        </div>
        <button id="winnerChangeNameButton" type="button" onclick="showProfileNameModal()"></button>
      `;
      const list = document.getElementById('winnerList');
      if (list) card.insertBefore(strip, list);
      else card.appendChild(strip);
    }
  }

  function updateProfileTexts() {
    const name = getProfileName();
    const button = ensureProfileButton();
    ensureProfileDialog();
    ensureWinnerProfileStrip();

    if (button) {
      button.textContent = name ? tr('profileButtonNamed', { name }) : tr('profileButtonEmpty');
      button.classList.toggle('has-name', Boolean(name));
    }

    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('profileTitle', tr('profileTitle'));
    setText('profileSubtitle', tr('profileSubtitle'));
    setText('profileCurrentLabel', tr('profileCurrentLabel'));
    setText('profileCurrentName', name || tr('profileNoName'));
    setText('profileNameLabel', tr('profileNameLabel'));
    setText('profileNote', tr('profileNote'));
    setText('profileSaveButton', tr('profileSave'));
    setText('profileClearButton', tr('profileClear'));
    setText('winnerActiveNameLabel', tr('winnerActiveName'));
    setText('winnerActiveNameValue', name || tr('profileNoName'));
    setText('winnerChangeNameButton', tr('winnerChangeName'));

    const input = document.getElementById('profileNameInput');
    if (input) input.placeholder = tr('profileNamePlaceholder');
    const badge = document.getElementById('profileAvatarBadge');
    if (badge) badge.innerHTML = getPlayerAvatarMarkup();

    const championInput = document.getElementById('championNameInput');
    if (championInput && !championInput.value) championInput.value = name;
  }

  window.showProfileNameModal = function showProfileNameModal() {
    const dialog = ensureProfileDialog();
    updateProfileTexts();
    const input = document.getElementById('profileNameInput');
    if (input) input.value = getProfileName();
    showDialog(dialog);
    if (input) setTimeout(() => input.focus(), 80);
  };

  window.closeProfileNameModal = function closeProfileNameModal() {
    closeDialog(document.getElementById('profileNameModal'));
  };

  window.saveProfileNameFromModal = function saveProfileNameFromModal() {
    const input = document.getElementById('profileNameInput');
    const name = setProfileName(input ? input.value : '');
    closeDialog(document.getElementById('profileNameModal'));
    if (messageBar) messageBar.textContent = name ? tr('profileSaved', { name }) : tr('profileCleared');
  };

  window.clearProfileNameFromModal = function clearProfileNameFromModal() {
    const input = document.getElementById('profileNameInput');
    if (input) input.value = '';
    setProfileName('');
    closeDialog(document.getElementById('profileNameModal'));
    if (messageBar) messageBar.textContent = tr('profileCleared');
  };

  const previousShowWinnerBoardV35 = window.showWinnerBoard;
  window.showWinnerBoard = function showWinnerBoardV35() {
    if (typeof previousShowWinnerBoardV35 === 'function') previousShowWinnerBoardV35.apply(this, arguments);
    ensureWinnerProfileStrip();
    updateProfileTexts();
  };

  const previousApplyLanguageV35 = applyLanguage;
  applyLanguage = function applyLanguageV35() {
    previousApplyLanguageV35.apply(this, arguments);
    updateProfileTexts();
  };
  window.applyLanguage = applyLanguage;

  const previousShowCustomizeV35 = window.showCustomizeModal;
  if (typeof previousShowCustomizeV35 === 'function') {
    window.showCustomizeModal = function showCustomizeModalV35() {
      previousShowCustomizeV35.apply(this, arguments);
      updateProfileTexts();
    };
  }

  setTimeout(updateProfileTexts, 80);
})();


/* --------------------------------------------------------------------------
   V36 Safe player name and privacy guide patch
   - Spillernavn er begrenset til 2–16 tegn.
   - Kun bokstaver, tall, mellomrom, punktum, bindestrek og understrek tillates.
   - Seksuelle, grove og hatefulle ord blokkeres før navnet lagres eller legges på Top 10.
   - Quick guide forklarer at spilleren bør bruke kallenavn, ikke fullt navn/e-post/telefon.
   -------------------------------------------------------------------------- */
(function v36SafePlayerNameAndPrivacyPatch() {
  const NAME_KEY = "ragiJoyMazePreferredNameV34";
  const LAST_NAME_KEY = "ragiJoyLastWinnerName";
  const WINNERS_KEY = "ragiJoyMazeWinnersV33";
  const MIN_NAME_LENGTH = 2;
  const MAX_NAME_LENGTH = 16;
  const DEFAULT_SAFE_NAME = "Player";

  const v36Texts = {
    no: {
      profileSafeTitle: "Navn og personvern",
      profileSafeText: "Bruk kallenavn. Ikke bruk fullt navn, e-post, telefonnummer eller privat info. Navn må være 2–16 tegn og kan ikke inneholde seksuelle, grove eller hatefulle ord.",
      profileInvalidEmpty: "Skriv inn et kallenavn først.",
      profileInvalidShort: "Navnet må ha minst 2 tegn.",
      profileInvalidLong: "Navnet kan maks ha 16 tegn.",
      profileInvalidPrivate: "Ikke bruk e-post, telefonnummer eller privat informasjon som spillernavn.",
      profileInvalidChars: "Bruk kun bokstaver, tall, mellomrom, punktum, bindestrek eller understrek.",
      profileInvalidBlocked: "Dette navnet kan ikke brukes. Velg et hyggelig og trygt kallenavn.",
      profileSavedSafe: "Spillernavn lagret: {name}",
      profileRulesShort: "2–16 tegn · kallenavn · ingen privat info",
      howToNameSafe: "Bruk trygt kallenavn. Top 10-navn lagres lokalt i nettleseren og støtende/seksuelle ord blokkeres.",
      championNameHelp: "Navnet vises på Top 10. Bruk kallenavn, ikke privat info."
    },
    en: {
      profileSafeTitle: "Name and privacy",
      profileSafeText: "Use a nickname. Do not use full name, email, phone number or private information. Names must be 2–16 characters and cannot contain sexual, offensive or hateful words.",
      profileInvalidEmpty: "Enter a nickname first.",
      profileInvalidShort: "The name must be at least 2 characters.",
      profileInvalidLong: "The name can be max 16 characters.",
      profileInvalidPrivate: "Do not use email, phone number or private information as your player name.",
      profileInvalidChars: "Use only letters, numbers, spaces, dot, hyphen or underscore.",
      profileInvalidBlocked: "This name cannot be used. Choose a friendly and safe nickname.",
      profileSavedSafe: "Player name saved: {name}",
      profileRulesShort: "2–16 chars · nickname · no private info",
      howToNameSafe: "Use a safe nickname. Top 10 names are stored locally in the browser, and offensive/sexual words are blocked.",
      championNameHelp: "This name is shown on Top 10. Use a nickname, not private information."
    },
    de: {
      profileSafeTitle: "Name und Datenschutz",
      profileSafeText: "Nutze einen Spitznamen. Verwende keinen vollständigen Namen, keine E-Mail, Telefonnummer oder privaten Daten. Namen müssen 2–16 Zeichen haben und dürfen keine sexuellen, beleidigenden oder hasserfüllten Wörter enthalten.",
      profileInvalidEmpty: "Gib zuerst einen Spitznamen ein.",
      profileInvalidShort: "Der Name muss mindestens 2 Zeichen haben.",
      profileInvalidLong: "Der Name darf maximal 16 Zeichen haben.",
      profileInvalidPrivate: "Verwende keine E-Mail, Telefonnummer oder privaten Daten als Spielernamen.",
      profileInvalidChars: "Nutze nur Buchstaben, Zahlen, Leerzeichen, Punkt, Bindestrich oder Unterstrich.",
      profileInvalidBlocked: "Dieser Name kann nicht verwendet werden. Wähle einen freundlichen und sicheren Spitznamen.",
      profileSavedSafe: "Spielername gespeichert: {name}",
      profileRulesShort: "2–16 Zeichen · Spitzname · keine privaten Daten",
      howToNameSafe: "Nutze einen sicheren Spitznamen. Top-10-Namen werden lokal im Browser gespeichert, und beleidigende/sexuelle Wörter werden blockiert.",
      championNameHelp: "Dieser Name wird in den Top 10 angezeigt. Nutze einen Spitznamen, keine privaten Daten."
    }
  };

  function v36T(key, vars = {}) {
    const lang = (typeof currentLanguage !== "undefined" && currentLanguage) ? currentLanguage : "en";
    const bucket = v36Texts[lang] || v36Texts.en;
    let value = (bucket && bucket[key]) || v36Texts.en[key] || key;
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }

  if (typeof translations !== "undefined") {
    const languageCodes = Array.isArray(languageOptions) ? languageOptions.map(language => language.code) : ["no", "en", "de"];
    for (const code of languageCodes) {
      const source = v36Texts[code] || (code === "no" ? v36Texts.no : v36Texts.en);
      translations[code] = { ...(translations[code] || translations.en || {}), ...source };
    }
  }

  const blockedNameParts = [
    "sex", "porn", "porno", "xxx", "nude", "naked", "onlyfans",
    "fuck", "fuk", "shit", "bitch", "cunt", "dick", "cock", "pussy", "asshole",
    "fitte", "fitta", "kuk", "pikk", "hore", "jævel", "jaevel",
    "nazi", "hitler", "terror", "isis", "kkk"
  ];

  function normalizeForSafety(value) {
    return String(value || "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[æ]/g, "ae")
      .replace(/[ø]/g, "o")
      .replace(/[å]/g, "a")
      .replace(/[áàâäã]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[íìîï]/g, "i")
      .replace(/[óòôöõ]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/[ýÿ]/g, "y")
      .replace(/0/g, "o")
      .replace(/[1!|]/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5|\$/g, "s")
      .replace(/7/g, "t")
      .replace(/@/g, "a")
      .replace(/[^a-z0-9]/g, "");
  }

  function cleanVisibleName(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F<>]/g, "")
      .replace(/[^\p{L}\p{N} ._-]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasPrivateInfo(value) {
    const raw = String(value || "");
    const compactDigits = raw.replace(/\D/g, "");
    return /@/.test(raw) || /\bhttps?:\/\//i.test(raw) || /\bwww\./i.test(raw) || compactDigits.length >= 6;
  }

  function validatePlayerName(value) {
    const visible = cleanVisibleName(value);
    if (!String(value || "").trim()) return { ok: false, name: "", error: v36T("profileInvalidEmpty") };
    if (hasPrivateInfo(value)) return { ok: false, name: visible.slice(0, MAX_NAME_LENGTH), error: v36T("profileInvalidPrivate") };
    if (!visible) return { ok: false, name: "", error: v36T("profileInvalidChars") };
    if (visible.length < MIN_NAME_LENGTH) return { ok: false, name: visible, error: v36T("profileInvalidShort") };
    if (visible.length > MAX_NAME_LENGTH) return { ok: false, name: visible.slice(0, MAX_NAME_LENGTH), error: v36T("profileInvalidLong") };
    const normalized = normalizeForSafety(visible);
    if (blockedNameParts.some(part => normalized.includes(part))) {
      return { ok: false, name: visible, error: v36T("profileInvalidBlocked") };
    }
    return { ok: true, name: visible, error: "" };
  }

  window.ragiValidatePlayerName = validatePlayerName;

  function showNameError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorId = `${inputId}Error`;
    let error = document.getElementById(errorId);
    if (!error && input) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "profile-error";
      input.insertAdjacentElement("afterend", error);
    }
    if (input) {
      input.classList.toggle("invalid", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
      input.setAttribute("aria-describedby", errorId);
    }
    if (error) {
      error.textContent = message || "";
      error.hidden = !message;
    }
  }

  function enhanceNameInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.maxLength = MAX_NAME_LENGTH;
    input.setAttribute("spellcheck", "false");
    input.setAttribute("autocapitalize", "words");
    input.setAttribute("autocomplete", "nickname");
    input.setAttribute("placeholder", input.getAttribute("placeholder") || "Nickname");
    input.addEventListener("input", () => showNameError(inputId, ""), { passive: true });
  }

  function ensureProfileSafetyUi() {
    enhanceNameInput("profileNameInput");
    const input = document.getElementById("profileNameInput");
    if (!input) return;

    if (!document.getElementById("profileNameInputError")) showNameError("profileNameInput", "");

    let rules = document.getElementById("profileSafeRules");
    if (!rules) {
      rules = document.createElement("div");
      rules.id = "profileSafeRules";
      rules.className = "profile-safe-rules";
      input.insertAdjacentElement("afterend", rules);
    }
    rules.innerHTML = `
      <strong>🛡️ ${v36T("profileSafeTitle")}</strong>
      <span>${v36T("profileSafeText")}</span>
      <small>${v36T("profileRulesShort")}</small>
    `;
  }

  function ensureChampionSafetyUi() {
    enhanceNameInput("championNameInput");
    const input = document.getElementById("championNameInput");
    if (!input) return;

    if (!document.getElementById("championNameInputError")) showNameError("championNameInput", "");

    let help = document.getElementById("championNameHelp");
    if (!help) {
      help = document.createElement("p");
      help.id = "championNameHelp";
      help.className = "profile-note champion-name-help";
      input.insertAdjacentElement("afterend", help);
    }
    help.textContent = v36T("championNameHelp");
  }

  function ensureHowToNameSafetyRow() {
    const grid = document.querySelector("#howToModal .howto-grid");
    if (!grid) return;
    let row = document.getElementById("howToNameSafety");
    if (!row) {
      row = document.createElement("div");
      row.id = "howToNameSafety";
      row.className = "howto-safety-row";
      row.innerHTML = `<strong>🛡️</strong><span id="howToNameSafeText"></span>`;
      grid.appendChild(row);
    }
    const text = document.getElementById("howToNameSafeText");
    if (text) text.textContent = v36T("howToNameSafe");
  }

  function updateProfileBadges() {
    const name = localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || "";
    const activeName = document.getElementById("profileCurrentName");
    const activeWinnerName = document.getElementById("winnerActiveNameValue");
    if (activeName) activeName.textContent = name || (typeof t === "function" ? t("profileNoName") : "No name");
    if (activeWinnerName) activeWinnerName.textContent = name || (typeof t === "function" ? t("profileNoName") : "No name");

    const button = document.getElementById("profileNameButton");
    if (button) {
      const emptyText = (typeof t === "function" ? t("profileButtonEmpty") : "👤 Player name");
      const namedText = (typeof t === "function" ? t("profileButtonNamed") : "👤 Player: {name}");
      button.innerHTML = name ? namedText.replace("{name}", name) : emptyText;
      button.title = v36T("profileRulesShort");
    }
  }

  function saveSafeNameToStorage(name) {
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(LAST_NAME_KEY, name);
    updateProfileBadges();
  }

  const previousShowProfileModal = window.showProfileNameModal;
  window.showProfileNameModal = function showProfileNameModalV36() {
    if (typeof previousShowProfileModal === "function") previousShowProfileModal();
    ensureProfileSafetyUi();
    updateProfileBadges();
    showNameError("profileNameInput", "");
  };

  window.saveProfileNameFromModal = function saveProfileNameFromModalV36() {
    const input = document.getElementById("profileNameInput");
    const result = validatePlayerName(input ? input.value : "");
    if (!result.ok) {
      showNameError("profileNameInput", result.error);
      if (input) {
        input.value = result.name || input.value;
        input.focus();
      }
      return;
    }
    saveSafeNameToStorage(result.name);
    const dialog = document.getElementById("profileNameModal");
    if (dialog && typeof dialog.close === "function") dialog.close();
    else if (dialog) dialog.removeAttribute("open");
    if (typeof messageBar !== "undefined" && messageBar) messageBar.textContent = v36T("profileSavedSafe", { name: result.name });
  };

  const previousSaveChampionWinner = window.saveChampionWinner;
  window.saveChampionWinner = function saveChampionWinnerV36() {
    const input = document.getElementById("championNameInput");
    const result = validatePlayerName(input ? input.value : "");
    if (!result.ok) {
      showNameError("championNameInput", result.error);
      if (input) {
        input.value = result.name || input.value;
        input.focus();
      }
      return;
    }
    if (input) input.value = result.name;
    saveSafeNameToStorage(result.name);
    if (typeof previousSaveChampionWinner === "function") previousSaveChampionWinner();
  };

  const previousShowWinnerBoard = window.showWinnerBoard;
  window.showWinnerBoard = function showWinnerBoardV36() {
    scrubStoredWinnerNames();
    if (typeof previousShowWinnerBoard === "function") previousShowWinnerBoard();
    ensureChampionSafetyUi();
    updateProfileBadges();
  };

  const previousShowHowToModal = window.showHowToModal;
  window.showHowToModal = function showHowToModalV36() {
    ensureHowToNameSafetyRow();
    if (typeof previousShowHowToModal === "function") previousShowHowToModal();
  };

  if (typeof applyLanguage === "function") {
    const previousApplyLanguage = applyLanguage;
    applyLanguage = function applyLanguageV36() {
      previousApplyLanguage();
      ensureHowToNameSafetyRow();
      ensureProfileSafetyUi();
      ensureChampionSafetyUi();
      updateProfileBadges();
    };
    window.applyLanguage = applyLanguage;
  }

  function scrubStoredWinnerNames() {
    try {
      const winners = JSON.parse(localStorage.getItem(WINNERS_KEY) || "[]");
      if (!Array.isArray(winners)) return;
      let changed = false;
      const scrubbed = winners.map(entry => {
        const result = validatePlayerName(entry && entry.name ? entry.name : DEFAULT_SAFE_NAME);
        if (!result.ok) changed = true;
        return { ...entry, name: result.ok ? result.name : DEFAULT_SAFE_NAME };
      });
      if (changed) localStorage.setItem(WINNERS_KEY, JSON.stringify(scrubbed.slice(0, 10)));
    } catch (error) {
      // Beholder spillet i gang selv om localStorage skulle være blokkert.
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureHowToNameSafetyRow();
    ensureProfileSafetyUi();
    ensureChampionSafetyUi();
    updateProfileBadges();
    scrubStoredWinnerNames();
  });

  setTimeout(() => {
    ensureHowToNameSafetyRow();
    updateProfileBadges();
    scrubStoredWinnerNames();
  }, 500);
})();


/* --------------------------------------------------------------------------
   V38 Safe profile builder
   - Bare ett sted for spillernavn: spillerkortet på hovedmenyen.
   - Ingen fritekstnavn lenger. Spillet lager trygge navn fra tema + valgfri 4-sifret tagg.
   - Gamle lagrede navn vaskes. Grov/seksuell tekst blir erstattet av trygt spillernavn.
   - Top 10 bruker alltid aktivt spillerkort, og vinnerdialogen viser ikke egen navne-endring.
   -------------------------------------------------------------------------- */
(function v38SafeProfileBuilder() {
  const NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const LAST_NAME_KEY = 'ragiJoyLastWinnerName';
  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const MAX_ENTRIES = 10;
  const DEFAULT_SAFE = 'JoyHero-1000';

  const ui = {
    no: {
      profileButtonEmpty: '👤 Lag spillerkort',
      profileButtonNamed: '👤 {name}',
      profileTitle: '👤 Spillerkort',
      profileSubtitle: 'Velg et trygt spillernavn generert av spillet. Ingen fritekstnavn lagres.',
      profileCurrentLabel: 'Aktivt spillerkort',
      profileNoName: 'Ikke valgt ennå',
      profileSafeTitle: 'Trygg navneløsning',
      profileSafeText: 'Navnet velges fra trygge forslag. Du kan kun legge til en 4-sifret kode. Det hindrer grove/seksuelle ord og privat informasjon.',
      profileRulesShort: 'Trygge forslag · valgfri 4-sifret kode · ingen privat info',
      profileThemeLabel: 'Velg tema',
      profileTagLabel: 'Personlig kode',
      profileTagHelp: 'Valgfritt: 4 tall som gjør navnet mer personlig, f.eks. 1998. Ingen bokstaver eller fritekst.',
      profileGenerate: '🎲 Lag 10 nye forslag',
      profileSave: '✅ Bruk valgt navn',
      profileClear: 'Nullstill',
      profileSavedSafe: 'Spillerkort aktivert: {name}',
      profileCleared: 'Spillerkort nullstilt.',
      profileNeedPick: 'Velg et av forslagene først.',
      profileInvalidBlocked: 'Dette navnet er ikke tillatt. Velg et trygt forslag fra listen.',
      profileActiveHud: 'Spiller',
      profileOnlyOnePlace: 'Navn endres kun her på hovedmenyen.',
      winnerUsesProfile: 'Top 10 bruker aktivt spillerkort fra hovedmenyen.',
      championTitle: '🏆 Ny toppscore!',
      championText: 'Resultatet kan lagres på Top 10 med aktivt spillerkort.',
      championNeedsName: 'Lag spillerkort først',
      championUseName: 'Lagre med {name}',
      championNoNameText: 'Du må velge et spillerkort før resultatet kan lagres.',
      howToNameSafe: 'Spillernavn velges som trygt spillerkort: forslag + valgfri 4-sifret kode. Ingen fritekstnavn eller privat info.'
    },
    en: {
      profileButtonEmpty: '👤 Create player card',
      profileButtonNamed: '👤 {name}',
      profileTitle: '👤 Player card',
      profileSubtitle: 'Choose a safe game name generated by the game. Free-text names are not stored.',
      profileCurrentLabel: 'Active player card',
      profileNoName: 'Not selected yet',
      profileSafeTitle: 'Safe name system',
      profileSafeText: 'The name is picked from safe suggestions. You can only add a 4-digit code. This blocks offensive/sexual words and private information.',
      profileRulesShort: 'Safe suggestions · optional 4-digit code · no private info',
      profileThemeLabel: 'Choose theme',
      profileTagLabel: 'Personal code',
      profileTagHelp: 'Optional: 4 digits to personalize the name, e.g. 1998. No letters or free text.',
      profileGenerate: '🎲 Generate 10 new names',
      profileSave: '✅ Use selected name',
      profileClear: 'Reset',
      profileSavedSafe: 'Player card activated: {name}',
      profileCleared: 'Player card reset.',
      profileNeedPick: 'Choose one of the suggestions first.',
      profileInvalidBlocked: 'This name is not allowed. Choose a safe suggestion from the list.',
      profileActiveHud: 'Player',
      profileOnlyOnePlace: 'Name is changed only here on the main menu.',
      winnerUsesProfile: 'Top 10 uses the active player card from the main menu.',
      championTitle: '🏆 New high score!',
      championText: 'This score can be saved to Top 10 with your active player card.',
      championNeedsName: 'Create player card first',
      championUseName: 'Save as {name}',
      championNoNameText: 'Choose a player card before saving this score.',
      howToNameSafe: 'Player names are safe player cards: suggestion + optional 4-digit code. No free text names or private information.'
    },
    de: {
      profileButtonEmpty: '👤 Spielerkarte erstellen',
      profileButtonNamed: '👤 {name}',
      profileTitle: '👤 Spielerkarte',
      profileSubtitle: 'Wähle einen sicheren Spielnamen, der vom Spiel erstellt wird. Freitextnamen werden nicht gespeichert.',
      profileCurrentLabel: 'Aktive Spielerkarte',
      profileNoName: 'Noch nicht gewählt',
      profileSafeTitle: 'Sicheres Namenssystem',
      profileSafeText: 'Der Name wird aus sicheren Vorschlägen gewählt. Du kannst nur einen 4-stelligen Code hinzufügen. Dadurch werden beleidigende/sexuelle Wörter und private Informationen vermieden.',
      profileRulesShort: 'Sichere Vorschläge · optionaler 4-stelliger Code · keine privaten Daten',
      profileThemeLabel: 'Thema wählen',
      profileTagLabel: 'Persönlicher Code',
      profileTagHelp: 'Optional: 4 Zahlen, z. B. 1998. Keine Buchstaben oder Freitext.',
      profileGenerate: '🎲 10 neue Namen',
      profileSave: '✅ Namen verwenden',
      profileClear: 'Zurücksetzen',
      profileSavedSafe: 'Spielerkarte aktiv: {name}',
      profileCleared: 'Spielerkarte zurückgesetzt.',
      profileNeedPick: 'Wähle zuerst einen Vorschlag.',
      profileInvalidBlocked: 'Dieser Name ist nicht erlaubt. Wähle einen sicheren Vorschlag aus der Liste.',
      profileActiveHud: 'Spieler',
      profileOnlyOnePlace: 'Der Name wird nur hier im Hauptmenü geändert.',
      winnerUsesProfile: 'Top 10 nutzt die aktive Spielerkarte aus dem Hauptmenü.',
      championTitle: '🏆 Neuer Highscore!',
      championText: 'Dieses Ergebnis kann mit deiner aktiven Spielerkarte gespeichert werden.',
      championNeedsName: 'Zuerst Spielerkarte erstellen',
      championUseName: 'Speichern als {name}',
      championNoNameText: 'Wähle eine Spielerkarte, bevor du dieses Ergebnis speicherst.',
      howToNameSafe: 'Spielernamen sind sichere Spielerkarten: Vorschlag + optionaler 4-stelliger Code. Keine Freitextnamen oder privaten Daten.'
    }
  };

  try {
    for (const [lang, texts] of Object.entries(ui)) {
      translations[lang] = { ...(translations[lang] || translations.en || {}), ...texts };
    }
    if (Array.isArray(languageOptions)) {
      for (const language of languageOptions) {
        if (!translations[language.code]) translations[language.code] = { ...(translations.en || {}) };
        for (const [key, value] of Object.entries(ui.en)) {
          if (!translations[language.code][key]) translations[language.code][key] = value;
        }
      }
    }
  } catch (_) {}

  const themes = {
    mixed: { icon: '🎲', label: { no: 'Miks', en: 'Mixed', de: 'Mix' }, words: ['TurboFox', 'NovaCat', 'PixelWolf', 'HappyRay', 'MegaCub', 'JoyRider', 'StarDuck', 'NeonBug', 'RocketPal', 'LuckyBee', 'ZappyKoala', 'DiamondOwl'] },
    car: { icon: '🏎️', label: { no: 'Racing', en: 'Racing', de: 'Racing' }, words: ['TurboFox', 'NitroCat', 'DriftOwl', 'RacerBee', 'BoostWolf', 'VroomCub', 'SpeedDuck', 'GripTiger', 'DashKoala', 'MotorAnt'] },
    space: { icon: '🚀', label: { no: 'Space', en: 'Space', de: 'Space' }, words: ['NovaFox', 'OrbitBee', 'CosmoCub', 'StarDuck', 'MoonCat', 'RocketOwl', 'GalaxyAnt', 'SolarWolf', 'CometPal', 'AstroRay'] },
    animal: { icon: '🐾', label: { no: 'Dyr', en: 'Animals', de: 'Tiere' }, words: ['HappyTiger', 'LuckyPanda', 'BraveKoala', 'MagicOwl', 'SwiftFox', 'SunnyBee', 'TinyDragon', 'MegaDuck', 'JollyCat', 'PowerCub'] },
    robot: { icon: '🤖', label: { no: 'Robot', en: 'Robot', de: 'Roboter' }, words: ['BotBuddy', 'PixelBot', 'MegaByte', 'NeonBot', 'CyberCub', 'RoboFox', 'ByteBee', 'SparkBot', 'NanoCat', 'LaserOwl'] },
    ocean: { icon: '🌊', label: { no: 'Hav', en: 'Ocean', de: 'Meer' }, words: ['WaveFox', 'CoralBee', 'PearlCat', 'AquaCub', 'TideOwl', 'BubbleRay', 'SplashDuck', 'SeaWolf', 'ReefPal', 'BlueKoala'] },
    viking: { icon: '🛡️', label: { no: 'Viking', en: 'Viking', de: 'Wikinger' }, words: ['RuneFox', 'SagaBee', 'ShieldCub', 'NordOwl', 'FjordCat', 'StormDuck', 'ValorWolf', 'IceTiger', 'BraveRay', 'HammerPal'] },
    candy: { icon: '🍭', label: { no: 'Godteri', en: 'Candy', de: 'Candy' }, words: ['CandyFox', 'SugarBee', 'JellyCat', 'CookieCub', 'BubbleOwl', 'ChocoDuck', 'SweetWolf', 'MangoRay', 'BerryPal', 'LimeKoala'] }
  };

  const blockedParts = [
    'hore','h0re','hora','whore','sadhore','saedhore','sedhore','sædhore','sex','sexy','porn','porno','p0rn','pikk','kuk','kukk','fitte','faen','javel','jævel','nazi','hitler','terror','isis','dritt','fuck','fuk','bitch','slut','rape','voldtekt','pedo','pdfil','pedofil','nigger','neger'
  ];

  let currentProfileTheme = 'mixed';
  let selectedGeneratedName = '';
  let lastGeneratedNames = [];

  function lang() {
    return (typeof currentLanguage !== 'undefined' && currentLanguage) || 'en';
  }

  function tr(key, vars = {}) {
    let value = (translations[lang()] && translations[lang()][key]) || (translations.en && translations.en[key]) || ui.en[key] || key;
    for (const [name, replacement] of Object.entries(vars)) value = String(value).replaceAll(`{${name}}`, replacement);
    return value;
  }

  function themeLabel(themeKey) {
    const theme = themes[themeKey] || themes.mixed;
    return (theme.label && (theme.label[lang()] || theme.label.en)) || themeKey;
  }

  function normalizeSafety(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'a')
      .replace(/0/g, 'o')
      .replace(/[1!|]/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5|\$/g, 's')
      .replace(/7/g, 't')
      .replace(/@/g, 'a')
      .replace(/[^a-z0-9]/g, '');
  }

  function isSafeName(name) {
    const raw = String(name || '');
    const normalized = normalizeSafety(raw);
    if (!raw || raw.length < 6 || raw.length > 18) return false;
    if (/@|https?:|www\.|<|>/.test(raw)) return false;
    if ((raw.replace(/\D/g, '') || '').length > 4) return false;
    return !blockedParts.some(part => normalized.includes(normalizeSafety(part)));
  }

  function safeStoredName() {
    const stored = String(localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || '').trim();
    if (isSafeName(stored)) return stored;
    if (stored) {
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(LAST_NAME_KEY);
    }
    return '';
  }

  function safeTag() {
    const input = document.getElementById('profileTagInput');
    const tag = input ? String(input.value || '').replace(/\D/g, '').slice(0, 4) : '';
    if (input && input.value !== tag) input.value = tag;
    return tag.length === 4 ? tag : String(Math.floor(1000 + Math.random() * 9000));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function makeName(themeKey, tag) {
    const theme = themes[themeKey] || themes.mixed;
    let base = pick(theme.words);
    let finalName = `${base}-${tag}`;
    let guard = 0;
    while ((!isSafeName(finalName) || finalName.length > 18) && guard < 20) {
      base = pick(theme.words);
      finalName = `${base}-${tag}`;
      guard += 1;
    }
    return isSafeName(finalName) ? finalName : DEFAULT_SAFE;
  }

  function generateNames(themeKey = currentProfileTheme) {
    currentProfileTheme = themes[themeKey] ? themeKey : 'mixed';
    const tag = safeTag();
    const sourceKeys = currentProfileTheme === 'mixed' ? Object.keys(themes).filter(k => k !== 'mixed') : [currentProfileTheme];
    const names = new Set();
    let guard = 0;
    while (names.size < 10 && guard < 80) {
      const key = pick(sourceKeys);
      names.add(makeName(key, tag));
      guard += 1;
    }
    lastGeneratedNames = Array.from(names).slice(0, 10);
    selectedGeneratedName = lastGeneratedNames[0] || DEFAULT_SAFE;
    renderNameSuggestions();
    updateProfileTextsV38();
  }

  function getAvatarMarkup() {
    const image = localStorage.getItem('ragiJoyAvatarImage');
    if (image) return `<img src="${image}" alt="" />`;
    return (typeof playerEmoji !== 'undefined' && playerEmoji) || localStorage.getItem('ragiJoyPlayerEmoji') || '😄';
  }

  function showDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else dialog.setAttribute('open', 'open');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function ensureProfileButton() {
    const slot = document.getElementById('profileButtonSlot');
    if (!slot) return null;
    let button = document.getElementById('profileNameButton');
    if (!button) {
      button = document.createElement('button');
      button.id = 'profileNameButton';
      button.className = 'profile-name-button v38-profile-button';
      button.type = 'button';
      slot.appendChild(button);
    }
    button.onclick = () => window.showProfileNameModal();
    return button;
  }

  function ensurePlayerHudCard() {
    let card = document.getElementById('playerNameHudCard');
    if (!card) {
      const hud = document.getElementById('gameHud');
      if (!hud) return null;
      card = document.createElement('div');
      card.id = 'playerNameHudCard';
      card.className = 'hud-card player-name-hud-card';
      card.innerHTML = `<span id="playerNameHudLabel"></span><strong id="playerNameHudValue"></strong>`;
      hud.insertBefore(card, hud.firstElementChild || null);
    }
    return card;
  }

  function ensureProfileDialog() {
    let dialog = document.getElementById('profileNameModal');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'profileNameModal';
      document.body.appendChild(dialog);
    }
    dialog.className = 'winner-modal profile-name-modal v38-profile-modal';
    dialog.innerHTML = `
      <div class="winner-card profile-card v38-profile-card">
        <button class="friend-modal-close" type="button" onclick="closeProfileNameModal()" aria-label="Close">✕</button>
        <p class="friend-kicker">PLAYER CARD</p>
        <h2 id="profileTitle"></h2>
        <p id="profileSubtitle" class="winner-subtitle"></p>

        <div class="profile-preview-row v38-profile-preview">
          <div id="profileAvatarBadge" class="profile-avatar-badge"></div>
          <div>
            <span id="profileCurrentLabel" class="profile-current-label"></span>
            <strong id="profileCurrentName" class="profile-current-name"></strong>
            <small id="profileOnlyOnePlace" class="v38-one-place"></small>
          </div>
        </div>

        <div class="profile-safe-rules v38-safe-rules">
          <strong id="profileSafeTitle"></strong>
          <span id="profileSafeText"></span>
          <small id="profileRulesShort"></small>
        </div>

        <div class="v38-theme-head">
          <strong id="profileThemeLabel"></strong>
          <button id="profileGenerateButton" type="button" onclick="regenerateSafePlayerNames()"></button>
        </div>
        <div id="profileThemeGrid" class="v38-theme-grid"></div>

        <label id="profileTagLabel" class="profile-label" for="profileTagInput"></label>
        <div class="v38-tag-row">
          <input id="profileTagInput" class="profile-input v38-tag-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="1998" />
          <button type="button" onclick="regenerateSafePlayerNames()">🎲</button>
        </div>
        <p id="profileTagHelp" class="profile-note"></p>

        <div id="profileSuggestionGrid" class="v38-name-grid"></div>
        <p id="profileNameInputError" class="profile-error" hidden></p>

        <div class="profile-actions v38-profile-actions">
          <button id="profileSaveButton" class="profile-save-button" type="button" onclick="saveGeneratedPlayerName()"></button>
          <button id="profileClearButton" class="profile-clear-button" type="button" onclick="clearGeneratedPlayerName()"></button>
        </div>
      </div>`;

    const tagInput = dialog.querySelector('#profileTagInput');
    if (tagInput) {
      tagInput.value = String(Math.floor(1000 + Math.random() * 9000));
      tagInput.addEventListener('input', () => {
        tagInput.value = tagInput.value.replace(/\D/g, '').slice(0, 4);
      }, { passive: true });
      tagInput.addEventListener('change', () => generateNames(currentProfileTheme));
    }
    return dialog;
  }

  function renderThemeGrid() {
    const grid = document.getElementById('profileThemeGrid');
    if (!grid) return;
    grid.innerHTML = Object.keys(themes).map(key => {
      const theme = themes[key];
      return `<button type="button" class="v38-theme-chip ${key === currentProfileTheme ? 'active' : ''}" onclick="setSafeNameTheme('${key}')">${theme.icon} <span>${themeLabel(key)}</span></button>`;
    }).join('');
  }

  function renderNameSuggestions() {
    const grid = document.getElementById('profileSuggestionGrid');
    if (!grid) return;
    grid.innerHTML = lastGeneratedNames.map(name => `
      <button type="button" class="v38-name-choice ${name === selectedGeneratedName ? 'selected' : ''}" onclick="selectGeneratedPlayerName('${name.replace(/'/g, '\\&#039;')}')">
        <span>✨</span><strong>${escapeHtml(name)}</strong>
      </button>`).join('');
  }

  function showProfileError(message) {
    const error = document.getElementById('profileNameInputError');
    if (error) {
      error.textContent = message || '';
      error.hidden = !message;
    }
  }

  function updateProfileTextsV38() {
    const name = safeStoredName();
    const button = ensureProfileButton();
    const hudCard = ensurePlayerHudCard();
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

    if (button) {
      button.textContent = name ? tr('profileButtonNamed', { name }) : tr('profileButtonEmpty');
      button.classList.toggle('has-name', Boolean(name));
      button.title = tr('profileRulesShort');
    }

    if (hudCard) {
      set('playerNameHudLabel', `👤 ${tr('profileActiveHud')}`);
      set('playerNameHudValue', name || tr('profileNoName'));
      hudCard.classList.toggle('empty-profile', !name);
    }

    set('profileTitle', tr('profileTitle'));
    set('profileSubtitle', tr('profileSubtitle'));
    set('profileCurrentLabel', tr('profileCurrentLabel'));
    set('profileCurrentName', name || tr('profileNoName'));
    set('profileOnlyOnePlace', tr('profileOnlyOnePlace'));
    set('profileSafeTitle', `🛡️ ${tr('profileSafeTitle')}`);
    set('profileSafeText', tr('profileSafeText'));
    set('profileRulesShort', tr('profileRulesShort'));
    set('profileThemeLabel', tr('profileThemeLabel'));
    set('profileGenerateButton', tr('profileGenerate'));
    set('profileTagLabel', tr('profileTagLabel'));
    set('profileTagHelp', tr('profileTagHelp'));
    set('profileSaveButton', tr('profileSave'));
    set('profileClearButton', tr('profileClear'));

    const badge = document.getElementById('profileAvatarBadge');
    if (badge) badge.innerHTML = getAvatarMarkup();
    renderThemeGrid();
    renderNameSuggestions();
    updateChampionNameUi();
    updateHowToSafeRow();
  }

  function saveName(name) {
    const clean = String(name || '').trim();
    if (!isSafeName(clean)) return false;
    localStorage.setItem(NAME_KEY, clean);
    localStorage.setItem(LAST_NAME_KEY, clean);
    updateProfileTextsV38();
    return true;
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  window.showProfileNameModal = function showProfileNameModalV38() {
    const dialog = ensureProfileDialog();
    generateNames(currentProfileTheme);
    updateProfileTextsV38();
    showProfileError('');
    showDialog(dialog);
  };

  window.closeProfileNameModal = function closeProfileNameModalV38() {
    closeDialog(document.getElementById('profileNameModal'));
  };

  window.setSafeNameTheme = function setSafeNameThemeV38(themeKey) {
    currentProfileTheme = themes[themeKey] ? themeKey : 'mixed';
    generateNames(currentProfileTheme);
  };

  window.regenerateSafePlayerNames = function regenerateSafePlayerNamesV38() {
    generateNames(currentProfileTheme);
  };

  window.selectGeneratedPlayerName = function selectGeneratedPlayerNameV38(name) {
    if (!lastGeneratedNames.includes(name) || !isSafeName(name)) {
      showProfileError(tr('profileInvalidBlocked'));
      return;
    }
    selectedGeneratedName = name;
    showProfileError('');
    renderNameSuggestions();
  };

  window.saveGeneratedPlayerName = function saveGeneratedPlayerNameV38() {
    if (!selectedGeneratedName || !lastGeneratedNames.includes(selectedGeneratedName)) {
      showProfileError(tr('profileNeedPick'));
      return;
    }
    if (!saveName(selectedGeneratedName)) {
      showProfileError(tr('profileInvalidBlocked'));
      return;
    }
    closeDialog(document.getElementById('profileNameModal'));
    if (typeof messageBar !== 'undefined' && messageBar) messageBar.textContent = tr('profileSavedSafe', { name: selectedGeneratedName });
  };

  window.clearGeneratedPlayerName = function clearGeneratedPlayerNameV38() {
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(LAST_NAME_KEY);
    updateProfileTextsV38();
    showProfileError('');
    if (typeof messageBar !== 'undefined' && messageBar) messageBar.textContent = tr('profileCleared');
  };

  // Backwards compatible function names used by older buttons, now routed to the generator.
  window.saveProfileNameFromModal = window.saveGeneratedPlayerName;
  window.clearProfileNameFromModal = window.clearGeneratedPlayerName;

  function cleanWinnerBoardUi() {
    const strip = document.getElementById('winnerProfileStrip');
    if (strip) strip.remove();
    const subtitle = document.getElementById('winnersSubtitle');
    if (subtitle && !subtitle.dataset.v38ProfileNote) {
      subtitle.dataset.v38ProfileNote = '1';
      subtitle.textContent = `${subtitle.textContent} ${tr('winnerUsesProfile')}`;
    }
  }

  const previousShowWinnerBoard = window.showWinnerBoard;
  window.showWinnerBoard = function showWinnerBoardV38() {
    cleanStoredNames();
    if (typeof previousShowWinnerBoard === 'function') previousShowWinnerBoard.apply(this, arguments);
    cleanWinnerBoardUi();
  };

  function loadBoard() {
    try {
      const parsed = JSON.parse(localStorage.getItem(BOARD_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function saveBoard(entries) {
    const sorted = (Array.isArray(entries) ? entries : [])
      .filter(Boolean)
      .sort((a, b) => {
        const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
        if (scoreDiff !== 0) return scoreDiff;
        const levelDiff = (Number(b.level) || 0) - (Number(a.level) || 0);
        if (levelDiff !== 0) return levelDiff;
        return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
      })
      .slice(0, MAX_ENTRIES);
    localStorage.setItem(BOARD_KEY, JSON.stringify(sorted));
  }

  function saveScoreToBoard() {
    const activeName = safeStoredName();
    if (!activeName) return false;
    const current = loadBoard();
    current.push({
      name: activeName,
      score: Number(score) || 0,
      level: Math.max(1, Math.min(35, Number(levelIndex) + 1 || 1)),
      difficulty: selectedDifficulty || 'normal',
      completedCampaign: Boolean(!onlineMode && levelIndex >= 34),
      createdAt: Date.now()
    });
    saveBoard(current);
    return true;
  }

  function ensureChampionModern() {
    const dialog = document.getElementById('championModal');
    if (!dialog) return;
    const activeName = safeStoredName();
    dialog.className = 'winner-modal champion-modal v38-champion-modal';
    dialog.innerHTML = `
      <div class="winner-card champion-card v38-champion-card">
        <button class="friend-modal-close" type="button" onclick="closeChampionModal()" aria-label="Close">✕</button>
        <p class="friend-kicker">TOP 10</p>
        <h2 id="championTitle">${tr('championTitle')}</h2>
        <p id="championText" class="winner-subtitle">${activeName ? tr('championText') : tr('championNoNameText')}</p>
        <input id="championNameInput" type="hidden" value="${escapeHtml(activeName)}" />
        <div class="v38-champion-profile ${activeName ? '' : 'missing'}">
          <div class="profile-avatar-badge">${getAvatarMarkup()}</div>
          <div>
            <span>${tr('profileCurrentLabel')}</span>
            <strong>${escapeHtml(activeName || tr('profileNoName'))}</strong>
            <small>${tr('profileRulesShort')}</small>
          </div>
        </div>
        <div class="champion-actions v38-champion-actions">
          ${activeName ? `<button id="championSaveButton" type="button" onclick="saveChampionWinner()">${tr('championUseName', { name: activeName })}</button>` : `<button id="championPickNameButton" type="button" onclick="showProfileNameModal()">${tr('championNeedsName')}</button>`}
          <button id="championSkipButton" type="button" onclick="closeChampionModal()">${(typeof t === 'function' ? t('championSkip') : 'Skip') || 'Skip'}</button>
        </div>
      </div>`;
  }

  function updateChampionNameUi() {
    const dialog = document.getElementById('championModal');
    if (dialog && dialog.open) ensureChampionModern();
  }

  window.saveChampionWinner = function saveChampionWinnerV38() {
    if (!safeStoredName()) {
      ensureChampionModern();
      window.showProfileNameModal();
      return;
    }
    saveScoreToBoard();
    closeDialog(document.getElementById('championModal'));
    if (typeof messageBar !== 'undefined' && messageBar) messageBar.textContent = (typeof t === 'function' ? t('championSaved') : 'Saved');
    window.showWinnerBoard();
  };

  window.closeChampionModal = function closeChampionModalV38() {
    closeDialog(document.getElementById('championModal'));
  };

  function watchChampionModal() {
    const dialog = document.getElementById('championModal');
    if (!dialog || dialog.dataset.v38Watched) return;
    dialog.dataset.v38Watched = '1';
    const observer = new MutationObserver(() => {
      if (dialog.open) setTimeout(ensureChampionModern, 20);
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  }

  function updateHowToSafeRow() {
    const grid = document.querySelector('#howToModal .howto-grid');
    if (!grid) return;
    let row = document.getElementById('howToNameSafety');
    if (!row) {
      row = document.createElement('div');
      row.id = 'howToNameSafety';
      row.className = 'howto-safety-row';
      row.innerHTML = '<strong>🛡️</strong><span id="howToNameSafeText"></span>';
      grid.appendChild(row);
    }
    const text = document.getElementById('howToNameSafeText');
    if (text) text.textContent = tr('howToNameSafe');
  }

  function cleanStoredNames() {
    const active = safeStoredName();
    if (active) saveName(active);
    const board = loadBoard();
    let changed = false;
    const cleanBoard = board.map(entry => {
      const name = entry && isSafeName(entry.name) ? entry.name : DEFAULT_SAFE;
      if (!entry || name !== entry.name) changed = true;
      return { ...entry, name };
    });
    if (changed) saveBoard(cleanBoard);
  }

  const previousApplyLanguage = applyLanguage;
  applyLanguage = function applyLanguageV38() {
    previousApplyLanguage.apply(this, arguments);
    updateProfileTextsV38();
    cleanWinnerBoardUi();
  };
  window.applyLanguage = applyLanguage;

  const previousShowHowToModal = window.showHowToModal;
  window.showHowToModal = function showHowToModalV38() {
    updateHowToSafeRow();
    if (typeof previousShowHowToModal === 'function') previousShowHowToModal.apply(this, arguments);
    updateHowToSafeRow();
  };

  document.addEventListener('DOMContentLoaded', () => {
    cleanStoredNames();
    ensureProfileButton();
    ensurePlayerHudCard();
    updateProfileTextsV38();
    updateHowToSafeRow();
    watchChampionModal();
  });

  setTimeout(() => {
    cleanStoredNames();
    ensureProfileButton();
    ensurePlayerHudCard();
    updateProfileTextsV38();
    updateHowToSafeRow();
    watchChampionModal();
  }, 250);

  setInterval(watchChampionModal, 1200);
})();

/* --------------------------------------------------------------------------
   V40 emergency fix: profile modal must not block gameplay.
   - close button/click outside/ESC works
   - starting any match closes the profile modal first
   - while playing, the profile modal is forced closed if it was left open
   -------------------------------------------------------------------------- */
(function v40ProfileModalGameUnblock() {
  if (window.__ragiJoyV40ProfileFix) return;
  window.__ragiJoyV40ProfileFix = true;

  function hardCloseProfileModal() {
    const dialog = document.getElementById('profileNameModal');
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    } catch (error) {}
    dialog.removeAttribute('open');
    dialog.classList.add('hidden');
  }

  function isMatchRunningOrPaused() {
    return document.body.classList.contains('playing-state') ||
           document.body.classList.contains('paused-state') ||
           document.body.classList.contains('online-state');
  }

  function patchProfileModal() {
    const dialog = document.getElementById('profileNameModal');
    if (!dialog || dialog.dataset.v40Patched === '1') return;
    dialog.dataset.v40Patched = '1';

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) hardCloseProfileModal();
    });

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      hardCloseProfileModal();
    });
  }

  const originalShowProfileNameModal = window.showProfileNameModal;
  if (typeof originalShowProfileNameModal === 'function') {
    window.showProfileNameModal = function showProfileNameModalV40() {
      // Player name is changed from the main menu only. This prevents the modal
      // from blocking the board if it is opened by accident during a match.
      if (isMatchRunningOrPaused()) {
        hardCloseProfileModal();
        return;
      }
      const result = originalShowProfileNameModal.apply(this, arguments);
      setTimeout(patchProfileModal, 0);
      return result;
    };
  }

  const originalCloseProfileNameModal = window.closeProfileNameModal;
  window.closeProfileNameModal = function closeProfileNameModalV40() {
    if (typeof originalCloseProfileNameModal === 'function') {
      try { originalCloseProfileNameModal.apply(this, arguments); } catch (error) {}
    }
    hardCloseProfileModal();
  };

  function wrapGlobalFunction(name) {
    const previous = window[name];
    if (typeof previous !== 'function' || previous.__v40Wrapped) return;
    const wrapped = function v40WrappedGameFunction() {
      hardCloseProfileModal();
      return previous.apply(this, arguments);
    };
    wrapped.__v40Wrapped = true;
    window[name] = wrapped;
    try { eval(`${name} = window[name];`); } catch (error) {}
  }

  ['startGame', 'startOnlineGame', 'restartGame', 'goToMainMenu', 'returnToMainMenuFromPause'].forEach(wrapGlobalFunction);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hardCloseProfileModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    patchProfileModal();
    // Safety: do not let an accidentally open profile modal survive into a match.
    setInterval(() => {
      patchProfileModal();
      const dialog = document.getElementById('profileNameModal');
      if (dialog && dialog.open && isMatchRunningOrPaused()) hardCloseProfileModal();
    }, 650);
  });
})();

/* --------------------------------------------------------------------------
   V41: Avslutt kamp + 24-timers dagsrekord + motivasjonsfeiring
   - Avslutt-knapp vises bare når spillet er pauset.
   - Hovedmeny finnes fortsatt, men Avslutt kamp lagrer score og viser sluttresultat.
   - Dagens Top 10 beholdes i 24 timer i denne nettleseren før den ryddes automatisk.
   - Når spilleren slår dagens rekord vises en liten "fontene"/feiring.
   -------------------------------------------------------------------------- */
(function v41QuitAndDailyRecords() {
  if (window.__ragiJoyV41QuitDailyRecords) return;
  window.__ragiJoyV41QuitDailyRecords = true;

  const DAILY_KEY = 'ragiJoyMazeDailyTop10V41';
  const DAILY_TTL = 24 * 60 * 60 * 1000;
  const NAME_KEY = 'ragiJoyMazePreferredNameV34';

  const ui = {
    no: {
      endRunButton: '🏁 Avslutt kamp',
      endRunTitle: 'Avslutte kampen?',
      endRunText: 'Poengsummen lagres hvis den er god nok for Top 10. Du kan også gå rett tilbake til hovedmenyen.',
      endRunSave: '✅ Lagre og avslutt',
      endRunMenu: '🏠 Hovedmeny',
      endRunCancel: 'Fortsett å spille',
      dailyChampionTitle: '⛲ Dagens rekord!',
      dailyChampionText: 'Gratulerer {name}! Du har dagens høyeste score med {score} poeng. Fortsett med talentet ditt – dette kan bli enda høyere! 🚀',
      dailyChampionButton: 'Konge! ✅',
      dailyTopTitle: '⏱️ Dagens Top 10',
      dailyTopEmpty: 'Ingen dagsresultater ennå. Spill en kamp for å fylle listen.',
      dailyTopInfo: 'Dagslisten lagres i denne nettleseren og ryddes automatisk etter 24 timer.',
      dailyTopExpires: 'Nullstilles om ca. {hours}t {minutes}m',
      dailyRecordShort: 'Dagens rekord: {score}'
    },
    en: {
      endRunButton: '🏁 End run',
      endRunTitle: 'End this run?',
      endRunText: 'Your score is saved if it is good enough for Top 10. You can also return directly to the main menu.',
      endRunSave: '✅ Save and end',
      endRunMenu: '🏠 Main menu',
      endRunCancel: 'Keep playing',
      dailyChampionTitle: '⛲ Daily record!',
      dailyChampionText: 'Congratulations {name}! You have today’s top score with {score} points. Keep that talent going – you can push it even higher! 🚀',
      dailyChampionButton: 'Awesome! ✅',
      dailyTopTitle: '⏱️ Daily Top 10',
      dailyTopEmpty: 'No daily results yet. Play a run to fill the list.',
      dailyTopInfo: 'The daily list is stored in this browser and is cleared automatically after 24 hours.',
      dailyTopExpires: 'Resets in about {hours}h {minutes}m',
      dailyRecordShort: 'Daily record: {score}'
    },
    de: {
      endRunButton: '🏁 Runde beenden',
      endRunTitle: 'Runde beenden?',
      endRunText: 'Dein Ergebnis wird gespeichert, wenn es gut genug für die Top 10 ist. Du kannst auch direkt zum Hauptmenü zurück.',
      endRunSave: '✅ Speichern und beenden',
      endRunMenu: '🏠 Hauptmenü',
      endRunCancel: 'Weiterspielen',
      dailyChampionTitle: '⛲ Tagesrekord!',
      dailyChampionText: 'Glückwunsch {name}! Du hast heute die höchste Punktzahl mit {score} Punkten. Weiter so – da geht noch mehr! 🚀',
      dailyChampionButton: 'Stark! ✅',
      dailyTopTitle: '⏱️ Tages Top 10',
      dailyTopEmpty: 'Noch keine Tagesergebnisse. Spiele eine Runde, um die Liste zu füllen.',
      dailyTopInfo: 'Die Tagesliste wird in diesem Browser gespeichert und nach 24 Stunden automatisch gelöscht.',
      dailyTopExpires: 'Reset in ca. {hours}h {minutes}m',
      dailyRecordShort: 'Tagesrekord: {score}'
    }
  };

  try {
    for (const [code, texts] of Object.entries(ui)) {
      translations[code] = { ...(translations[code] || translations.en || {}), ...texts };
    }
    if (Array.isArray(languageOptions)) {
      for (const language of languageOptions) {
        translations[language.code] = { ...(translations[language.code] || translations.en || {}), ...ui.en, ...(ui[language.code] || {}) };
      }
    }
  } catch (_) {}

  function tr(key, vars = {}) {
    let text = (translations[currentLanguage] && translations[currentLanguage][key]) || (translations.en && translations.en[key]) || ui.en[key] || key;
    for (const [name, value] of Object.entries(vars)) text = String(text).replaceAll(`{${name}}`, value);
    return text;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function playerName() {
    const stored = String(localStorage.getItem(NAME_KEY) || localStorage.getItem('ragiJoyLastWinnerName') || '').trim();
    return stored || (currentLanguage === 'no' ? 'Spiller' : 'Player');
  }

  function loadDailyBoard() {
    const now = Date.now();
    let entries = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(DAILY_KEY) || '[]');
      entries = Array.isArray(parsed) ? parsed : [];
    } catch (_) { entries = []; }
    entries = entries
      .filter(entry => entry && Number(entry.score) > 0 && Number(entry.createdAt) && now - Number(entry.createdAt) < DAILY_TTL)
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0) || (Number(b.level) || 0) - (Number(a.level) || 0))
      .slice(0, 10);
    localStorage.setItem(DAILY_KEY, JSON.stringify(entries));
    return entries;
  }

  function saveDailyScore(runScore, runLevel, runDifficulty) {
    const before = loadDailyBoard();
    const previousBest = before[0] ? Number(before[0].score) || 0 : 0;
    const entry = {
      name: playerName(),
      score: Number(runScore) || 0,
      level: Number(runLevel) || 1,
      difficulty: runDifficulty || selectedDifficulty || 'normal',
      createdAt: Date.now()
    };
    const after = [...before, entry]
      .filter(item => Number(item.score) > 0)
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0) || (Number(b.level) || 0) - (Number(a.level) || 0))
      .slice(0, 10);
    localStorage.setItem(DAILY_KEY, JSON.stringify(after));
    return entry.score > previousBest;
  }

  function nextExpiry(entries) {
    const now = Date.now();
    const oldest = entries.reduce((min, item) => Math.min(min, Number(item.createdAt) || now), now);
    const remaining = Math.max(0, DAILY_TTL - (now - oldest));
    return {
      hours: Math.floor(remaining / 3600000),
      minutes: Math.max(1, Math.ceil((remaining % 3600000) / 60000))
    };
  }

  function ensureEndRunButton() {
    const topActions = document.querySelector('.top-actions');
    if (!topActions) return null;
    let button = document.getElementById('endRunButton');
    if (!button) {
      button = document.createElement('button');
      button.id = 'endRunButton';
      button.type = 'button';
      button.className = 'end-run-button';
      button.addEventListener('click', () => showEndRunDialog());
      const menuButton = document.getElementById('menuFromPauseButton');
      if (menuButton && menuButton.parentElement === topActions) topActions.insertBefore(button, menuButton.nextSibling);
      else topActions.appendChild(button);
    }
    button.textContent = tr('endRunButton');
    return button;
  }

  function ensureEndRunDialog() {
    let dialog = document.getElementById('endRunDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'endRunDialog';
    dialog.className = 'v41-end-dialog';
    document.body.appendChild(dialog);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeEndRunDialog();
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeEndRunDialog();
    });
    return dialog;
  }

  function renderEndRunDialog() {
    const dialog = ensureEndRunDialog();
    dialog.innerHTML = `
      <div class="v41-end-card">
        <button class="friend-modal-close" type="button" onclick="closeEndRunDialog()" aria-label="Close">✕</button>
        <p class="friend-kicker">RUN CONTROL</p>
        <h2>${tr('endRunTitle')}</h2>
        <p>${tr('endRunText')}</p>
        <div class="v41-end-scorebox">
          <span>Score</span><strong>${escapeHtml(score)}</strong>
          <span>Level</span><strong>${Math.max(1, Number(levelIndex) + 1 || 1)}/35</strong>
        </div>
        <div class="v41-end-actions">
          <button type="button" class="v41-save-end" onclick="finishRunAndSave()">${tr('endRunSave')}</button>
          <button type="button" class="v41-menu-now" onclick="returnToMainMenuFromPause()">${tr('endRunMenu')}</button>
          <button type="button" class="v41-cancel" onclick="closeEndRunDialog()">${tr('endRunCancel')}</button>
        </div>
      </div>`;
    return dialog;
  }

  window.showEndRunDialog = function showEndRunDialogV41() {
    if (!gameRunning) return;
    const dialog = renderEndRunDialog();
    try { dialog.showModal(); } catch (_) { dialog.setAttribute('open', ''); }
  };

  window.closeEndRunDialog = function closeEndRunDialogV41() {
    const dialog = document.getElementById('endRunDialog');
    if (!dialog) return;
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch (_) {}
    dialog.removeAttribute('open');
  };

  window.finishRunAndSave = function finishRunAndSaveV41() {
    closeEndRunDialog();
    if (!gameRunning) return;
    paused = false;
    if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi();
    endGame(false);
  };

  function ensureDailyCelebration() {
    let overlay = document.getElementById('dailyRecordCelebration');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'dailyRecordCelebration';
    overlay.className = 'v41-daily-celebration';
    overlay.innerHTML = `
      <div class="v41-fountain" aria-hidden="true">
        <span>💎</span><span>🎉</span><span>⚡</span><span>🚀</span><span>🏆</span><span>✨</span><span>💎</span><span>🎊</span>
      </div>
      <div class="v41-daily-card">
        <button class="friend-modal-close" type="button" onclick="hideDailyCelebration()" aria-label="Close">✕</button>
        <p class="friend-kicker">DAILY CHAMPION</p>
        <h2 id="dailyRecordTitle"></h2>
        <p id="dailyRecordText"></p>
        <button type="button" onclick="hideDailyCelebration()" id="dailyRecordButton"></button>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function showDailyCelebration(runScore) {
    const overlay = ensureDailyCelebration();
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('dailyRecordTitle', tr('dailyChampionTitle'));
    set('dailyRecordText', tr('dailyChampionText', { name: playerName(), score: Number(runScore || 0).toLocaleString('nb-NO') }));
    set('dailyRecordButton', tr('dailyChampionButton'));
    overlay.classList.add('show');
    try { playSfx && playSfx('win'); } catch (_) {}
    for (let i = 0; i < 42; i++) {
      const particle = document.createElement('span');
      particle.className = 'v41-fountain-particle';
      particle.textContent = ['💎','🎉','⚡','🚀','🏆','✨','🟦','🟨'][i % 8];
      particle.style.setProperty('--x', `${(Math.random() * 520 - 260).toFixed(0)}px`);
      particle.style.setProperty('--r', `${(Math.random() * 720 - 360).toFixed(0)}deg`);
      particle.style.animationDelay = `${Math.random() * 0.55}s`;
      overlay.appendChild(particle);
      setTimeout(() => particle.remove(), 2300);
    }
  }

  window.hideDailyCelebration = function hideDailyCelebrationV41() {
    const overlay = document.getElementById('dailyRecordCelebration');
    if (overlay) overlay.classList.remove('show');
  };

  function renderDailyBoardHtml() {
    const entries = loadDailyBoard();
    if (!entries.length) {
      return `<section id="dailyTopPanel" class="v41-daily-panel"><h3>${tr('dailyTopTitle')}</h3><p>${tr('dailyTopEmpty')}</p><small>${tr('dailyTopInfo')}</small></section>`;
    }
    const expiry = nextExpiry(entries);
    return `<section id="dailyTopPanel" class="v41-daily-panel">
      <h3>${tr('dailyTopTitle')}</h3>
      <p>${tr('dailyTopInfo')} <strong>${tr('dailyTopExpires', expiry)}</strong></p>
      <ol class="v41-daily-list">
        ${entries.map((entry, index) => `<li><span>#${index + 1}</span><strong>${escapeHtml(entry.name || 'Player')}</strong><b>${Number(entry.score || 0).toLocaleString('nb-NO')}</b><em>L${escapeHtml(entry.level || 1)}</em></li>`).join('')}
      </ol>
    </section>`;
  }

  function injectDailyPanelIntoWinners() {
    const modal = document.getElementById('winnersModal') || document.querySelector('.winner-modal');
    if (!modal) return;
    const card = modal.querySelector('.winner-card') || modal;
    if (!card) return;
    let panel = document.getElementById('dailyTopPanel');
    if (!panel) {
      const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
      const holder = document.createElement('div');
      holder.innerHTML = renderDailyBoardHtml();
      panel = holder.firstElementChild;
      if (list && list.parentElement) list.parentElement.insertBefore(panel, list.nextSibling);
      else card.appendChild(panel);
    } else {
      const holder = document.createElement('div');
      holder.innerHTML = renderDailyBoardHtml();
      panel.replaceWith(holder.firstElementChild);
    }
  }

  function updateDailyMiniHud() {
    const entries = loadDailyBoard();
    const best = entries[0];
    let badge = document.getElementById('dailyRecordBadge');
    const summary = document.querySelector('.pre-game-summary') || document.querySelector('.summary-grid') || document.querySelector('.stats');
    if (!summary) return;
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'dailyRecordBadge';
      badge.className = 'summary-card v41-daily-badge';
      summary.appendChild(badge);
    }
    badge.innerHTML = `<span>⏱️ ${tr('dailyTopTitle').replace('⏱️ ', '')}</span><strong>${best ? Number(best.score || 0).toLocaleString('nb-NO') : '0'}</strong>`;
  }

  const previousUpdatePlayUi = window.v30UpdatePlayUi || (typeof v30UpdatePlayUi === 'function' ? v30UpdatePlayUi : null);
  window.v30UpdatePlayUi = globalThis.v30UpdatePlayUi = function v41UpdatePlayUi() {
    if (typeof previousUpdatePlayUi === 'function') previousUpdatePlayUi.apply(this, arguments);
    ensureEndRunButton();
  };
  try { eval('v30UpdatePlayUi = window.v30UpdatePlayUi'); } catch (_) {}

  const previousApplyLanguage = window.applyLanguage || applyLanguage;
  if (typeof previousApplyLanguage === 'function') {
    window.applyLanguage = globalThis.applyLanguage = applyLanguage = function applyLanguageV41() {
      previousApplyLanguage.apply(this, arguments);
      ensureEndRunButton();
      updateDailyMiniHud();
      injectDailyPanelIntoWinners();
    };
  }

  const previousShowWinnerBoard = window.showWinnerBoard;
  if (typeof previousShowWinnerBoard === 'function') {
    window.showWinnerBoard = function showWinnerBoardV41() {
      const result = previousShowWinnerBoard.apply(this, arguments);
      setTimeout(injectDailyPanelIntoWinners, 0);
      return result;
    };
  }

  const previousEndGame = window.endGame || endGame;
  if (typeof previousEndGame === 'function') {
    window.endGame = globalThis.endGame = endGame = function endGameV41(won) {
      const runScore = Number(score) || 0;
      const runLevel = Math.max(1, Math.min(35, Number(levelIndex) + 1 || 1));
      const runDifficulty = selectedDifficulty || 'normal';
      const isNewDaily = !onlineMode && runScore > 0 ? saveDailyScore(runScore, runLevel, runDifficulty) : false;
      const result = previousEndGame.apply(this, arguments);
      updateDailyMiniHud();
      if (isNewDaily) setTimeout(() => showDailyCelebration(runScore), 650);
      return result;
    };
  }

  const previousGoMain = window.goToMainMenu || goToMainMenu;
  if (typeof previousGoMain === 'function') {
    window.goToMainMenu = globalThis.goToMainMenu = goToMainMenu = function goToMainMenuV41() {
      closeEndRunDialog();
      hideDailyCelebration();
      const result = previousGoMain.apply(this, arguments);
      updateDailyMiniHud();
      return result;
    };
  }

  setTimeout(() => {
    ensureEndRunButton();
    updateDailyMiniHud();
    injectDailyPanelIntoWinners();
    if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi();
  }, 250);
})();

/* V41.1: close quit/daily overlays also when old pause-main-menu button is used. */
(function v411CloseOverlaysOnPauseMenu() {
  const previousReturnToMain = window.returnToMainMenuFromPause;
  if (typeof previousReturnToMain === 'function' && !previousReturnToMain.__v411Wrapped) {
    const wrapped = function returnToMainMenuFromPauseV411() {
      try { window.closeEndRunDialog && window.closeEndRunDialog(); } catch (_) {}
      try { window.hideDailyCelebration && window.hideDailyCelebration(); } catch (_) {}
      return previousReturnToMain.apply(this, arguments);
    };
    wrapped.__v411Wrapped = true;
    window.returnToMainMenuFromPause = wrapped;
    try { eval('returnToMainMenuFromPause = window.returnToMainMenuFromPause'); } catch (_) {}
  }
})();

/* --------------------------------------------------------------------------
   V42: Tydelig vinnerliste med navn + score + vanskelighetsgrad
   - Top 10 viser: rangering, spillernavn, vanskelighetsgrad, level og score.
   - Dagens Top 10 viser også vanskelighetsgrad.
   - Lagringen er ikke endret: eksisterende resultater brukes videre.
   -------------------------------------------------------------------------- */
(function v42LeaderboardDifficultyDisplay() {
  if (window.__ragiJoyV42LeaderboardDifficultyDisplay) return;
  window.__ragiJoyV42LeaderboardDifficultyDisplay = true;

  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const DAILY_KEY = 'ragiJoyMazeDailyTop10V41';
  const DAILY_TTL = 24 * 60 * 60 * 1000;

  const ui = {
    no: {
      leaderboardColumnsInfo: 'Listen viser spillernavn, score og valgt vanskelighetsgrad.',
      leaderboardDifficultyLabel: 'Vanskelighet',
      leaderboardScoreLabel: 'Score',
      leaderboardLevelLabel: 'Level',
      dailyTopTitle: '⏱️ Dagens Top 10',
      dailyTopEmpty: 'Ingen dagsresultater ennå. Spill en kamp for å fylle listen.',
      dailyTopInfo: 'Dagslisten lagres i denne nettleseren og ryddes automatisk etter 24 timer.',
      dailyTopExpires: 'Nullstilles om ca. {hours}t {minutes}m'
    },
    en: {
      leaderboardColumnsInfo: 'The list shows player name, score and selected difficulty.',
      leaderboardDifficultyLabel: 'Difficulty',
      leaderboardScoreLabel: 'Score',
      leaderboardLevelLabel: 'Level',
      dailyTopTitle: '⏱️ Daily Top 10',
      dailyTopEmpty: 'No daily results yet. Play a run to fill the list.',
      dailyTopInfo: 'The daily list is stored in this browser and is cleared automatically after 24 hours.',
      dailyTopExpires: 'Resets in about {hours}h {minutes}m'
    },
    de: {
      leaderboardColumnsInfo: 'Die Liste zeigt Spielername, Punkte und gewählte Schwierigkeit.',
      leaderboardDifficultyLabel: 'Schwierigkeit',
      leaderboardScoreLabel: 'Punkte',
      leaderboardLevelLabel: 'Level',
      dailyTopTitle: '⏱️ Tages Top 10',
      dailyTopEmpty: 'Noch keine Tagesergebnisse. Spiele eine Runde, um die Liste zu füllen.',
      dailyTopInfo: 'Die Tagesliste wird in diesem Browser gespeichert und nach 24 Stunden automatisch gelöscht.',
      dailyTopExpires: 'Reset in ca. {hours}h {minutes}m'
    }
  };

  try {
    for (const [code, texts] of Object.entries(ui)) {
      translations[code] = { ...(translations[code] || translations.en || {}), ...texts };
    }
    if (Array.isArray(languageOptions)) {
      for (const language of languageOptions) {
        translations[language.code] = { ...(translations[language.code] || translations.en || {}), ...ui.en, ...(ui[language.code] || {}) };
      }
    }
  } catch (_) {}

  function tr42(key, vars = {}) {
    let value = (translations[currentLanguage] && translations[currentLanguage][key]) ||
                (translations.en && translations.en[key]) ||
                (ui.en && ui.en[key]) ||
                key;
    for (const [name, replacement] of Object.entries(vars)) {
      value = String(value).replaceAll(`{${name}}`, replacement);
    }
    return value;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatScore(value) {
    try { return Number(value || 0).toLocaleString(currentLanguage === 'no' ? 'nb-NO' : undefined); }
    catch (_) { return String(Number(value || 0)); }
  }

  function difficultyText(key) {
    const fallback = key || 'normal';
    try {
      if (difficultySettings && difficultySettings[fallback] && difficultySettings[fallback].labelKey) {
        return t(difficultySettings[fallback].labelKey) || fallback;
      }
    } catch (_) {}
    const mapNo = { easy: 'Enkel', normal: 'Middels', hard: 'Vanskelig', extreme: 'Ekstrem' };
    const mapEn = { easy: 'Easy', normal: 'Medium', hard: 'Hard', extreme: 'Extreme' };
    return (currentLanguage === 'no' ? mapNo[fallback] : mapEn[fallback]) || fallback;
  }

  function difficultyIcon(key) {
    return ({ easy: '😁', normal: '😎', hard: '🔥', extreme: '💀' }[key]) || '🎯';
  }

  function loadJsonArray(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function loadLeaderboard() {
    return loadJsonArray(BOARD_KEY)
      .filter(entry => entry && Number(entry.score) > 0)
      .sort((a, b) => {
        const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
        if (scoreDiff !== 0) return scoreDiff;
        const levelDiff = (Number(b.level) || 0) - (Number(a.level) || 0);
        if (levelDiff !== 0) return levelDiff;
        return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
      })
      .slice(0, 10);
  }

  function loadDaily() {
    const now = Date.now();
    const fresh = loadJsonArray(DAILY_KEY)
      .filter(entry => entry && Number(entry.score) > 0 && Number(entry.createdAt) && now - Number(entry.createdAt) < DAILY_TTL)
      .sort((a, b) => {
        const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (Number(b.level) || 0) - (Number(a.level) || 0);
      })
      .slice(0, 10);
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(fresh)); } catch (_) {}
    return fresh;
  }

  function remainingTime(entries) {
    const now = Date.now();
    const oldest = entries.reduce((min, entry) => Math.min(min, Number(entry.createdAt) || now), now);
    const remaining = Math.max(0, DAILY_TTL - (now - oldest));
    return {
      hours: Math.floor(remaining / 3600000),
      minutes: Math.max(1, Math.ceil((remaining % 3600000) / 60000))
    };
  }

  function enhanceMainWinnerList() {
    const list = document.getElementById('winnerList');
    if (!list) return;
    const entries = loadLeaderboard();
    if (!entries.length) return;

    const subtitle = document.getElementById('winnersSubtitle');
    if (subtitle && !subtitle.dataset.v42ColumnsInfo) {
      subtitle.dataset.v42ColumnsInfo = '1';
      subtitle.textContent = `${subtitle.textContent} ${tr42('leaderboardColumnsInfo')}`;
    }

    list.classList.add('v42-winner-list');
    list.innerHTML = entries.map((entry, index) => {
      const diffKey = entry.difficulty || 'normal';
      const rankIcon = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
      return `
        <li class="winner-row v42-winner-row ${index === 0 ? 'top-rank' : ''}">
          <span class="winner-rank v42-rank">${rankIcon}<b>#${index + 1}</b></span>
          <div class="v42-player-cell">
            <span class="winner-name">${escapeHtml(entry.name || 'Player')}</span>
            <small>${tr42('leaderboardLevelLabel')} ${escapeHtml(entry.level || 1)}${entry.completedCampaign ? ' • 35/35' : ''}</small>
          </div>
          <span class="v42-difficulty-chip" title="${tr42('leaderboardDifficultyLabel')}">${difficultyIcon(diffKey)} ${escapeHtml(difficultyText(diffKey))}</span>
          <strong class="winner-score v42-score"><small>${tr42('leaderboardScoreLabel')}</small>${formatScore(entry.score)}</strong>
        </li>`;
    }).join('');
  }

  function renderDailyPanel() {
    const panel = document.getElementById('dailyTopPanel');
    if (!panel) return;
    const entries = loadDaily();
    panel.classList.add('v42-daily-panel');
    if (!entries.length) {
      panel.innerHTML = `<h3>${tr42('dailyTopTitle')}</h3><p>${tr42('dailyTopEmpty')}</p><small>${tr42('dailyTopInfo')}</small>`;
      return;
    }
    const expire = remainingTime(entries);
    panel.innerHTML = `
      <h3>${tr42('dailyTopTitle')}</h3>
      <p>${tr42('dailyTopInfo')} <strong>${tr42('dailyTopExpires', expire)}</strong></p>
      <ol class="v42-daily-list">
        ${entries.map((entry, index) => {
          const diffKey = entry.difficulty || 'normal';
          return `<li>
            <span class="v42-daily-rank">#${index + 1}</span>
            <strong>${escapeHtml(entry.name || 'Player')}</strong>
            <em>${difficultyIcon(diffKey)} ${escapeHtml(difficultyText(diffKey))}</em>
            <small>L${escapeHtml(entry.level || 1)}</small>
            <b>${formatScore(entry.score)}</b>
          </li>`;
        }).join('')}
      </ol>`;
  }

  function enhanceWinnerBoard() {
    enhanceMainWinnerList();
    renderDailyPanel();
  }

  const previousShowWinnerBoard = window.showWinnerBoard;
  if (typeof previousShowWinnerBoard === 'function') {
    window.showWinnerBoard = function showWinnerBoardV42() {
      const result = previousShowWinnerBoard.apply(this, arguments);
      setTimeout(enhanceWinnerBoard, 0);
      setTimeout(enhanceWinnerBoard, 80);
      return result;
    };
    try { eval('showWinnerBoard = window.showWinnerBoard'); } catch (_) {}
  }

  const previousApplyLanguage = window.applyLanguage || (typeof applyLanguage === 'function' ? applyLanguage : null);
  if (typeof previousApplyLanguage === 'function' && !previousApplyLanguage.__v42Wrapped) {
    const wrapped = function applyLanguageV42() {
      const result = previousApplyLanguage.apply(this, arguments);
      setTimeout(enhanceWinnerBoard, 0);
      return result;
    };
    wrapped.__v42Wrapped = true;
    window.applyLanguage = globalThis.applyLanguage = wrapped;
    try { applyLanguage = wrapped; } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(enhanceWinnerBoard, 350));
})();

/* --------------------------------------------------------------------------
   V44 PROFILE MODAL + LANGUAGE POLISH
   - Ingen ekstern AI/bildekilde: spillerkort-bildet genereres lokalt med CSS.
   - Fikser spillerkort-layout: venstre info/visual, høyre navnevalg parallelt.
   - Legger inn flere oversettelser slik at Quick guide / Player card ikke faller tilbake til engelsk for vanlige språk.
-------------------------------------------------------------------------- */
(function v44ProfilePolish() {
  const localTexts = {
    no: {
      profileKicker: 'SPILLERKORT',
      profileArtKicker: 'LOKALT GENERERT KORT',
      profileArtBadge: 'TRYGT NAVN',
      profileArtTitle: 'Din arcade-identitet',
      profileArtText: 'Kortet får en tilfeldig animert stil hver gang du åpner navnevalget. Ingen bilde eller navn sendes til eksterne AI-tjenester.',
      profileArtSafe: 'Kun trygge forslag',
      profileArtLocal: 'Lagres lokalt i nettleseren',
      profileArtTop10: 'Brukes i Top 10',
      profileThemeLabel: 'Velg tema',
      profileTagLabel: 'Personlig kode',
      profileGenerate: '🎲 Lag 10 nye navn',
      profileSave: '✅ Bruk valgt navn',
      profileClear: 'Nullstill',
      howToButton: '❔ Hvordan spille', howToKicker: 'KORT GUIDE', howToTitle: 'Slik spiller du',
      howToDiamonds: 'Samle alle diamantene.', howToPower: 'Ta power-up og spis fiender for bonus.', howToShield: 'Skjold redder deg én gang.', howToPortal: 'Portalen åpnes når brettet er tomt.', howToCombo: 'Combo gir mer poeng.', howToOnline: 'Multiplayer handler om å samle mer enn vennen din.', howToOkButton: 'Skjønner ✅'
    },
    en: {
      profileKicker: 'PLAYER CARD',
      profileArtKicker: 'LOCALLY GENERATED CARD',
      profileArtBadge: 'SAFE NAME',
      profileArtTitle: 'Your arcade identity',
      profileArtText: 'The card gets a random animated style each time you open the name picker. No image or name is sent to external AI services.',
      profileArtSafe: 'Safe suggestions only',
      profileArtLocal: 'Stored locally in this browser',
      profileArtTop10: 'Used on Top 10',
      profileThemeLabel: 'Choose theme',
      profileTagLabel: 'Personal code',
      profileGenerate: '🎲 Generate 10 new names',
      profileSave: '✅ Use selected name',
      profileClear: 'Reset',
      howToButton: '❔ How to play', howToKicker: 'QUICK GUIDE', howToTitle: 'How to play',
      howToDiamonds: 'Collect all diamonds.', howToPower: 'Grab power-up and eat enemies for bonus.', howToShield: 'Shield saves you once.', howToPortal: 'The portal opens when the board is empty.', howToCombo: 'Combos give more points.', howToOnline: 'Multiplayer is about collecting more than your friend.', howToOkButton: 'Got it ✅'
    },
    sv: {
      profileKicker: 'SPELARKORT',
      profileTitle: '👤 Spelarkort',
      profileSubtitle: 'Välj ett säkert spelnamn som skapas av spelet. Fritextnamn sparas inte.',
      profileCurrentLabel: 'Aktivt spelarkort', profileNoName: 'Inte valt ännu', profileSafeTitle: 'Säkert namnsystem',
      profileSafeText: 'Namnet väljs från säkra förslag. Du kan bara lägga till en 4-siffrig kod. Det stoppar grova/sexuella ord och privat information.',
      profileRulesShort: 'Säkra förslag · valfri 4-siffrig kod · ingen privat info', profileThemeLabel: 'Välj tema', profileTagLabel: 'Personlig kod',
      profileTagHelp: 'Valfritt: 4 siffror för att göra namnet personligt, t.ex. 1998. Inga bokstäver eller fritext.',
      profileGenerate: '🎲 Skapa 10 nya namn', profileSave: '✅ Använd valt namn', profileClear: 'Återställ', profileActiveHud: 'Spelare', profileOnlyOnePlace: 'Namnet ändras bara här i huvudmenyn.',
      profileArtKicker: 'LOKALT GENERERAT KORT', profileArtBadge: 'SÄKERT NAMN', profileArtTitle: 'Din arcade-identitet', profileArtText: 'Kortet får en slumpad animerad stil varje gång du öppnar namnvalet. Inget skickas till externa AI-tjänster.', profileArtSafe: 'Endast säkra förslag', profileArtLocal: 'Sparas lokalt i webbläsaren', profileArtTop10: 'Används i Top 10',
      howToButton: '❔ Hur man spelar', howToKicker: 'SNABBGUIDE', howToTitle: 'Så spelar du', howToDiamonds: 'Samla alla diamanter.', howToPower: 'Ta power-up och ät fiender för bonus.', howToShield: 'Skölden räddar dig en gång.', howToPortal: 'Portalen öppnas när banan är tom.', howToCombo: 'Combo ger fler poäng.', howToOnline: 'Multiplayer handlar om att samla mer än din vän.', howToOkButton: 'Jag fattar ✅'
    },
    da: {
      profileKicker: 'SPILLERKORT', profileTitle: '👤 Spillerkort', profileSubtitle: 'Vælg et sikkert spilnavn genereret af spillet. Fritekstnavne gemmes ikke.', profileCurrentLabel: 'Aktivt spillerkort', profileNoName: 'Ikke valgt endnu', profileSafeTitle: 'Sikkert navnesystem', profileSafeText: 'Navnet vælges fra sikre forslag. Du kan kun tilføje en 4-cifret kode.', profileRulesShort: 'Sikre forslag · valgfri 4-cifret kode · ingen privat info', profileThemeLabel: 'Vælg tema', profileTagLabel: 'Personlig kode', profileTagHelp: 'Valgfrit: 4 tal, f.eks. 1998. Ingen bogstaver eller fritekst.', profileGenerate: '🎲 Lav 10 nye navne', profileSave: '✅ Brug valgt navn', profileClear: 'Nulstil', profileActiveHud: 'Spiller', profileOnlyOnePlace: 'Navnet ændres kun her i hovedmenuen.', profileArtKicker: 'LOKALT GENERERET KORT', profileArtBadge: 'SIKKERT NAVN', profileArtTitle: 'Din arcade-identitet', profileArtText: 'Kortet får en tilfældig animeret stil hver gang. Intet sendes til eksterne AI-tjenester.', profileArtSafe: 'Kun sikre forslag', profileArtLocal: 'Gemmes lokalt i browseren', profileArtTop10: 'Bruges i Top 10', howToButton: '❔ Sådan spiller du', howToKicker: 'HURTIG GUIDE', howToTitle: 'Sådan spiller du', howToDiamonds: 'Saml alle diamanterne.', howToPower: 'Tag power-up og spis fjender for bonus.', howToShield: 'Skjold redder dig én gang.', howToPortal: 'Portalen åbner når banen er tom.', howToCombo: 'Combo giver flere point.', howToOnline: 'Multiplayer handler om at samle mere end din ven.', howToOkButton: 'Forstået ✅'
    },
    de: {
      profileKicker: 'SPIELERKARTE', profileArtKicker: 'LOKAL ERSTELLTE KARTE', profileArtBadge: 'SICHERER NAME', profileArtTitle: 'Deine Arcade-Identität', profileArtText: 'Die Karte erhält bei jedem Öffnen einen zufälligen animierten Stil. Es wird nichts an externe KI-Dienste gesendet.', profileArtSafe: 'Nur sichere Vorschläge', profileArtLocal: 'Lokal im Browser gespeichert', profileArtTop10: 'Wird für Top 10 genutzt', howToButton: '❔ Spielanleitung', howToKicker: 'KURZANLEITUNG', howToTitle: 'So spielst du', howToDiamonds: 'Sammle alle Diamanten.', howToPower: 'Nimm Power-ups und friss Gegner für Bonus.', howToShield: 'Das Schild rettet dich einmal.', howToPortal: 'Das Portal öffnet sich, wenn das Feld leer ist.', howToCombo: 'Kombos geben mehr Punkte.', howToOnline: 'Im Multiplayer sammelst du mehr als dein Freund.', howToOkButton: 'Verstanden ✅'
    },
    fr: {
      profileKicker: 'CARTE JOUEUR', profileTitle: '👤 Carte joueur', profileSubtitle: 'Choisis un nom sûr généré par le jeu. Les noms en texte libre ne sont pas enregistrés.', profileCurrentLabel: 'Carte active', profileNoName: 'Pas encore choisi', profileSafeTitle: 'Système de nom sûr', profileSafeText: 'Le nom vient de propositions sûres. Tu peux seulement ajouter un code à 4 chiffres.', profileRulesShort: 'Suggestions sûres · code 4 chiffres facultatif · aucune info privée', profileThemeLabel: 'Choisir un thème', profileTagLabel: 'Code personnel', profileTagHelp: 'Facultatif : 4 chiffres, par ex. 1998. Pas de lettres ni de texte libre.', profileGenerate: '🎲 Générer 10 noms', profileSave: '✅ Utiliser ce nom', profileClear: 'Réinitialiser', profileActiveHud: 'Joueur', profileOnlyOnePlace: 'Le nom se change seulement ici dans le menu principal.', profileArtKicker: 'CARTE GÉNÉRÉE LOCALEMENT', profileArtBadge: 'NOM SÛR', profileArtTitle: 'Ton identité arcade', profileArtText: 'La carte reçoit un style animé aléatoire à chaque ouverture. Rien n’est envoyé à un service IA externe.', profileArtSafe: 'Suggestions sûres uniquement', profileArtLocal: 'Stocké localement', profileArtTop10: 'Utilisé dans le Top 10', howToButton: '❔ Comment jouer', howToKicker: 'GUIDE RAPIDE', howToTitle: 'Comment jouer', howToDiamonds: 'Collecte tous les diamants.', howToPower: 'Prends le bonus et mange les ennemis.', howToShield: 'Le bouclier te sauve une fois.', howToPortal: 'Le portail s’ouvre quand le plateau est vide.', howToCombo: 'Les combos donnent plus de points.', howToOnline: 'En multijoueur, collecte plus que ton ami.', howToOkButton: 'Compris ✅'
    },
    es: {
      profileKicker: 'TARJETA DE JUGADOR', profileTitle: '👤 Tarjeta de jugador', profileSubtitle: 'Elige un nombre seguro generado por el juego. No se guardan nombres libres.', profileCurrentLabel: 'Tarjeta activa', profileNoName: 'Aún no elegido', profileSafeTitle: 'Sistema de nombre seguro', profileSafeText: 'El nombre se elige entre sugerencias seguras. Solo puedes añadir un código de 4 dígitos.', profileRulesShort: 'Sugerencias seguras · código opcional de 4 dígitos · sin datos privados', profileThemeLabel: 'Elige tema', profileTagLabel: 'Código personal', profileTagHelp: 'Opcional: 4 dígitos, por ejemplo 1998. Sin letras ni texto libre.', profileGenerate: '🎲 Generar 10 nombres', profileSave: '✅ Usar nombre', profileClear: 'Restablecer', profileActiveHud: 'Jugador', profileOnlyOnePlace: 'El nombre solo se cambia aquí en el menú principal.', profileArtKicker: 'TARJETA GENERADA LOCALMENTE', profileArtBadge: 'NOMBRE SEGURO', profileArtTitle: 'Tu identidad arcade', profileArtText: 'La tarjeta recibe un estilo animado aleatorio cada vez. No se envía nada a servicios externos de IA.', profileArtSafe: 'Solo sugerencias seguras', profileArtLocal: 'Guardado localmente', profileArtTop10: 'Se usa en Top 10', howToButton: '❔ Cómo jugar', howToKicker: 'GUÍA RÁPIDA', howToTitle: 'Cómo jugar', howToDiamonds: 'Recoge todos los diamantes.', howToPower: 'Toma power-up y come enemigos.', howToShield: 'El escudo te salva una vez.', howToPortal: 'El portal se abre cuando el tablero está vacío.', howToCombo: 'Los combos dan más puntos.', howToOnline: 'Multijugador: consigue más que tu amigo.', howToOkButton: 'Entendido ✅'
    },
    it: { profileKicker: 'SCHEDA GIOCATORE', profileThemeLabel: 'Scegli tema', profileTagLabel: 'Codice personale', profileGenerate: '🎲 Genera 10 nomi', profileSave: '✅ Usa nome scelto', profileClear: 'Ripristina', profileArtKicker: 'SCHEDA GENERATA LOCALMENTE', profileArtBadge: 'NOME SICURO', profileArtTitle: 'La tua identità arcade', profileArtText: 'Stile animato casuale, senza servizi IA esterni.', profileArtSafe: 'Solo suggerimenti sicuri', profileArtLocal: 'Salvato localmente', profileArtTop10: 'Usato nella Top 10', howToButton: '❔ Come giocare', howToKicker: 'GUIDA RAPIDA', howToTitle: 'Come giocare', howToDiamonds: 'Raccogli tutti i diamanti.', howToPower: 'Prendi power-up e mangia i nemici.', howToShield: 'Lo scudo ti salva una volta.', howToPortal: 'Il portale si apre quando il campo è vuoto.', howToCombo: 'Le combo danno più punti.', howToOnline: 'In multiplayer raccogli più del tuo amico.', howToOkButton: 'Capito ✅' },
    pt: { profileKicker: 'CARTÃO DO JOGADOR', profileThemeLabel: 'Escolher tema', profileTagLabel: 'Código pessoal', profileGenerate: '🎲 Gerar 10 nomes', profileSave: '✅ Usar nome', profileClear: 'Repor', profileArtKicker: 'CARTÃO GERADO LOCALMENTE', profileArtBadge: 'NOME SEGURO', profileArtTitle: 'A tua identidade arcade', profileArtText: 'Estilo animado aleatório, sem serviços externos de IA.', profileArtSafe: 'Só sugestões seguras', profileArtLocal: 'Guardado localmente', profileArtTop10: 'Usado no Top 10', howToButton: '❔ Como jogar', howToKicker: 'GUIA RÁPIDO', howToTitle: 'Como jogar', howToDiamonds: 'Apanha todos os diamantes.', howToPower: 'Usa power-up e come inimigos.', howToShield: 'O escudo salva-te uma vez.', howToPortal: 'O portal abre quando o tabuleiro fica vazio.', howToCombo: 'Combos dão mais pontos.', howToOnline: 'Multijogador: apanha mais que o teu amigo.', howToOkButton: 'Entendi ✅' },
    nl: { profileKicker: 'SPELERSKAART', profileThemeLabel: 'Kies thema', profileTagLabel: 'Persoonlijke code', profileGenerate: '🎲 Maak 10 nieuwe namen', profileSave: '✅ Gebruik naam', profileClear: 'Reset', profileArtKicker: 'LOKAAL GEMAAKTE KAART', profileArtBadge: 'VEILIGE NAAM', profileArtTitle: 'Jouw arcade-identiteit', profileArtText: 'Willekeurige animatiestijl, zonder externe AI-diensten.', profileArtSafe: 'Alleen veilige suggesties', profileArtLocal: 'Lokaal opgeslagen', profileArtTop10: 'Gebruikt in Top 10', howToButton: '❔ Hoe spelen', howToKicker: 'SNELLE GIDS', howToTitle: 'Hoe speel je', howToDiamonds: 'Verzamel alle diamanten.', howToPower: 'Pak power-up en eet vijanden.', howToShield: 'Schild redt je één keer.', howToPortal: 'Portaal opent als het bord leeg is.', howToCombo: 'Combo’s geven meer punten.', howToOnline: 'Multiplayer: verzamel meer dan je vriend.', howToOkButton: 'Begrepen ✅' },
    fi: { profileKicker: 'PELAAJAKORTTI', profileThemeLabel: 'Valitse teema', profileTagLabel: 'Henkilökohtainen koodi', profileGenerate: '🎲 Luo 10 nimeä', profileSave: '✅ Käytä nimeä', profileClear: 'Nollaa', profileArtKicker: 'PAIKALLISESTI LUOTU KORTTI', profileArtBadge: 'TURVALLINEN NIMI', profileArtTitle: 'Arcade-identiteettisi', profileArtText: 'Satunnainen animoitu tyyli, ei ulkoisia AI-palveluja.', profileArtSafe: 'Vain turvalliset ehdotukset', profileArtLocal: 'Tallennettu paikallisesti', profileArtTop10: 'Käytetään Top 10:ssa', howToButton: '❔ Kuinka pelata', howToKicker: 'PIKAOPAS', howToTitle: 'Kuinka pelata', howToDiamonds: 'Kerää kaikki timantit.', howToPower: 'Ota power-up ja syö vihollisia.', howToShield: 'Kilpi pelastaa kerran.', howToPortal: 'Portaali avautuu kun kenttä on tyhjä.', howToCombo: 'Combot antavat lisää pisteitä.', howToOnline: 'Moninpeli: kerää enemmän kuin ystäväsi.', howToOkButton: 'Selvä ✅' },
    pl: { profileKicker: 'KARTA GRACZA', profileThemeLabel: 'Wybierz motyw', profileTagLabel: 'Kod osobisty', profileGenerate: '🎲 Wygeneruj 10 nazw', profileSave: '✅ Użyj nazwy', profileClear: 'Reset', profileArtKicker: 'KARTA LOKALNA', profileArtBadge: 'BEZPIECZNA NAZWA', profileArtTitle: 'Twoja tożsamość arcade', profileArtText: 'Losowy animowany styl, bez zewnętrznych usług AI.', profileArtSafe: 'Tylko bezpieczne propozycje', profileArtLocal: 'Zapis lokalny', profileArtTop10: 'Używane w Top 10', howToButton: '❔ Jak grać', howToKicker: 'SZYBKI PORADNIK', howToTitle: 'Jak grać', howToDiamonds: 'Zbierz wszystkie diamenty.', howToPower: 'Weź power-up i jedz wrogów.', howToShield: 'Tarcza ratuje raz.', howToPortal: 'Portal otwiera się, gdy plansza jest pusta.', howToCombo: 'Combo daje więcej punktów.', howToOnline: 'Multiplayer: zbierz więcej niż znajomy.', howToOkButton: 'Rozumiem ✅' },
    tr: { profileKicker: 'OYUNCU KARTI', profileThemeLabel: 'Tema seç', profileTagLabel: 'Kişisel kod', profileGenerate: '🎲 10 yeni isim üret', profileSave: '✅ Seçilen adı kullan', profileClear: 'Sıfırla', profileArtKicker: 'YEREL OLUŞTURULAN KART', profileArtBadge: 'GÜVENLİ AD', profileArtTitle: 'Arcade kimliğin', profileArtText: 'Harici AI servisi olmadan rastgele animasyonlu stil.', profileArtSafe: 'Sadece güvenli öneriler', profileArtLocal: 'Tarayıcıda yerel kayıt', profileArtTop10: 'Top 10’da kullanılır', howToButton: '❔ Nasıl oynanır', howToKicker: 'HIZLI REHBER', howToTitle: 'Nasıl oynanır', howToDiamonds: 'Tüm elmasları topla.', howToPower: 'Power-up al ve düşmanları ye.', howToShield: 'Kalkan seni bir kez kurtarır.', howToPortal: 'Tahta boşalınca portal açılır.', howToCombo: 'Kombolar daha çok puan verir.', howToOnline: 'Çok oyunculu: arkadaşından fazla topla.', howToOkButton: 'Anladım ✅' },
    ta: { profileKicker: 'வீரர் அட்டை', profileThemeLabel: 'தீம் தேர்வு', profileTagLabel: 'தனிப்பட்ட குறியீடு', profileGenerate: '🎲 10 புதிய பெயர்கள்', profileSave: '✅ தேர்ந்த பெயரை பயன்படுத்து', profileClear: 'மீட்டமை', profileArtKicker: 'உள்ளூரில் உருவான அட்டை', profileArtBadge: 'பாதுகாப்பான பெயர்', profileArtTitle: 'உங்கள் arcade அடையாளம்', profileArtText: 'வெளிப்புற AI சேவை இல்லாமல் உள்ளூரில் உருவான அனிமேஷன்.', profileArtSafe: 'பாதுகாப்பான பரிந்துரைகள் மட்டும்', profileArtLocal: 'உலாவியில் சேமிக்கும்', profileArtTop10: 'Top 10 இல் பயன்படும்', howToButton: '❔ எப்படி விளையாடுவது', howToKicker: 'விரைவு வழிகாட்டி', howToTitle: 'எப்படி விளையாடுவது', howToDiamonds: 'அனைத்து வைரங்களையும் சேகரி.', howToPower: 'Power-up எடுத்து bonus பெறு.', howToShield: 'Shield ஒரு முறை காப்பாற்றும்.', howToPortal: 'வைரங்கள் முடிந்ததும் portal திறக்கும்.', howToCombo: 'Combo அதிக புள்ளி தரும்.', howToOnline: 'Multiplayer: நண்பரை விட அதிகம் சேகரி.', howToOkButton: 'புரிந்தது ✅' }
  };

  const themeLabels = {
    no: { mixed: 'Miks', car: 'Racing', space: 'Space', animal: 'Dyr', robot: 'Robot', ocean: 'Hav', viking: 'Viking', candy: 'Godteri' },
    en: { mixed: 'Mixed', car: 'Racing', space: 'Space', animal: 'Animals', robot: 'Robot', ocean: 'Ocean', viking: 'Viking', candy: 'Candy' },
    sv: { mixed: 'Mix', car: 'Racing', space: 'Rymd', animal: 'Djur', robot: 'Robot', ocean: 'Hav', viking: 'Viking', candy: 'Godis' },
    da: { mixed: 'Miks', car: 'Racing', space: 'Rum', animal: 'Dyr', robot: 'Robot', ocean: 'Hav', viking: 'Viking', candy: 'Slik' },
    de: { mixed: 'Mix', car: 'Racing', space: 'Weltall', animal: 'Tiere', robot: 'Roboter', ocean: 'Meer', viking: 'Wikinger', candy: 'Süßes' },
    fr: { mixed: 'Mixte', car: 'Course', space: 'Espace', animal: 'Animaux', robot: 'Robot', ocean: 'Océan', viking: 'Viking', candy: 'Bonbons' },
    es: { mixed: 'Mixto', car: 'Carreras', space: 'Espacio', animal: 'Animales', robot: 'Robot', ocean: 'Océano', viking: 'Vikingo', candy: 'Dulces' },
    it: { mixed: 'Misto', car: 'Corsa', space: 'Spazio', animal: 'Animali', robot: 'Robot', ocean: 'Oceano', viking: 'Vichingo', candy: 'Dolci' },
    pt: { mixed: 'Misto', car: 'Corrida', space: 'Espaço', animal: 'Animais', robot: 'Robô', ocean: 'Oceano', viking: 'Viking', candy: 'Doces' },
    nl: { mixed: 'Mix', car: 'Race', space: 'Ruimte', animal: 'Dieren', robot: 'Robot', ocean: 'Oceaan', viking: 'Viking', candy: 'Snoep' },
    fi: { mixed: 'Sekoitus', car: 'Ralli', space: 'Avaruus', animal: 'Eläimet', robot: 'Robotti', ocean: 'Meri', viking: 'Viikinki', candy: 'Karkki' },
    pl: { mixed: 'Miks', car: 'Wyścigi', space: 'Kosmos', animal: 'Zwierzęta', robot: 'Robot', ocean: 'Ocean', viking: 'Wiking', candy: 'Słodycze' },
    tr: { mixed: 'Karışık', car: 'Yarış', space: 'Uzay', animal: 'Hayvanlar', robot: 'Robot', ocean: 'Okyanus', viking: 'Viking', candy: 'Şeker' },
    ta: { mixed: 'கலவை', car: 'ரேசிங்', space: 'விண்வெளி', animal: 'விலங்கு', robot: 'ரோபோ', ocean: 'கடல்', viking: 'வைக்கிங்', candy: 'மிட்டாய்' }
  };

  try {
    if (typeof translations === 'object' && translations) {
      for (const [code, texts] of Object.entries(localTexts)) {
        translations[code] = { ...(translations[code] || translations.en || {}), ...texts };
      }
      if (Array.isArray(window.languageOptions || globalThis.languageOptions)) {
        const opts = window.languageOptions || globalThis.languageOptions;
        opts.forEach(opt => {
          const code = opt.code;
          translations[code] = { ...(translations.en || {}), ...(translations[code] || {}), ...(localTexts[code] || {}) };
        });
      }
    }
  } catch (_) {}

  function code() {
    try { return currentLanguage || 'en'; } catch (_) { return 'en'; }
  }

  function txt(key, vars = {}) {
    let value = (translations[code()] && translations[code()][key]) || (translations.en && translations.en[key]) || localTexts.en[key] || key;
    Object.entries(vars).forEach(([name, replacement]) => { value = String(value).replaceAll(`{${name}}`, replacement); });
    return value;
  }

  function activeAvatar() {
    try {
      const img = localStorage.getItem('ragiJoyAvatarImage');
      if (img) return '🖼️';
      return localStorage.getItem('ragiJoyPlayerEmoji') || (typeof playerEmoji !== 'undefined' && playerEmoji) || '😄';
    } catch (_) { return '😄'; }
  }

  function hashString(value) {
    return String(value || '').split('').reduce((sum, ch) => ((sum << 5) - sum + ch.charCodeAt(0)) | 0, 0);
  }

  const palettes = [
    ['#16e6ff', '#ffd23f', '#ff4edb'], ['#7c5cff', '#22f7b8', '#ffd23f'], ['#ff7a18', '#ff2f92', '#26e7ff'], ['#40ff8a', '#23b7ff', '#ffde59'], ['#ff5e62', '#ffcf4a', '#63e6ff'], ['#6d5dfc', '#00ffd0', '#ffb000']
  ];

  function ensureProfileArt() {
    const card = document.querySelector('#profileNameModal .v38-profile-card, #profileNameModal .profile-card');
    if (!card) return null;
    let art = document.getElementById('v44ProfileArt');
    if (!art) {
      art = document.createElement('div');
      art.id = 'v44ProfileArt';
      art.className = 'v44-profile-art';
      const safe = document.getElementById('profileRulesShort')?.closest('.profile-safe-rules') || card.querySelector('.profile-safe-rules');
      if (safe && safe.parentNode) safe.parentNode.insertBefore(art, safe.nextSibling);
      else card.appendChild(art);
    }
    return art;
  }

  function updateProfileArt() {
    const art = ensureProfileArt();
    if (!art) return;
    let name = '';
    try { name = localStorage.getItem('ragiJoyMazePreferredNameV34') || localStorage.getItem('ragiJoyLastWinnerName') || ''; } catch (_) {}
    const seed = Math.abs(hashString(`${name}-${code()}-${Date.now()}`));
    const p = palettes[seed % palettes.length];
    art.style.setProperty('--v44-art-a', p[0]);
    art.style.setProperty('--v44-art-b', p[1]);
    art.style.setProperty('--v44-art-c', p[2]);
    art.innerHTML = `
      <span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span>
      <div class="v44-art-topline"><span class="v44-art-kicker">${txt('profileArtKicker')}</span><span class="v44-art-badge">${txt('profileArtBadge')}</span></div>
      <div class="v44-art-orb"><span>${activeAvatar()}</span></div>
      <strong class="v44-art-title">${txt('profileArtTitle')}</strong>
      <p class="v44-art-text">${txt('profileArtText')}</p>
      <div class="v44-art-stats">
        <div class="v44-art-stat"><span>🛡️ ${txt('profileArtSafe')}</span><b>OK</b></div>
        <div class="v44-art-stat"><span>💾 ${txt('profileArtLocal')}</span><b>LOCAL</b></div>
        <div class="v44-art-stat"><span>🏆 ${txt('profileArtTop10')}</span><b>TOP</b></div>
      </div>`;
  }

  function relabelProfileThemes() {
    const labels = themeLabels[code()] || themeLabels.en;
    const order = ['mixed', 'car', 'space', 'animal', 'robot', 'ocean', 'viking', 'candy'];
    document.querySelectorAll('#profileThemeGrid .v38-theme-chip').forEach((button, index) => {
      const key = button.getAttribute('data-theme') || order[index];
      if (!button.getAttribute('data-theme')) button.setAttribute('data-theme', key);
      const span = button.querySelector('span');
      if (span && labels[key]) span.textContent = labels[key];
      button.title = labels[key] || '';
    });
  }

  function polishProfileTexts() {
    const dialog = document.getElementById('profileNameModal');
    if (!dialog) return;
    const kicker = dialog.querySelector('.friend-kicker');
    if (kicker) kicker.textContent = txt('profileKicker');
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('profileThemeLabel', txt('profileThemeLabel'));
    set('profileTagLabel', txt('profileTagLabel'));
    set('profileGenerateButton', txt('profileGenerate'));
    set('profileSaveButton', txt('profileSave'));
    set('profileClearButton', txt('profileClear'));
    updateProfileArt();
    relabelProfileThemes();
  }

  function patchHowToTexts() {
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('howToButton', txt('howToButton'));
    set('howToKicker', txt('howToKicker'));
    set('howToTitle', txt('howToTitle'));
    set('howToDiamonds', txt('howToDiamonds'));
    set('howToPower', txt('howToPower'));
    set('howToShield', txt('howToShield'));
    set('howToPortal', txt('howToPortal'));
    set('howToCombo', txt('howToCombo'));
    set('howToOnline', txt('howToOnline'));
    set('howToOkButton', txt('howToOkButton'));
  }

  function polishAll() {
    patchHowToTexts();
    polishProfileTexts();
  }

  const oldShow = window.showProfileNameModal;
  if (typeof oldShow === 'function' && !oldShow.__v44Wrapped) {
    const wrapped = function showProfileNameModalV44() {
      const result = oldShow.apply(this, arguments);
      setTimeout(polishProfileTexts, 0);
      setTimeout(polishProfileTexts, 90);
      return result;
    };
    wrapped.__v44Wrapped = true;
    window.showProfileNameModal = wrapped;
    try { showProfileNameModal = wrapped; } catch (_) {}
  }

  const oldTheme = window.setSafeNameTheme;
  if (typeof oldTheme === 'function' && !oldTheme.__v44Wrapped) {
    const wrappedTheme = function setSafeNameThemeV44() {
      const result = oldTheme.apply(this, arguments);
      setTimeout(polishProfileTexts, 0);
      return result;
    };
    wrappedTheme.__v44Wrapped = true;
    window.setSafeNameTheme = wrappedTheme;
    try { setSafeNameTheme = wrappedTheme; } catch (_) {}
  }

  const oldRegen = window.regenerateSafePlayerNames;
  if (typeof oldRegen === 'function' && !oldRegen.__v44Wrapped) {
    const wrappedRegen = function regenerateSafePlayerNamesV44() {
      const result = oldRegen.apply(this, arguments);
      setTimeout(polishProfileTexts, 0);
      return result;
    };
    wrappedRegen.__v44Wrapped = true;
    window.regenerateSafePlayerNames = wrappedRegen;
    try { regenerateSafePlayerNames = wrappedRegen; } catch (_) {}
  }

  const oldSelect = window.selectGeneratedPlayerName;
  if (typeof oldSelect === 'function' && !oldSelect.__v44Wrapped) {
    const wrappedSelect = function selectGeneratedPlayerNameV44() {
      const result = oldSelect.apply(this, arguments);
      setTimeout(polishProfileTexts, 0);
      return result;
    };
    wrappedSelect.__v44Wrapped = true;
    window.selectGeneratedPlayerName = wrappedSelect;
    try { selectGeneratedPlayerName = wrappedSelect; } catch (_) {}
  }

  const prevApply = window.applyLanguage || (typeof applyLanguage === 'function' ? applyLanguage : null);
  if (typeof prevApply === 'function' && !prevApply.__v44Wrapped) {
    const wrappedApply = function applyLanguageV44() {
      const result = prevApply.apply(this, arguments);
      setTimeout(polishAll, 0);
      setTimeout(polishAll, 80);
      return result;
    };
    wrappedApply.__v44Wrapped = true;
    window.applyLanguage = globalThis.applyLanguage = wrappedApply;
    try { applyLanguage = wrappedApply; } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(polishAll, 500));
  setTimeout(polishAll, 1000);
})();

/* --------------------------------------------------------------------------
   V47 Public feedback wall: full-screen comments + feedback form
   -------------------------------------------------------------------------- */
(function v47PublicFeedbackWall(){
  if (window.__v47FeedbackWall) return; window.__v47FeedbackWall = true;
  const PATH = 'feedback/public';
  const LIMIT = 20;
  const MAX = { experience:180, liked:160, improve:180, issue:160 };
  const LOCAL_KEY = 'ragiJoyFeedbackPublicCacheV47';
  const LAST_SEND_KEY = 'ragiJoyFeedbackLastSendV47';
  let stars = 4, fun = 8, design = 8, perf = 8, filter = 'all', cache = [], refreshTimer = null, suggestUses = 0, lastSuggestionPack = null;
  const SUGGEST_LIMIT = 10;

  const $ = id => document.getElementById(id);
  const no = {
    btn:'💬 Feedback', title:'Feedback og kommentarvegg', sub:'Siste 20 kommentarer vises offentlig som snakkebobler. Navn vises anonymt eller maskert.',
    form:'Skriv feedback', wall:'Kommentarvegg', wallSub:'Siste 20 etter dato, måned og år', rating:'Hvor bra var spillet?', score:'Nettside-score',
    fun:'Moro', design:'Design', perf:'Ytelse', anon:'Vis som anonym', masked:'Vis maskert navn',
    experience:'Hvordan var spillet?', liked:'Hva likte du best?', improve:'Hva bør forbedres?', issue:'Lagg, feil eller noe irriterende?',
    suggest:'Forslag', suggestAll:'✨ Lag forslag for alle felt', send:'Send feedback', sending:'Sender ...', sent:'Takk! Feedback sendt ✅',
    fail:'Kommentar lagret her. Synk prøves automatisk.', short:'Skriv litt mer i minst ett felt først.', wait:'Vent litt før du sender ny feedback.',
    suggestLimit:'10 forslag er brukt. Generatoren går nå i loop med trygge forslag.', suggestCounter:'forslag igjen',
    refresh:'Oppdater', all:'Alle', top:'5 stjerner', low:'Lav score', bugs:'Feil/lagg', empty:'Ingen kommentarer ennå. Bli første som legger igjen feedback.', anonName:'Anonym spiller', chars:'tegn'
  };
  const en = {...no, title:'Feedback and comment wall', sub:'Latest 20 comments are shown publicly as speech bubbles. Names are anonymous or masked.', form:'Write feedback', wall:'Comment wall', wallSub:'Latest 20 by day, month and year', rating:'How good was the game?', score:'Website score', fun:'Fun', perf:'Performance', anon:'Show as anonymous', masked:'Show masked name', experience:'How was the game?', liked:'What did you like most?', improve:'What should be improved?', issue:'Lag, bugs or anything annoying?', suggest:'Suggest', suggestAll:'✨ Generate suggestions for all fields', send:'Send feedback', sending:'Sending ...', sent:'Thanks! Feedback sent ✅', fail:'Could not send right now. The comment is saved temporarily in this browser and shown locally.', short:'Write a little more in at least one field first.', wait:'Wait a little before sending again.', suggestLimit:'10 suggestions used. The generator now loops safe suggestions.', suggestCounter:'suggestions left', refresh:'Refresh', all:'All', top:'5 stars', low:'Low score', bugs:'Bugs/lag', empty:'No comments yet. Be the first to leave feedback.', anonName:'Anonymous player', chars:'chars'};
  function L(){ try { return currentLanguage === 'en' ? en : no; } catch(_) { return no; } }
  function clean(v, max=240){ return String(v||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,max); }
  function calcFeedbackScore(){ return Math.round(Math.max(0, Math.min(100, stars*10 + fun*1.7 + design*1.6 + perf*1.7))); }
  function profileName(){ try { return clean(localStorage.getItem('ragiJoyMazePreferredNameV34') || localStorage.getItem('ragiJoyLastWinnerName') || '', 22); } catch(_) { return ''; } }
  function maskName(n){ n = clean(n, 22); if(!n) return L().anonName; if(n.length <= 4) return n[0] + '•••'; return n.slice(0,3) + '••••' + n.slice(-2); }
  function publicName(){ const anon = $('v47Anon')?.checked !== false; return anon ? L().anonName : maskName(profileName()); }
  function dateText(ts){ let langCode='no'; try{ langCode=currentLanguage==='en'?'en':'no'; }catch(_){} return new Date(Number(ts)||Date.now()).toLocaleDateString(langCode==='en'?'en-GB':'nb-NO',{day:'2-digit',month:'2-digit',year:'numeric'}); }
  function dbUrl(){ try { return typeof FIREBASE_DATABASE_URL === 'string' ? FIREBASE_DATABASE_URL : ''; } catch(_) { return ''; } }

  function field(key){ return `<div class="v47-field"><div><label for="v47_${key}"></label><button type="button" data-v47-suggest="${key}"></button></div><textarea id="v47_${key}" maxlength="${MAX[key]}" rows="3"></textarea><small><span id="v47_${key}_count">0</span>/${MAX[key]} <span data-v47-chars></span></small></div>`; }

  function ensure(){
    if (!$('v47FeedbackOpen')) {
      const b = document.createElement('button'); b.id='v47FeedbackOpen'; b.className='v47-feedback-open'; b.type='button'; b.onclick=openFeedbackWall; document.body.appendChild(b);
    }
    if (!$('v47FeedbackModal')) {
      const d = document.createElement('dialog'); d.id='v47FeedbackModal'; d.className='v47-feedback-modal';
      d.innerHTML = `<div class="v47-shell"><header class="v47-head"><div><p>PLAYER FEEDBACK</p><h2 id="v47Title"></h2><span id="v47Sub"></span></div><button type="button" onclick="closeFeedbackWall()">✕</button></header><main class="v47-grid"><section class="v47-card v47-form"><div class="v47-card-title"><h3 id="v47FormTitle"></h3><strong id="v47LiveScore"></strong></div><label class="v47-label" id="v47RatingLabel"></label><div id="v47Stars" class="v47-stars"></div><div class="v47-ranges"><label><span id="v47FunLabel"></span><input id="v47Fun" type="range" min="1" max="10" value="8"></label><label><span id="v47DesignLabel"></span><input id="v47Design" type="range" min="1" max="10" value="8"></label><label><span id="v47PerfLabel"></span><input id="v47Perf" type="range" min="1" max="10" value="8"></label></div><div class="v47-name"><label><input id="v47Anon" name="v47NameMode" type="radio" checked> <span id="v47AnonLabel"></span></label><label><input id="v47Masked" name="v47NameMode" type="radio"> <span id="v47MaskedLabel"></span></label></div><button id="v47SuggestAll" class="v47-suggest-all" type="button"></button><div class="v47-fields">${field('experience')}${field('liked')}${field('improve')}${field('issue')}</div><div class="v47-actions"><button id="v47Send" type="button" onclick="sendPublicFeedback()"></button><span id="v47Status"></span></div></section><section class="v47-card v47-wall"><div class="v47-wall-top"><div><h3 id="v47WallTitle"></h3><span id="v47WallSub"></span></div><button id="v47Refresh" type="button" onclick="loadPublicFeedback()"></button></div><div id="v47Filters" class="v47-filters"></div><div id="v47List" class="v47-list"></div></section></main></div>`;
      document.body.appendChild(d); bind();
    }
    text();
  }

  function bind(){
    ['v47Fun','v47Design','v47Perf'].forEach(id => $(id)?.addEventListener('input',()=>{ fun=+$('v47Fun').value; design=+$('v47Design').value; perf=+$('v47Perf').value; updateScore(); },{passive:true}));
    Object.keys(MAX).forEach(k => { $("v47_"+k)?.addEventListener('input',()=>count(k),{passive:true}); document.querySelector(`[data-v47-suggest="${k}"]`)?.addEventListener('click',()=>suggest(k)); });
    $('v47SuggestAll')?.addEventListener('click',suggestAll);
  }

  function text(){ const t=L(); $('v47FeedbackOpen').textContent=t.btn; $('v47Title').textContent=t.title; $('v47Sub').textContent=t.sub; $('v47FormTitle').textContent=t.form; $('v47RatingLabel').textContent=t.rating; $('v47FunLabel').textContent=t.fun; $('v47DesignLabel').textContent=t.design; $('v47PerfLabel').textContent=t.perf; $('v47AnonLabel').textContent=t.anon; $('v47MaskedLabel').textContent=`${t.masked} (${maskName(profileName())})`; $('v47Send').textContent=t.send; $('v47WallTitle').textContent=t.wall; $('v47WallSub').textContent=t.wallSub; $('v47Refresh').textContent='↻ '+t.refresh; Object.keys(MAX).forEach(k=>{ const lab=document.querySelector(`label[for="v47_${k}"]`); if(lab) lab.textContent=t[k]; const btn=document.querySelector(`[data-v47-suggest="${k}"]`); if(btn) btn.textContent=t.suggest; }); document.querySelectorAll('[data-v47-chars]').forEach(e=>e.textContent=t.chars); updateSuggestUi(); renderStars(); renderFilters(); updateScore(); renderWall(); }
  function updateScore(){ const el=$('v47LiveScore'); if(el) el.textContent=`${L().score}: ${calcFeedbackScore()}/100`; }
  function count(k){ const e=$('v47_'+k), c=$('v47_'+k+'_count'); if(e&&c) c.textContent=e.value.length; }
  function renderStars(){ const row=$('v47Stars'); if(!row) return; row.innerHTML=''; for(let i=1;i<=5;i++){ const b=document.createElement('button'); b.type='button'; b.textContent=i<=stars?'★':'☆'; b.className=i<=stars?'active':''; b.onclick=()=>{stars=i;renderStars();updateScore();}; row.appendChild(b);} }
  function renderFilters(){ const row=$('v47Filters'); if(!row) return; row.innerHTML=''; [['all',L().all],['top',L().top],['low',L().low],['bugs',L().bugs]].forEach(([k,v])=>{ const b=document.createElement('button'); b.type='button'; b.className=k===filter?'active':''; b.textContent=v; b.onclick=()=>{filter=k;renderFilters();renderWall();}; row.appendChild(b); }); }

  function suggestionVariants(){
    const great = [
      {experience:'Spillet var veldig morsomt, raskt og lett å forstå.',liked:'Jeg likte power-ups, laser, freeze og at brettene føltes levende.',improve:'Forklar coins og butikken enda tydeligere for nye spillere.',issue:'Jeg merket ikke store feil, men små forklaringer kan gjøre det enda bedre.'},
      {experience:'Det var lett å komme i gang, og rundene hadde fin fart.',liked:'Jeg likte at man kan kjøpe hjelp og få litt kaos på brettet.',improve:'Vis enda tydeligere hva hver power-up gjør før man kjøper den.',issue:'Ingen stor feil, men noen knapper kan være enda mer synlige.'},
      {experience:'Spillet føltes lekent, raskt og mer avhengighetsskapende enn forventet.',liked:'Coins, diamanter og fiender gjorde at jeg ville prøve én runde til.',improve:'Legg inn flere små belønninger når man klarer et nivå.',issue:'Jeg opplevde ikke lagg, men mobilvisningen bør alltid testes.'}
    ];
    const ok = [
      {experience:'Spillet var gøy og hadde bra tempo, men noen ting kan forklares bedre.',liked:'Jeg likte variasjonen, ikonene og at man kan kjøpe hjelp underveis.',improve:'Gjør Power-butikken og coins-systemet enda mer tydelig.',issue:'Det fungerte stort sett bra, men noen menyer kan bli mer oversiktlige.'},
      {experience:'Spillet var underholdende, men det tok litt tid å skjønne alt.',liked:'Jeg likte ideen med power-ups og at brettet endrer seg.',improve:'Gi en kort forklaring på coins, laser og freeze første gang.',issue:'Noen valg på skjermen kan føles litt tett sammen.'},
      {experience:'Spillet har mye bra, spesielt når tempoet øker.',liked:'Jeg likte jakten, lydene og små overraskelser underveis.',improve:'Lag en tydeligere startside som forklarer målet på 10 sekunder.',issue:'Det kan bli litt mye informasjon samtidig.'}
    ];
    const low = [
      {experience:'Spillet har gode ideer, men det kan bli mer ryddig.',liked:'Jeg likte konseptet med diamanter, nivåer og power-ups.',improve:'Forenkle menyene og gjør målet tydeligere før start.',issue:'Det kan bli litt mye på skjermen, og lagg/feil bør testes mer.'},
      {experience:'Jeg skjønte deler av spillet, men trengte mer forklaring.',liked:'Jeg likte at det finnes coins og hjelpemidler.',improve:'Start roligere og vis en kort guide før første runde.',issue:'Noen elementer kan oppleves for små eller uklare.'}
    ];
    return stars>=5 ? great : stars>=4 ? ok : low;
  }
  function nextSuggestionPack(){
    const list = suggestionVariants();
    const index = list.length ? (suggestUses % list.length) : 0;
    const pack = list[index] || list[0] || {};
    lastSuggestionPack = pack;
    suggestUses += 1;
    updateSuggestUi();
    return pack;
  }
  function updateSuggestUi(){
    const left = Math.max(0, SUGGEST_LIMIT - suggestUses);
    const t = L();
    const all = $('v47SuggestAll');
    if (all) {
      all.textContent = left > 0 ? `${t.suggestAll} · ${left} ${t.suggestCounter}` : `${t.suggestAll} · LOOP`;
      all.classList.toggle('limit-reached', left <= 0);
    }
    document.querySelectorAll('[data-v47-suggest]').forEach(btn => btn.classList.toggle('limit-reached', left <= 0));
  }
  function suggest(k){
    const e=$('v47_'+k), pack=nextSuggestionPack(), s=pack&&pack[k];
    if(e&&s){ e.value=clean(s,MAX[k]); count(k); }
    if (suggestUses >= SUGGEST_LIMIT) $('v47Status').textContent = L().suggestLimit;
  }
  function suggestAll(){
    const pack = nextSuggestionPack();
    Object.keys(MAX).forEach(k=>{ const e=$('v47_'+k), s=pack&&pack[k]; if(e&&s){ e.value=clean(s,MAX[k]); count(k); } });
    if (suggestUses >= SUGGEST_LIMIT) $('v47Status').textContent = L().suggestLimit;
  }

  function payload(){ const p={}; Object.keys(MAX).forEach(k=>p[k]=clean($('v47_'+k)?.value,MAX[k])); if(Object.values(p).join('').length<8) return null; let mode='computer'; try{ mode=onlineMode?'friend':'computer'; }catch(_){} return { id:'fb_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), createdAt:Date.now(), dateKey:new Date().toISOString().slice(0,10), maskedName:publicName(), stars, fun, design, performance:perf, totalScore:calcFeedbackScore(), ...p, game:{ mode, level:Number(typeof levelIndex!=='undefined'?levelIndex+1:1)||1, score:Number(typeof score!=='undefined'?score:0)||0, difficulty:String(typeof selectedDifficulty!=='undefined'?selectedDifficulty:'normal'), language:String(typeof currentLanguage!=='undefined'?currentLanguage:'no') }, public:true }; }
  function localSave(p){ try{ const a=JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]'); a.push(p); localStorage.setItem(LOCAL_KEY,JSON.stringify(a.slice(-LIMIT))); }catch(_){} }
  function localRead(){ try{ const cutoff=Date.now()-7*24*60*60*1000; const a=JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]'); const list=Array.isArray(a)?a.filter(x=>Number(x.createdAt||0)>=cutoff):[]; localStorage.setItem(LOCAL_KEY,JSON.stringify(list.slice(-LIMIT))); return list; }catch(_){return [];} }
  async function writeRemote(p){ if(typeof restPut==='function') return restPut(`${PATH}/${p.id}`,p); const u=dbUrl(); if(!u) throw new Error('No database url'); const r=await fetch(`${u}/${PATH}/${p.id}.json`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)}); if(!r.ok) throw new Error('write '+r.status); }
  async function readRemote(){
    const u=dbUrl();
    if(!u) return [];
    const r=await fetch(`${u}/${PATH}.json?orderBy=%22createdAt%22&limitToLast=80`,{cache:'no-store'});
    if(!r.ok) throw new Error('read '+r.status);
    const d=await r.json();
    const cutoff=Date.now()-7*24*60*60*1000;
    const arr=d?Object.values(d).filter(Boolean):[];
    arr.forEach(x=>{ if(x && x.id && Number(x.createdAt||0) < cutoff && typeof restDelete==='function') restDelete(`${PATH}/${x.id}`).catch(()=>{}); });
    return arr.filter(x=>Number(x.createdAt||0) >= cutoff);
  }

  window.sendPublicFeedback = async function(){ ensure(); const last=Number(localStorage.getItem(LAST_SEND_KEY)||0); if(Date.now()-last<25000){ $('v47Status').textContent=L().wait; return; } const p=payload(); if(!p){ $('v47Status').textContent=L().short; return; } $('v47Send').disabled=true; $('v47Status').textContent=L().sending; try{ await writeRemote(p); localStorage.setItem(LAST_SEND_KEY,String(Date.now())); $('v47Status').textContent=L().sent; }catch(e){ console.warn(e); $('v47Status').textContent=L().fail; } finally { localSave(p); cache=[p,...cache.filter(x=>x.id!==p.id)].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,LIMIT); renderWall(); Object.keys(MAX).forEach(k=>{ const e=$('v47_'+k); if(e) e.value=''; count(k); }); $('v47Send').disabled=false; try{spawnCenterBurst('💬 TAKK!');}catch(_){} setTimeout(loadPublicFeedback,800); } };
  window.loadPublicFeedback = async function(){ ensure(); try{ const remote=await readRemote(); const merged=[...remote,...localRead()]; const seen=new Set(); cache=merged.filter(x=>x&&x.id&&!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,LIMIT); }catch(e){ console.warn(e); cache=localRead().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,LIMIT); } renderWall(); };
  function filtered(){ return cache.filter(x=> filter==='top' ? +x.stars>=5 : filter==='low' ? (+x.totalScore<60||+x.stars<=2) : filter==='bugs' ? /lagg|treg|feil|bug|problem|slow|error|freeze/i.test((x.issue||'')+' '+(x.improve||'')) : true); }
  function line(parent,label,value){ value=clean(value,240); if(!value) return; const p=document.createElement('p'); const b=document.createElement('b'); b.textContent=label+': '; p.appendChild(b); p.appendChild(document.createTextNode(value)); parent.appendChild(p); }
  function renderWall(){ const list=$('v47List'); if(!list) return; const items=filtered(); list.innerHTML=''; if(!items.length){ const e=document.createElement('div'); e.className='v47-empty'; e.textContent=L().empty; list.appendChild(e); return; } items.forEach(x=>{ const a=document.createElement('article'); a.className='v47-bubble'; const h=document.createElement('div'); h.className='v47-bubble-head'; const n=document.createElement('strong'); n.textContent=x.maskedName||L().anonName; const m=document.createElement('span'); m.textContent=`${'★'.repeat(Math.max(1,+x.stars||1))} · ${+x.totalScore||0}/100 · ${dateText(x.createdAt)}`; h.append(n,m); const body=document.createElement('div'); line(body,L().experience,x.experience); line(body,L().liked,x.liked); line(body,L().improve,x.improve); line(body,L().issue,x.issue); const f=document.createElement('small'); const g=x.game||{}; f.textContent=`Level ${g.level||1} · ${g.difficulty||'normal'} · ${g.mode||'computer'} · Score ${g.score||0}`; a.append(h,body,f); list.appendChild(a); }); }
  window.openFeedbackWall = function(){ ensure(); loadPublicFeedback(); const d=$('v47FeedbackModal'); if(d.showModal&&!d.open)d.showModal(); else d.setAttribute('open','open'); clearInterval(refreshTimer); refreshTimer=setInterval(()=>{ if(d.open) loadPublicFeedback(); },60000); };
  window.closeFeedbackWall = function(){ clearInterval(refreshTimer); const d=$('v47FeedbackModal'); if(d?.close)d.close(); else d?.removeAttribute('open'); };

  const oldApply = window.applyLanguage || globalThis.applyLanguage; if(typeof oldApply==='function'){ window.applyLanguage=globalThis.applyLanguage=function(){ const r=oldApply.apply(this,arguments); setTimeout(()=>{ensure();text();},0); return r; }; }
  document.addEventListener('DOMContentLoaded',()=>{ensure(); setTimeout(loadPublicFeedback,400);}); setTimeout(()=>{ensure(); loadPublicFeedback();},650);
})();


/* --------------------------------------------------------------------------
   V49: Smart laser restore, random portal restore, active purchase HUD + sync polish
   -------------------------------------------------------------------------- */
(function v49SmartLasersRandomPortalAndHud(){
  if (window.__v49SmartLasersRandomPortalAndHud) return;
  window.__v49SmartLasersRandomPortalAndHud = true;

  const SMART_COST_ONE = 1450;
  const SMART_COST_THREE = 3800;
  const SMART_LASER_MS = 45000;
  const MANUAL_LASER_MS = 45000;
  const HUD_TICK_MS = 500;
  let hudTimer = null;

  Object.assign(translations.no, {
    shopSmartTurretTitle: '🤖 Smart laser',
    shopSmartTurretDesc: 'Systemet velger gode ruter automatisk. Varer lenger enn vanlig laser.',
    shopSmartTurretOne: '🤖 Kjøp smart laser',
    shopSmartTurretThree: '🤖 Kjøp 3 smarte',
    shopSmartTurretPlaced: '🤖 Smart laser plassert automatisk!',
    shopSmartTurretPlacedMany: '🤖 Smarte lasere plassert automatisk:',
    shopSmartNoSpot: 'Fant ikke en god ledig rute for smart laser akkurat nå.',
    activeToolsTitle: 'Aktivt utstyr',
    activeShield: 'Skjold klart',
    activeSlow: 'Slow',
    activeFreeze: 'Freeze',
    activeMagnet: 'Magnet',
    activeDouble: '2x score',
    activeLasers: 'Laser',
    activeInventory: 'Klar til plassering',
    portalRandomOpen: '🌀 Portalen åpnet på et tilfeldig trygt sted!'
  });
  Object.assign(translations.en, {
    shopSmartTurretTitle: '🤖 Smart laser',
    shopSmartTurretDesc: 'The system chooses good tiles automatically. Lasts longer than normal lasers.',
    shopSmartTurretOne: '🤖 Buy smart laser',
    shopSmartTurretThree: '🤖 Buy 3 smart',
    shopSmartTurretPlaced: '🤖 Smart laser placed automatically!',
    shopSmartTurretPlacedMany: '🤖 Smart lasers placed automatically:',
    shopSmartNoSpot: 'No good free tile for smart laser right now.',
    activeToolsTitle: 'Active gear',
    activeShield: 'Shield ready',
    activeSlow: 'Slow',
    activeFreeze: 'Freeze',
    activeMagnet: 'Magnet',
    activeDouble: '2x score',
    activeLasers: 'Laser',
    activeInventory: 'Ready to place',
    portalRandomOpen: '🌀 Portal opened in a random safe spot!'
  });
  for (const language of languageOptions) {
    translations[language.code] = translations[language.code] || { ...translations.en };
    Object.keys(translations.en).forEach(key => {
      if ((key.startsWith('shopSmart') || key.startsWith('active') || key === 'portalRandomOpen') && !translations[language.code][key]) {
        translations[language.code][key] = translations.en[key];
      }
    });
  }

  function timeLeft(until) {
    return Math.max(0, Math.ceil((Number(until || 0) - Date.now()) / 1000));
  }

  function ensureSmartShopButtons() {
    if (document.getElementById('buySmartTurretButton')) return;
    const turretArticle = document.querySelector('.shop-item-turret');
    if (!turretArticle) return;
    const smartBox = document.createElement('div');
    smartBox.className = 'v49-smart-laser-box';
    smartBox.innerHTML = `
      <hr class="v49-shop-divider">
      <strong id="shopSmartTurretTitle">🤖 Smart laser</strong>
      <p id="shopSmartTurretDesc">Systemet velger gode ruter automatisk.</p>
      <button id="buySmartTurretButton" class="v49-smart-button" type="button" onclick="buySmartLaser(1)">🤖 Smart laser ${SMART_COST_ONE}</button>
      <button id="buySmartTurretPackButton" class="v49-smart-button v49-smart-pack" type="button" onclick="buySmartLaser(3)">🤖 3 smarte ${SMART_COST_THREE}</button>
    `;
    turretArticle.appendChild(smartBox);
  }

  function updateSmartShopButtons() {
    ensureSmartShopButtons();
    const one = document.getElementById('buySmartTurretButton');
    const three = document.getElementById('buySmartTurretPackButton');
    const notSingle = Boolean(onlineMode) || !gameRunning;
    if (one) {
      one.textContent = `${t('shopSmartTurretOne')} ${SMART_COST_ONE}`;
      one.disabled = notSingle || score < SMART_COST_ONE;
    }
    if (three) {
      three.textContent = `${t('shopSmartTurretThree')} ${SMART_COST_THREE}`;
      three.disabled = notSingle || score < SMART_COST_THREE;
    }
    const title = document.getElementById('shopSmartTurretTitle');
    const desc = document.getElementById('shopSmartTurretDesc');
    if (title) title.textContent = t('shopSmartTurretTitle');
    if (desc) desc.textContent = t('shopSmartTurretDesc');
  }

  function tileOpenForSmartLaser(x, y) {
    if (!map[y] || map[y][x] === undefined) return false;
    if (map[y][x] !== TILE.EMPTY) return false;
    if (player.x === x && player.y === y) return false;
    if (remotePlayer && remotePlayer.x === x && remotePlayer.y === y) return false;
    if (enemies.some(enemy => enemy.x === x && enemy.y === y)) return false;
    if (v23Turrets.some(turret => turret.x === x && turret.y === y)) return false;
    return true;
  }

  function smartLaserScore(x, y) {
    const width = map[0]?.length || 13;
    const height = map.length || 11;
    const center = Math.abs(x - width / 2) + Math.abs(y - height / 2);
    const enemyNear = enemies.reduce((best, enemy) => Math.min(best, Math.abs(enemy.x - x) + Math.abs(enemy.y - y)), 99);
    let corridors = 0;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => {
      const tx = x + dx, ty = y + dy;
      if (map[ty] && map[ty][tx] !== undefined && map[ty][tx] !== TILE.WALL) corridors++;
    });
    let diamondsNearby = 0;
    for (let yy = Math.max(1, y - 3); yy <= Math.min(height - 2, y + 3); yy++) {
      for (let xx = Math.max(1, x - 3); xx <= Math.min(width - 2, x + 3); xx++) {
        if (map[yy][xx] === TILE.DOT) diamondsNearby++;
      }
    }
    return corridors * 18 + diamondsNearby * 2 + Math.max(0, 14 - center) + Math.max(0, 10 - enemyNear) * 3;
  }

  function bestSmartLaserTile(blocked = []) {
    const blockedKey = new Set(blocked.map(p => `${p.x},${p.y}`));
    const candidates = [];
    for (let y = 1; y < map.length - 1; y++) {
      for (let x = 1; x < map[y].length - 1; x++) {
        if (blockedKey.has(`${x},${y}`)) continue;
        if (!tileOpenForSmartLaser(x, y)) continue;
        candidates.push({ x, y, score: smartLaserScore(x, y) + Math.random() * 4 });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  function addSmartTurretAt(x, y) {
    v23Turrets.push({
      id: v23TurretId++,
      x,
      y,
      expiresAt: Date.now() + SMART_LASER_MS,
      lastShotAt: 0,
      smart: true
    });
    spawnPop('🤖', x, y);
  }

  window.buySmartLaser = function buySmartLaser(count = 1) {
    if (onlineMode || !gameRunning) return;
    count = Number(count) === 3 ? 3 : 1;
    const cost = count === 3 ? SMART_COST_THREE : SMART_COST_ONE;
    if (score < cost) {
      if (messageBar) messageBar.textContent = t('shopNotEnough');
      playSfx('lose');
      return;
    }
    const placed = [];
    for (let i = 0; i < count; i++) {
      const pos = bestSmartLaserTile(placed);
      if (!pos) break;
      placed.push(pos);
      addSmartTurretAt(pos.x, pos.y);
    }
    if (!placed.length) {
      if (messageBar) messageBar.textContent = t('shopSmartNoSpot');
      playSfx('lose');
      return;
    }
    score -= Math.round(cost * (placed.length / count));
    v23StartTurretLoop();
    spawnCenterBurst(count === 3 ? `🤖 x${placed.length}` : '🤖 LASER');
    if (messageBar) messageBar.textContent = placed.length > 1 ? `${t('shopSmartTurretPlacedMany')} ${placed.length}` : t('shopSmartTurretPlaced');
    playSfx('power');
    drawGame();
    v23UpdateShopUi();
    updatePowerHud();
  };

  const oldPlaceTurretAt = v23PlaceTurretAt;
  v23PlaceTurretAt = function v49PlaceTurretAt(x, y) {
    const beforeIds = new Set(v23Turrets.map(turret => turret.id));
    const result = oldPlaceTurretAt.apply(this, arguments);
    if (result) {
      const now = Date.now();
      v23Turrets.forEach(turret => {
        if (!beforeIds.has(turret.id)) turret.expiresAt = now + MANUAL_LASER_MS;
      });
      updatePowerHud();
    }
    return result;
  };
  window.v23PlaceTurretAt = v23PlaceTurretAt;

  function bestRandomPortalTile() {
    const candidates = [];
    const fallback = [];
    for (let y = 1; y < map.length - 1; y++) {
      for (let x = 1; x < map[y].length - 1; x++) {
        if (map[y][x] === TILE.WALL || map[y][x] === TILE.PORTAL) continue;
        if (player.x === x && player.y === y) continue;
        if (v23Turrets && v23Turrets.some(t => t.x === x && t.y === y)) continue;
        const enemyDistance = enemies.reduce((best, enemy) => Math.min(best, Math.abs(enemy.x - x) + Math.abs(enemy.y - y)), 99);
        const playerDistance = Math.abs(player.x - x) + Math.abs(player.y - y);
        const item = { x, y, score: enemyDistance * 4 + playerDistance + Math.random() * 10 };
        if (map[y][x] === TILE.EMPTY && enemyDistance >= 4 && playerDistance >= 3) candidates.push(item);
        else if (map[y][x] !== TILE.WALL && enemyDistance >= 2) fallback.push(item);
      }
    }
    const list = candidates.length ? candidates : fallback;
    list.sort((a, b) => b.score - a.score);
    return list[Math.floor(Math.random() * Math.min(8, list.length))] || list[0] || { x: 6, y: 5 };
  }

  openPortal = function v49OpenPortalRandom() {
    portalOpen = true;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === TILE.PORTAL) map[y][x] = TILE.EMPTY;
      }
    }
    const pos = bestRandomPortalTile();
    if (map[pos.y] && map[pos.y][pos.x] !== undefined) map[pos.y][pos.x] = TILE.PORTAL;
    if (messageBar) messageBar.textContent = t('portalRandomOpen');
    spawnCenterBurst('🌀 PORTAL!');
    spawnPop('🌀', pos.x, pos.y);
    playSfx('portal');
    drawGame();
  };
  window.openPortal = openPortal;

  function ensurePowerHud() {
    let hud = document.getElementById('v49PowerHud');
    if (hud) return hud;
    const wrapper = document.getElementById('game-wrapper');
    if (!wrapper) return null;
    hud = document.createElement('div');
    hud.id = 'v49PowerHud';
    hud.className = 'v49-power-hud hidden';
    wrapper.appendChild(hud);
    return hud;
  }

  function pill(icon, label, value) {
    return `<span class="v49-tool-pill"><b>${icon}</b><span>${label}</span>${value ? `<em>${value}</em>` : ''}</span>`;
  }

  function updatePowerHud() {
    const hud = ensurePowerHud();
    if (!hud) return;
    const items = [];
    if (!onlineMode && gameRunning) {
      if (shield) items.push(pill('🛡️', t('activeShield'), ''));
      const slowLeft = timeLeft(v23SlowUntil);
      const freezeLeft = typeof v30FreezeUntil !== 'undefined' ? timeLeft(v30FreezeUntil) : 0;
      const magnetLeft = typeof v30MagnetUntil !== 'undefined' ? timeLeft(v30MagnetUntil) : 0;
      const doubleLeft = typeof v30DoubleUntil !== 'undefined' ? timeLeft(v30DoubleUntil) : 0;
      if (slowLeft) items.push(pill('🧊', t('activeSlow'), `${slowLeft}s`));
      if (freezeLeft) items.push(pill('❄️', t('activeFreeze'), `${freezeLeft}s`));
      if (magnetLeft) items.push(pill('🧲', t('activeMagnet'), `${magnetLeft}s`));
      if (doubleLeft) items.push(pill('⭐', t('activeDouble'), `${doubleLeft}s`));
      const activeLasers = v23Turrets.filter(turret => Date.now() < turret.expiresAt);
      if (activeLasers.length) {
        const maxLeft = Math.max(...activeLasers.map(turret => timeLeft(turret.expiresAt)));
        items.push(pill('🔫', `${t('activeLasers')} x${activeLasers.length}`, `${maxLeft}s`));
      }
      if (v23TurretInventory > 0) items.push(pill('🎯', `${t('activeInventory')} x${v23TurretInventory}`, ''));
    }
    hud.classList.toggle('hidden', items.length === 0);
    hud.innerHTML = items.length ? `<strong>${t('activeToolsTitle')}</strong><div>${items.join('')}</div>` : '';
  }
  window.updatePowerHud = updatePowerHud;

  const oldUpdateShopUi = v23UpdateShopUi;
  v23UpdateShopUi = function v49UpdateShopUi() {
    oldUpdateShopUi.apply(this, arguments);
    updateSmartShopButtons();
    updatePowerHud();
  };
  window.v23UpdateShopUi = v23UpdateShopUi;

  const oldDrawGame = drawGame;
  drawGame = function v49DrawGame() {
    oldDrawGame.apply(this, arguments);
    updatePowerHud();
  };
  window.drawGame = drawGame;

  const oldClearLevelTools = v23ClearLevelTools;
  v23ClearLevelTools = function v49ClearLevelTools() {
    oldClearLevelTools.apply(this, arguments);
    updatePowerHud();
  };
  window.v23ClearLevelTools = v23ClearLevelTools;

  const oldResetShopRun = v23ResetShopRun;
  v23ResetShopRun = function v49ResetShopRun() {
    oldResetShopRun.apply(this, arguments);
    updatePowerHud();
  };
  window.v23ResetShopRun = v23ResetShopRun;

  function startHudTimer() {
    if (hudTimer) clearInterval(hudTimer);
    hudTimer = setInterval(updatePowerHud, HUD_TICK_MS);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureSmartShopButtons();
    updateSmartShopButtons();
    ensurePowerHud();
    startHudTimer();
  });
  setTimeout(() => {
    ensureSmartShopButtons();
    updateSmartShopButtons();
    ensurePowerHud();
    startHudTimer();
  }, 500);
})();
