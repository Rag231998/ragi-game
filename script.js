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
    setOnlineStatus("Tilkobling kobler til ... Last siden på nytt hvis den ikke blir klar.");
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
    : "Tilkobling kobler til ... Last siden på nytt hvis dette ikke endrer seg."
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
      setOnlineStatus("Tilkoblingen ble ikke klar. Last siden på nytt og sjekk internett.");
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
  aboutPrivacy: "Multiplayer uses secure cloud sync to share room code, ready status, score and player positions. Do not share private information in room codes or game names.",
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
  aboutCurrentNecessary: "Current choice: necessary only. The game stores local settings/highscores and uses cloud sync for multiplayer.",
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
  document.title = "Ragish 28 single Joys Maze";

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
   V62: shop coach placement + hit feedback polish
   - Shop hint bubble is anchored next to Power-shop button.
   - Losing a life gives subtle audio/visual feedback outside the board.
   -------------------------------------------------------------------------- */
(function v62ShopCoachAndHitFeedback(){
  if (window.__ragiJoyV62Patch) return;
  window.__ragiJoyV62Patch = true;

  function v62No(){
    try { return currentLanguage !== 'en'; } catch(_) { return true; }
  }
  function v62Text(no, en){ return v62No() ? no : en; }

  function v62EnsureShopCoach(){
    let coach = document.getElementById('v62ShopCoach');
    if (coach) return coach;
    coach = document.createElement('div');
    coach.id = 'v62ShopCoach';
    coach.className = 'v62-shop-coach hidden';
    coach.setAttribute('aria-hidden', 'true');
    coach.innerHTML = `
      <div class="v62-shop-coach-bubble">
        <strong class="v62-shop-coach-title"></strong>
        <span class="v62-shop-coach-text"></span>
      </div>`;
    document.body.appendChild(coach);
    return coach;
  }

  function v62UpdateShopCoachText(){
    const coach = v62EnsureShopCoach();
    const title = coach.querySelector('.v62-shop-coach-title');
    const text = coach.querySelector('.v62-shop-coach-text');
    if (title) title.textContent = v62Text('🛒 Power-tips', '🛒 Power tip');
    if (text) text.textContent = v62Text(
      'Du har nok poeng! Kjøp noe i Power-butikken og vinn lettere 🚀',
      'You have enough points! Buy something in the Power shop and make the run easier 🚀'
    );
  }

  function v62PositionShopCoach(){
    const coach = v62EnsureShopCoach();
    const shopButton = document.getElementById('shopButton');
    if (!coach || !shopButton || coach.classList.contains('hidden')) return;
    const rect = shopButton.getBoundingClientRect();
    const bubble = coach.firstElementChild || coach;
    const bubbleRect = bubble.getBoundingClientRect();
    let left = rect.left - bubbleRect.width - 14;
    let top = rect.top + (rect.height - bubbleRect.height) / 2;
    let sideClass = 'left';

    if (left < 12) {
      left = rect.right + 14;
      sideClass = 'right';
    }
    if (left + bubbleRect.width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - bubbleRect.width - 12);
      top = rect.bottom + 10;
      sideClass = 'bottom';
    }
    top = Math.max(12, Math.min(top, window.innerHeight - bubbleRect.height - 12));

    coach.classList.remove('v62-side-left', 'v62-side-right', 'v62-side-bottom');
    coach.classList.add(`v62-side-${sideClass}`);
    coach.style.left = `${Math.round(left)}px`;
    coach.style.top = `${Math.round(top)}px`;
  }

  function v62ShouldShowShopCoach(){
    const shopButton = document.getElementById('shopButton');
    const shopModal = document.getElementById('shopModal');
    if (!shopButton || shopButton.hidden || shopButton.disabled) return false;
    if (!gameRunning || paused || onlineMode) return false;
    if (shopModal && (shopModal.open || shopModal.hasAttribute('open'))) return false;
    const threshold = typeof V23_SHOP_COSTS === 'object' ? Math.min(...Object.values(V23_SHOP_COSTS)) : 650;
    return Number(score || 0) >= Number(threshold || 650);
  }

  function v62RefreshShopCoach(){
    const coach = v62EnsureShopCoach();
    const shopButton = document.getElementById('shopButton');
    if (!coach || !shopButton) return;
    v62UpdateShopCoachText();
    const show = v62ShouldShowShopCoach();
    coach.classList.toggle('hidden', !show);
    shopButton.classList.toggle('v62-shop-button-pulse', show);
    if (show) {
      coach.setAttribute('aria-hidden', 'false');
      v62PositionShopCoach();
    } else {
      coach.setAttribute('aria-hidden', 'true');
    }
  }

  function v62PlayHitJingle(){
    try {
      if (!soundEnabled || typeof tone !== 'function') return;
      const steps = [
        [330, 0.07, 'square', 0.030],
        [247, 0.08, 'triangle', 0.028],
        [196, 0.10, 'sawtooth', 0.030],
        [147, 0.14, 'sine', 0.025]
      ];
      steps.forEach(([freq, dur, type, gain], i) => {
        setTimeout(() => tone(freq, dur, type, gain * (typeof musicVolume === 'number' ? Math.max(0.45, musicVolume) : 1)), i * 85);
      });
    } catch(_) {}
  }

  function v62CapturePlayerSnapshot(){
    try {
      return {
        x: Number(player?.x || 0),
        y: Number(player?.y || 0),
        emoji: (typeof selectedPlayerEmoji === 'string' && selectedPlayerEmoji) ? selectedPlayerEmoji : '😵',
        image: (typeof selectedPlayerImage === 'string' && selectedPlayerImage) ? selectedPlayerImage : ''
      };
    } catch(_) {
      return { x: 0, y: 0, emoji: '😵', image: '' };
    }
  }

  function v62SpawnFloatingHeart(index){
    const anchor = document.getElementById('lives') || document.getElementById('livesLabel');
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'v62-life-heart';
    heart.textContent = '❤️';
    heart.style.left = `${rect.left + rect.width * 0.35 + index * 18}px`;
    heart.style.top = `${rect.top + rect.height * 0.3}px`;
    heart.style.animationDelay = `${index * 70}ms`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }

  function v62SpawnPlayerHitEcho(snapshot){
    const board = document.getElementById('game');
    if (!board || !snapshot) return;
    const rect = board.getBoundingClientRect();
    const cols = Math.max(1, Array.isArray(map) && map[0] ? map[0].length : 13);
    const rows = Math.max(1, Array.isArray(map) ? map.length : 11);
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const echo = document.createElement('div');
    echo.className = 'v62-player-hit-echo';
    if (snapshot.image) {
      echo.classList.add('v62-player-hit-image');
      echo.style.backgroundImage = `url(${snapshot.image})`;
    } else {
      echo.textContent = snapshot.emoji || '😵';
    }
    echo.style.left = `${rect.left + snapshot.x * cellW + cellW * 0.5}px`;
    echo.style.top = `${rect.top + snapshot.y * cellH + cellH * 0.5}px`;
    document.body.appendChild(echo);
    setTimeout(() => echo.remove(), 950);
  }

  function v62ShowLostLifeToast(){
    const toast = document.createElement('div');
    toast.className = 'v62-hit-toast';
    toast.textContent = v62Text('💔 Oi! Du mistet et liv', '💔 Ouch! You lost a life');
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 1100);
    setTimeout(() => toast.remove(), 1600);
  }

  function v62TriggerHitFeedback(snapshot){
    const wrapper = document.getElementById('game-wrapper');
    const livesEl = document.getElementById('lives');
    const livesCard = livesEl ? livesEl.closest('.hud-card') : null;
    wrapper?.classList.remove('v62-hit-shake');
    livesCard?.classList.remove('v62-life-card-hit');
    void wrapper?.offsetWidth;
    void livesCard?.offsetWidth;
    wrapper?.classList.add('v62-hit-shake');
    livesCard?.classList.add('v62-life-card-hit');
    setTimeout(() => wrapper?.classList.remove('v62-hit-shake'), 720);
    setTimeout(() => livesCard?.classList.remove('v62-life-card-hit'), 780);
    v62PlayHitJingle();
    v62SpawnPlayerHitEcho(snapshot);
    v62ShowLostLifeToast();
    [0,1,2].forEach(v62SpawnFloatingHeart);
  }

  function v62InstallLoseLifeWrapper(){
    const currentLoseLife = window.loseLife || (typeof loseLife === 'function' ? loseLife : null);
    if (typeof currentLoseLife !== 'function' || currentLoseLife.__v62Wrapped) return;
    const wrappedLoseLife = function v62LoseLifeWrapper(){
      const beforeLives = Number(lives || 0);
      const snapshot = v62CapturePlayerSnapshot();
      const result = currentLoseLife.apply(this, arguments);
      if (Number(lives || 0) < beforeLives) {
        setTimeout(() => v62TriggerHitFeedback(snapshot), 20);
      }
      return result;
    };
    wrappedLoseLife.__v62Wrapped = true;
    window.loseLife = wrappedLoseLife;
    try { loseLife = wrappedLoseLife; } catch(_) {}
  }

  function v62HookLanguageRefresh(){
    const previousApplyLanguage = window.applyLanguage || (typeof applyLanguage === 'function' ? applyLanguage : null);
    if (typeof previousApplyLanguage !== 'function' || previousApplyLanguage.__v62Wrapped) return;
    const wrappedApply = function v62ApplyLanguageWrapper(){
      const result = previousApplyLanguage.apply(this, arguments);
      v62RefreshShopCoach();
      return result;
    };
    wrappedApply.__v62Wrapped = true;
    window.applyLanguage = wrappedApply;
    try { applyLanguage = wrappedApply; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    v62EnsureShopCoach();
    v62InstallLoseLifeWrapper();
    v62HookLanguageRefresh();
    v62RefreshShopCoach();
    setTimeout(v62RefreshShopCoach, 400);
  });

  v62EnsureShopCoach();
  v62InstallLoseLifeWrapper();
  v62HookLanguageRefresh();
  setInterval(v62RefreshShopCoach, 1200);
  window.addEventListener('resize', v62PositionShopCoach, { passive: true });
  window.addEventListener('scroll', v62PositionShopCoach, { passive: true });
})();


/* --------------------------------------------------------------------------
   V63: Player image lock + real enemy generator
   - When an uploaded image is active, point 1 emoji buttons are truly locked.
   - "Fjern bilde" clears preview, storage and file input immediately.
   - Enemy generator creates NEW enemy choice buttons, not just switching old ones.
   -------------------------------------------------------------------------- */
(function v63AvatarLockAndRealEnemyGenerator(){
  if (window.__ragiJoyV63AvatarEnemyPatch) return;
  window.__ragiJoyV63AvatarEnemyPatch = true;

  const PLAYER_EMOJI_SETS_V63 = [
    ['😄','😎','🚀','🐯','👑','🔥','🤖','🦁'],
    ['🥷','🧙','🦸','🐉','⚡','🍕','🎯','💎'],
    ['🐵','🦊','🐼','🐸','🦄','🛸','🎮','🏆'],
    ['🤠','🥳','🦅','🐲','🦝','🚁','🌟','💥'],
    ['😺','🐺','🦖','👽','🧠','🕹️','🌈','🍀'],
    ['🐱','🐺','🦂','👽','🧠','🕹️','🌈','☘️'],
    ['🦹','🧛','🧟','👻','🤡','💀','👾','🦇']
  ];

  const ENEMY_PRESET_POOLS_V63 = [
    { label: '🧪 Mutant Mix', pool: ['🧬','🦠','🧪','👽','🤢','☣️','🧟','🧌'] },
    { label: '🤖 Robot Army', pool: ['🤖','🦾','🛸','⚙️','🔩','🛰️','👾','💣'] },
    { label: '🐉 Dragon Cave', pool: ['🐉','🐲','🦖','🔥','🌋','☄️','👺','🧌'] },
    { label: '🧊 Ice Squad', pool: ['🥶','❄️','🧊','👻','💎','🌨️','☃️','🦭'] },
    { label: '🦈 Sea Panic', pool: ['🦈','🐙','🪼','🦑','🐡','🌊','⚓','👾'] },
    { label: '🎃 Horror Night', pool: ['🎃','👻','🧛','🧟','🦇','🕷️','💀','🪦'] },
    { label: '🐝 Bug Swarm', pool: ['🐝','🪲','🦂','🕷️','🪳','🦟','🐜','🦠'] },
    { label: '👑 Boss Rush', pool: ['👑','🦹','👺','🧌','🐲','🤖','💀','⚔️'] },
    { label: '🌪️ Chaos Pack', pool: ['🌪️','💥','⚡','☄️','🌀','👽','🤡','😈'] },
    { label: '🧟 Zombie Crew', pool: ['🧟','🧟‍♂️','🧟‍♀️','💀','🪦','👻','🦴','😵'] }
  ];

  function v63IsNo(){
    try { return currentLanguage !== 'en'; } catch(_) { return true; }
  }

  function v63T(no, en){
    return v63IsNo() ? no : en;
  }

  function v63StorageSet(key, value){
    try { localStorage.setItem(key, value); } catch(_) {}
  }

  function v63StorageRemove(key){
    try { localStorage.removeItem(key); } catch(_) {}
  }

  function v63HasImage(){
    try { return Boolean(selectedPlayerImage || localStorage.getItem('ragiJoyPlayerImage')); }
    catch(_) { return Boolean(typeof selectedPlayerImage !== 'undefined' && selectedPlayerImage); }
  }

  function v63Status(text){
    let status = document.getElementById('v63AvatarStatus') || document.getElementById('v61AvatarStatus');
    if (!status) {
      const imageSection = document.getElementById('avatarUpload')?.closest('.custom-section');
      if (imageSection) {
        status = document.createElement('p');
        status.id = 'v63AvatarStatus';
        status.className = 'custom-note v63-avatar-status';
        imageSection.appendChild(status);
      }
    }
    if (status && text) status.textContent = text;
  }

  function v63ClearFileInput(){
    const input = document.getElementById('avatarUpload');
    if (input) {
      try { input.value = ''; } catch(_) {}
    }
  }

  function v63UpdatePreview(){
    const preview = document.getElementById('avatarPreview');
    if (!preview) return;
    if (v63HasImage()) {
      const img = selectedPlayerImage || localStorage.getItem('ragiJoyPlayerImage') || '';
      preview.textContent = '';
      preview.style.backgroundImage = `url(${img})`;
      preview.classList.add('v63-image-active');
    } else {
      preview.style.backgroundImage = '';
      preview.textContent = selectedPlayerEmoji || '😄';
      preview.classList.remove('v63-image-active');
    }
  }

  function v63SetEmojiLock(){
    const locked = v63HasImage();
    const emojiGrid = document.getElementById('playerEmojiGrid');
    const section = emojiGrid?.closest('.custom-section');
    if (section) section.classList.toggle('v63-emoji-locked-section', locked);
    document.body.classList.toggle('v63-avatar-image-active', locked);

    if (emojiGrid) {
      emojiGrid.querySelectorAll('button').forEach(btn => {
        btn.disabled = locked;
        btn.setAttribute('aria-disabled', locked ? 'true' : 'false');
        btn.title = locked
          ? v63T('Fjern bildet først for å velge emoji.', 'Remove the image first to choose an emoji.')
          : '';
      });
    }

    const generator = document.getElementById('v63GeneratePlayerEmojis') || document.getElementById('v61GeneratePlayerEmojis');
    if (generator) {
      generator.disabled = locked;
      generator.setAttribute('aria-disabled', locked ? 'true' : 'false');
      generator.title = locked
        ? v63T('Fjern bildet først for å generere nye emojier.', 'Remove the image first to generate new emojis.')
        : '';
    }

    v63UpdatePreview();

    if (locked) {
      v63Status(v63T(
        'Bilde er aktivt. Emoji-valg er låst til du trykker «Fjern bilde».',
        'Image is active. Emoji choice is locked until you press “Remove image”.'
      ));
    }
  }

  const v63OriginalSetPlayerEmoji = window.setPlayerEmoji || (typeof setPlayerEmoji === 'function' ? setPlayerEmoji : null);
  window.setPlayerEmoji = function setPlayerEmojiV63(emoji){
    if (v63HasImage()) {
      v63Status(v63T(
        'Du har lastet opp bilde. Trykk «Fjern bilde» før du velger emoji.',
        'You uploaded an image. Press “Remove image” before choosing an emoji.'
      ));
      try { playSfx('select'); } catch(_) {}
      v63SetEmojiLock();
      return;
    }

    selectedPlayerEmoji = emoji || '😄';
    selectedPlayerImage = '';
    v63StorageSet('ragiJoyPlayerEmoji', selectedPlayerEmoji);
    v63StorageRemove('ragiJoyPlayerImage');
    v63ClearFileInput();

    if (typeof v63OriginalSetPlayerEmoji === 'function') {
      try { v63OriginalSetPlayerEmoji.call(this, selectedPlayerEmoji); }
      catch(_) {
        try { updateCustomizerUi(); drawGame(); playSfx('select'); } catch(__) {}
      }
    } else {
      try { updateCustomizerUi(); drawGame(); playSfx('select'); } catch(_) {}
    }

    v63SetEmojiLock();
  };
  try { setPlayerEmoji = window.setPlayerEmoji; } catch(_) {}

  window.clearAvatarImage = function clearAvatarImageV63(){
    selectedPlayerImage = '';
    v63StorageRemove('ragiJoyPlayerImage');
    v63ClearFileInput();
    v63Status(v63T('Bildet er fjernet. Emoji-valg er åpnet igjen.', 'Image removed. Emoji choice is open again.'));
    v63UpdatePreview();
    v63SetEmojiLock();
    try { updateCustomizerUi(); } catch(_) {}
    try { drawGame(); } catch(_) {}
    try { playSfx('select'); } catch(_) {}
  };
  try { clearAvatarImage = window.clearAvatarImage; } catch(_) {}

  window.handleAvatarUpload = function handleAvatarUploadV63(event){
    const input = event?.target || document.getElementById('avatarUpload');
    const file = input?.files && input.files[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      v63Status(v63T('Velg en vanlig bildefil.', 'Choose a normal image file.'));
      alert(v63T('Velg en vanlig bildefil.', 'Choose a normal image file.'));
      v63ClearFileInput();
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      v63Status(v63T('Bildet er for stort. Bruk maks 4 MB.', 'Image is too large. Use max 4 MB.'));
      alert(v63T('Bildet er for stort. Bruk maks 4 MB.', 'Image is too large. Use max 4 MB.'));
      v63ClearFileInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        selectedPlayerImage = data;
        v63StorageSet('ragiJoyPlayerImage', selectedPlayerImage);
        v63Status(v63T(
          'Bilde er aktivt. Emoji-valg er låst til du fjerner bildet.',
          'Image is active. Emoji choice is locked until you remove the image.'
        ));
        v63UpdatePreview();
        v63SetEmojiLock();
        try { updateCustomizerUi(); } catch(_) {}
        try { drawGame(); } catch(_) {}
        try { playSfx('level'); } catch(_) {}
      };
      img.onerror = () => {
        v63Status(v63T('Kunne ikke lese bildet.', 'Could not read the image.'));
        v63ClearFileInput();
      };
      img.src = data;
    };
    reader.onerror = () => {
      v63Status(v63T('Kunne ikke lese filen.', 'Could not read the file.'));
      v63ClearFileInput();
    };
    reader.readAsDataURL(file);
  };
  try { handleAvatarUpload = window.handleAvatarUpload; } catch(_) {}

  function v63RenderPlayerEmojiSet(set){
    const grid = document.getElementById('playerEmojiGrid');
    if (!grid) return;
    grid.innerHTML = set.map(emoji => `<button type="button" data-emoji="${emoji}" onclick="setPlayerEmoji('${emoji}')">${emoji}</button>`).join('');
    v63SetEmojiLock();
  }

  window.generatePlayerEmojis = function generatePlayerEmojisV63(){
    if (v63HasImage()) {
      v63Status(v63T(
        'Fjern bildet først hvis du vil bytte til emoji.',
        'Remove the image first if you want to switch to emoji.'
      ));
      v63SetEmojiLock();
      return;
    }
    const index = (Number(localStorage.getItem('ragiJoyPlayerEmojiSetV63') || '0') + 1) % PLAYER_EMOJI_SETS_V63.length;
    v63StorageSet('ragiJoyPlayerEmojiSetV63', String(index));
    v63RenderPlayerEmojiSet(PLAYER_EMOJI_SETS_V63[index]);
    try { updateCustomizerUi(); playSfx('coin'); } catch(_) {}
  };

  function v63AddPlayerGenerator(){
    const section = document.getElementById('playerEmojiGrid')?.closest('.custom-section');
    if (!section || document.getElementById('v63GeneratePlayerEmojis')) return;

    // Remove older generator if it exists, so only one button is shown.
    const old = document.getElementById('v61GeneratePlayerEmojis');
    if (old) old.remove();

    const btn = document.createElement('button');
    btn.id = 'v63GeneratePlayerEmojis';
    btn.type = 'button';
    btn.className = 'v63-generate-button';
    btn.textContent = v63T('🎲 Generer nye emojier', '🎲 Generate new emojis');
    btn.onclick = window.generatePlayerEmojis;
    section.appendChild(btn);
  }

  function v63LoadGeneratedEnemyStyles(){
    try { return JSON.parse(localStorage.getItem('ragiJoyGeneratedEnemyStylesV63') || '[]'); }
    catch(_) { return []; }
  }

  function v63SaveGeneratedEnemyStyles(items){
    try { localStorage.setItem('ragiJoyGeneratedEnemyStylesV63', JSON.stringify(items.slice(-12))); }
    catch(_) {}
  }

  function v63EnsureEnemyStyle(key, label, pool){
    if (!key || !Array.isArray(pool) || !pool.length) return;
    try { v30EnemyPools[key] = pool; } catch(_) {}

    const grid = document.getElementById('enemyStyleGrid');
    if (!grid || grid.querySelector(`[data-enemy-style="${key}"]`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.enemyStyle = key;
    btn.className = 'v63-generated-enemy-button';
    btn.textContent = label;
    btn.onclick = () => setEnemyStyle(key);
    const generator = document.getElementById('v63GenerateEnemyEmojis') || document.getElementById('v61GenerateEnemyEmojis');
    if (generator) grid.insertBefore(btn, generator);
    else grid.appendChild(btn);
  }

  function v63RestoreGeneratedEnemyStyles(){
    const saved = v63LoadGeneratedEnemyStyles();
    saved.forEach(item => v63EnsureEnemyStyle(item.key, item.label, item.pool));
  }

  window.generateEnemyEmojis = function generateEnemyEmojisV63(){
    const existing = v63LoadGeneratedEnemyStyles();
    const preset = ENEMY_PRESET_POOLS_V63[existing.length % ENEMY_PRESET_POOLS_V63.length];
    const key = `generated_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    const label = `${preset.label} #${existing.length + 1}`;
    const pool = [...preset.pool].sort(() => Math.random() - 0.5);

    const item = { key, label, pool };
    const updated = [...existing, item].slice(-12);
    v63SaveGeneratedEnemyStyles(updated);
    v63EnsureEnemyStyle(key, label, pool);

    try { setEnemyStyle(key); } catch(_) {}
    try {
      enemies.forEach(enemy => enemy.face = getEnemyFace());
      updateCustomizerUi();
      drawGame();
      playSfx('enemy');
    } catch(_) {}
  };

  function v63AddEnemyGenerator(){
    const grid = document.getElementById('enemyStyleGrid');
    const section = grid?.closest('.custom-section');
    if (!grid || !section || document.getElementById('v63GenerateEnemyEmojis')) return;

    const old = document.getElementById('v61GenerateEnemyEmojis');
    if (old) old.remove();

    const btn = document.createElement('button');
    btn.id = 'v63GenerateEnemyEmojis';
    btn.type = 'button';
    btn.className = 'v63-generate-button v63-enemy-generator';
    btn.textContent = v63T('🎲 Legg til ny fiende-pakke', '🎲 Add new enemy pack');
    btn.onclick = window.generateEnemyEmojis;
    section.appendChild(btn);
  }

  const v63PreviousUpdateCustomizerUi = window.updateCustomizerUi || (typeof updateCustomizerUi === 'function' ? updateCustomizerUi : null);
  if (typeof v63PreviousUpdateCustomizerUi === 'function' && !v63PreviousUpdateCustomizerUi.__v63Wrapped) {
    const wrapped = function updateCustomizerUiV63(){
      const result = v63PreviousUpdateCustomizerUi.apply(this, arguments);
      v63SetEmojiLock();
      v63RestoreGeneratedEnemyStyles();
      return result;
    };
    wrapped.__v63Wrapped = true;
    window.updateCustomizerUi = wrapped;
    try { updateCustomizerUi = wrapped; } catch(_) {}
  }

  function v63Init(){
    v63AddPlayerGenerator();
    v63AddEnemyGenerator();
    v63RestoreGeneratedEnemyStyles();
    v63SetEmojiLock();
  }

  document.addEventListener('DOMContentLoaded', () => {
    v63Init();
    setTimeout(v63Init, 250);
  });
  setTimeout(v63Init, 500);
})();


/* --------------------------------------------------------------------------
   V64: anonymous player save + level countdown + live winners + 7-day feedback
   - Fixes no-name play: player can continue as anonymous and still appear on Top 10.
   - Quit run is shown as ended run, not "no lives/game over".
   - Level transition shows 3-2-1-GO before next board starts.
   - Winner list refreshes while open and can sync through the existing cloud endpoint.
   - Feedback/comments are stored for 7 days and show an info box.
   -------------------------------------------------------------------------- */
(function v64AnonymousFeedbackAndWinnerFix() {
  if (window.__ragiJoyV64AnonymousFeedbackAndWinnerFix) return;
  window.__ragiJoyV64AnonymousFeedbackAndWinnerFix = true;

  const NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const LAST_NAME_KEY = 'ragiJoyLastWinnerName';
  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const DAILY_KEY = 'ragiJoyMazeDailyTop10V41';
  const FEEDBACK_KEY = 'ragiJoyMazeFeedbackPublicV64';
  const COMMENT_TTL = 7 * 24 * 60 * 60 * 1000;
  const MAX_COMMENTS = 20;
  const SCORE_CLOUD_PATH = 'scores/public';
  const FEEDBACK_CLOUD_PATH = 'feedback/public/comments';
  let endingReason = '';
  let winnerRefreshTimer = null;
  let lastCloudScoreSync = 0;
  let lastCloudFeedbackSync = 0;

  const texts = {
    no: {
      anonTitle: 'Spill uten spillerkort?',
      anonText: 'Du kan spille som anonym. Da lagres scoren som et anonymt navn på vinnerlisten.',
      anonPlay: '🎮 Spill anonymt',
      anonCreate: '👤 Lag spillerkort',
      anonCancel: 'Avbryt',
      anonActivated: 'Spiller anonymt som {name}',
      quitTitle: 'Kamp avsluttet',
      quitSummary: 'Du avsluttet kampen selv. Scoren kan fortsatt lagres hvis den er høy nok.',
      championAnon: 'Lagre anonymt',
      championNoNameText: 'Du kan lagre med anonymt navn, eller lage spillerkort først.',
      countdownGo: 'GOOO!',
      winnerInfoTitle: 'Slik fungerer Top 10',
      winnerInfoText: 'Listen sorteres etter høyest score. Ved lik score teller høyeste level først. Listen oppdateres automatisk når vinduet står åpent.',
      winnerRefresh: '↻ Oppdaterer automatisk',
      feedbackButton: '💬 Feedback',
      feedbackTitle: 'Feedback og kommentarer',
      feedbackIntro: 'Skriv kort hva du synes. De siste 20 kommentarene vises offentlig i 7 dager.',
      feedbackInfoTitle: 'Lagring',
      feedbackInfoText: 'Kommentarer lagres lokalt i nettleseren og synkes til kommentarfeltet hvis sky-lagring er aktiv. Gamle kommentarer ryddes automatisk etter 7 dager.',
      feedbackName: 'Navn / alias',
      feedbackNamePlaceholder: 'Anonym spiller',
      feedbackRating: 'Hvor bra var spillet?',
      feedbackCategory: 'Hva gjelder det?',
      feedbackFun: '🎮 Moro',
      feedbackDesign: '🎨 Design',
      feedbackPerformance: '⚡ Ytelse',
      feedbackLiked: 'Hva likte du best?',
      feedbackImprove: 'Hva bør forbedres?',
      feedbackBug: 'Feil, lagg eller noe irriterende?',
      feedbackPlaceholder: 'Skriv her ...',
      feedbackSend: 'Send feedback',
      feedbackSaved: 'Takk! Kommentaren er lagt inn.',
      feedbackEmpty: 'Skriv minst én kommentar før du sender.',
      feedbackWall: 'Siste kommentarer',
      feedbackNoComments: 'Ingen kommentarer ennå.',
      feedbackClose: 'Lukk',
      feedbackGenerate: 'Forslag'
    },
    en: {
      anonTitle: 'Play without a player card?',
      anonText: 'You can play anonymously. The score will be saved with an anonymous name on the winner list.',
      anonPlay: '🎮 Play anonymous',
      anonCreate: '👤 Create player card',
      anonCancel: 'Cancel',
      anonActivated: 'Playing anonymously as {name}',
      quitTitle: 'Run ended',
      quitSummary: 'You ended the run yourself. The score can still be saved if it is high enough.',
      championAnon: 'Save anonymously',
      championNoNameText: 'You can save anonymously, or create a player card first.',
      countdownGo: 'GOOO!',
      winnerInfoTitle: 'How Top 10 works',
      winnerInfoText: 'The list is sorted by highest score. If scores match, highest level is ranked first. The list refreshes automatically while this window is open.',
      winnerRefresh: '↻ Auto-refreshing',
      feedbackButton: '💬 Feedback',
      feedbackTitle: 'Feedback and comments',
      feedbackIntro: 'Write briefly what you think. The latest 20 comments are public for 7 days.',
      feedbackInfoTitle: 'Storage',
      feedbackInfoText: 'Comments are stored locally in the browser and synced to the comment wall if cloud storage is active. Old comments are removed automatically after 7 days.',
      feedbackName: 'Name / alias',
      feedbackNamePlaceholder: 'Anonymous player',
      feedbackRating: 'How good was the game?',
      feedbackCategory: 'What is it about?',
      feedbackFun: '🎮 Fun',
      feedbackDesign: '🎨 Design',
      feedbackPerformance: '⚡ Performance',
      feedbackLiked: 'What did you like best?',
      feedbackImprove: 'What should be improved?',
      feedbackBug: 'Bugs, lag or something annoying?',
      feedbackPlaceholder: 'Write here ...',
      feedbackSend: 'Send feedback',
      feedbackSaved: 'Thanks! Your comment is posted.',
      feedbackEmpty: 'Write at least one comment before sending.',
      feedbackWall: 'Latest comments',
      feedbackNoComments: 'No comments yet.',
      feedbackClose: 'Close',
      feedbackGenerate: 'Suggest'
    }
  };

  function installTranslations() {
    try {
      for (const [code, value] of Object.entries(texts)) translations[code] = { ...(translations[code] || translations.en || {}), ...value };
      if (Array.isArray(languageOptions)) {
        for (const language of languageOptions) {
          translations[language.code] = { ...(translations.en || {}), ...(translations[language.code] || {}) };
          for (const [key, value] of Object.entries(texts.en)) if (!translations[language.code][key]) translations[language.code][key] = value;
        }
      }
    } catch (_) {}
  }

  function tr(key, vars = {}) {
    const dict = (typeof translations !== 'undefined' && translations[currentLanguage]) || texts.no;
    let value = (dict && dict[key]) || (texts.en && texts.en[key]) || key;
    for (const [name, replacement] of Object.entries(vars)) value = String(value).replaceAll(`{${name}}`, replacement);
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

  function readJsonArray(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function writeJsonArray(key, entries) {
    try { localStorage.setItem(key, JSON.stringify(Array.isArray(entries) ? entries : [])); } catch (_) {}
  }

  function activePlayerName() {
    return String(localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || '').trim();
  }

  function newAnonymousName() {
    const animals = ['Fox', 'Tiger', 'Koala', 'Panda', 'Wolf', 'Owl', 'Duck', 'Bee', 'Cat', 'Otter'];
    return `Anonym${animals[Math.floor(Math.random() * animals.length)]}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function setPlayerName(name) {
    const clean = String(name || '').trim().replace(/[^A-Za-z0-9ÆØÅæøå_-]/g, '').slice(0, 18) || newAnonymousName();
    localStorage.setItem(NAME_KEY, clean);
    localStorage.setItem(LAST_NAME_KEY, clean);
    try { if (typeof applyLanguage === 'function') applyLanguage(); } catch (_) {}
    try { if (typeof window.v30UpdateMenuLayout === 'function') window.v30UpdateMenuLayout(); } catch (_) {}
    try { if (typeof drawGame === 'function') drawGame(); } catch (_) {}
    if (typeof messageBar !== 'undefined' && messageBar) messageBar.textContent = tr('anonActivated', { name: clean });
    return clean;
  }

  function createDialog(id, className) {
    let dialog = document.getElementById(id);
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = id;
      dialog.className = className;
      document.body.appendChild(dialog);
    }
    return dialog;
  }

  function openDialog(dialog) {
    if (!dialog) return;
    try { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', ''); }
    catch (_) { dialog.setAttribute('open', ''); }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch (_) {}
    dialog.removeAttribute('open');
  }

  function showAnonymousStartPrompt(startCallback) {
    const dialog = createDialog('v64AnonymousPrompt', 'v64-anon-dialog');
    dialog.innerHTML = `
      <div class="v64-anon-card">
        <button class="friend-modal-close" type="button" data-v64-anon-close aria-label="Close">✕</button>
        <p class="friend-kicker">PLAYER</p>
        <h2>${escapeHtml(tr('anonTitle'))}</h2>
        <p>${escapeHtml(tr('anonText'))}</p>
        <div class="v64-anon-actions">
          <button type="button" data-v64-play-anon>${escapeHtml(tr('anonPlay'))}</button>
          <button type="button" data-v64-create-card>${escapeHtml(tr('anonCreate'))}</button>
          <button type="button" data-v64-anon-close>${escapeHtml(tr('anonCancel'))}</button>
        </div>
      </div>`;
    dialog.querySelector('[data-v64-play-anon]').addEventListener('click', () => {
      setPlayerName(newAnonymousName());
      closeDialog(dialog);
      startCallback();
    });
    dialog.querySelector('[data-v64-create-card]').addEventListener('click', () => {
      closeDialog(dialog);
      try { if (typeof window.showProfileNameModal === 'function') window.showProfileNameModal(); }
      catch (_) {}
    });
    dialog.querySelectorAll('[data-v64-anon-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
    openDialog(dialog);
  }

  function installAnonymousStart() {
    const previousStartGame = window.startGame || (typeof startGame === 'function' ? startGame : null);
    if (typeof previousStartGame !== 'function' || previousStartGame.__v64AnonymousWrapped) return;
    const wrapped = function startGameV64Anonymous() {
      const args = arguments;
      if (!activePlayerName() && !onlineMode) {
        showAnonymousStartPrompt(() => previousStartGame.apply(this, args));
        return;
      }
      return previousStartGame.apply(this, args);
    };
    wrapped.__v64AnonymousWrapped = true;
    window.startGame = globalThis.startGame = wrapped;
    try { startGame = wrapped; } catch (_) {}
  }

  function addEntryToBoard(entry) {
    const clean = {
      id: entry.id || `score_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(entry.name || activePlayerName() || newAnonymousName()).slice(0, 18),
      score: Number(entry.score) || 0,
      level: Math.max(1, Math.min(35, Number(entry.level) || 1)),
      difficulty: entry.difficulty || selectedDifficulty || 'normal',
      completedCampaign: Boolean(entry.completedCampaign),
      createdAt: Number(entry.createdAt) || Date.now()
    };
    if (!clean.score) return null;
    const merged = mergeScoreEntries([...readJsonArray(BOARD_KEY), clean]);
    writeJsonArray(BOARD_KEY, merged);
    return clean;
  }

  function mergeScoreEntries(entries) {
    const map = new Map();
    for (const item of Array.isArray(entries) ? entries : []) {
      if (!item || Number(item.score) <= 0) continue;
      const id = item.id || `${item.name || 'Player'}_${item.score}_${item.createdAt || ''}_${item.level || 1}`;
      const existing = map.get(id);
      if (!existing || Number(item.score) > Number(existing.score)) map.set(id, { ...item, id });
    }
    return Array.from(map.values())
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0) || (Number(b.level) || 0) - (Number(a.level) || 0) || (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0))
      .slice(0, 10);
  }

  async function pushScoreToCloud(entry) {
    if (!entry || typeof restPut !== 'function') return;
    try { await restPut(`${SCORE_CLOUD_PATH}/${entry.id}`, entry); }
    catch (_) {}
  }

  async function syncScoresFromCloud(force = false) {
    if (!force && Date.now() - lastCloudScoreSync < 7000) return;
    lastCloudScoreSync = Date.now();
    if (typeof restGet !== 'function') return;
    try {
      const cloud = await restGet(SCORE_CLOUD_PATH);
      const cloudEntries = Object.values(cloud || {}).filter(Boolean);
      if (cloudEntries.length) writeJsonArray(BOARD_KEY, mergeScoreEntries([...readJsonArray(BOARD_KEY), ...cloudEntries]));
      refreshWinnerInfoOnly();
    } catch (_) {}
  }

  function installChampionAnonymousSave() {
    const previousSave = window.saveChampionWinner;
    if (typeof previousSave === 'function' && !previousSave.__v64AnonymousSaveWrapped) {
      const wrappedSave = function saveChampionWinnerV64() {
        if (!activePlayerName()) setPlayerName(newAnonymousName());
        const before = readJsonArray(BOARD_KEY);
        const result = previousSave.apply(this, arguments);
        setTimeout(() => {
          const after = readJsonArray(BOARD_KEY);
          const created = after.find(item => !before.some(old => old.id === item.id || (old.name === item.name && old.score === item.score && old.createdAt === item.createdAt)));
          if (created) pushScoreToCloud(created);
          syncScoresFromCloud(true);
          refreshWinnerInfoOnly();
        }, 120);
        return result;
      };
      wrappedSave.__v64AnonymousSaveWrapped = true;
      window.saveChampionWinner = globalThis.saveChampionWinner = wrappedSave;
      try { saveChampionWinner = wrappedSave; } catch (_) {}
    }

    const observer = new MutationObserver(() => patchChampionDialog());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
  }

  function patchChampionDialog() {
    const dialog = document.getElementById('championModal');
    if (!dialog || !dialog.open) return;
    const noName = !activePlayerName();
    const text = document.getElementById('championText');
    if (noName && text) text.textContent = tr('championNoNameText');
    const actions = dialog.querySelector('.champion-actions, .v38-champion-actions');
    if (!actions || document.getElementById('championAnonSaveButton')) return;
    if (noName) {
      const btn = document.createElement('button');
      btn.id = 'championAnonSaveButton';
      btn.type = 'button';
      btn.textContent = tr('championAnon');
      btn.addEventListener('click', () => {
        setPlayerName(newAnonymousName());
        try { window.saveChampionWinner(); } catch (_) {}
      });
      actions.insertBefore(btn, actions.firstChild);
    }
  }

  function installQuitReasonFix() {
    window.finishRunAndSave = function finishRunAndSaveV64() {
      try { if (typeof window.closeEndRunDialog === 'function') window.closeEndRunDialog(); } catch (_) {}
      if (!gameRunning) return;
      if (!activePlayerName()) setPlayerName(newAnonymousName());
      endingReason = 'quit';
      paused = false;
      try { if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi(); } catch (_) {}
      endGame(false);
    };
    try { finishRunAndSave = window.finishRunAndSave; } catch (_) {}

    const previousEndGame = window.endGame || (typeof endGame === 'function' ? endGame : null);
    if (typeof previousEndGame === 'function' && !previousEndGame.__v64QuitReasonWrapped) {
      const wrappedEndGame = function endGameV64Reason(won) {
        const reason = endingReason;
        const result = previousEndGame.apply(this, arguments);
        if (reason === 'quit') {
          const title = document.getElementById('endTitle');
          const summary = document.getElementById('endSummary') || document.querySelector('#endScreen p, #endScreen .end-summary');
          if (title) title.textContent = tr('quitTitle');
          if (summary) summary.textContent = tr('quitSummary');
          if (typeof messageBar !== 'undefined' && messageBar) messageBar.textContent = tr('quitSummary');
        }
        endingReason = '';
        setTimeout(() => syncScoresFromCloud(true), 450);
        return result;
      };
      wrappedEndGame.__v64QuitReasonWrapped = true;
      window.endGame = globalThis.endGame = wrappedEndGame;
      try { endGame = wrappedEndGame; } catch (_) {}
    }
  }

  function showLevelCountdown() {
    return new Promise(resolve => {
      let overlay = document.getElementById('v64LevelCountdown');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'v64LevelCountdown';
        overlay.className = 'v64-level-countdown hidden';
        document.body.appendChild(overlay);
      }
      const steps = ['3', '2', '1', tr('countdownGo')];
      let i = 0;
      overlay.classList.remove('hidden');
      const tick = () => {
        overlay.innerHTML = `<div class="v64-countdown-bubble">${escapeHtml(steps[i])}</div>`;
        i += 1;
        if (i >= steps.length) {
          setTimeout(() => {
            overlay.classList.add('hidden');
            resolve();
          }, 520);
        } else {
          setTimeout(tick, 620);
        }
      };
      tick();
    });
  }

  function installLevelTransitionCountdown() {
    const previousNextLevel = window.nextLevel || (typeof nextLevel === 'function' ? nextLevel : null);
    if (typeof previousNextLevel !== 'function' || previousNextLevel.__v64CountdownWrapped) return;
    const wrapped = function nextLevelV64Countdown() {
      try { clearInterval(enemyTimer); clearTimeout(powerTimer); } catch (_) {}
      score += 250 + (Number(levelIndex) + 1) * 100;
      const maxLevel = Math.min(Array.isArray(levels) ? levels.length : 35, 35);
      if (levelIndex >= maxLevel - 1) {
        endGame(true);
        return;
      }
      gameRunning = false;
      paused = true;
      try {
        if (levelTitle) levelTitle.textContent = `Level ${Number(levelIndex) + 1} ${typeof t === 'function' ? t('levelComplete') : 'complete'}`;
        if (levelDescription) levelDescription.textContent = typeof t === 'function' ? t('levelDoneDesc') : 'Next level starts soon.';
        if (levelScreen) levelScreen.classList.remove('hidden');
        if (typeof spawnCenterBurst === 'function') spawnCenterBurst('🎉 LEVEL UP!');
        if (typeof playSfx === 'function') playSfx('level');
      } catch (_) {}
      setTimeout(() => {
        levelIndex++;
        if (levelScreen) levelScreen.classList.add('hidden');
        loadLevel(levelIndex);
        gameRunning = true;
        paused = true;
        drawGame();
        showLevelCountdown().then(() => {
          paused = false;
          gameRunning = true;
          try { clearInterval(enemyTimer); enemyTimer = setInterval(moveEnemies, getEnemyDelay()); } catch (_) {}
          try { if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi(); } catch (_) {}
        });
      }, 650);
    };
    wrapped.__v64CountdownWrapped = true;
    window.nextLevel = globalThis.nextLevel = wrapped;
    try { nextLevel = wrapped; } catch (_) {}
  }

  function refreshWinnerInfoOnly() {
    try {
      if (typeof window.showWinnerBoard === 'function' && document.getElementById('winnerBoardModal')?.open) {
        const list = document.getElementById('winnerList');
        if (list && typeof window.showWinnerBoard === 'function') {
          const dialog = document.getElementById('winnerBoardModal');
          window.showWinnerBoard();
          if (dialog && !dialog.open) openDialog(dialog);
        }
      }
    } catch (_) {}
    injectWinnerInfoBox();
  }

  function injectWinnerInfoBox() {
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    if (!card) return;
    let info = document.getElementById('v64WinnerInfoBox');
    if (!info) {
      info = document.createElement('section');
      info.id = 'v64WinnerInfoBox';
      info.className = 'v64-winner-info';
      const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
      if (list && list.parentElement) list.parentElement.insertBefore(info, list);
      else card.prepend(info);
    }
    info.innerHTML = `<strong>${escapeHtml(tr('winnerInfoTitle'))}</strong><span>${escapeHtml(tr('winnerInfoText'))}</span><em>${escapeHtml(tr('winnerRefresh'))}</em>`;
  }

  function installWinnerAutoRefresh() {
    const previousShowWinnerBoard = window.showWinnerBoard;
    if (typeof previousShowWinnerBoard === 'function' && !previousShowWinnerBoard.__v64AutoRefreshWrapped) {
      const wrapped = function showWinnerBoardV64() {
        const result = previousShowWinnerBoard.apply(this, arguments);
        setTimeout(() => { injectWinnerInfoBox(); syncScoresFromCloud(true); }, 80);
        clearInterval(winnerRefreshTimer);
        winnerRefreshTimer = setInterval(() => {
          const dialog = document.getElementById('winnerBoardModal');
          if (!dialog || !dialog.open) {
            clearInterval(winnerRefreshTimer);
            winnerRefreshTimer = null;
            return;
          }
          syncScoresFromCloud(true);
          injectWinnerInfoBox();
        }, 12000);
        return result;
      };
      wrapped.__v64AutoRefreshWrapped = true;
      window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
      try { showWinnerBoard = wrapped; } catch (_) {}
    }
    document.addEventListener('close', event => {
      if (event.target && event.target.id === 'winnerBoardModal') {
        clearInterval(winnerRefreshTimer);
        winnerRefreshTimer = null;
      }
    }, true);
  }

  function maskName(name) {
    const clean = String(name || '').trim();
    if (!clean) return currentLanguage === 'no' ? 'Anonym spiller' : 'Anonymous player';
    if (clean.length <= 4) return clean[0] + '***';
    return `${clean.slice(0, 3)}***${clean.slice(-2)}`;
  }

  function loadComments() {
    const now = Date.now();
    const clean = readJsonArray(FEEDBACK_KEY)
      .filter(item => item && Number(item.createdAt) && now - Number(item.createdAt) < COMMENT_TTL)
      .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
      .slice(0, MAX_COMMENTS);
    writeJsonArray(FEEDBACK_KEY, clean);
    return clean;
  }

  function saveCommentLocal(entry) {
    const clean = { ...entry, id: entry.id || `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, createdAt: entry.createdAt || Date.now() };
    writeJsonArray(FEEDBACK_KEY, [clean, ...loadComments()].slice(0, MAX_COMMENTS));
    return clean;
  }

  async function pushCommentToCloud(entry) {
    if (!entry || typeof restPut !== 'function') return;
    try { await restPut(`${FEEDBACK_CLOUD_PATH}/${entry.id}`, entry); } catch (_) {}
  }

  async function syncCommentsFromCloud(force = false) {
    if (!force && Date.now() - lastCloudFeedbackSync < 9000) return;
    lastCloudFeedbackSync = Date.now();
    if (typeof restGet !== 'function') return;
    try {
      const cloud = await restGet(FEEDBACK_CLOUD_PATH);
      const values = Object.values(cloud || {}).filter(Boolean);
      if (values.length) {
        const merged = new Map();
        [...loadComments(), ...values].forEach(item => {
          if (!item || !item.id) return;
          if (Date.now() - Number(item.createdAt || 0) < COMMENT_TTL) merged.set(item.id, item);
        });
        writeJsonArray(FEEDBACK_KEY, Array.from(merged.values()).sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0)).slice(0, MAX_COMMENTS));
        renderFeedbackWall();
      }
    } catch (_) {}
  }

  function feedbackSuggestions(field) {
    const suggestions = {
      liked: [
        'Spillet var gøy, raskt og lett å forstå.',
        'Jeg likte brettet, ikonene og at power-ups gjør spillet mer spennende.',
        'Det var morsomt å jakte poeng og komme videre til neste level.'
      ],
      improve: [
        'Gjør butikken enda tydeligere når jeg har nok poeng.',
        'Legg inn flere morsomme brett og enda tydeligere belønninger.',
        'Fiendene kan gjerne få flere animasjoner og overraskelser.'
      ],
      bug: [
        'Jeg merket litt lagg når mye skjedde samtidig.',
        'Noen knapper kan bli enda større på mobil.',
        'Jeg ønsker tydeligere beskjed når scoren er lagret.'
      ]
    };
    const list = suggestions[field] || suggestions.liked;
    return list[Math.floor(Math.random() * list.length)];
  }

  function ensureFeedbackUi() {
    let button = document.getElementById('v64FeedbackButton');
    if (!button) {
      button = document.createElement('button');
      button.id = 'v64FeedbackButton';
      button.type = 'button';
      button.className = 'v64-feedback-button';
      button.addEventListener('click', showFeedbackDialog);
      document.body.appendChild(button);
    }
    button.textContent = tr('feedbackButton');

    let dialog = document.getElementById('v64FeedbackDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'v64FeedbackDialog';
      dialog.className = 'v64-feedback-dialog';
      document.body.appendChild(dialog);
      dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
      dialog.addEventListener('keydown', event => {
        if (event.target && /^(TEXTAREA|INPUT|SELECT)$/.test(event.target.tagName)) event.stopPropagation();
      }, true);
      dialog.addEventListener('input', event => {
        const area = event.target.closest('textarea[data-max]');
        if (area) {
          const max = Number(area.dataset.max) || 180;
          if (area.value.length > max) area.value = area.value.slice(0, max);
          const counter = dialog.querySelector(`[data-count-for="${area.id}"]`);
          if (counter) counter.textContent = `${area.value.length}/${max}`;
        }
      });
    }
  }

  function renderFeedbackDialog() {
    const dialog = document.getElementById('v64FeedbackDialog');
    if (!dialog) return;
    const active = activePlayerName();
    dialog.innerHTML = `
      <div class="v64-feedback-card">
        <button class="friend-modal-close" type="button" data-v64-feedback-close aria-label="Close">✕</button>
        <p class="friend-kicker">PLAYER FEEDBACK</p>
        <h2>${escapeHtml(tr('feedbackTitle'))}</h2>
        <p class="v64-feedback-intro">${escapeHtml(tr('feedbackIntro'))}</p>
        <section class="v64-feedback-info"><strong>${escapeHtml(tr('feedbackInfoTitle'))}</strong><span>${escapeHtml(tr('feedbackInfoText'))}</span></section>
        <div class="v64-feedback-grid">
          <form id="v64FeedbackForm" class="v64-feedback-form">
            <label>${escapeHtml(tr('feedbackName'))}<input id="v64FeedbackName" maxlength="18" placeholder="${escapeHtml(tr('feedbackNamePlaceholder'))}" value="${escapeHtml(active)}"></label>
            <div class="v64-rating-wrap"><span>${escapeHtml(tr('feedbackRating'))}</span><div class="v64-stars" role="radiogroup" aria-label="rating">
              ${[1,2,3,4,5].map(n => `<button type="button" data-rating="${n}" class="${n <= 5 ? 'active' : ''}">★</button>`).join('')}
            </div></div>
            <input type="hidden" id="v64FeedbackRating" value="5">
            <div class="v64-category-wrap"><span>${escapeHtml(tr('feedbackCategory'))}</span><div class="v64-category-buttons">
              <button type="button" class="active" data-category="fun">${escapeHtml(tr('feedbackFun'))}</button>
              <button type="button" data-category="design">${escapeHtml(tr('feedbackDesign'))}</button>
              <button type="button" data-category="performance">${escapeHtml(tr('feedbackPerformance'))}</button>
            </div></div>
            <input type="hidden" id="v64FeedbackCategory" value="fun">
            ${[
              ['liked', tr('feedbackLiked')],
              ['improve', tr('feedbackImprove')],
              ['bug', tr('feedbackBug')]
            ].map(([id, label]) => `
              <label class="v64-textarea-label"><span>${escapeHtml(label)}</span><button type="button" data-suggest="${id}">${escapeHtml(tr('feedbackGenerate'))}</button>
                <textarea id="v64Fb_${id}" data-max="180" maxlength="180" placeholder="${escapeHtml(tr('feedbackPlaceholder'))}"></textarea>
                <small data-count-for="v64Fb_${id}">0/180</small>
              </label>`).join('')}
            <button type="submit" class="v64-submit-feedback">${escapeHtml(tr('feedbackSend'))}</button>
            <p id="v64FeedbackMessage" class="v64-feedback-message"></p>
          </form>
          <section class="v64-feedback-wall"><h3>${escapeHtml(tr('feedbackWall'))}</h3><div id="v64FeedbackWallList"></div></section>
        </div>
      </div>`;

    dialog.querySelectorAll('[data-v64-feedback-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
    dialog.querySelectorAll('[data-rating]').forEach(button => button.addEventListener('click', () => {
      const value = Number(button.dataset.rating) || 5;
      dialog.querySelector('#v64FeedbackRating').value = String(value);
      dialog.querySelectorAll('[data-rating]').forEach(star => star.classList.toggle('active', Number(star.dataset.rating) <= value));
    }));
    dialog.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      dialog.querySelector('#v64FeedbackCategory').value = button.dataset.category;
      dialog.querySelectorAll('[data-category]').forEach(item => item.classList.toggle('active', item === button));
    }));
    dialog.querySelectorAll('[data-suggest]').forEach(button => button.addEventListener('click', () => {
      const field = button.dataset.suggest;
      const area = dialog.querySelector(`#v64Fb_${field}`);
      if (area) {
        area.value = feedbackSuggestions(field);
        area.dispatchEvent(new Event('input', { bubbles: true }));
        area.focus();
      }
    }));
    const form = dialog.querySelector('#v64FeedbackForm');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const liked = dialog.querySelector('#v64Fb_liked').value.trim();
      const improve = dialog.querySelector('#v64Fb_improve').value.trim();
      const bug = dialog.querySelector('#v64Fb_bug').value.trim();
      const message = dialog.querySelector('#v64FeedbackMessage');
      if (!liked && !improve && !bug) {
        if (message) message.textContent = tr('feedbackEmpty');
        return;
      }
      const entry = saveCommentLocal({
        name: maskName(dialog.querySelector('#v64FeedbackName').value || activePlayerName()),
        rating: Number(dialog.querySelector('#v64FeedbackRating').value) || 5,
        category: dialog.querySelector('#v64FeedbackCategory').value || 'fun',
        liked,
        improve,
        bug,
        level: Math.max(1, Number(levelIndex) + 1 || 1),
        score: Number(score) || 0,
        createdAt: Date.now()
      });
      pushCommentToCloud(entry);
      renderFeedbackWall();
      if (message) message.textContent = tr('feedbackSaved');
      form.reset();
      dialog.querySelector('#v64FeedbackRating').value = '5';
      dialog.querySelector('#v64FeedbackCategory').value = 'fun';
      dialog.querySelectorAll('[data-rating]').forEach(star => star.classList.add('active'));
      dialog.querySelectorAll('[data-category]').forEach((item, index) => item.classList.toggle('active', index === 0));
      dialog.querySelectorAll('textarea[data-max]').forEach(area => area.dispatchEvent(new Event('input', { bubbles: true })));
    });
    renderFeedbackWall();
  }

  function renderFeedbackWall() {
    const list = document.getElementById('v64FeedbackWallList');
    if (!list) return;
    const comments = loadComments();
    if (!comments.length) {
      list.innerHTML = `<p class="v64-no-comments">${escapeHtml(tr('feedbackNoComments'))}</p>`;
      return;
    }
    list.innerHTML = comments.map(item => {
      const date = new Date(Number(item.createdAt) || Date.now()).toLocaleString(currentLanguage === 'no' ? 'nb-NO' : undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const cat = item.category === 'design' ? tr('feedbackDesign') : item.category === 'performance' ? tr('feedbackPerformance') : tr('feedbackFun');
      return `<article class="v64-comment-bubble">
        <header><strong>${escapeHtml(item.name || 'Anonym')}</strong><span>${'★'.repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)))}</span></header>
        <small>${escapeHtml(cat)} · ${escapeHtml(date)}</small>
        ${item.liked ? `<p><b>${escapeHtml(tr('feedbackLiked'))}</b> ${escapeHtml(item.liked)}</p>` : ''}
        ${item.improve ? `<p><b>${escapeHtml(tr('feedbackImprove'))}</b> ${escapeHtml(item.improve)}</p>` : ''}
        ${item.bug ? `<p><b>${escapeHtml(tr('feedbackBug'))}</b> ${escapeHtml(item.bug)}</p>` : ''}
      </article>`;
    }).join('');
  }

  function showFeedbackDialog() {
    ensureFeedbackUi();
    renderFeedbackDialog();
    openDialog(document.getElementById('v64FeedbackDialog'));
    syncCommentsFromCloud(true);
  }

  function installTypingFix() {
    document.addEventListener('keydown', event => {
      const target = event.target;
      if (!target) return;
      if (target.closest && target.closest('#v64FeedbackDialog, #championModal, #profileNameModal, .customize-modal')) {
        if (/^(TEXTAREA|INPUT|SELECT)$/.test(target.tagName) || target.isContentEditable) event.stopPropagation();
      }
    }, true);
  }

  function refreshUiTexts() {
    const fb = document.getElementById('v64FeedbackButton');
    if (fb) fb.textContent = tr('feedbackButton');
    injectWinnerInfoBox();
    renderFeedbackWall();
  }

  function installLanguageRefresh() {
    const previousApply = window.applyLanguage || (typeof applyLanguage === 'function' ? applyLanguage : null);
    if (typeof previousApply === 'function' && !previousApply.__v64RefreshWrapped) {
      const wrapped = function applyLanguageV64() {
        const result = previousApply.apply(this, arguments);
        setTimeout(refreshUiTexts, 0);
        return result;
      };
      wrapped.__v64RefreshWrapped = true;
      window.applyLanguage = globalThis.applyLanguage = wrapped;
      try { applyLanguage = wrapped; } catch (_) {}
    }
  }

  installTranslations();
  installAnonymousStart();
  installChampionAnonymousSave();
  installQuitReasonFix();
  installLevelTransitionCountdown();
  installWinnerAutoRefresh();
  installTypingFix();
  installLanguageRefresh();

  document.addEventListener('DOMContentLoaded', () => {
    installTranslations();
    ensureFeedbackUi();
    syncScoresFromCloud(true);
    syncCommentsFromCloud(true);
    refreshUiTexts();
  });
  setTimeout(() => {
    ensureFeedbackUi();
    syncScoresFromCloud(true);
    syncCommentsFromCloud(true);
    refreshUiTexts();
  }, 500);
})();

/* --------------------------------------------------------------------------
   V65: targeted repair patch
   Fixes only the reported issues: enemy generator duplicates, winner modal
   side-by-side layout, champion popup empty width, right-side shop bubble,
   safer anonymous save, and reliable level countdown.
   -------------------------------------------------------------------------- */
(function v65TargetedRepair(){
  if (window.__ragiJoyV65Patch) return;
  window.__ragiJoyV65Patch = true;

  const NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const LAST_NAME_KEY = 'ragiJoyLastWinnerName';
  const GENERATED_KEY = 'ragiJoyGeneratedEnemyStylesV63';
  const COUNTER_KEY = 'ragiJoyGeneratedEnemyCounterV65';

  function isNorwegian(){
    try { return currentLanguage !== 'en'; } catch(_) { return true; }
  }
  function txt(no, en){ return isNorwegian() ? no : en; }
  function esc(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function readArray(key){
    try { const parsed = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(parsed) ? parsed : []; }
    catch(_) { return []; }
  }
  function writeArray(key, items){
    try { localStorage.setItem(key, JSON.stringify(Array.isArray(items) ? items : [])); } catch(_) {}
  }
  function currentSafeName(){
    return String(localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || '').trim();
  }
  function createAnonName(){
    let name = currentSafeName();
    if (name && name.toLowerCase() !== 'spiller' && name.toLowerCase() !== 'player') return name;
    name = `Anonym-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      localStorage.setItem(NAME_KEY, name);
      localStorage.setItem(LAST_NAME_KEY, name);
    } catch(_) {}
    return name;
  }

  /* ----------------------- Enemy generator real fix ----------------------- */
  const V65_ENEMY_PRESETS = [
    { base: '🧪 Mutant Lab', pool: ['🧬','🦠','🧪','👽','🤢','☣️','🧟','🧌'] },
    { base: '🤖 Robot Army', pool: ['🤖','🦾','🛸','⚙️','🔩','🛰️','👾','💣'] },
    { base: '🐉 Dragon Cave', pool: ['🐉','🐲','🦖','🔥','🌋','☄️','👺','🧌'] },
    { base: '🧊 Ice Squad', pool: ['🥶','❄️','🧊','👻','💎','🌨️','☃️','🦭'] },
    { base: '🦈 Sea Panic', pool: ['🦈','🐙','🪼','🦑','🐡','🌊','⚓','👾'] },
    { base: '🎃 Horror Night', pool: ['🎃','👻','🧛','🧟','🦇','🕷️','💀','🪦'] },
    { base: '🐝 Bug Swarm', pool: ['🐝','🪲','🦂','🕷️','🪳','🦟','🐜','🦠'] },
    { base: '👑 Boss Rush', pool: ['👑','🦹','👺','🧌','🐲','🤖','💀','⚔️'] },
    { base: '🌪️ Chaos Pack', pool: ['🌪️','💥','⚡','☄️','🌀','👽','🤡','😈'] },
    { base: '🧟 Zombie Crew', pool: ['🧟','🧟‍♂️','🧟‍♀️','💀','🪦','👻','🦴','😵'] },
    { base: '🛸 Alien Raid', pool: ['🛸','👽','🪐','☄️','🚀','🔮','👾','⚡'] },
    { base: '🧛 Vampire Alley', pool: ['🧛','🦇','🌙','🩸','👻','💀','🕯️','🕷️'] },
    { base: '🦴 Bone Yard', pool: ['🦴','💀','🪦','👻','🧟','🕷️','⚰️','😵'] },
    { base: '🎪 Clown Attack', pool: ['🤡','🎪','🎈','😈','👺','💣','🃏','👻'] },
    { base: '⚡ Storm Crew', pool: ['⚡','🌩️','🌪️','☄️','🔥','🌀','💥','👾'] },
    { base: '🏴‍☠️ Pirate Bay', pool: ['🏴‍☠️','☠️','⚓','🦜','🦈','💣','🗡️','🌊'] }
  ];

  function normaliseGeneratedEnemyItems(){
    const seen = new Set();
    const cleaned = [];
    readArray(GENERATED_KEY).forEach((item) => {
      if (!item || !item.key || !item.label || !Array.isArray(item.pool) || !item.pool.length) return;
      const signature = `${String(item.label).trim().toLowerCase()}|${item.pool.join('')}`;
      if (seen.has(signature)) return;
      seen.add(signature);
      cleaned.push({ key: String(item.key), label: String(item.label), pool: item.pool.slice(0, 12) });
    });
    const latest = cleaned.slice(-8);
    writeArray(GENERATED_KEY, latest);
    return latest;
  }

  function maxGeneratedNumber(items){
    let max = Number(localStorage.getItem(COUNTER_KEY) || 0) || 0;
    items.forEach(item => {
      const m = String(item.label || '').match(/#(\d+)\s*$/);
      if (m) max = Math.max(max, Number(m[1]) || 0);
    });
    return max;
  }

  function registerGeneratedPool(item){
    if (!item || !item.key || !Array.isArray(item.pool)) return;
    try { v30EnemyPools[item.key] = item.pool.slice(); } catch(_) {}
  }

  function renderGeneratedEnemyButtons(){
    const grid = document.getElementById('enemyStyleGrid');
    if (!grid) return;
    const generator = document.getElementById('v63GenerateEnemyEmojis') || document.getElementById('v61GenerateEnemyEmojis');

    grid.querySelectorAll('button.v63-generated-enemy-button, button[data-v65-generated="1"]').forEach(btn => btn.remove());

    const items = normaliseGeneratedEnemyItems();
    items.forEach(item => {
      registerGeneratedPool(item);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.enemyStyle = item.key;
      btn.dataset.v65Generated = '1';
      btn.className = 'v63-generated-enemy-button';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        registerGeneratedPool(item);
        if (typeof window.setEnemyStyle === 'function') window.setEnemyStyle(item.key);
      });
      if (generator && generator.parentElement === grid) grid.insertBefore(btn, generator);
      else grid.appendChild(btn);
    });

    if (generator) {
      generator.textContent = txt('🎲 Generer ny fiende-pakke', '🎲 Generate new enemy pack');
      generator.onclick = window.generateEnemyEmojis;
    }

    try {
      const selected = String(localStorage.getItem('ragiJoyEnemyStyle') || selectedEnemyStyle || 'monsters');
      document.querySelectorAll('#enemyStyleGrid button').forEach(btn => {
        btn.classList.toggle('active-choice', btn.dataset.enemyStyle === selected);
      });
    } catch(_) {}
  }

  window.generateEnemyEmojis = function generateEnemyEmojisV65(){
    const existing = normaliseGeneratedEnemyItems();
    const nextNo = maxGeneratedNumber(existing) + 1;
    try { localStorage.setItem(COUNTER_KEY, String(nextNo)); } catch(_) {}
    const preset = V65_ENEMY_PRESETS[(nextNo - 1) % V65_ENEMY_PRESETS.length];
    const key = `generated_v65_${nextNo}_${Date.now().toString(36)}`;
    const pool = preset.pool.slice().sort(() => Math.random() - 0.5);
    const item = { key, label: `${preset.base} #${nextNo}`, pool };
    writeArray(GENERATED_KEY, [...existing, item].slice(-8));
    registerGeneratedPool(item);
    renderGeneratedEnemyButtons();
    try { if (typeof window.setEnemyStyle === 'function') window.setEnemyStyle(key); } catch(_) {}
    try {
      if (Array.isArray(enemies)) enemies.forEach(enemy => { enemy.face = typeof getEnemyFace === 'function' ? getEnemyFace() : pool[0]; });
      if (typeof updateCustomizerUi === 'function') updateCustomizerUi();
      if (typeof drawGame === 'function') drawGame();
      if (typeof playSfx === 'function') playSfx('enemy');
    } catch(_) {}
  };

  function installEnemyGeneratorFix(){
    normaliseGeneratedEnemyItems().forEach(registerGeneratedPool);
    renderGeneratedEnemyButtons();
    const generator = document.getElementById('v63GenerateEnemyEmojis') || document.getElementById('v61GenerateEnemyEmojis');
    if (generator) generator.onclick = window.generateEnemyEmojis;
  }

  /* ----------------------- Top 10 side-by-side layout ---------------------- */
  function ensureDailyPanelExists(card){
    let panel = document.getElementById('dailyTopPanel');
    if (!panel && card) {
      panel = document.createElement('section');
      panel.id = 'dailyTopPanel';
      panel.className = 'v41-daily-panel v42-daily-panel';
      panel.innerHTML = `<h3>${txt('⏱️ Dagens Top 10', '⏱️ Today Top 10')}</h3><p>${txt('Daglisten oppdateres automatisk.', 'The daily list updates automatically.')}</p>`;
      card.appendChild(panel);
    }
    return panel;
  }

  function layoutWinnerBoardV65(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    const list = document.getElementById('winnerList');
    const panel = ensureDailyPanelExists(card);
    if (!card || !list || !panel) return;

    let grid = card.querySelector('.v65-winner-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'v65-winner-grid';
      card.insertBefore(grid, list);
    }
    if (list.parentElement !== grid) grid.appendChild(list);
    if (panel.parentElement !== grid) grid.appendChild(panel);
    dialog.style.width = 'min(1120px, calc(100vw - 26px))';
    dialog.style.maxWidth = 'min(1120px, calc(100vw - 26px))';
    dialog.style.overflow = 'hidden';
  }

  function wrapWinnerBoard(){
    const previous = window.showWinnerBoard;
    if (typeof previous === 'function' && !previous.__v65Wrapped) {
      const wrapped = function showWinnerBoardV65(){
        const result = previous.apply(this, arguments);
        [0, 60, 180, 600].forEach(delay => setTimeout(layoutWinnerBoardV65, delay));
        return result;
      };
      wrapped.__v65Wrapped = true;
      window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
      try { showWinnerBoard = wrapped; } catch(_) {}
    }
    setInterval(() => {
      const dialog = document.getElementById('winnerBoardModal');
      if (dialog && (dialog.open || dialog.hasAttribute('open'))) layoutWinnerBoardV65();
    }, 12000);
  }

  /* -------------------- Champion popup width hard-fix ---------------------- */
  function compactChampionPopup(){
    const dialog = document.getElementById('championModal');
    if (!dialog) return;
    dialog.style.width = 'min(500px, calc(100vw - 28px))';
    dialog.style.maxWidth = 'min(500px, calc(100vw - 28px))';
    dialog.style.minWidth = '0';
    dialog.style.padding = '0';
    dialog.style.margin = 'auto';
    dialog.style.background = 'transparent';
    dialog.style.border = '0';
    dialog.style.overflow = 'visible';
    const card = dialog.querySelector('.winner-card, .champion-card, .v38-champion-card');
    if (card) {
      card.style.width = '100%';
      card.style.maxWidth = '100%';
      card.style.minWidth = '0';
      card.style.margin = '0';
      card.style.boxSizing = 'border-box';
      card.style.overflow = 'hidden';
    }
  }

  function installChampionCompactWatcher(){
    compactChampionPopup();
    const dialog = document.getElementById('championModal');
    if (dialog && !dialog.dataset.v65CompactWatcher) {
      dialog.dataset.v65CompactWatcher = '1';
      new MutationObserver(() => setTimeout(compactChampionPopup, 0)).observe(dialog, { attributes: true, childList: true, subtree: true });
    }
    const prevClose = window.closeChampionModal;
    if (typeof prevClose === 'function' && !prevClose.__v65Wrapped) {
      const wrappedClose = function closeChampionModalV65(){
        return prevClose.apply(this, arguments);
      };
      wrappedClose.__v65Wrapped = true;
      window.closeChampionModal = globalThis.closeChampionModal = wrappedClose;
      try { closeChampionModal = wrappedClose; } catch(_) {}
    }
  }

  /* ----------------------- Anonymous score saving -------------------------- */
  function installAnonymousSaveFallback(){
    const previousSave = window.saveChampionWinner;
    if (typeof previousSave === 'function' && !previousSave.__v65AnonWrapped) {
      const wrapped = function saveChampionWinnerV65(){
        if (!currentSafeName()) createAnonName();
        compactChampionPopup();
        return previousSave.apply(this, arguments);
      };
      wrapped.__v65AnonWrapped = true;
      window.saveChampionWinner = globalThis.saveChampionWinner = wrapped;
      try { saveChampionWinner = wrapped; } catch(_) {}
    }
  }

  /* ----------------------- Level countdown hard-fix ------------------------- */
  function ensureCountdownElement(){
    let overlay = document.getElementById('v64LevelCountdown');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'v64LevelCountdown';
      overlay.className = 'v64-level-countdown hidden';
      overlay.innerHTML = '<div class="v64-countdown-bubble">3</div>';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function showLevelCountdownV65(done){
    const overlay = ensureCountdownElement();
    const bubble = overlay.querySelector('.v64-countdown-bubble') || overlay;
    const sequence = ['3', '2', '1', 'GO!'];
    overlay.classList.remove('hidden');
    let index = 0;
    const step = () => {
      bubble.textContent = sequence[index];
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = '';
      try { if (typeof playSfx === 'function') playSfx(index < 3 ? 'coin' : 'power'); } catch(_) {}
      index += 1;
      if (index < sequence.length) setTimeout(step, 560);
      else setTimeout(() => {
        overlay.classList.add('hidden');
        if (typeof done === 'function') done();
      }, 430);
    };
    step();
  }

  function installLevelCountdownHardfix(){
    if (typeof window.nextLevel !== 'function') return;
    const previousNext = window.nextLevel;
    if (previousNext.__v65Hardfix) return;

    const wrapped = function nextLevelV65(){
      try {
        if (window.__v65LevelTransitionBusy) return;
        window.__v65LevelTransitionBusy = true;

        if (typeof levelIndex === 'number' && Array.isArray(levels) && levelIndex >= levels.length - 1) {
          window.__v65LevelTransitionBusy = false;
          if (typeof endGame === 'function') endGame(true);
          return;
        }

        try { score += 500 + (levelIndex + 1) * 75; } catch(_) {}
        try { gameRunning = false; paused = true; } catch(_) {}
        try { clearInterval(enemyTimer); } catch(_) {}
        try { if (typeof stopEnemyLoop === 'function') stopEnemyLoop(); } catch(_) {}
        try {
          if (levelScreen) {
            levelScreen.hidden = false;
            levelScreen.textContent = txt('Neste level starter ...', 'Next level starts ...');
          }
        } catch(_) {}
        try { if (typeof updateHud === 'function') updateHud(); } catch(_) {}
        try { if (typeof playSfx === 'function') playSfx('level'); } catch(_) {}

        setTimeout(() => {
          try { levelIndex += 1; } catch(_) {}
          try { if (levelScreen) levelScreen.hidden = true; } catch(_) {}
          try { if (typeof loadLevel === 'function') loadLevel(levelIndex); } catch(_) {}
          try { paused = true; gameRunning = false; } catch(_) {}
          try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
          showLevelCountdownV65(() => {
            try {
              paused = false;
              gameRunning = true;
              window.__v65LevelTransitionBusy = false;
              if (typeof startTimers === 'function') startTimers();
              if (typeof startEnemyLoop === 'function') startEnemyLoop();
              else { try { clearInterval(enemyTimer); enemyTimer = setTimeout(moveEnemies, getEnemyDelay()); } catch(_) {} }
              if (typeof updateHud === 'function') updateHud();
              if (typeof updatePlayUi === 'function') updatePlayUi();
              if (typeof syncOnlinePlayer === 'function' && typeof onlineMode !== 'undefined' && onlineMode) syncOnlinePlayer(true);
            } catch(_) {
              window.__v65LevelTransitionBusy = false;
            }
          });
        }, 300);
      } catch(error) {
        window.__v65LevelTransitionBusy = false;
        return previousNext.apply(this, arguments);
      }
    };
    wrapped.__v65Hardfix = true;
    window.nextLevel = globalThis.nextLevel = wrapped;
    try { nextLevel = wrapped; } catch(_) {}
  }

  /* ----------------------- Shop coach RIGHT placement ----------------------- */
  function positionShopCoachRightV65(){
    const coach = document.getElementById('v62ShopCoach');
    const shopButton = document.getElementById('shopButton');
    if (!coach || !shopButton || coach.classList.contains('hidden')) return;
    const rect = shopButton.getBoundingClientRect();
    const bubble = coach.firstElementChild || coach;
    const bubbleRect = bubble.getBoundingClientRect();
    let left = rect.right + 14;
    let top = rect.top + (rect.height - bubbleRect.height) / 2;
    let side = 'right';

    if (left + bubbleRect.width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - bubbleRect.width - 12);
      top = rect.bottom + 10;
      side = 'bottom';
    }
    top = Math.max(12, Math.min(top, window.innerHeight - bubbleRect.height - 12));
    coach.classList.remove('v62-side-left', 'v62-side-right', 'v62-side-bottom', 'v65-side-right');
    coach.classList.add(side === 'right' ? 'v62-side-right' : 'v62-side-bottom', 'v65-force-right');
    if (side === 'right') coach.classList.add('v65-side-right');
    coach.style.left = `${Math.round(left)}px`;
    coach.style.top = `${Math.round(top)}px`;
  }

  function installShopCoachRightPlacement(){
    setInterval(positionShopCoachRightV65, 180);
    window.addEventListener('resize', () => setTimeout(positionShopCoachRightV65, 0), { passive: true });
    window.addEventListener('scroll', () => setTimeout(positionShopCoachRightV65, 0), { passive: true });
  }

  /* ----------------------- Feedback visibility + language ------------------- */
  function ensureFeedbackButtonVisible(){
    const button = document.getElementById('v64FeedbackButton');
    if (button) {
      button.style.display = 'inline-flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.zIndex = '1600';
      button.textContent = txt('💬 Feedback', '💬 Feedback');
    }
    const info = document.querySelector('.v64-feedback-info span');
    if (info) info.textContent = txt(
      'Kommentarer lagres lokalt i nettleseren og kan synkes til kommentarveggen. Gamle kommentarer slettes automatisk etter 7 dager.',
      'Comments are stored locally in the browser and can sync to the comment wall. Old comments are removed automatically after 7 days.'
    );
  }

  function initV65(){
    installEnemyGeneratorFix();
    wrapWinnerBoard();
    layoutWinnerBoardV65();
    compactChampionPopup();
    installChampionCompactWatcher();
    installAnonymousSaveFallback();
    installLevelCountdownHardfix();
    positionShopCoachRightV65();
    ensureFeedbackButtonVisible();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initV65();
    [150, 450, 900, 1600].forEach(delay => setTimeout(initV65, delay));
  });
  [250, 800, 1800].forEach(delay => setTimeout(initV65, delay));
  installShopCoachRightPlacement();
})();

/* --------------------------------------------------------------------------
   V70: Stability/cleanup pass requested 2026-05-06
   - Reliable How-to popup
   - Pause -> main menu confirmation instead of fake game-over
   - Anonymous player prompt before singleplayer starts
   - Power shop compact/no-scroll desktop layout + extra items
   - Auto-placed laser turrets + active countdown under board
   - Leaderboard country/language badges, no "unknown" fallback
   - Feedback/comment persistence reinforcement
   - De-duplicate repeated shop sounds
   -------------------------------------------------------------------------- */
(function v70RagiJoyHardFixes() {
  if (window.__ragiJoyV70HardFixes) return;
  window.__ragiJoyV70HardFixes = true;

  const NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const LAST_NAME_KEY = 'ragiJoyLastWinnerName';
  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const LEGACY_BOARD_KEY = 'ragiJoyMazeWinnersV33';
  const DAILY_KEY = 'ragiJoyMazeDailyTop10V41';
  const FEEDBACK_KEY = 'ragiJoyMazeFeedbackPublicV64';
  const FEEDBACK_BACKUP_KEY = 'ragiJoyMazeFeedbackBackupV70';
  const COMMENT_TTL_V70 = 30 * 24 * 60 * 60 * 1000;
  const MAX_COMMENTS_V70 = 30;
  let v70WinnerRefreshTimer = null;
  let v70HudTimer = null;
  let v70StartingFromAnonPrompt = false;

  const text = (no, en) => (typeof currentLanguage !== 'undefined' && currentLanguage === 'no') ? no : en;
  const htmlEscape = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function safeReadArray(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function safeWriteArray(key, value) {
    try { localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : [])); } catch (_) {}
  }

  function safeOpenDialog(dialog) {
    if (!dialog) return;
    try {
      if (dialog.open) return;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', 'open');
    } catch (_) {
      dialog.setAttribute('open', 'open');
    }
  }

  function safeCloseDialog(dialog) {
    if (!dialog) return;
    try {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    } catch (_) { dialog.removeAttribute('open'); }
  }

  function setNameRaw(name) {
    const fallback = text('Anonym spiller', 'Anonymous player');
    const clean = String(name || fallback).trim().replace(/[^A-Za-z0-9ÆØÅæøå_-]/g, '').slice(0, 18) || fallback.replace(/\s+/g, '');
    try {
      localStorage.setItem(NAME_KEY, clean);
      localStorage.setItem(LAST_NAME_KEY, clean);
    } catch (_) {}
    return clean;
  }

  function getActiveName() {
    try { return String(localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || '').trim(); }
    catch (_) { return ''; }
  }

  function makeAnonName() {
    return `${text('Anonym', 'Anon')}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function countryFromLanguage() {
    let lang = 'no';
    try { lang = currentLanguage || localStorage.getItem('ragiJoyLanguage') || 'no'; } catch (_) {}
    const option = (Array.isArray(languageOptions) ? languageOptions : []).find(item => item && item.code === lang);
    if (option) return { flag: option.flag || '🌍', country: option.country || option.name || 'Global', source: text('språkvalg', 'language setting') };
    return { flag: '🌍', country: text('Global spiller', 'Global player'), source: text('språkvalg', 'language setting') };
  }

  function addCountry(entry) {
    const country = countryFromLanguage();
    return {
      ...entry,
      countryFlag: entry.countryFlag || country.flag,
      country: entry.country || country.country,
      countrySource: entry.countrySource || country.source
    };
  }

  function enrichStoredBoards() {
    [BOARD_KEY, LEGACY_BOARD_KEY, DAILY_KEY].forEach(key => {
      const list = safeReadArray(key);
      if (!list.length) return;
      const updated = list.map(addCountry);
      if (JSON.stringify(list) !== JSON.stringify(updated)) safeWriteArray(key, updated);
    });
  }

  try {
    const nativeSetItem = Storage.prototype.setItem;
    if (!nativeSetItem.__v70CountryWrapped) {
      Storage.prototype.setItem = function setItemV70(key, value) {
        if ([BOARD_KEY, LEGACY_BOARD_KEY, DAILY_KEY].includes(String(key))) {
          try {
            const parsed = JSON.parse(String(value));
            if (Array.isArray(parsed)) return nativeSetItem.call(this, key, JSON.stringify(parsed.map(addCountry)));
          } catch (_) {}
        }
        return nativeSetItem.call(this, key, value);
      };
      Storage.prototype.setItem.__v70CountryWrapped = true;
    }
  } catch (_) {}

  /* -------------------- 1) Reliable "Hvordan spille" -------------------- */
  function setHowToTexts() {
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    set('howToKicker', 'QUICK GUIDE');
    set('howToTitle', text('Slik spiller du', 'How to play'));
    set('howToDiamonds', text('Samle alle diamantene på brettet.', 'Collect all diamonds on the board.'));
    set('howToPower', text('Ta ⚡ for power-mode. Da kan du spise fiender for bonus.', 'Grab ⚡ for power mode. Then you can eat enemies for bonus.'));
    set('howToShield', text('🛡️ Skjold redder deg én gang hvis en fiende treffer deg.', '🛡️ Shield saves you once if an enemy hits you.'));
    set('howToPortal', text('Når alle diamanter er tatt åpnes 🌀 portal til neste level.', 'When all diamonds are collected, the 🌀 portal opens to the next level.'));
    set('howToCombo', text('Combo gir mer poeng. Power-butikk kan hjelpe deg videre.', 'Combo gives more points. The power shop can help you progress.'));
    set('howToOnline', text('Mot venn handler det om å samle mest mulig og overleve lengst.', 'Against a friend, collect the most and survive the longest.'));
    set('howToOkButton', text('Skjønner ✅', 'Got it ✅'));
  }

  const showHowToFixed = function showHowToModalV70() {
    setHowToTexts();
    safeOpenDialog(document.getElementById('howToModal'));
  };
  window.showHowToModal = globalThis.showHowToModal = showHowToFixed;
  try { showHowToModal = showHowToFixed; } catch (_) {}
  const closeHowToFixed = function closeHowToModalV70() { safeCloseDialog(document.getElementById('howToModal')); };
  window.closeHowToModal = globalThis.closeHowToModal = closeHowToFixed;
  try { closeHowToModal = closeHowToFixed; } catch (_) {}

  /* -------------------- 2) Pause -> main menu confirm -------------------- */
  function ensureQuitConfirmDialog() {
    let dialog = document.getElementById('v70QuitConfirmDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'v70QuitConfirmDialog';
    dialog.className = 'v70-confirm-dialog';
    dialog.innerHTML = `
      <div class="v70-confirm-card">
        <button class="friend-modal-close" type="button" data-v70-cancel aria-label="Close">✕</button>
        <p class="friend-kicker">${htmlEscape(text('AVSLUTT KAMP', 'LEAVE GAME'))}</p>
        <h2>${htmlEscape(text('Forlate spillet?', 'Leave the game?'))}</h2>
        <p>${htmlEscape(text('Du forlater nå kampen. Hvis du velger ja, går du tilbake til hovedmenyen og må starte på nytt fra level 1.', 'You are leaving the run. If you choose yes, you return to the main menu and must start again from level 1.'))}</p>
        <div class="v70-confirm-actions">
          <button type="button" data-v70-confirm>${htmlEscape(text('Ja, gå til hovedmeny', 'Yes, go to main menu'))}</button>
          <button type="button" class="secondary-action" data-v70-cancel>${htmlEscape(text('Nei, fortsett pause', 'No, stay paused'))}</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    dialog.addEventListener('cancel', event => { event.preventDefault(); safeCloseDialog(dialog); });
    dialog.querySelectorAll('[data-v70-cancel]').forEach(btn => btn.addEventListener('click', () => {
      safeCloseDialog(dialog);
      try { paused = true; if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi(); } catch (_) {}
    }));
    dialog.querySelector('[data-v70-confirm]').addEventListener('click', () => {
      safeCloseDialog(dialog);
      try { paused = false; gameRunning = false; } catch (_) {}
      try { clearInterval(enemyTimer); clearTimeout(enemyTimer); clearTimeout(powerTimer); } catch (_) {}
      try { if (typeof stopMusic === 'function') stopMusic(); } catch (_) {}
      try { if (typeof v23ResetShopRun === 'function') v23ResetShopRun(); } catch (_) {}
      try { if (typeof goToMainMenu === 'function') goToMainMenu(); } catch (_) {
        startScreen?.classList.remove('hidden');
        endScreen?.classList.add('hidden');
        levelScreen?.classList.add('hidden');
      }
      try {
        if (messageBar) messageBar.textContent = text('Du forlot kampen. Start ny kamp når du er klar.', 'You left the run. Start a new game when ready.');
        if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi();
      } catch (_) {}
    });
    return dialog;
  }

  const returnMenuFixed = function returnToMainMenuFromPauseV70() {
    try {
      if (!gameRunning) { if (typeof goToMainMenu === 'function') goToMainMenu(); return; }
      paused = true;
      if (messageBar) messageBar.textContent = text('Pause aktivert. Bekreft om du vil forlate kampen.', 'Paused. Confirm if you want to leave the run.');
      if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi();
      safeOpenDialog(ensureQuitConfirmDialog());
    } catch (_) { safeOpenDialog(ensureQuitConfirmDialog()); }
  };
  window.returnToMainMenuFromPause = globalThis.returnToMainMenuFromPause = returnMenuFixed;
  try { returnToMainMenuFromPause = returnMenuFixed; } catch (_) {}

  function fixPauseButtonText() {
    try {
      const pauseButton = document.getElementById('pauseButton');
      if (pauseButton && gameRunning && !paused) pauseButton.textContent = text('⏸️ Pause', '⏸️ Pause');
      const menuButton = document.getElementById('menuFromPauseButton');
      if (menuButton) menuButton.textContent = text('🏠 Hovedmeny', '🏠 Main menu');
    } catch (_) {}
  }

  /* -------------------- 3) Anonymous start prompt -------------------- */
  function ensureAnonDialog() {
    let dialog = document.getElementById('v70AnonDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'v70AnonDialog';
    dialog.className = 'v70-anon-dialog';
    dialog.innerHTML = `
      <div class="v70-anon-card">
        <button class="friend-modal-close" type="button" data-v70-anon-cancel aria-label="Close">✕</button>
        <p class="friend-kicker">PLAYER NAME</p>
        <h2>${htmlEscape(text('Spille med navn eller anonymt?', 'Play with name or anonymously?'))}</h2>
        <p>${htmlEscape(text('Du kan skrive et navn, eller spille anonymt. Vinnerlisten vil da vise anonymt spillernavn og landprofil fra språkvalget ditt.', 'You can enter a name or play anonymously. The leaderboard will then show an anonymous player name and country profile from your language setting.'))}</p>
        <input id="v70AnonNameInput" maxlength="18" placeholder="${htmlEscape(text('Valgfritt spillernavn', 'Optional player name'))}">
        <div class="v70-anon-actions">
          <button type="button" data-v70-name>${htmlEscape(text('Start med navn', 'Start with name'))}</button>
          <button type="button" data-v70-anon>${htmlEscape(text('Spill anonymt', 'Play anonymously'))}</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    const startWith = (name) => {
      safeCloseDialog(dialog);
      setNameRaw(name || makeAnonName());
      v70StartingFromAnonPrompt = true;
      try { window.startGame(); } finally { setTimeout(() => { v70StartingFromAnonPrompt = false; }, 0); }
    };
    dialog.querySelector('[data-v70-name]').addEventListener('click', () => {
      const input = dialog.querySelector('#v70AnonNameInput');
      startWith(input && input.value.trim() ? input.value.trim() : makeAnonName());
    });
    dialog.querySelector('[data-v70-anon]').addEventListener('click', () => startWith(makeAnonName()));
    dialog.querySelector('[data-v70-anon-cancel]').addEventListener('click', () => safeCloseDialog(dialog));
    dialog.querySelector('#v70AnonNameInput').addEventListener('keydown', event => {
      if (event.key === 'Enter') dialog.querySelector('[data-v70-name]').click();
    });
    return dialog;
  }

  const previousStartGameV70 = window.startGame || (typeof startGame === 'function' ? startGame : null);
  if (typeof previousStartGameV70 === 'function') {
    const startGameFixed = function startGameV70() {
      if (!v70StartingFromAnonPrompt && !getActiveName() && !window.onlineMode) {
        safeOpenDialog(ensureAnonDialog());
        return;
      }
      const result = previousStartGameV70.apply(this, arguments);
      setTimeout(() => { fixPauseButtonText(); updateLaserHud(); hideAvatarSummaryIfNoImage(); }, 60);
      return result;
    };
    window.startGame = globalThis.startGame = startGameFixed;
    try { startGame = startGameFixed; } catch (_) {}
  }

  /* -------------------- 4) Power shop: extra products + auto turrets -------------------- */
  const V70_COSTS = {
    overdrive: 1500,
    cleaner: 950,
    heartpack: 2200,
    chaos: 1350
  };

  function hasScore(cost) { try { return Number(score) >= Number(cost); } catch (_) { return false; } }
  function spend(cost) { try { if (!hasScore(cost)) return false; score -= cost; return true; } catch (_) { return false; } }

  function addRandomTiles(tile, count) {
    try {
      const empty = [];
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          if (map[y][x] === TILE.EMPTY && !(player.x === x && player.y === y) && !enemies.some(e => e.x === x && e.y === y)) empty.push({ x, y });
        }
      }
      let placed = 0;
      while (empty.length && placed < count) {
        const idx = Math.floor(Math.random() * empty.length);
        const cell = empty.splice(idx, 1)[0];
        map[cell.y][cell.x] = tile;
        placed++;
      }
      return placed;
    } catch (_) { return 0; }
  }

  function collectRandomDiamonds(maxCount) {
    try {
      const dots = [];
      for (let y = 0; y < map.length; y++) for (let x = 0; x < map[y].length; x++) if (map[y][x] === TILE.DOT) dots.push({ x, y });
      let taken = 0;
      while (dots.length && taken < maxCount) {
        const idx = Math.floor(Math.random() * dots.length);
        const dot = dots.splice(idx, 1)[0];
        map[dot.y][dot.x] = TILE.EMPTY;
        diamondsLeft = Math.max(0, diamondsLeft - 1);
        score += 10 * Math.max(1, combo || 1);
        taken++;
        try { spawnPop('💎', dot.x, dot.y); } catch (_) {}
      }
      if (diamondsLeft === 0 && !portalOpen && typeof openPortal === 'function') openPortal();
      return taken;
    } catch (_) { return 0; }
  }

  function findTurretTiles() {
    const tiles = [];
    try {
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          const ok = (typeof v23CanPlaceTurret === 'function') ? v23CanPlaceTurret(x, y) : (map[y][x] !== TILE.WALL && !(player.x === x && player.y === y));
          if (ok) tiles.push({ x, y });
        }
      }
    } catch (_) {}
    return tiles;
  }

  function autoPlaceTurretsV70(limit = 99) {
    let placed = 0;
    try {
      const tiles = findTurretTiles();
      while (tiles.length && typeof v23TurretInventory !== 'undefined' && v23TurretInventory > 0 && placed < limit) {
        const idx = Math.floor(Math.random() * tiles.length);
        const tile = tiles.splice(idx, 1)[0];
        if (typeof v23PlaceTurretAt === 'function' && v23PlaceTurretAt(tile.x, tile.y)) placed++;
      }
      if (placed && messageBar) messageBar.textContent = text(`🤖 ${placed} laser(e) er auto-plassert på brettet.`, `🤖 ${placed} laser(s) auto-placed on the board.`);
    } catch (_) {}
    updateLaserHud();
    return placed;
  }
  window.v70AutoPlaceTurrets = autoPlaceTurretsV70;

  function ensureExtraShopItems() {
    const grid = document.querySelector('#shopModal .shop-grid');
    if (!grid || document.getElementById('v70ShopOverdrive')) return;
    const items = [
      ['overdrive', '⚡', text('Overdrive', 'Overdrive'), text('Power-mode i 10 sekunder. Perfekt når fiendene presser.', 'Power mode for 10 seconds. Perfect when enemies pressure you.')],
      ['cleaner', '💎', text('Diamant-støvsuger', 'Diamond vacuum'), text('Fjerner opptil 14 tilfeldige diamanter og gir poeng.', 'Clears up to 14 random diamonds and gives points.')],
      ['heartpack', '❤️', text('Ekstra liv-pakke', 'Extra life pack'), text('Gir deg 3 ekstra liv i denne kampen.', 'Gives 3 extra lives in this run.')],
      ['chaos', '🎲', text('Kaos-drop', 'Chaos drop'), text('Legger ut nye power-ups/skjold på tilfeldige trygge ruter.', 'Drops new power-ups/shields on random safe tiles.')]
    ];
    for (const [id, icon, title, desc] of items) {
      const article = document.createElement('article');
      article.className = 'shop-item shop-item-fun v70-shop-item';
      article.id = `v70Shop${id[0].toUpperCase()}${id.slice(1)}`;
      article.innerHTML = `<strong>${icon} ${htmlEscape(title)}</strong><p>${htmlEscape(desc)}</p><button type="button" data-v70-buy="${id}"></button>`;
      grid.appendChild(article);
    }
    grid.addEventListener('click', event => {
      const btn = event.target.closest('[data-v70-buy]');
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      window.buyShopItem(btn.dataset.v70Buy);
    });
    refreshShopUiV70();
  }

  function refreshShopUiV70() {
    try {
      ensureExtraShopItems();
      Object.entries(V70_COSTS).forEach(([key, cost]) => {
        const btn = document.querySelector(`[data-v70-buy="${key}"]`);
        if (!btn) return;
        btn.textContent = text(`Kjøp (${cost})`, `Buy (${cost})`);
        btn.disabled = Boolean(window.onlineMode) || !hasScore(cost);
      });
      const placeBtn = document.getElementById('shopPlaceTurretButton');
      if (placeBtn) placeBtn.textContent = text('🎯 Plasser laser selv', '🎯 Place laser manually');
      let autoBtn = document.getElementById('v70AutoPlaceTurretButton');
      const card = document.querySelector('#shopModal .shop-card');
      if (card && !autoBtn) {
        autoBtn = document.createElement('button');
        autoBtn.id = 'v70AutoPlaceTurretButton';
        autoBtn.type = 'button';
        autoBtn.className = 'shop-place-button v70-auto-place-button';
        autoBtn.addEventListener('click', () => autoPlaceTurretsV70());
        const after = document.getElementById('shopPlaceTurretButton');
        if (after) after.insertAdjacentElement('afterend', autoBtn);
        else card.appendChild(autoBtn);
      }
      if (autoBtn) {
        const inv = (typeof v23TurretInventory !== 'undefined') ? Number(v23TurretInventory) : 0;
        autoBtn.textContent = text(`🤖 Auto-plasser laser (${inv})`, `🤖 Auto-place lasers (${inv})`);
        autoBtn.disabled = !inv || Boolean(window.onlineMode);
      }
    } catch (_) {}
  }

  const previousOpenPowerShopV70 = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
  if (typeof previousOpenPowerShopV70 === 'function') {
    const openShopFixed = function openPowerShopV70() {
      const result = previousOpenPowerShopV70.apply(this, arguments);
      setTimeout(() => { ensureExtraShopItems(); refreshShopUiV70(); updateLaserHud(); }, 40);
      return result;
    };
    window.openPowerShop = globalThis.openPowerShop = openShopFixed;
    try { openPowerShop = openShopFixed; } catch (_) {}
  }

  const previousBuyShopItemV70 = window.buyShopItem || (typeof buyShopItem === 'function' ? buyShopItem : null);
  if (typeof previousBuyShopItemV70 === 'function') {
    const buyFixed = function buyShopItemV70(item) {
      const key = String(item || '');
      if (V70_COSTS[key]) {
        const cost = V70_COSTS[key];
        if (!spend(cost)) {
          if (messageBar) messageBar.textContent = text('Ikke nok score til dette produktet.', 'Not enough score for this item.');
          try { playSfx('lose'); } catch (_) {}
          refreshShopUiV70();
          return false;
        }
        if (key === 'overdrive') {
          try {
            powerMode = true;
            clearTimeout(powerTimer);
            powerTimer = setTimeout(() => { powerMode = false; combo = 1; if (messageBar) messageBar.textContent = text('Overdrive ferdig.', 'Overdrive ended.'); drawGame(); }, 10000);
          } catch (_) {}
          if (messageBar) messageBar.textContent = text('⚡ Overdrive aktivert i 10 sekunder!', '⚡ Overdrive active for 10 seconds!');
        }
        if (key === 'cleaner') {
          const taken = collectRandomDiamonds(14);
          if (messageBar) messageBar.textContent = text(`💎 Støvsuger tok ${taken} diamanter!`, `💎 Vacuum cleared ${taken} diamonds!`);
        }
        if (key === 'heartpack') {
          try { lives = Math.min(12, Number(lives || 0) + 3); } catch (_) {}
          if (messageBar) messageBar.textContent = text('❤️ Du fikk 3 ekstra liv!', '❤️ You got 3 extra lives!');
        }
        if (key === 'chaos') {
          const p = addRandomTiles(TILE.POWER, 2);
          const s = addRandomTiles(TILE.SHIELD, 2);
          if (messageBar) messageBar.textContent = text(`🎲 Kaos-drop: ${p} power-ups og ${s} skjold lagt ut.`, `🎲 Chaos drop: ${p} power-ups and ${s} shields added.`);
        }
        try { playSfx('power'); } catch (_) {}
        try { drawGame(); } catch (_) {}
        try { if (typeof v23UpdateShopUi === 'function') v23UpdateShopUi(); } catch (_) {}
        refreshShopUiV70();
        updateLaserHud();
        return true;
      }

      const beforeInventory = (() => { try { return Number(v23TurretInventory || 0); } catch (_) { return 0; } })();
      const result = previousBuyShopItemV70.apply(this, arguments);
      const afterInventory = (() => { try { return Number(v23TurretInventory || 0); } catch (_) { return 0; } })();
      if (key === 'turret' && afterInventory > beforeInventory) setTimeout(() => autoPlaceTurretsV70(afterInventory - beforeInventory), 60);
      setTimeout(() => { refreshShopUiV70(); updateLaserHud(); }, 80);
      return result;
    };
    window.buyShopItem = globalThis.buyShopItem = buyFixed;
    try { buyShopItem = buyFixed; } catch (_) {}
  }

  const previousBuyTurretPackV70 = window.buyTurretPack || (typeof buyTurretPack === 'function' ? buyTurretPack : null);
  if (typeof previousBuyTurretPackV70 === 'function') {
    const buyPackFixed = function buyTurretPackV70() {
      const beforeInventory = (() => { try { return Number(v23TurretInventory || 0); } catch (_) { return 0; } })();
      const result = previousBuyTurretPackV70.apply(this, arguments);
      const afterInventory = (() => { try { return Number(v23TurretInventory || 0); } catch (_) { return 0; } })();
      if (afterInventory > beforeInventory) setTimeout(() => autoPlaceTurretsV70(afterInventory - beforeInventory), 60);
      setTimeout(() => { refreshShopUiV70(); updateLaserHud(); }, 80);
      return result;
    };
    window.buyTurretPack = globalThis.buyTurretPack = buyPackFixed;
    try { buyTurretPack = buyPackFixed; } catch (_) {}
  }

  /* -------------------- 5) Laser countdown HUD -------------------- */
  function ensureLaserHud() {
    let hud = document.getElementById('v70LaserHud');
    if (hud) return hud;
    hud = document.createElement('div');
    hud.id = 'v70LaserHud';
    hud.className = 'v70-laser-hud hidden';
    const wrapper = document.getElementById('game-wrapper') || document.querySelector('.game-wrapper') || document.getElementById('gameContainer');
    if (wrapper && wrapper.parentElement) wrapper.insertAdjacentElement('afterend', hud);
    else document.body.appendChild(hud);
    return hud;
  }

  function updateLaserHud() {
    const hud = ensureLaserHud();
    try {
      const now = Date.now();
      const turrets = (typeof v23Turrets !== 'undefined' && Array.isArray(v23Turrets)) ? v23Turrets.filter(t => Number(t.expiresAt) > now) : [];
      const longest = turrets.length ? Math.max(...turrets.map(t => Number(t.expiresAt) - now)) : 0;
      const seconds = Math.max(0, Math.ceil(longest / 1000));
      if (!gameRunning || !turrets.length) {
        hud.classList.add('hidden');
        hud.innerHTML = '';
        return;
      }
      hud.classList.remove('hidden');
      hud.innerHTML = `<span>🔫 ${htmlEscape(text('Aktive lasere', 'Active lasers'))}: <b>${turrets.length}</b></span><span>⏳ ${htmlEscape(text('varer ca.', 'about'))} <b>${seconds}s</b></span><small>${htmlEscape(text('Laserne skyter automatisk og forsvinner når tiden går ut.', 'Lasers shoot automatically and disappear when time runs out.'))}</small>`;
    } catch (_) {
      hud.classList.add('hidden');
    }
  }

  /* -------------------- 6) Leaderboard country badges + info -------------------- */
  function decorateWinnerRows() {
    enrichStoredBoards();
    const country = countryFromLanguage();
    const board = safeReadArray(BOARD_KEY).map(addCountry);
    const rows = Array.from(document.querySelectorAll('#winnerList .winner-row, #dailyTopPanel li, .v42-daily-list li, .v41-daily-list li'));
    rows.forEach((row, index) => {
      if (!row || row.querySelector('.v70-country-badge')) return;
      const entry = board[index] || {};
      const flag = entry.countryFlag || country.flag;
      const name = entry.country || country.country;
      const badge = document.createElement('span');
      badge.className = 'v70-country-badge';
      badge.title = text(`Landprofil fra ${entry.countrySource || country.source}`, `Country profile from ${entry.countrySource || country.source}`);
      badge.textContent = `${flag} ${name}`;
      const target = row.querySelector('.winner-meta, .v42-player-cell small, small') || row.querySelector('.winner-name') || row;
      if (target) target.appendChild(badge);
    });
  }

  function injectWinnerInfoV70() {
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    let info = document.getElementById('v70WinnerInfoBox');
    if (!info) {
      info = document.createElement('section');
      info.id = 'v70WinnerInfoBox';
      info.className = 'v70-winner-info';
      const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
      if (list && list.parentElement) list.parentElement.insertBefore(info, list);
      else card.prepend(info);
    }
    info.innerHTML = `<strong>${htmlEscape(text('Hvordan vinnerlisten sorteres', 'How the leaderboard is sorted'))}</strong><span>${htmlEscape(text('Listen viser beste poengsum først. Ved lik score rangeres høyeste level foran. Landmerket er basert på spillerens språk/landprofil, derfor vises aldri "ukjent".', 'The list shows highest score first. If scores tie, highest level ranks first. The country badge is based on the player language/country profile, so it never shows "unknown".'))}</span><em>${htmlEscape(text('Oppdateres automatisk ca. hvert 10. sekund når vinduet er åpent.', 'Auto-refreshes about every 10 seconds while open.'))}</em>`;
    decorateWinnerRows();
  }

  const previousShowWinnerBoardV70 = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof previousShowWinnerBoardV70 === 'function') {
    const showWinnerFixed = function showWinnerBoardV70() {
      enrichStoredBoards();
      const result = previousShowWinnerBoardV70.apply(this, arguments);
      setTimeout(() => { injectWinnerInfoV70(); decorateWinnerRows(); }, 80);
      clearInterval(v70WinnerRefreshTimer);
      v70WinnerRefreshTimer = setInterval(() => {
        const dialog = document.getElementById('winnerBoardModal');
        if (!dialog || !dialog.open) { clearInterval(v70WinnerRefreshTimer); v70WinnerRefreshTimer = null; return; }
        injectWinnerInfoV70();
        decorateWinnerRows();
      }, 10000);
      return result;
    };
    window.showWinnerBoard = globalThis.showWinnerBoard = showWinnerFixed;
    try { showWinnerBoard = showWinnerFixed; } catch (_) {}
  }

  const previousSaveChampionV70 = window.saveChampionWinner;
  if (typeof previousSaveChampionV70 === 'function') {
    window.saveChampionWinner = function saveChampionWinnerV70() {
      if (!getActiveName()) setNameRaw(makeAnonName());
      const result = previousSaveChampionV70.apply(this, arguments);
      setTimeout(() => { enrichStoredBoards(); injectWinnerInfoV70(); }, 150);
      return result;
    };
  }

  /* -------------------- 7) Feedback storage reinforcement -------------------- */
  function saveFeedbackBackupFromDialog() {
    const dialog = document.getElementById('v64FeedbackDialog');
    if (!dialog) return;
    const liked = dialog.querySelector('#v64Fb_liked')?.value?.trim() || '';
    const improve = dialog.querySelector('#v64Fb_improve')?.value?.trim() || '';
    const bug = dialog.querySelector('#v64Fb_bug')?.value?.trim() || '';
    if (!liked && !improve && !bug) return;
    const entry = {
      id: `fbv70_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      name: (dialog.querySelector('#v64FeedbackName')?.value || getActiveName() || text('Anonym spiller', 'Anonymous player')).slice(0, 18),
      rating: Number(dialog.querySelector('#v64FeedbackRating')?.value || 5),
      category: dialog.querySelector('#v64FeedbackCategory')?.value || 'fun',
      liked, improve, bug,
      score: Number(typeof score !== 'undefined' ? score : 0) || 0,
      level: Number(typeof levelIndex !== 'undefined' ? levelIndex + 1 : 1) || 1
    };
    const now = Date.now();
    const backup = [entry, ...safeReadArray(FEEDBACK_BACKUP_KEY)]
      .filter(item => item && now - Number(item.createdAt || 0) < COMMENT_TTL_V70)
      .slice(0, MAX_COMMENTS_V70);
    safeWriteArray(FEEDBACK_BACKUP_KEY, backup);
    // Also mirror into the original wall key so the existing UI sees it immediately.
    const wall = [entry, ...safeReadArray(FEEDBACK_KEY)]
      .filter(item => item && now - Number(item.createdAt || 0) < COMMENT_TTL_V70)
      .slice(0, MAX_COMMENTS_V70);
    safeWriteArray(FEEDBACK_KEY, wall);
  }

  function mergeFeedbackBackupToWall() {
    const now = Date.now();
    const merged = new Map();
    [...safeReadArray(FEEDBACK_KEY), ...safeReadArray(FEEDBACK_BACKUP_KEY)]
      .filter(item => item && now - Number(item.createdAt || 0) < COMMENT_TTL_V70)
      .forEach(item => merged.set(item.id || `${item.createdAt}_${item.name}`, item));
    const list = Array.from(merged.values()).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, MAX_COMMENTS_V70);
    safeWriteArray(FEEDBACK_KEY, list);
    const wall = document.getElementById('v64FeedbackWallList');
    if (!wall) return;
    if (!list.length) return;
    wall.innerHTML = list.map(item => {
      const date = new Date(Number(item.createdAt) || Date.now()).toLocaleString((typeof currentLanguage !== 'undefined' && currentLanguage === 'no') ? 'nb-NO' : undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const stars = '★'.repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)));
      return `<article class="v64-comment-bubble"><header><strong>${htmlEscape(item.name || text('Anonym', 'Anonymous'))}</strong><span>${stars}</span></header><small>${htmlEscape(date)} · ${htmlEscape(text('lagres i opptil 30 dager', 'stored up to 30 days'))}</small>${item.liked ? `<p><b>${htmlEscape(text('Likte:', 'Liked:'))}</b> ${htmlEscape(item.liked)}</p>` : ''}${item.improve ? `<p><b>${htmlEscape(text('Forbedring:', 'Improve:'))}</b> ${htmlEscape(item.improve)}</p>` : ''}${item.bug ? `<p><b>${htmlEscape(text('Feil:', 'Bug:'))}</b> ${htmlEscape(item.bug)}</p>` : ''}</article>`;
    }).join('');
  }

  document.addEventListener('submit', event => {
    if (event.target && event.target.id === 'v64FeedbackForm') {
      saveFeedbackBackupFromDialog();
      setTimeout(mergeFeedbackBackupToWall, 80);
    }
  }, true);

  function updateFeedbackInfoText() {
    const info = document.querySelector('.v64-feedback-info span');
    if (info) info.textContent = text('Kommentarer lagres lokalt i nettleseren i opptil 30 dager og vises i kommentarfeltet. Hvis sky-lagring er aktiv, forsøker spillet også å synke dem.', 'Comments are stored locally in the browser for up to 30 days and shown in the comment wall. If cloud storage is active, the game also tries to sync them.');
    mergeFeedbackBackupToWall();
  }

  /* -------------------- 8) Hide avatar summary card if no uploaded image -------------------- */
  function hideAvatarSummaryIfNoImage() {
    try {
      const avatar = document.getElementById('summaryAvatar');
      const card = avatar?.closest('.summary-card');
      const summary = document.getElementById('preGameSummary');
      const hasImage = Boolean(typeof selectedPlayerImage !== 'undefined' && selectedPlayerImage);
      if (card) card.classList.toggle('v70-hide-no-image', !hasImage);
      if (summary) summary.classList.toggle('v70-summary-three', !hasImage);
    } catch (_) {}
  }

  /* -------------------- 9) De-dupe repeated sounds -------------------- */
  const previousPlaySfxV70 = window.playSfx || (typeof playSfx === 'function' ? playSfx : null);
  if (typeof previousPlaySfxV70 === 'function') {
    const last = new Map();
    const playSfxFixed = function playSfxV70(type) {
      const now = performance.now ? performance.now() : Date.now();
      const key = String(type || 'default');
      if (now - Number(last.get(key) || 0) < 90) return;
      last.set(key, now);
      return previousPlaySfxV70.apply(this, arguments);
    };
    window.playSfx = globalThis.playSfx = playSfxFixed;
    try { playSfx = playSfxFixed; } catch (_) {}
  }

  /* -------------------- 10) Level transition state repair -------------------- */
  const previousNextLevelV70 = window.nextLevel || (typeof nextLevel === 'function' ? nextLevel : null);
  if (typeof previousNextLevelV70 === 'function') {
    const nextLevelFixed = function nextLevelV70() {
      const result = previousNextLevelV70.apply(this, arguments);
      [400, 1200, 2500, 3600].forEach(delay => setTimeout(() => {
        try {
          const countdownVisible = document.querySelector('.countdown-overlay:not(.hidden), #v64LevelCountdown:not(.hidden)');
          if (gameRunning && !countdownVisible && !document.getElementById('shopModal')?.open && !document.getElementById('v70QuitConfirmDialog')?.open) {
            paused = false;
            fixPauseButtonText();
            if (typeof window.v30UpdatePlayUi === 'function') window.v30UpdatePlayUi();
          }
          updateLaserHud();
        } catch (_) {}
      }, delay));
      return result;
    };
    window.nextLevel = globalThis.nextLevel = nextLevelFixed;
    try { nextLevel = nextLevelFixed; } catch (_) {}
  }

  function initV70() {
    setHowToTexts();
    ensureQuitConfirmDialog();
    ensureAnonDialog();
    ensureExtraShopItems();
    refreshShopUiV70();
    enrichStoredBoards();
    injectWinnerInfoV70();
    updateFeedbackInfoText();
    hideAvatarSummaryIfNoImage();
    updateLaserHud();
    fixPauseButtonText();
    if (!v70HudTimer) v70HudTimer = setInterval(() => {
      refreshShopUiV70();
      updateLaserHud();
      updateFeedbackInfoText();
      hideAvatarSummaryIfNoImage();
      decorateWinnerRows();
      fixPauseButtonText();
    }, 700);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initV70();
    [150, 500, 1200].forEach(delay => setTimeout(initV70, delay));
  });
  [200, 650, 1500].forEach(delay => setTimeout(initV70, delay));
})();

/* --------------------------------------------------------------------------
   V71: PC-safe winner flags
   Windows/desktop browsers often render emoji flags as regional letters like
   "NO". The leaderboard now uses real flag images with country-name fallback,
   so the result is the same on PC and phone.
   -------------------------------------------------------------------------- */
(function v71PcSafeWinnerFlags() {
  if (window.__ragiJoyV71PcSafeWinnerFlags) return;
  window.__ragiJoyV71PcSafeWinnerFlags = true;

  const BOARD_KEY = 'ragiJoyMazeLeaderboardV34';
  const LEGACY_BOARD_KEY = 'ragiJoyMazeWinnersV33';
  const DAILY_KEY = 'ragiJoyMazeDailyTop10V41';

  const LANGUAGE_COUNTRY = {
    no: { code: 'no', country: 'Norge' },
    en: { code: 'gb', country: 'United Kingdom' },
    ta: { code: 'lk', country: 'Sri Lanka' },
    si: { code: 'lk', country: 'Sri Lanka' },
    de: { code: 'de', country: 'Deutschland' },
    fr: { code: 'fr', country: 'France' },
    es: { code: 'es', country: 'España' },
    it: { code: 'it', country: 'Italia' },
    pt: { code: 'pt', country: 'Portugal' },
    nl: { code: 'nl', country: 'Nederland' },
    sv: { code: 'se', country: 'Sverige' },
    da: { code: 'dk', country: 'Danmark' },
    fi: { code: 'fi', country: 'Finland' },
    pl: { code: 'pl', country: 'Polska' },
    tr: { code: 'tr', country: 'Türkiye' },
    ar: { code: 'sa', country: 'Saudi Arabia' },
    hi: { code: 'in', country: 'India' },
    ur: { code: 'pk', country: 'Pakistan' },
    bn: { code: 'bd', country: 'Bangladesh' },
    zh: { code: 'cn', country: 'China' },
    ja: { code: 'jp', country: 'Japan' },
    ko: { code: 'kr', country: 'South Korea' },
    ru: { code: 'ru', country: 'Russia' },
    uk: { code: 'ua', country: 'Ukraine' },
    ro: { code: 'ro', country: 'România' },
    cs: { code: 'cz', country: 'Czechia' },
    el: { code: 'gr', country: 'Greece' },
    id: { code: 'id', country: 'Indonesia' },
    th: { code: 'th', country: 'Thailand' },
    vi: { code: 'vn', country: 'Vietnam' }
  };

  const COUNTRY_NAMES = Object.entries(LANGUAGE_COUNTRY).reduce((acc, [, value]) => {
    acc[value.code] = value.country;
    return acc;
  }, {
    no: 'Norge', gb: 'United Kingdom', uk: 'Ukraine', us: 'United States', lk: 'Sri Lanka'
  });

  const COUNTRY_ALIASES = {
    norge: 'no', norway: 'no', norsk: 'no', no: 'no', nor: 'no',
    'united kingdom': 'gb', england: 'gb', britain: 'gb', greatbritain: 'gb', gb: 'gb', uk: 'gb',
    'sri lanka': 'lk', srilanka: 'lk', lanka: 'lk', lk: 'lk',
    deutschland: 'de', germany: 'de', de: 'de',
    france: 'fr', fr: 'fr',
    espana: 'es', españa: 'es', spain: 'es', es: 'es',
    italia: 'it', italy: 'it', it: 'it',
    portugal: 'pt', pt: 'pt',
    nederland: 'nl', netherlands: 'nl', holland: 'nl', nl: 'nl',
    sverige: 'se', sweden: 'se', se: 'se', sv: 'se',
    danmark: 'dk', denmark: 'dk', dk: 'dk', da: 'dk',
    finland: 'fi', suomi: 'fi', fi: 'fi',
    polska: 'pl', poland: 'pl', pl: 'pl',
    türkiye: 'tr', turkiye: 'tr', turkey: 'tr', tr: 'tr',
    'saudi arabia': 'sa', arabia: 'sa', sa: 'sa',
    india: 'in', in: 'in',
    pakistan: 'pk', pk: 'pk',
    bangladesh: 'bd', bd: 'bd',
    china: 'cn', cn: 'cn',
    japan: 'jp', jp: 'jp',
    korea: 'kr', 'south korea': 'kr', kr: 'kr',
    russia: 'ru', ru: 'ru',
    ukraine: 'ua', ua: 'ua',
    romania: 'ro', românia: 'ro', ro: 'ro',
    czechia: 'cz', 'czech republic': 'cz', cz: 'cz',
    greece: 'gr', gr: 'gr',
    indonesia: 'id', id: 'id',
    thailand: 'th', th: 'th',
    vietnam: 'vn', vi: 'vn', vn: 'vn'
  };

  const escapeHtmlV71 = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function isNorwegianUi() {
    try { return (typeof currentLanguage !== 'undefined' ? currentLanguage : localStorage.getItem('ragiJoyLanguage')) === 'no'; }
    catch (_) { return true; }
  }

  function textV71(no, en) {
    return isNorwegianUi() ? no : en;
  }

  function readArrayV71(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function writeArrayV71(key, list) {
    try { localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : [])); } catch (_) {}
  }

  function normalizePlain(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  function codeFromEmojiFlag(value) {
    const chars = Array.from(String(value || ''));
    if (chars.length < 2) return '';
    const letters = chars.slice(0, 2).map(char => {
      const codePoint = char.codePointAt(0);
      if (codePoint < 0x1F1E6 || codePoint > 0x1F1FF) return '';
      return String.fromCharCode(97 + codePoint - 0x1F1E6);
    }).join('');
    return /^[a-z]{2}$/.test(letters) ? letters : '';
  }

  function normalizeCountryCode(value) {
    if (!value) return '';
    const emojiCode = codeFromEmojiFlag(value);
    if (emojiCode) return emojiCode;
    const raw = String(value).trim();
    if (/^[A-Z]{2}$/.test(raw) || /^[a-z]{2}$/.test(raw)) {
      const lower = raw.toLowerCase();
      if (lower === 'uk') return 'gb';
      return COUNTRY_ALIASES[lower] || lower;
    }
    const plain = normalizePlain(raw);
    return COUNTRY_ALIASES[plain] || COUNTRY_ALIASES[plain.replace(/\s/g, '')] || '';
  }

  function getLanguageProfileV71() {
    let lang = 'no';
    try { lang = (typeof currentLanguage !== 'undefined' && currentLanguage) || localStorage.getItem('ragiJoyLanguage') || 'no'; } catch (_) {}
    const fromMap = LANGUAGE_COUNTRY[lang];
    if (fromMap) return { ...fromMap, source: textV71('språkvalg', 'language setting') };
    try {
      const option = (Array.isArray(languageOptions) ? languageOptions : []).find(item => item && item.code === lang);
      const code = normalizeCountryCode(option?.country || option?.flag || option?.code) || 'no';
      return { code, country: option?.country || COUNTRY_NAMES[code] || textV71('Norge', 'Norway'), source: textV71('språkvalg', 'language setting') };
    } catch (_) {
      return { code: 'no', country: 'Norge', source: textV71('språkvalg', 'language setting') };
    }
  }

  function countryForEntryV71(entry) {
    const profile = getLanguageProfileV71();
    const code = normalizeCountryCode(entry?.countryCode)
      || normalizeCountryCode(entry?.isoCountry)
      || normalizeCountryCode(entry?.countryFlag)
      || normalizeCountryCode(entry?.country)
      || normalizeCountryCode(entry?.languageCode)
      || normalizeCountryCode(entry?.lang)
      || normalizeCountryCode(entry?.locale)
      || profile.code;
    const rawCountry = String(entry?.country || '').trim();
    const countryIsOnlyCode = /^[A-Z]{2}$/.test(rawCountry) || /^[a-z]{2}$/.test(rawCountry);
    const country = rawCountry && !countryIsOnlyCode && !codeFromEmojiFlag(rawCountry)
      ? rawCountry
      : (COUNTRY_NAMES[code] || profile.country || 'Global');
    return {
      code,
      country,
      source: entry?.countrySource || profile.source
    };
  }

  function flagImageUrl(code, size) {
    const safeCode = normalizeCountryCode(code) || 'no';
    return `https://flagcdn.com/w${size}/${safeCode}.png`;
  }

  function enrichEntryV71(entry) {
    const info = countryForEntryV71(entry || {});
    return {
      ...(entry || {}),
      countryCode: info.code,
      country: info.country,
      countrySource: info.source,
      // Keep this empty on purpose. Desktop Windows can show emoji flags as "NO".
      // The UI renders image flags instead.
      countryFlag: ''
    };
  }

  function enrichBoardsV71() {
    [BOARD_KEY, LEGACY_BOARD_KEY, DAILY_KEY].forEach(key => {
      const oldList = readArrayV71(key);
      if (!oldList.length) return;
      const newList = oldList.map(enrichEntryV71);
      if (JSON.stringify(oldList) !== JSON.stringify(newList)) writeArrayV71(key, newList);
    });
  }

  function sortedBoardV71() {
    return readArrayV71(BOARD_KEY)
      .map(enrichEntryV71)
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

  function sortedDailyV71() {
    return readArrayV71(DAILY_KEY)
      .map(enrichEntryV71)
      .filter(entry => entry && Number(entry.score) > 0)
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
      .slice(0, 10);
  }

  function renderFlagBadgeV71(badge, info) {
    const country = info.country || COUNTRY_NAMES[info.code] || 'Global';
    const code = normalizeCountryCode(info.code) || 'no';
    badge.className = 'v70-country-badge v71-country-badge';
    badge.dataset.countryCode = code;
    badge.title = textV71(`Landprofil: ${country}`, `Country profile: ${country}`);
    badge.innerHTML = `
      <img class="v71-flag-img" src="${flagImageUrl(code, 40)}" srcset="${flagImageUrl(code, 80)} 2x" alt="${escapeHtmlV71(country)} flagg" loading="lazy" decoding="async">
      <span>${escapeHtmlV71(country)}</span>`;
    const img = badge.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        badge.classList.add('v71-flag-failed');
        img.remove();
        if (!badge.querySelector('.v71-fallback-globe')) {
          const fallback = document.createElement('span');
          fallback.className = 'v71-fallback-globe';
          fallback.textContent = '🌐';
          badge.prepend(fallback);
        }
      }, { once: true });
    }
  }

  function decorateRowV71(row, entry) {
    if (!row) return;
    const info = countryForEntryV71(entry || {});
    const existing = Array.from(row.querySelectorAll('.v70-country-badge, .v71-country-badge'));
    const badge = existing.shift() || document.createElement('span');
    existing.forEach(extra => extra.remove());
    renderFlagBadgeV71(badge, info);
    const target = row.querySelector('.v42-player-cell small')
      || row.querySelector('.winner-meta')
      || row.querySelector('.winner-name')
      || row.querySelector('small')
      || row;
    if (target && badge.parentElement !== target) target.appendChild(badge);
  }

  function decorateWinnerRowsV71() {
    enrichBoardsV71();
    const boardEntries = sortedBoardV71();
    const dailyEntries = sortedDailyV71();
    Array.from(document.querySelectorAll('#winnerList .winner-row')).forEach((row, index) => decorateRowV71(row, boardEntries[index]));
    Array.from(document.querySelectorAll('#dailyTopPanel li, .v42-daily-list li, .v41-daily-list li')).forEach((row, index) => decorateRowV71(row, dailyEntries[index] || boardEntries[index]));
  }

  function updateWinnerInfoV71() {
    const info = document.getElementById('v70WinnerInfoBox');
    if (info) {
      info.innerHTML = `<strong>${escapeHtmlV71(textV71('Hvordan vinnerlisten sorteres', 'How the leaderboard is sorted'))}</strong><span>${escapeHtmlV71(textV71('Listen viser høyeste score først. Ved lik score rangeres høyeste level foran. Flagg vises som bilde slik at PC ikke viser landkode som NO.', 'The list shows highest score first. If scores tie, highest level ranks first. Flags are shown as images so desktop PCs do not show country codes like NO.'))}</span><em>${escapeHtmlV71(textV71('Landprofilen hentes fra språk/land-valget ditt og fungerer likt på PC og telefon.', 'The country profile comes from your language/country setting and works the same on PC and phone.'))}</em>`;
    }
  }

  // Store future results with countryCode immediately, even when older save-functions run.
  try {
    const previousSetItem = Storage.prototype.setItem;
    if (!previousSetItem.__v71WinnerFlagWrapped) {
      Storage.prototype.setItem = function setItemV71(key, value) {
        if ([BOARD_KEY, LEGACY_BOARD_KEY, DAILY_KEY].includes(String(key))) {
          try {
            const parsed = JSON.parse(String(value));
            if (Array.isArray(parsed)) return previousSetItem.call(this, key, JSON.stringify(parsed.map(enrichEntryV71)));
          } catch (_) {}
        }
        return previousSetItem.call(this, key, value);
      };
      Storage.prototype.setItem.__v71WinnerFlagWrapped = true;
    }
  } catch (_) {}

  const previousShowWinnerBoardV71 = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof previousShowWinnerBoardV71 === 'function') {
    const showWinnerBoardV71 = function showWinnerBoardV71() {
      enrichBoardsV71();
      const result = previousShowWinnerBoardV71.apply(this, arguments);
      [0, 60, 180, 500].forEach(delay => setTimeout(() => {
        updateWinnerInfoV71();
        decorateWinnerRowsV71();
      }, delay));
      return result;
    };
    window.showWinnerBoard = globalThis.showWinnerBoard = showWinnerBoardV71;
    try { showWinnerBoard = showWinnerBoardV71; } catch (_) {}
  }

  window.ragiJoyFixWinnerFlagsNow = function ragiJoyFixWinnerFlagsNow() {
    enrichBoardsV71();
    updateWinnerInfoV71();
    decorateWinnerRowsV71();
  };

  document.addEventListener('DOMContentLoaded', () => {
    enrichBoardsV71();
    [100, 400, 1000].forEach(delay => setTimeout(() => {
      updateWinnerInfoV71();
      decorateWinnerRowsV71();
    }, delay));
  });
  setInterval(() => {
    const dialog = document.getElementById('winnerBoardModal');
    if (dialog && dialog.open) {
      updateWinnerInfoV71();
      decorateWinnerRowsV71();
    }
  }, 1500);
})();



/* --------------------------------------------------------------------------
   V72: stable inline shop coach + hide feedback during gameplay +
   reliable auto laser placement button.
   -------------------------------------------------------------------------- */
(function v72GameplayPolish(){
  if (window.__ragiJoyV72Patch) return;
  window.__ragiJoyV72Patch = true;

  function v72No(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function v72Text(no, en){ return v72No() ? no : en; }
  function v72Esc(v){
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function v72EnsureInlineCoach(){
    let coach = document.getElementById('v72InlineShopCoach');
    const shopButton = document.getElementById('shopButton');
    if (!shopButton) return null;
    const row = shopButton.closest('.top-actions') || shopButton.parentElement;
    if (!row) return null;
    if (!coach) {
      coach = document.createElement('div');
      coach.id = 'v72InlineShopCoach';
      coach.className = 'v72-inline-shop-coach hidden';
      coach.setAttribute('aria-hidden', 'true');
      coach.innerHTML = '<div class="v72-inline-shop-coach-bubble"><strong class="v72-inline-shop-coach-title"></strong><span class="v72-inline-shop-coach-text"></span></div>';
    }
    if (coach.parentElement !== row) {
      const after = shopButton.nextElementSibling;
      if (after) after.insertAdjacentElement('afterend', coach);
      else row.appendChild(coach);
    }
    return coach;
  }

  function v72ShouldShowCoach(){
    try {
      const shopButton = document.getElementById('shopButton');
      const shopModal = document.getElementById('shopModal');
      if (!shopButton || shopButton.hidden || shopButton.disabled) return false;
      if (!gameRunning || paused || onlineMode) return false;
      if (shopModal && (shopModal.open || shopModal.hasAttribute('open'))) return false;
      const threshold = (typeof V23_SHOP_COSTS === 'object' && V23_SHOP_COSTS)
        ? Math.min(...Object.values(V23_SHOP_COSTS).filter(v => Number.isFinite(Number(v))))
        : 650;
      return Number(score || 0) >= Number(threshold || 650);
    } catch(_) {
      return false;
    }
  }

  function v72RefreshInlineCoach(){
    const legacy = document.getElementById('v62ShopCoach');
    if (legacy) legacy.classList.add('hidden');
    const coach = v72EnsureInlineCoach();
    if (!coach) return;
    const title = coach.querySelector('.v72-inline-shop-coach-title');
    const text = coach.querySelector('.v72-inline-shop-coach-text');
    if (title) title.textContent = v72Text('🛒 POWER-TIPS', '🛒 POWER TIPS');
    if (text) text.textContent = v72Text(
      'Du har nok poeng! Kjøp noe i Power-butikken og vinn lettere 🚀',
      'You have enough points! Buy something in the Power shop and make the run easier 🚀'
    );
    const show = v72ShouldShowCoach();
    coach.classList.toggle('hidden', !show);
    coach.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  function v72SyncFeedbackVisibility(){
    const button = document.getElementById('v64FeedbackButton');
    if (!button) return;
    const endScreen = document.getElementById('endScreen');
    const endVisible = !!(endScreen && !endScreen.classList.contains('hidden'));
    const shouldHide = Boolean(gameRunning && !paused && !endVisible);
    button.hidden = shouldHide;
    if (shouldHide) {
      const dialog = document.getElementById('v64FeedbackDialog');
      if (dialog && (dialog.open || dialog.hasAttribute('open'))) {
        try { dialog.close(); } catch(_) { dialog.removeAttribute('open'); }
      }
    }
  }

  function v72EnsureAutoTurretButton(){
    const shopCard = document.querySelector('#shopModal .shop-card');
    if (!shopCard) return null;
    let btn = document.getElementById('v72AutoPlaceTurretButton');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'v72AutoPlaceTurretButton';
      btn.type = 'button';
      btn.className = 'shop-place-button v70-auto-place-button';
      btn.addEventListener('click', () => {
        try {
          const inv = Number(v23TurretInventory || 0);
          if (inv <= 0) {
            if (messageBar) messageBar.textContent = v72Text('Du må kjøpe laser først.', 'You need to buy lasers first.');
            return;
          }
          const placed = (typeof v70AutoPlaceTurrets === 'function') ? v70AutoPlaceTurrets(inv) : 0;
          if (!placed && messageBar) messageBar.textContent = v72Text('Fant ingen trygg tom rute for auto-plassering akkurat nå.', 'No safe empty tile was found for auto placement right now.');
        } catch(_) {}
        setTimeout(v72RefreshAutoTurretButton, 60);
        if (typeof updateLaserHud === 'function') setTimeout(updateLaserHud, 70);
      });
    }
    const manual = document.getElementById('placeTurretButton') || document.getElementById('shopPlaceTurretButton');
    if (manual) {
      if (btn.parentElement !== manual.parentElement || btn.previousElementSibling !== manual) {
        manual.insertAdjacentElement('afterend', btn);
      }
      manual.textContent = v72Text('🎯 Plasser laser selv', '🎯 Place laser manually');
    } else if (btn.parentElement !== shopCard) {
      shopCard.appendChild(btn);
    }
    return btn;
  }

  function v72RefreshAutoTurretButton(){
    const btn = v72EnsureAutoTurretButton();
    if (!btn) return;
    const inv = Number((typeof v23TurretInventory !== 'undefined' ? v23TurretInventory : 0) || 0);
    btn.textContent = v72Text(`🤖 Auto-plasser laser (${inv})`, `🤖 Auto-place lasers (${inv})`);
    btn.disabled = Boolean(onlineMode) || !gameRunning || inv <= 0;
    btn.hidden = Boolean(onlineMode);
  }

  function v72PatchShopOpeners(){
    const prevOpen = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
    if (typeof prevOpen === 'function' && !prevOpen.__v72Wrapped) {
      const wrappedOpen = function openPowerShopV72(){
        const result = prevOpen.apply(this, arguments);
        setTimeout(() => { v72EnsureAutoTurretButton(); v72RefreshAutoTurretButton(); v72RefreshInlineCoach(); }, 40);
        return result;
      };
      wrappedOpen.__v72Wrapped = true;
      window.openPowerShop = globalThis.openPowerShop = wrappedOpen;
      try { openPowerShop = wrappedOpen; } catch(_) {}
    }

    const prevClose = window.closePowerShop || (typeof closePowerShop === 'function' ? closePowerShop : null);
    if (typeof prevClose === 'function' && !prevClose.__v72Wrapped) {
      const wrappedClose = function closePowerShopV72(){
        const result = prevClose.apply(this, arguments);
        setTimeout(v72RefreshInlineCoach, 30);
        return result;
      };
      wrappedClose.__v72Wrapped = true;
      window.closePowerShop = globalThis.closePowerShop = wrappedClose;
      try { closePowerShop = wrappedClose; } catch(_) {}
    }
  }

  function v72PatchTurretBuyers(){
    const prevBuy = window.buyShopItem || (typeof buyShopItem === 'function' ? buyShopItem : null);
    if (typeof prevBuy === 'function' && !prevBuy.__v72Wrapped) {
      const wrappedBuy = function buyShopItemV72(item){
        const before = Number((typeof v23TurretInventory !== 'undefined' ? v23TurretInventory : 0) || 0);
        const result = prevBuy.apply(this, arguments);
        const key = String(item || '').toLowerCase();
        if (key === 'turret') {
          const tryAuto = (attempt = 0) => {
            const after = Number((typeof v23TurretInventory !== 'undefined' ? v23TurretInventory : 0) || 0);
            const delta = Math.max(0, after - before);
            if (delta > 0 && typeof v70AutoPlaceTurrets === 'function') {
              v70AutoPlaceTurrets(delta);
            } else if (attempt < 5) {
              setTimeout(() => tryAuto(attempt + 1), 80);
            }
            v72RefreshAutoTurretButton();
            if (typeof updateLaserHud === 'function') updateLaserHud();
          };
          setTimeout(() => tryAuto(0), 70);
        } else {
          setTimeout(v72RefreshAutoTurretButton, 70);
        }
        return result;
      };
      wrappedBuy.__v72Wrapped = true;
      window.buyShopItem = globalThis.buyShopItem = wrappedBuy;
      try { buyShopItem = wrappedBuy; } catch(_) {}
    }

    const prevPack = window.buyTurretPack || (typeof buyTurretPack === 'function' ? buyTurretPack : null);
    if (typeof prevPack === 'function' && !prevPack.__v72Wrapped) {
      const wrappedPack = function buyTurretPackV72(){
        const before = Number((typeof v23TurretInventory !== 'undefined' ? v23TurretInventory : 0) || 0);
        const result = prevPack.apply(this, arguments);
        const tryAuto = (attempt = 0) => {
          const after = Number((typeof v23TurretInventory !== 'undefined' ? v23TurretInventory : 0) || 0);
          const delta = Math.max(0, after - before);
          if (delta > 0 && typeof v70AutoPlaceTurrets === 'function') {
            v70AutoPlaceTurrets(delta);
          } else if (attempt < 5) {
            setTimeout(() => tryAuto(attempt + 1), 90);
          }
          v72RefreshAutoTurretButton();
          if (typeof updateLaserHud === 'function') updateLaserHud();
        };
        setTimeout(() => tryAuto(0), 80);
        return result;
      };
      wrappedPack.__v72Wrapped = true;
      window.buyTurretPack = globalThis.buyTurretPack = wrappedPack;
      try { buyTurretPack = wrappedPack; } catch(_) {}
    }
  }

  function v72Install(){
    v72EnsureInlineCoach();
    v72EnsureAutoTurretButton();
    v72RefreshInlineCoach();
    v72RefreshAutoTurretButton();
    v72SyncFeedbackVisibility();
  }

  v72PatchShopOpeners();
  v72PatchTurretBuyers();
  document.addEventListener('DOMContentLoaded', v72Install);
  setTimeout(v72Install, 350);
  setInterval(() => {
    v72RefreshInlineCoach();
    v72RefreshAutoTurretButton();
    v72SyncFeedbackVisibility();
  }, 700);
})();



/* --------------------------------------------------------------------------
   V73: winner board layout repair
   - no inner scrolling in the winner list
   - winner list placed first, daily list below
   - modal itself scrolls if content is taller than viewport
   -------------------------------------------------------------------------- */
(function v73WinnerBoardRepair(){
  if (window.__ragiJoyV73Patch) return;
  window.__ragiJoyV73Patch = true;

  function v73EnsureDailyPanel(card){
    let panel = document.getElementById('dailyTopPanel');
    if (!panel && card) {
      panel = document.createElement('section');
      panel.id = 'dailyTopPanel';
      panel.className = 'v41-daily-panel v42-daily-panel';
      card.appendChild(panel);
    }
    return panel;
  }

  function v73LayoutWinnerBoard(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
    const panel = v73EnsureDailyPanel(card);
    if (!card || !list || !panel) return;

    let layout = card.querySelector('.v73-winner-layout');
    if (!layout) {
      layout = document.createElement('div');
      layout.className = 'v73-winner-layout';
      const info70 = document.getElementById('v70WinnerInfoBox');
      const info64 = document.getElementById('v64WinnerInfoBox');
      const anchor = info70 || info64;
      if (anchor && anchor.parentElement === card) anchor.insertAdjacentElement('afterend', layout);
      else if (list.parentElement === card) card.insertBefore(layout, list);
      else card.appendChild(layout);
    }

    if (list.parentElement !== layout) layout.appendChild(list);
    if (panel.parentElement !== layout) layout.appendChild(panel);

    dialog.style.overflow = 'auto';
    card.style.overflow = 'visible';
    card.style.maxHeight = 'none';
    list.style.maxHeight = 'none';
    list.style.overflow = 'visible';
    panel.style.maxHeight = 'none';
    panel.style.overflow = 'visible';
  }

  const prevShow = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof prevShow === 'function' && !prevShow.__v73Wrapped) {
    const wrapped = function showWinnerBoardV73(){
      const result = prevShow.apply(this, arguments);
      [0, 60, 180, 450].forEach(delay => setTimeout(v73LayoutWinnerBoard, delay));
      return result;
    };
    wrapped.__v73Wrapped = true;
    window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
    try { showWinnerBoard = wrapped; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(v73LayoutWinnerBoard, 250));
  setInterval(() => {
    const dialog = document.getElementById('winnerBoardModal');
    if (dialog && (dialog.open || dialog.hasAttribute('open'))) v73LayoutWinnerBoard();
  }, 1500);
})();



/* --------------------------------------------------------------------------
   V74: focused fixes requested by user only
   - pause layout stable
   - power shop duplicate auto buttons removed and positioned correctly
   - portal (blue next-level tile) placed randomly again
   - restore time-on-site and current-date summary boxes
   -------------------------------------------------------------------------- */
(function v74FocusedFix(){
  if (window.__ragiJoyV74Patch) return;
  window.__ragiJoyV74Patch = true;

  function v74No(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function v74Text(no, en){ return v74No() ? no : en; }

  /* ---------- 1) Random portal placement ---------- */
  function v74FindPortalSpot(){
    const empty = [];
    try {
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          if (!map[y]) continue;
          if (map[y][x] !== TILE.EMPTY) continue;
          if (player && player.x === x && player.y === y) continue;
          if (Array.isArray(enemies) && enemies.some(e => e.x === x && e.y === y)) continue;
          empty.push({ x, y });
        }
      }
    } catch(_) {}
    if (!empty.length) return { x: 6, y: 5 };
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function v74OpenPortal(){
    try {
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          if (map[y][x] === TILE.PORTAL) map[y][x] = TILE.EMPTY;
        }
      }
      portalOpen = true;
      const spot = v74FindPortalSpot();
      if (!map[spot.y]) map[spot.y] = [];
      map[spot.y][spot.x] = TILE.PORTAL;
      if (messageBar) messageBar.textContent = t('portalOpen');
      if (typeof spawnPop === 'function') spawnPop('🌀', spot.x, spot.y);
      if (typeof spawnCenterBurst === 'function') spawnCenterBurst('🌀 PORTAL!');
      if (typeof playSfx === 'function') playSfx('portal');
      if (typeof drawGame === 'function') drawGame();
    } catch(_) {}
  }
  window.openPortal = globalThis.openPortal = v74OpenPortal;
  try { openPortal = v74OpenPortal; } catch(_) {}

  /* ---------- 2) Clean power shop action buttons ---------- */
  function v74CleanupShopButtons(){
    const modal = document.getElementById('shopModal');
    const card = modal && modal.querySelector('.shop-card');
    if (!card) return;

    const manual = document.getElementById('placeTurretButton') || document.getElementById('shopPlaceTurretButton');
    const hint = document.getElementById('shopHint');

    const oldButtons = Array.from(card.querySelectorAll('#v70AutoPlaceTurretButton, #v72AutoPlaceTurretButton, #v74AutoPlaceTurretButton'));
    let canonical = oldButtons.find(btn => btn.id === 'v74AutoPlaceTurretButton') || oldButtons[0] || null;

    if (!canonical) {
      canonical = document.createElement('button');
      canonical.type = 'button';
      canonical.id = 'v74AutoPlaceTurretButton';
      canonical.className = 'shop-place-button v74-auto-place-button';
      canonical.addEventListener('click', () => {
        try {
          const inv = Number(v23TurretInventory || 0);
          if (inv <= 0) {
            if (messageBar) messageBar.textContent = v74Text('Du må kjøpe laser først.', 'You need to buy lasers first.');
            return;
          }
          if (typeof v70AutoPlaceTurrets === 'function') v70AutoPlaceTurrets(inv);
          if (typeof updateLaserHud === 'function') updateLaserHud();
        } catch(_) {}
        setTimeout(v74CleanupShopButtons, 40);
      });
    }

    oldButtons.forEach(btn => { if (btn !== canonical) btn.remove(); });
    canonical.id = 'v74AutoPlaceTurretButton';

    let actionRow = card.querySelector('.shop-action-row');
    if (!actionRow) {
      actionRow = document.createElement('div');
      actionRow.className = 'shop-action-row';
      if (hint) card.insertBefore(actionRow, hint);
      else card.appendChild(actionRow);
    }

    if (manual) {
      manual.textContent = v74Text('🎯 Plasser laser selv', '🎯 Place laser manually');
      if (manual.parentElement !== actionRow) actionRow.appendChild(manual);
    }
    canonical.textContent = v74Text(`🤖 Auto-plasser laser (${Number(v23TurretInventory || 0)})`, `🤖 Auto-place lasers (${Number(v23TurretInventory || 0)})`);
    canonical.disabled = Boolean(onlineMode) || !gameRunning || Number(v23TurretInventory || 0) <= 0;
    if (canonical.parentElement !== actionRow) actionRow.appendChild(canonical);

    if (hint && hint.parentElement !== card) card.appendChild(hint);
  }

  const v74PrevOpenShop = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
  if (typeof v74PrevOpenShop === 'function' && !v74PrevOpenShop.__v74Wrapped) {
    const wrappedOpen = function openPowerShopV74(){
      const result = v74PrevOpenShop.apply(this, arguments);
      [20, 80, 180].forEach(delay => setTimeout(v74CleanupShopButtons, delay));
      return result;
    };
    wrappedOpen.__v74Wrapped = true;
    window.openPowerShop = globalThis.openPowerShop = wrappedOpen;
    try { openPowerShop = wrappedOpen; } catch(_) {}
  }

  /* ---------- 3) Restore time and date cards on menu ---------- */
  let v74VisitStartedAt = Date.now();

  function v74EnsureSummaryBadges(){
    const summary = document.getElementById('preGameSummary') || document.querySelector('.pre-game-summary');
    if (!summary) return {};

    let timeBadge = document.getElementById('v74SessionBadge');
    if (!timeBadge) {
      timeBadge = document.createElement('div');
      timeBadge.id = 'v74SessionBadge';
      timeBadge.className = 'summary-card v74-session-badge';
      summary.appendChild(timeBadge);
    }

    let dateBadge = document.getElementById('v74DateBadge');
    if (!dateBadge) {
      dateBadge = document.createElement('div');
      dateBadge.id = 'v74DateBadge';
      dateBadge.className = 'summary-card v74-date-badge';
      summary.appendChild(dateBadge);
    }
    return { summary, timeBadge, dateBadge };
  }

  function v74FormatDuration(ms){
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}t ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
    return `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
  }

  function v74RefreshSummaryBadges(){
    const bits = v74EnsureSummaryBadges();
    if (!bits.timeBadge || !bits.dateBadge) return;
    const now = new Date();
    bits.timeBadge.innerHTML = `<span>${v74Text('⏳ På nettsiden', '⏳ Time on site')}</span><strong>${v74FormatDuration(Date.now() - v74VisitStartedAt)}</strong>`;
    bits.dateBadge.innerHTML = `<span>${v74Text('📅 Dagens dato', '📅 Today')}</span><strong>${now.toLocaleDateString(v74No() ? 'nb-NO' : undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</strong>`;
  }

  /* ---------- 4) Keep pause action row stable ---------- */
  function v74StabilizePausedActions(){
    const row = document.querySelector('.top-actions');
    if (!row) return;
    const ids = ['pauseButton', 'menuFromPauseButton', 'endRunButton', 'soundButton', 'shopButton'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentElement === row) row.appendChild(el);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    v74RefreshSummaryBadges();
    v74CleanupShopButtons();
    v74StabilizePausedActions();
  });

  setTimeout(() => {
    v74RefreshSummaryBadges();
    v74CleanupShopButtons();
    v74StabilizePausedActions();
  }, 300);

  setInterval(() => {
    v74RefreshSummaryBadges();
    v74StabilizePausedActions();
    const modal = document.getElementById('shopModal');
    if (modal && (modal.open || modal.hasAttribute('open'))) v74CleanupShopButtons();
  }, 1000);
})();


/* --------------------------------------------------------------------------
   V75: Top 10 vinnerresultat only
   - desktop layout with Top 10 and Dagens Top 10 side by side
   - no inner scrolling in the winner lists on PC
   - compact filters: all / Top 10 / today / my player
   -------------------------------------------------------------------------- */
(function v75WinnerBoardOnlyPatch(){
  if (window.__ragiJoyV75WinnerBoardPatch) return;
  window.__ragiJoyV75WinnerBoardPatch = true;

  function v75IsNo(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }

  function v75Text(no, en){
    return v75IsNo() ? no : en;
  }

  function v75GetPlayerName(){
    const selectors = [
      '#playerName',
      '#playerNameDisplay',
      '#playerDisplayName',
      '.player-name',
      '.player-card strong',
      '.player-card .value',
      '[data-player-name]'
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const txt = el && (el.value || el.textContent || el.getAttribute('data-player-name') || '').trim();
      if (txt && !/^(spiller|player)$/i.test(txt)) return txt;
    }
    try {
      const saved = localStorage.getItem('ragiJoyMazePreferredNameV34') || localStorage.getItem('ragiJoyPlayerName');
      if (saved) return saved.replace(/^"|"$/g, '').trim();
    } catch(_) {}
    return '';
  }

  function v75EnsureControlPanel(card){
    if (!card) return null;
    let panel = document.getElementById('v75WinnerControlPanel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'v75WinnerControlPanel';
      panel.className = 'v75-winner-control';
      panel.innerHTML = `
        <div class="v75-winner-control-text">
          <strong>${v75Text('Ryddig Top 10-visning', 'Clean Top 10 view')}</strong>
          <span>${v75Text('Listen viser plassering, spiller, level, flagg og score. Bruk filter hvis du bare vil se én del.', 'The list shows rank, player, level, flag and score. Use filters if you only want one section.')}</span>
        </div>
        <div id="v75WinnerFilters" class="v75-winner-filters" role="group" aria-label="Winner filters">
          <button type="button" data-v75-filter="all">${v75Text('Alt', 'All')}</button>
          <button type="button" data-v75-filter="global">${v75Text('Top 10', 'Top 10')}</button>
          <button type="button" data-v75-filter="daily">${v75Text('Dagens', 'Today')}</button>
          <button type="button" data-v75-filter="mine">${v75Text('Meg', 'Me')}</button>
        </div>
      `;
      const subtitle = document.getElementById('winnersSubtitle');
      if (subtitle && subtitle.parentElement === card) subtitle.insertAdjacentElement('afterend', panel);
      else {
        const title = document.getElementById('winnersTitle');
        if (title && title.parentElement === card) title.insertAdjacentElement('afterend', panel);
        else card.prepend(panel);
      }
    }

    const buttons = panel.querySelectorAll('[data-v75-filter]');
    buttons.forEach(button => {
      if (button.dataset.v75Bound) return;
      button.dataset.v75Bound = '1';
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-v75-filter') || 'all';
        v75ApplyFilter(filter);
      });
    });

    const text = panel.querySelector('.v75-winner-control-text span');
    if (text) {
      text.textContent = v75Text(
        'Listen viser plassering, spiller, level, flagg og score. Bruk filter hvis du bare vil se én del.',
        'The list shows rank, player, level, flag and score. Use filters if you only want one section.'
      );
    }
    return panel;
  }

  function v75FindMainCard(dialog){
    if (!dialog) return null;
    return dialog.querySelector('.winner-card') || dialog;
  }

  function v75EnsureLayout(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = v75FindMainCard(dialog);
    const list = document.getElementById('winnerList');
    let daily = document.getElementById('dailyTopPanel');
    if (!card || !list) return;

    if (!daily) {
      daily = document.createElement('section');
      daily.id = 'dailyTopPanel';
      daily.className = 'v41-daily-panel v42-daily-panel';
    }

    dialog.classList.add('v75-winner-modal');
    card.classList.add('v75-winner-card');
    list.classList.add('v75-winner-list');
    daily.classList.add('v75-daily-panel');

    v75EnsureControlPanel(card);

    // Hide older explanation boxes that took too much space and caused the layout to scroll.
    card.querySelectorAll('#v64WinnerInfoBox, #v70WinnerInfoBox, .v64-winner-info, .v70-winner-info').forEach(el => {
      if (el.id !== 'v75WinnerControlPanel') el.classList.add('v75-hidden-legacy-info');
    });

    let layout = card.querySelector('.v75-winner-grid') || card.querySelector('.v73-winner-layout') || card.querySelector('.v65-winner-grid');
    if (!layout) {
      layout = document.createElement('div');
      layout.className = 'v75-winner-grid';
      const control = document.getElementById('v75WinnerControlPanel');
      if (control && control.parentElement === card) control.insertAdjacentElement('afterend', layout);
      else card.appendChild(layout);
    }
    layout.classList.add('v75-winner-grid');
    // Keep older layout classes so older interval patches reuse the same element instead of creating duplicates.

    if (list.parentElement !== layout) layout.appendChild(list);
    if (daily.parentElement !== layout) layout.appendChild(daily);

    // Inline style cleanup from older patches so CSS can control the board.
    [dialog, card, layout, list, daily].forEach(el => {
      if (!el) return;
      el.style.overflow = '';
      el.style.maxHeight = '';
      el.style.height = '';
    });

    v75CompactRows();
    v75ApplyFilter(dialog.dataset.v75Filter || 'all');
  }

  function v75CompactRows(){
    const list = document.getElementById('winnerList');
    if (list) {
      list.querySelectorAll('.winner-row, li').forEach((row, index) => {
        row.classList.add('v75-compact-row');
        row.dataset.v75Index = String(index + 1);
        const score = row.querySelector('.winner-score, .v42-score, strong:last-child');
        if (score) score.setAttribute('title', v75Text('Score', 'Score'));
      });
    }

    const daily = document.getElementById('dailyTopPanel');
    if (daily) {
      daily.querySelectorAll('ol li').forEach((row, index) => {
        row.classList.add('v75-compact-daily-row');
        row.dataset.v75Index = String(index + 1);
      });
    }
  }

  function v75ApplyFilter(filter){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const selected = filter || 'all';
    dialog.dataset.v75Filter = selected;

    dialog.classList.toggle('v75-filter-all', selected === 'all');
    dialog.classList.toggle('v75-filter-global', selected === 'global');
    dialog.classList.toggle('v75-filter-daily', selected === 'daily');
    dialog.classList.toggle('v75-filter-mine', selected === 'mine');

    const buttons = dialog.querySelectorAll('[data-v75-filter]');
    buttons.forEach(button => {
      const active = button.getAttribute('data-v75-filter') === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const playerName = v75GetPlayerName().toLowerCase();
    const rows = dialog.querySelectorAll('#winnerList .winner-row, #winnerList li, #dailyTopPanel ol li');
    rows.forEach(row => {
      row.classList.remove('v75-mine-hidden');
      if (selected === 'mine') {
        const text = (row.textContent || '').toLowerCase();
        const visible = playerName && text.includes(playerName);
        row.classList.toggle('v75-mine-hidden', !visible);
      }
    });

    let empty = document.getElementById('v75MineEmpty');
    if (selected === 'mine') {
      if (!empty) {
        empty = document.createElement('div');
        empty.id = 'v75MineEmpty';
        empty.className = 'v75-mine-empty';
        empty.textContent = v75Text('Fant ingen synlig score for din spiller i denne listen ennå.', 'No visible score for your player in this list yet.');
        const layout = dialog.querySelector('.v75-winner-grid');
        if (layout) layout.appendChild(empty);
      }
      const hasVisible = Array.from(rows).some(row => !row.classList.contains('v75-mine-hidden'));
      empty.hidden = hasVisible;
    } else if (empty) {
      empty.hidden = true;
    }
  }

  function v75RefreshSoon(){
    [0, 50, 150, 350].forEach(delay => setTimeout(v75EnsureLayout, delay));
  }

  const prevShow = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof prevShow === 'function' && !prevShow.__v75Wrapped) {
    const wrapped = function showWinnerBoardV75(){
      const result = prevShow.apply(this, arguments);
      v75RefreshSoon();
      return result;
    };
    wrapped.__v75Wrapped = true;
    window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
    try { showWinnerBoard = wrapped; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(v75EnsureLayout, 300));

  let v75Interval = null;
  document.addEventListener('click', event => {
    const btn = event.target && event.target.closest && event.target.closest('#winnerBoardButton, [onclick*="showWinnerBoard"]');
    if (btn) v75RefreshSoon();
  }, true);

  v75Interval = setInterval(() => {
    const dialog = document.getElementById('winnerBoardModal');
    if (dialog && (dialog.open || dialog.hasAttribute('open'))) v75EnsureLayout();
  }, 700);

  try {
    const observer = new MutationObserver(() => {
      const dialog = document.getElementById('winnerBoardModal');
      if (dialog && (dialog.open || dialog.hasAttribute('open'))) setTimeout(v75EnsureLayout, 30);
    });
    document.addEventListener('DOMContentLoaded', () => {
      const dialog = document.getElementById('winnerBoardModal');
      if (dialog) observer.observe(dialog, { childList: true, subtree: true });
    });
  } catch(_) {}
})();




/* --------------------------------------------------------------------------
   V76: focused gameplay/pause + power-shop stability patch
   - no repeated shaking shop popups
   - stable pause/action layout
   - one clean manual laser button + one clean auto laser button
   -------------------------------------------------------------------------- */
(function v76GameplayShopPolish(){
  if (window.__ragiJoyV76GameplayShopPatch) return;
  window.__ragiJoyV76GameplayShopPatch = true;

  function isNo(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function txt(no, en){ return isNo() ? no : en; }

  let v76TipCount = 0;
  let v76LastTipAt = 0;
  function disableOldTipBubbles(){
    document.querySelectorAll('#v62ShopCoach, #v72InlineShopCoach, .v62-shop-coach, .v72-inline-shop-coach').forEach(el => {
      el.classList.add('hidden');
      el.setAttribute('aria-hidden', 'true');
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
      el.style.animation = 'none';
      el.style.transform = 'none';
    });
  }

  function maybeShowQuietShopInfo(){
    try {
      if (!gameRunning || paused || onlineMode) return;
      const now = Date.now();
      if (v76TipCount >= 2 || now - v76LastTipAt < 45000) return;
      const costs = (typeof V23_SHOP_COSTS === 'object' && V23_SHOP_COSTS) ? Object.values(V23_SHOP_COSTS).map(Number).filter(Number.isFinite) : [650];
      const cheapest = Math.min(...costs);
      if (Number(score || 0) < cheapest) return;
      v76TipCount++;
      v76LastTipAt = now;
      if (messageBar) messageBar.textContent = txt('Tips: Du har nok poeng til Power-butikken.', 'Tip: You have enough points for the Power shop.');
    } catch(_) {}
  }

  function getInventory(){
    try { return Math.max(0, Number(v23TurretInventory || 0)); }
    catch(_) { return 0; }
  }

  function autoPlaceAllLasers(){
    let placed = 0;
    try {
      const max = getInventory();
      if (!max) {
        if (messageBar) messageBar.textContent = txt('Kjøp laser først, så kan systemet plassere den.', 'Buy a laser first, then the system can place it.');
        return 0;
      }
      const candidates = [];
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          const ok = (typeof v23CanPlaceTurret === 'function') ? v23CanPlaceTurret(x, y) : map[y][x] === TILE.EMPTY;
          if (ok) candidates.push({ x, y });
        }
      }
      while (candidates.length && getInventory() > 0 && placed < max) {
        const index = Math.floor(Math.random() * candidates.length);
        const spot = candidates.splice(index, 1)[0];
        if (typeof v23PlaceTurretAt === 'function' && v23PlaceTurretAt(spot.x, spot.y)) placed++;
      }
      if (placed > 0) {
        v23PlacingTurret = false;
        document.body.classList.remove('turret-placement-active');
        if (messageBar) messageBar.textContent = txt(`🤖 Systemet plasserte ${placed} laser(e) på trygge ruter.`, `🤖 The system placed ${placed} laser(s) on safe tiles.`);
        try { playSfx('power'); } catch(_) {}
        try { drawGame(); } catch(_) {}
      } else if (messageBar) {
        messageBar.textContent = txt('Fant ingen trygg ledig rute for laser akkurat nå.', 'No safe free tile for a laser right now.');
      }
    } catch(_) {}
    try { if (typeof updateLaserHud === 'function') updateLaserHud(); } catch(_) {}
    setTimeout(v76RefreshShopActions, 40);
    return placed;
  }

  function v76EnsureShopActions(){
    const modal = document.getElementById('shopModal');
    const card = modal && modal.querySelector('.shop-card');
    if (!card) return null;

    let panel = document.getElementById('v76ShopActions');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'v76ShopActions';
      panel.className = 'v76-shop-actions';
      panel.innerHTML = `
        <button id="v76ManualPlaceButton" type="button" class="v76-manual-place"></button>
        <button id="v76AutoPlaceButton" type="button" class="v76-auto-place"></button>
      `;
      const grid = card.querySelector('.shop-grid');
      const hint = document.getElementById('shopHint');
      if (grid) grid.insertAdjacentElement('afterend', panel);
      else if (hint) card.insertBefore(panel, hint);
      else card.appendChild(panel);
    }

    let help = document.getElementById('v76ShopHelp');
    if (!help) {
      help = document.createElement('p');
      help.id = 'v76ShopHelp';
      help.className = 'v76-shop-help';
      const hint = document.getElementById('shopHint');
      if (hint) hint.insertAdjacentElement('afterend', help);
      else panel.insertAdjacentElement('afterend', help);
    }

    const manual = document.getElementById('v76ManualPlaceButton');
    const auto = document.getElementById('v76AutoPlaceButton');
    if (manual && !manual.dataset.v76Bound) {
      manual.dataset.v76Bound = '1';
      manual.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (getInventory() <= 0) {
          if (messageBar) messageBar.textContent = txt('Kjøp laser først.', 'Buy a laser first.');
          v76RefreshShopActions();
          return;
        }
        if (typeof activateTurretPlacement === 'function') activateTurretPlacement();
      });
    }
    if (auto && !auto.dataset.v76Bound) {
      auto.dataset.v76Bound = '1';
      auto.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        autoPlaceAllLasers();
      });
    }
    return { panel, help, manual, auto };
  }

  function v76RefreshShopActions(){
    disableOldTipBubbles();
    const bits = v76EnsureShopActions();
    if (!bits) return;
    const inv = getInventory();
    const disabled = Boolean(onlineMode) || !gameRunning || inv <= 0;
    if (bits.manual) {
      bits.manual.textContent = txt(`🎯 Plasser selv (${inv})`, `🎯 Place manually (${inv})`);
      bits.manual.disabled = disabled;
    }
    if (bits.auto) {
      bits.auto.textContent = inv > 0
        ? txt(`🤖 Auto-plasser laser (${inv})`, `🤖 Auto-place lasers (${inv})`)
        : txt('🤖 Auto-plasser: kjøp laser først', '🤖 Auto-place: buy laser first');
      bits.auto.disabled = disabled;
    }
    if (bits.help) {
      bits.help.textContent = inv > 0
        ? txt('Velg selv-plassering eller la systemet plassere laser på trygg tilfeldig rute.', 'Place manually or let the system place lasers on safe random tiles.')
        : txt('Kjøp Laser-tårn først. Da aktiveres knappene for plassering.', 'Buy Laser turret first. Then the placement buttons become active.');
    }
  }

  function v76StabilizeLayout(){
    disableOldTipBubbles();
    const top = document.querySelector('.top-actions');
    if (top) {
      ['pauseButton', 'menuFromPauseButton', 'endRunButton', 'soundButton', 'shopButton'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentElement === top) top.appendChild(el);
      });
    }
  }

  const prevOpen = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
  if (typeof prevOpen === 'function' && !prevOpen.__v76Wrapped) {
    const wrappedOpen = function openPowerShopV76(){
      const result = prevOpen.apply(this, arguments);
      [0, 40, 120, 260].forEach(delay => setTimeout(v76RefreshShopActions, delay));
      return result;
    };
    wrappedOpen.__v76Wrapped = true;
    window.openPowerShop = globalThis.openPowerShop = wrappedOpen;
    try { openPowerShop = wrappedOpen; } catch(_) {}
  }

  const prevShopUi = window.v23UpdateShopUi || (typeof v23UpdateShopUi === 'function' ? v23UpdateShopUi : null);
  if (typeof prevShopUi === 'function' && !prevShopUi.__v76Wrapped) {
    const wrappedShopUi = function v23UpdateShopUiV76(){
      const result = prevShopUi.apply(this, arguments);
      setTimeout(v76RefreshShopActions, 0);
      return result;
    };
    wrappedShopUi.__v76Wrapped = true;
    window.v23UpdateShopUi = globalThis.v23UpdateShopUi = wrappedShopUi;
    try { v23UpdateShopUi = wrappedShopUi; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    v76StabilizeLayout();
    v76RefreshShopActions();
  });

  setTimeout(() => {
    v76StabilizeLayout();
    v76RefreshShopActions();
  }, 300);

  setInterval(() => {
    v76StabilizeLayout();
    maybeShowQuietShopInfo();
    const modal = document.getElementById('shopModal');
    if (modal && (modal.open || modal.hasAttribute('open'))) v76RefreshShopActions();
    else disableOldTipBubbles();
  }, 900);
})();



/* --------------------------------------------------------------------------
   V77: Winner board only - remove filters and keep Top 10 + Daily side-by-side
   -------------------------------------------------------------------------- */
(function v77WinnerTwoColumnReset(){
  if (window.__ragiJoyV77WinnerReset) return;
  window.__ragiJoyV77WinnerReset = true;

  function v77No(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function v77Text(no, en){ return v77No() ? no : en; }

  function v77EnsureWinnerLayout(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    const list = document.getElementById('winnerList');
    let daily = document.getElementById('dailyTopPanel');
    const close = document.getElementById('winnersCloseButton');
    if (!card || !list) return;

    dialog.classList.add('v77-winner-modal');
    dialog.classList.remove('v75-filter-global', 'v75-filter-daily', 'v75-filter-mine');
    dialog.classList.add('v75-filter-all');
    dialog.dataset.v75Filter = 'all';

    const oldControl = document.getElementById('v75WinnerControlPanel');
    if (oldControl) oldControl.remove();
    const oldMine = document.getElementById('v75MineEmpty');
    if (oldMine) oldMine.remove();

    let info = document.getElementById('v77WinnerInfo');
    if (!info) {
      info = document.createElement('div');
      info.id = 'v77WinnerInfo';
      info.className = 'v77-winner-info';
      const subtitle = document.getElementById('winnersSubtitle');
      if (subtitle && subtitle.parentElement === card) subtitle.insertAdjacentElement('afterend', info);
      else card.prepend(info);
    }
    info.innerHTML = v77Text(
      '<strong>Oversikt:</strong> Top 10 totalt til venstre og Dagens Top 10 til høyre. Sortering skjer automatisk etter høyest score, deretter høyest level.',
      '<strong>Overview:</strong> All-time Top 10 on the left and Today\'s Top 10 on the right. Sorted automatically by highest score, then highest level.'
    );

    let layout = card.querySelector('.v77-winner-grid') || card.querySelector('.v75-winner-grid') || card.querySelector('.v73-winner-layout') || card.querySelector('.v65-winner-grid');
    if (!layout) {
      layout = document.createElement('div');
      card.appendChild(layout);
    }
    layout.className = 'v77-winner-grid v75-winner-grid';

    let globalPanel = document.getElementById('v77GlobalWinnersPanel');
    if (!globalPanel) {
      globalPanel = document.createElement('section');
      globalPanel.id = 'v77GlobalWinnersPanel';
      globalPanel.className = 'v77-board-panel';
    }
    let globalTitle = document.getElementById('v77GlobalWinnersTitle');
    if (!globalTitle) {
      globalTitle = document.createElement('h3');
      globalTitle.id = 'v77GlobalWinnersTitle';
      globalPanel.prepend(globalTitle);
    }
    globalTitle.textContent = v77Text('🏆 Top 10 totalt', '🏆 All-time Top 10');

    let globalNote = document.getElementById('v77GlobalWinnersNote');
    if (!globalNote) {
      globalNote = document.createElement('small');
      globalNote.id = 'v77GlobalWinnersNote';
      globalNote.className = 'v77-panel-note';
      globalTitle.insertAdjacentElement('afterend', globalNote);
    }
    globalNote.textContent = v77Text('Beste score blir liggende øverst.', 'Highest score stays on top.');

    if (globalPanel.parentElement !== layout) layout.appendChild(globalPanel);
    if (list.parentElement !== globalPanel) globalPanel.appendChild(list);

    if (!daily) {
      daily = document.createElement('section');
      daily.id = 'dailyTopPanel';
      daily.className = 'v41-daily-panel v42-daily-panel v75-daily-panel';
      daily.innerHTML = `<h3>${v77Text('⏱️ Dagens Top 10', '⏱️ Today\'s Top 10')}</h3><p>${v77Text('Ingen resultater for i dag ennå.', 'No results today yet.')}</p>`;
    }
    daily.classList.add('v77-board-panel');
    if (daily.parentElement !== layout) layout.appendChild(daily);

    const dailyTitle = daily.querySelector('h3');
    if (dailyTitle) dailyTitle.textContent = v77Text('⏱️ Dagens Top 10', '⏱️ Today\'s Top 10');

    list.querySelectorAll('.v75-mine-hidden').forEach(row => row.classList.remove('v75-mine-hidden'));
    dialog.querySelectorAll('#winnerList .winner-row, #winnerList li, #dailyTopPanel li').forEach(row => row.classList.remove('v75-mine-hidden'));

    if (close && close.parentElement !== card) card.appendChild(close);
    else if (close) card.appendChild(close);

    // Remove inline height/overflow left by older patches.
    [dialog, card, layout, globalPanel, list, daily].forEach(el => {
      if (!el) return;
      el.style.maxHeight = '';
      el.style.height = '';
      el.style.overflow = '';
    });
  }

  const previousShow = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof previousShow === 'function' && !previousShow.__v77Wrapped) {
    const wrapped = function showWinnerBoardV77(){
      const result = previousShow.apply(this, arguments);
      [0, 80, 220, 500].forEach(delay => setTimeout(v77EnsureWinnerLayout, delay));
      return result;
    };
    wrapped.__v77Wrapped = true;
    window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
    try { showWinnerBoard = wrapped; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(v77EnsureWinnerLayout, 350));
  setInterval(() => {
    const dialog = document.getElementById('winnerBoardModal');
    if (dialog && (dialog.open || dialog.hasAttribute('open'))) v77EnsureWinnerLayout();
  }, 500);
})();



/* --------------------------------------------------------------------------
   V78 focused repair:
   - reliable pause click
   - avatar preview in summary card
   - stable power shop laser controls + direct purchase handlers
   -------------------------------------------------------------------------- */
(function v78FocusedRepair(){
  if (window.__ragiJoyV78FocusedRepair) return;
  window.__ragiJoyV78FocusedRepair = true;

  function noLang(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function txt(no, en){ return noLang() ? no : en; }

  function inv(){
    try { return Math.max(0, Number(v23TurretInventory || 0)); }
    catch(_) { return 0; }
  }
  function maxInv(){
    try { return Number(V25_TURRET_MAX_INVENTORY || 6); }
    catch(_) { return 6; }
  }
  function setInv(value){
    try { v23TurretInventory = Math.max(0, Math.min(maxInv(), Number(value || 0))); }
    catch(_) {}
  }
  function safeSfx(name){ try { if (typeof playSfx === 'function') playSfx(name); } catch(_) {} }
  function safeDraw(){
    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    try { if (typeof v23UpdateShopUi === 'function') v23UpdateShopUi(); } catch(_) {}
    try { if (typeof updateLaserHud === 'function') updateLaserHud(); } catch(_) {}
    setTimeout(refreshShopLaserControls, 20);
  }

  /* 1) Pause: one click = one toggle */
  function setPauseVisuals(){
    const active = Boolean(gameRunning);
    const btn = document.getElementById('pauseButton');
    if (btn) {
      btn.textContent = paused ? txt('▶️ Fortsett', '▶️ Resume') : txt('⏸️ Pause', '⏸️ Pause');
      btn.disabled = !active;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }
    document.body.classList.toggle('paused-state', Boolean(active && paused));
    document.body.classList.toggle('playing-state', Boolean(active && !paused));
    const msg = document.getElementById('messageBar');
    if (msg && paused && !msg.textContent.trim()) msg.textContent = txt('Pause aktivert. Trykk P igjen for å fortsette.', 'Paused. Press P again to continue.');
  }

  function robustTogglePause(){
    if (!gameRunning) return;
    paused = !paused;
    if (messageBar) messageBar.textContent = paused ? t('paused') : t('resumed');
    try { clearInterval(enemyTimer); clearTimeout(enemyTimer); } catch(_) {}
    if (!paused) {
      try { enemyTimer = setTimeout(moveEnemies, getEnemyDelay()); } catch(_) {}
    }
    setPauseVisuals();
    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
  }

  window.togglePause = globalThis.togglePause = robustTogglePause;
  try { togglePause = robustTogglePause; } catch(_) {}

  function bindPauseButton(){
    const btn = document.getElementById('pauseButton');
    if (!btn || btn.dataset.v78PauseBound === '1') return;
    btn.dataset.v78PauseBound = '1';
    btn.removeAttribute('onclick');
    btn.onclick = null;
    btn.addEventListener('click', function(event){
      event.preventDefault();
      event.stopImmediatePropagation();
      robustTogglePause();
    }, true);
  }

  /* 2) Uploaded avatar preview in "Figur" card */
  function refreshSummaryAvatar(){
    const avatar = document.getElementById('summaryAvatar');
    if (!avatar) return;
    let image = '';
    let emoji = '😄';
    try { image = selectedPlayerImage || localStorage.getItem('ragiJoyPlayerImage') || ''; } catch(_) {}
    try { emoji = selectedPlayerEmoji || localStorage.getItem('ragiJoyPlayerEmoji') || '😄'; } catch(_) {}
    if (image && /^data:image\//.test(image)) {
      avatar.innerHTML = '';
      const img = document.createElement('img');
      img.className = 'v78-summary-avatar-img';
      img.alt = txt('Valgt figur', 'Selected avatar');
      img.src = image;
      avatar.appendChild(img);
    } else {
      avatar.textContent = emoji || '😄';
    }
  }

  /* 3) Stable power-shop laser purchase + buttons */
  function ensureShopLaserControls(){
    const modal = document.getElementById('shopModal');
    const card = modal && modal.querySelector('.shop-card');
    if (!card) return null;

    let row = document.getElementById('v78ShopActions');
    if (!row) {
      row = document.createElement('div');
      row.id = 'v78ShopActions';
      row.innerHTML = `
        <button id="v78ManualLaserButton" type="button"></button>
        <button id="v78AutoLaserButton" type="button"></button>
      `;
    }

    const grid = card.querySelector('.shop-grid');
    const hint = document.getElementById('shopHint');
    if (row.parentElement !== card) {
      if (grid) grid.insertAdjacentElement('afterend', row);
      else if (hint) card.insertBefore(row, hint);
      else card.appendChild(row);
    }

    let status = document.getElementById('v78ShopStatus');
    if (!status) {
      status = document.createElement('p');
      status.id = 'v78ShopStatus';
    }
    if (hint && status.parentElement !== card) {
      hint.insertAdjacentElement('afterend', status);
    } else if (!hint && status.parentElement !== card) {
      row.insertAdjacentElement('afterend', status);
    }

    const manual = document.getElementById('v78ManualLaserButton');
    const auto = document.getElementById('v78AutoLaserButton');

    if (manual && manual.dataset.v78Bound !== '1') {
      manual.dataset.v78Bound = '1';
      manual.addEventListener('click', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        if (inv() <= 0) {
          if (messageBar) messageBar.textContent = txt('Kjøp Laser-tårn først.', 'Buy a laser tower first.');
          refreshShopLaserControls();
          return;
        }
        try {
          if (typeof activateTurretPlacement === 'function') activateTurretPlacement();
        } catch(_) {}
        refreshShopLaserControls();
      }, true);
    }

    if (auto && auto.dataset.v78Bound !== '1') {
      auto.dataset.v78Bound = '1';
      auto.addEventListener('click', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        autoPlaceLasersV78();
      }, true);
    }

    return { row, manual, auto, status };
  }

  function refreshShopLaserControls(){
    const bits = ensureShopLaserControls();
    if (!bits) return;
    const count = inv();
    const disabled = Boolean(onlineMode) || !gameRunning || count <= 0;

    if (bits.manual) {
      bits.manual.textContent = txt(`🎯 Plasser selv (${count})`, `🎯 Place manually (${count})`);
      bits.manual.disabled = disabled;
    }
    if (bits.auto) {
      bits.auto.textContent = count > 0
        ? txt(`🤖 Auto-plasser (${count})`, `🤖 Auto-place (${count})`)
        : txt('🤖 Auto-plasser: kjøp laser først', '🤖 Auto-place: buy laser first');
      bits.auto.disabled = disabled;
    }
    if (bits.status) {
      bits.status.textContent = count > 0
        ? txt(`Du har ${count} laser klar. Velg Plasser selv eller Auto-plasser.`, `You have ${count} laser(s) ready. Choose manual or auto-place.`)
        : txt('Kjøp Laser-tårn først. Da aktiveres knappene for plassering.', 'Buy a laser tower first. Then the placement buttons activate.');
    }

    const buyOne = document.getElementById('buyTurretButton');
    const buyPack = document.getElementById('buyTurretPackButton');
    if (buyOne) buyOne.disabled = Boolean(onlineMode) || !gameRunning || score < V23_SHOP_COSTS.turret || count >= maxInv();
    if (buyPack) buyPack.disabled = Boolean(onlineMode) || !gameRunning || score < V23_SHOP_COSTS.turretPack || count + V25_TURRET_PACK_COUNT > maxInv();
    try { if (typeof v23UpdateShopTexts === 'function') v23UpdateShopTexts(); } catch(_) {}
  }

  function buyLaserDirect(count, cost, label){
    if (onlineMode || !gameRunning) return false;
    const current = inv();
    if (current + count > maxInv()) {
      if (messageBar) messageBar.textContent = txt('Du har maks antall laser på lager allerede.', 'You already have the maximum number of lasers.');
      safeSfx('lose');
      refreshShopLaserControls();
      return false;
    }
    if (score < cost) {
      if (messageBar) messageBar.textContent = t('shopNotEnough');
      safeSfx('lose');
      refreshShopLaserControls();
      return false;
    }
    score -= cost;
    setInv(current + count);
    if (v23PlacingTurret) {
      v23PlacingTurret = false;
      document.body.classList.remove('turret-placement-active');
    }
    if (messageBar) messageBar.textContent = txt(`${label} kjøpt. Du har ${inv()} laser klar.`, `${label} bought. You have ${inv()} laser(s) ready.`);
    try { if (typeof spawnCenterBurst === 'function') spawnCenterBurst(count > 1 ? '🔫 x3' : '🔫 +1'); } catch(_) {}
    safeSfx('power');
    safeDraw();
    return true;
  }

  const previousBuyShopItemV78 = window.buyShopItem || (typeof buyShopItem === 'function' ? buyShopItem : null);
  function buyShopItemV78(item){
    const key = String(item || '');
    if (key === 'turret') {
      return buyLaserDirect(1, V23_SHOP_COSTS.turret, txt('Laser-tårn', 'Laser tower'));
    }
    return typeof previousBuyShopItemV78 === 'function' ? previousBuyShopItemV78.apply(this, arguments) : false;
  }
  window.buyShopItem = globalThis.buyShopItem = buyShopItemV78;
  try { buyShopItem = buyShopItemV78; } catch(_) {}

  function buyTurretPackV78(){
    return buyLaserDirect(V25_TURRET_PACK_COUNT, V23_SHOP_COSTS.turretPack, txt('Laser-pakke', 'Laser pack'));
  }
  window.buyTurretPack = globalThis.buyTurretPack = buyTurretPackV78;
  try { buyTurretPack = buyTurretPackV78; } catch(_) {}

  function bindShopPurchaseButtons(){
    const one = document.getElementById('buyTurretButton');
    if (one && one.dataset.v78Bound !== '1') {
      one.dataset.v78Bound = '1';
      one.removeAttribute('onclick');
      one.onclick = null;
      one.addEventListener('click', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        buyShopItemV78('turret');
      }, true);
    }
    const pack = document.getElementById('buyTurretPackButton');
    if (pack && pack.dataset.v78Bound !== '1') {
      pack.dataset.v78Bound = '1';
      pack.removeAttribute('onclick');
      pack.onclick = null;
      pack.addEventListener('click', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        buyTurretPackV78();
      }, true);
    }
  }

  function autoPlaceLasersV78(){
    if (inv() <= 0) {
      if (messageBar) messageBar.textContent = txt('Kjøp Laser-tårn først.', 'Buy a laser tower first.');
      refreshShopLaserControls();
      return 0;
    }

    const candidates = [];
    try {
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          const ok = (typeof v23CanPlaceTurret === 'function') ? v23CanPlaceTurret(x, y) : map[y][x] === TILE.EMPTY;
          if (ok) candidates.push({ x, y });
        }
      }
    } catch(_) {}

    let placed = 0;
    while (candidates.length && inv() > 0) {
      const index = Math.floor(Math.random() * candidates.length);
      const spot = candidates.splice(index, 1)[0];
      try {
        if (typeof v23PlaceTurretAt === 'function' && v23PlaceTurretAt(spot.x, spot.y)) placed++;
      } catch(_) {}
    }

    if (placed > 0) {
      v23PlacingTurret = false;
      document.body.classList.remove('turret-placement-active');
      try { if (typeof closePowerShop === 'function') closePowerShop(); } catch(_) {}
      if (messageBar) messageBar.textContent = txt(`🤖 Systemet plasserte ${placed} laser.`, `🤖 The system placed ${placed} laser(s).`);
      safeSfx('power');
      safeDraw();
    } else {
      if (messageBar) messageBar.textContent = txt('Fant ingen trygg ledig rute for laser akkurat nå.', 'No safe free tile for a laser right now.');
      refreshShopLaserControls();
    }
    return placed;
  }

  const previousOpenPowerShopV78 = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
  if (typeof previousOpenPowerShopV78 === 'function' && !previousOpenPowerShopV78.__v78Wrapped) {
    const openWrapped = function openPowerShopV78(){
      const result = previousOpenPowerShopV78.apply(this, arguments);
      [0, 40, 120, 260].forEach(delay => setTimeout(() => {
        bindShopPurchaseButtons();
        refreshShopLaserControls();
      }, delay));
      return result;
    };
    openWrapped.__v78Wrapped = true;
    window.openPowerShop = globalThis.openPowerShop = openWrapped;
    try { openPowerShop = openWrapped; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', function(){
    bindPauseButton();
    setPauseVisuals();
    refreshSummaryAvatar();
    bindShopPurchaseButtons();
    refreshShopLaserControls();
  });

  setTimeout(function(){
    bindPauseButton();
    setPauseVisuals();
    refreshSummaryAvatar();
    bindShopPurchaseButtons();
    refreshShopLaserControls();
  }, 250);

  setInterval(function(){
    bindPauseButton();
    setPauseVisuals();
    refreshSummaryAvatar();
    const modal = document.getElementById('shopModal');
    if (modal && (modal.open || modal.hasAttribute('open'))) {
      bindShopPurchaseButtons();
      refreshShopLaserControls();
    }
  }, 500);

  const previousHandleAvatarUploadV78 = window.handleAvatarUpload || (typeof handleAvatarUpload === 'function' ? handleAvatarUpload : null);
  if (typeof previousHandleAvatarUploadV78 === 'function' && !previousHandleAvatarUploadV78.__v78Wrapped) {
    const avatarWrapped = function handleAvatarUploadV78(){
      const result = previousHandleAvatarUploadV78.apply(this, arguments);
      setTimeout(refreshSummaryAvatar, 80);
      setTimeout(refreshSummaryAvatar, 250);
      return result;
    };
    avatarWrapped.__v78Wrapped = true;
    window.handleAvatarUpload = globalThis.handleAvatarUpload = avatarWrapped;
    try { handleAvatarUpload = avatarWrapped; } catch(_) {}
  }

  const previousClearAvatarImageV78 = window.clearAvatarImage || (typeof clearAvatarImage === 'function' ? clearAvatarImage : null);
  if (typeof previousClearAvatarImageV78 === 'function' && !previousClearAvatarImageV78.__v78Wrapped) {
    const clearWrapped = function clearAvatarImageV78(){
      const result = previousClearAvatarImageV78.apply(this, arguments);
      setTimeout(refreshSummaryAvatar, 80);
      return result;
    };
    clearWrapped.__v78Wrapped = true;
    window.clearAvatarImage = globalThis.clearAvatarImage = clearWrapped;
    try { clearAvatarImage = clearWrapped; } catch(_) {}
  }
})();

/* --------------------------------------------------------------------------
   V79 focused patch requested:
   - stable winner tab with two boxes side-by-side and no visible refresh text
   - readable date card
   - player name from anonymous prompt / player card is shown immediately in HUD
   - one clean laser control panel in the power shop
   - pause does not reopen menu/home content
   -------------------------------------------------------------------------- */
(function v79FocusedFinalPatch(){
  if (window.__ragiJoyV79FocusedFinalPatch) return;
  window.__ragiJoyV79FocusedFinalPatch = true;

  const NAME_KEY = 'ragiJoyMazePreferredNameV34';
  const LAST_NAME_KEY = 'ragiJoyLastWinnerName';
  const TURRET_COST = () => {
    try { return Number(V23_SHOP_COSTS && V23_SHOP_COSTS.turret) || 1200; }
    catch(_) { return 1200; }
  };
  const TURRET_PACK_COST = () => {
    try { return Number(V23_SHOP_COSTS && V23_SHOP_COSTS.turretPack) || 3300; }
    catch(_) { return 3300; }
  };
  const PACK_COUNT = () => {
    try { return Number(V25_TURRET_PACK_COUNT || 3); }
    catch(_) { return 3; }
  };
  const MAX_TURRETS = () => {
    try { return Number(V25_TURRET_MAX_INVENTORY || 6); }
    catch(_) { return 6; }
  };

  function isNo(){
    try { return String(currentLanguage || localStorage.getItem('ragiJoyLanguage') || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function text(no, en){ return isNo() ? no : en; }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function activeName(){
    try { return String(localStorage.getItem(NAME_KEY) || localStorage.getItem(LAST_NAME_KEY) || '').trim(); }
    catch(_) { return ''; }
  }
  function setDomText(id, value){
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function playSafe(name){ try { if (typeof playSfx === 'function') playSfx(name); } catch(_) {} }
  function redrawSafe(){
    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    try { if (typeof v23UpdateShopUi === 'function') v23UpdateShopUi(); } catch(_) {}
    try { if (typeof updateLaserHud === 'function') updateLaserHud(); } catch(_) {}
  }
  function inv(){
    try { return Math.max(0, Number(v23TurretInventory || 0)); }
    catch(_) { return 0; }
  }
  function setInv(value){
    try { v23TurretInventory = Math.max(0, Math.min(MAX_TURRETS(), Number(value || 0))); }
    catch(_) {}
  }
  function canUseShop(){
    try { return Boolean(gameRunning && !onlineMode); }
    catch(_) { return false; }
  }

  /* Player name must update everywhere after anonymous prompt or player card save. */
  function syncPlayerNameUi(showReadyMessage){
    const name = activeName();
    if (!name) return;
    setDomText('playerNameHudValue', name);
    setDomText('profileCurrentName', name);
    const hud = document.getElementById('playerNameHudCard');
    if (hud) hud.classList.remove('empty-profile');
    const profileButton = document.getElementById('profileNameButton');
    if (profileButton) {
      profileButton.textContent = `👤 ${name}`;
      profileButton.classList.add('has-name');
    }
    try {
      const input = document.getElementById('championNameInput');
      if (input && !input.value.trim()) input.value = name;
    } catch(_) {}
    if (showReadyMessage && typeof messageBar !== 'undefined' && messageBar) {
      messageBar.textContent = text(`Klar, ${name}! Lykke til 🚀`, `Ready, ${name}! Good luck 🚀`);
    }
  }

  try {
    const nativeSetItem = Storage.prototype.setItem;
    if (!nativeSetItem.__v79NameSyncWrapped) {
      Storage.prototype.setItem = function setItemV79(key, value){
        const result = nativeSetItem.call(this, key, value);
        if (String(key) === NAME_KEY || String(key) === LAST_NAME_KEY) {
          setTimeout(() => syncPlayerNameUi(false), 0);
          setTimeout(() => syncPlayerNameUi(false), 120);
        }
        return result;
      };
      Storage.prototype.setItem.__v79NameSyncWrapped = true;
    }
  } catch(_) {}

  const previousStartGameV79 = window.startGame || (typeof startGame === 'function' ? startGame : null);
  if (typeof previousStartGameV79 === 'function' && !previousStartGameV79.__v79NameWrapped) {
    const wrappedStart = function startGameV79(){
      const result = previousStartGameV79.apply(this, arguments);
      setTimeout(() => syncPlayerNameUi(true), 40);
      setTimeout(() => syncPlayerNameUi(false), 220);
      setTimeout(() => {
        try {
          document.body.classList.remove('menu-state');
          document.body.classList.add(paused ? 'paused-state' : 'playing-state');
          const summary = document.getElementById('preGameSummary');
          if (summary) summary.setAttribute('aria-hidden', 'true');
        } catch(_) {}
      }, 80);
      return result;
    };
    wrappedStart.__v79NameWrapped = true;
    window.startGame = globalThis.startGame = wrappedStart;
    try { startGame = wrappedStart; } catch(_) {}
  }

  /* Winner tab: no filter row, no visible auto-refresh text, two panels side-by-side. */
  function cleanWinnerTextNoise(dialog){
    if (!dialog) return;
    const selectors = [
      '#v75WinnerControlPanel', '#v75WinnerFilters', '#v75MineEmpty',
      '#v64WinnerInfoBox', '#v70WinnerInfoBox', '.v64-winner-info', '.v70-winner-info',
      '.v75-winner-control', '.v75-winner-filters'
    ];
    selectors.forEach(selector => dialog.querySelectorAll(selector).forEach(el => el.remove()));
    dialog.querySelectorAll('em, small, p, span').forEach(el => {
      const value = (el.textContent || '').toLowerCase();
      if (value.includes('oppdateres automatisk') || value.includes('oppdaterer automatisk') || value.includes('auto-refresh') || value.includes('updates automatically')) {
        el.remove();
      }
    });
  }

  function ensureWinnerTwoColumns(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
    if (!card || !list) return;

    dialog.classList.add('v79-winner-modal', 'v77-winner-modal', 'v75-filter-all');
    dialog.classList.remove('v75-filter-global', 'v75-filter-daily', 'v75-filter-mine');
    dialog.dataset.v75Filter = 'all';
    cleanWinnerTextNoise(dialog);

    const title = document.getElementById('winnersTitle');
    if (title) title.textContent = text('🏆 Top 10 vinnerresultat', '🏆 Top 10 winners');
    const subtitle = document.getElementById('winnersSubtitle');
    if (subtitle) {
      subtitle.textContent = text(
        'Beste resultater til venstre. Dagens Top 10 til høyre. Sorteres etter score, deretter level.',
        'Best results on the left. Today\'s Top 10 on the right. Sorted by score, then level.'
      );
    }

    let info = document.getElementById('v79WinnerInfo');
    if (!info) {
      info = document.createElement('div');
      info.id = 'v79WinnerInfo';
      info.className = 'v79-winner-info';
      if (subtitle && subtitle.parentElement === card) subtitle.insertAdjacentElement('afterend', info);
      else card.prepend(info);
    }
    info.textContent = text('Topplisten lagres lokalt i nettleseren. Flagget hentes fra språk/landprofil.', 'The leaderboard is stored locally in the browser. The flag comes from language/country profile.');

    let layout = card.querySelector('.v79-winner-grid') || card.querySelector('.v77-winner-grid') || card.querySelector('.v75-winner-grid') || card.querySelector('.v73-winner-layout') || card.querySelector('.v65-winner-grid');
    if (!layout) {
      layout = document.createElement('div');
      card.appendChild(layout);
    }
    layout.className = 'v79-winner-grid v77-winner-grid v75-winner-grid';

    let globalPanel = document.getElementById('v79GlobalWinnersPanel') || document.getElementById('v77GlobalWinnersPanel');
    if (!globalPanel) {
      globalPanel = document.createElement('section');
      globalPanel.id = 'v79GlobalWinnersPanel';
      globalPanel.className = 'v79-board-panel v77-board-panel';
    }
    globalPanel.id = 'v79GlobalWinnersPanel';
    globalPanel.className = 'v79-board-panel v77-board-panel';
    let globalTitle = document.getElementById('v79GlobalWinnersTitle');
    if (!globalTitle) {
      globalTitle = document.createElement('h3');
      globalTitle.id = 'v79GlobalWinnersTitle';
      globalPanel.prepend(globalTitle);
    }
    globalTitle.textContent = text('🏆 Top 10 totalt', '🏆 All-time Top 10');
    let globalNote = document.getElementById('v79GlobalWinnersNote');
    if (!globalNote) {
      globalNote = document.createElement('p');
      globalNote.id = 'v79GlobalWinnersNote';
      globalNote.className = 'v79-panel-note';
      globalTitle.insertAdjacentElement('afterend', globalNote);
    }
    globalNote.textContent = text('Høyeste score øverst. Ved lik score teller level først.', 'Highest score first. If tied, level wins.');
    if (globalPanel.parentElement !== layout) layout.appendChild(globalPanel);
    if (list.parentElement !== globalPanel) globalPanel.appendChild(list);

    let daily = document.getElementById('dailyTopPanel');
    if (!daily) {
      daily = document.createElement('section');
      daily.id = 'dailyTopPanel';
      daily.innerHTML = `<h3>${text('⏱️ Dagens Top 10', '⏱️ Today\'s Top 10')}</h3><p>${text('Ingen resultater for i dag ennå.', 'No results today yet.')}</p>`;
    }
    daily.classList.add('v79-board-panel', 'v77-board-panel');
    const dailyTitle = daily.querySelector('h3') || document.createElement('h3');
    if (!dailyTitle.parentElement) daily.prepend(dailyTitle);
    dailyTitle.textContent = text('⏱️ Dagens Top 10', '⏱️ Today\'s Top 10');
    daily.querySelectorAll('p, small, em').forEach(el => {
      const value = (el.textContent || '').toLowerCase();
      if (value.includes('oppdater') || value.includes('update')) el.remove();
    });
    if (daily.parentElement !== layout) layout.appendChild(daily);

    list.querySelectorAll('.v75-mine-hidden').forEach(row => row.classList.remove('v75-mine-hidden'));
    dialog.querySelectorAll('#winnerList .winner-row, #winnerList li, #dailyTopPanel li').forEach(row => row.classList.remove('v75-mine-hidden'));

    const closeButton = document.getElementById('winnersCloseButton');
    if (closeButton) {
      closeButton.textContent = text('Lukk', 'Close');
      if (closeButton.parentElement !== card) card.appendChild(closeButton);
    }
    [dialog, card, layout, globalPanel, list, daily].forEach(el => {
      if (!el) return;
      el.style.maxHeight = '';
      el.style.height = '';
      el.style.overflow = '';
    });
  }

  const previousShowWinnerV79 = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof previousShowWinnerV79 === 'function' && !previousShowWinnerV79.__v79WinnerWrapped) {
    const wrappedWinner = function showWinnerBoardV79(){
      const result = previousShowWinnerV79.apply(this, arguments);
      [0, 60, 180, 420].forEach(delay => setTimeout(ensureWinnerTwoColumns, delay));
      return result;
    };
    wrappedWinner.__v79WinnerWrapped = true;
    window.showWinnerBoard = globalThis.showWinnerBoard = wrappedWinner;
    try { showWinnerBoard = wrappedWinner; } catch(_) {}
  }

  /* Date card: make it readable instead of cutting "2026". */
  function fixSummaryDateCard(){
    const dateCard = document.getElementById('v74DateBadge');
    if (dateCard) {
      dateCard.classList.add('v79-date-wide');
      const strong = dateCard.querySelector('strong');
      if (strong) {
        strong.style.whiteSpace = 'nowrap';
        strong.style.overflow = 'visible';
        strong.style.textOverflow = 'clip';
        strong.style.fontSize = 'clamp(16px, 2vw, 22px)';
      }
    }
  }

  /* Power shop: one clear laser panel; remove old duplicate rows every time. */
  function removeOldLaserControls(card){
    if (!card) return;
    const removeSelectors = [
      '#v78ShopActions', '#v76ShopActions', '.v76-shop-actions', '.shop-action-row',
      '#v70AutoPlaceTurretButton', '#v72AutoPlaceTurretButton', '#v74AutoPlaceTurretButton',
      '#placeTurretButton', '#shopPlaceTurretButton', '#v78ShopStatus', '#v76ShopHelp'
    ];
    removeSelectors.forEach(selector => card.querySelectorAll(selector).forEach(el => el.remove()));
    card.querySelectorAll('[id="v79ShopLaserPanel"]').forEach((el, index) => { if (index > 0) el.remove(); });
  }

  function buyLaser(count, cost, label){
    if (!canUseShop()) return false;
    const current = inv();
    if (current + count > MAX_TURRETS()) {
      if (messageBar) messageBar.textContent = text('Du har maks antall laser på lager allerede.', 'You already have the maximum number of lasers.');
      playSafe('lose');
      refreshShopLaserPanel();
      return false;
    }
    if (Number(score || 0) < cost) {
      if (messageBar) messageBar.textContent = typeof t === 'function' ? t('shopNotEnough') : text('Ikke nok poeng.', 'Not enough points.');
      playSafe('lose');
      refreshShopLaserPanel();
      return false;
    }
    try { score = Number(score || 0) - cost; } catch(_) {}
    setInv(current + count);
    try { v23PlacingTurret = false; document.body.classList.remove('turret-placement-active'); } catch(_) {}
    if (messageBar) messageBar.textContent = text(`${label} kjøpt. Du har ${inv()} laser klar.`, `${label} bought. You have ${inv()} laser(s) ready.`);
    try { if (typeof spawnCenterBurst === 'function') spawnCenterBurst(count > 1 ? '🔫 x3' : '🔫 +1'); } catch(_) {}
    playSafe('power');
    redrawSafe();
    refreshShopLaserPanel();
    return true;
  }

  function activateManualLaser(){
    if (inv() <= 0) {
      if (messageBar) messageBar.textContent = text('Kjøp Laser-tårn først.', 'Buy a laser tower first.');
      refreshShopLaserPanel();
      return;
    }
    try {
      if (typeof activateTurretPlacement === 'function') activateTurretPlacement();
      else {
        v23PlacingTurret = true;
        document.body.classList.add('turret-placement-active');
      }
    } catch(_) {}
    refreshShopLaserPanel();
  }

  function autoPlaceAllLasers(){
    if (inv() <= 0) {
      if (messageBar) messageBar.textContent = text('Kjøp Laser-tårn først.', 'Buy a laser tower first.');
      refreshShopLaserPanel();
      return 0;
    }
    const spots = [];
    try {
      for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[y].length - 1; x++) {
          const ok = (typeof v23CanPlaceTurret === 'function') ? v23CanPlaceTurret(x, y) : map[y][x] === TILE.EMPTY;
          if (ok) spots.push({ x, y });
        }
      }
    } catch(_) {}
    let placed = 0;
    while (spots.length && inv() > 0) {
      const index = Math.floor(Math.random() * spots.length);
      const spot = spots.splice(index, 1)[0];
      try {
        if (typeof v23PlaceTurretAt === 'function') {
          if (v23PlaceTurretAt(spot.x, spot.y)) placed++;
        }
      } catch(_) {}
    }
    try { v23PlacingTurret = false; document.body.classList.remove('turret-placement-active'); } catch(_) {}
    if (placed > 0) {
      try { if (typeof closePowerShop === 'function') closePowerShop(); } catch(_) {}
      if (messageBar) messageBar.textContent = text(`🤖 Systemet plasserte ${placed} laser automatisk.`, `🤖 The system placed ${placed} laser(s) automatically.`);
      playSafe('power');
      redrawSafe();
    } else {
      if (messageBar) messageBar.textContent = text('Fant ingen ledig trygg rute for laser nå.', 'No safe free tile for a laser right now.');
    }
    refreshShopLaserPanel();
    return placed;
  }

  function cleanShopBuyButton(id){
    const oldButton = document.getElementById(id);
    if (!oldButton) return null;
    if (oldButton.dataset.v79CleanButton === '1') return oldButton;
    const fresh = oldButton.cloneNode(true);
    fresh.removeAttribute('onclick');
    fresh.onclick = null;
    fresh.dataset.v79CleanButton = '1';
    oldButton.replaceWith(fresh);
    return fresh;
  }

  function ensureShopLaserPanel(){
    const modal = document.getElementById('shopModal');
    const card = modal && modal.querySelector('.shop-card');
    if (!card) return null;
    removeOldLaserControls(card);

    let panel = document.getElementById('v79ShopLaserPanel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'v79ShopLaserPanel';
      panel.innerHTML = `
        <div class="v79-shop-laser-actions">
          <button id="v79ManualLaserButton" type="button"></button>
          <button id="v79AutoLaserButton" type="button"></button>
        </div>
        <p id="v79ShopLaserHint"></p>
      `;
    }
    const grid = card.querySelector('.shop-grid');
    const hint = document.getElementById('shopHint');
    if (panel.parentElement !== card) {
      if (grid) grid.insertAdjacentElement('afterend', panel);
      else if (hint) hint.insertAdjacentElement('beforebegin', panel);
      else card.appendChild(panel);
    }

    const manual = document.getElementById('v79ManualLaserButton');
    const auto = document.getElementById('v79AutoLaserButton');
    if (manual && manual.dataset.v79Bound !== '1') {
      manual.dataset.v79Bound = '1';
      manual.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        activateManualLaser();
      }, true);
    }
    if (auto && auto.dataset.v79Bound !== '1') {
      auto.dataset.v79Bound = '1';
      auto.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        autoPlaceAllLasers();
      }, true);
    }

    const buyOne = cleanShopBuyButton('buyTurretButton');
    if (buyOne && buyOne.dataset.v79Bound !== '1') {
      buyOne.dataset.v79Bound = '1';
      buyOne.removeAttribute('onclick');
      buyOne.onclick = null;
      buyOne.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        buyLaser(1, TURRET_COST(), text('Laser-tårn', 'Laser tower'));
      }, true);
    }
    const buyPack = cleanShopBuyButton('buyTurretPackButton');
    if (buyPack && buyPack.dataset.v79Bound !== '1') {
      buyPack.dataset.v79Bound = '1';
      buyPack.removeAttribute('onclick');
      buyPack.onclick = null;
      buyPack.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        buyLaser(PACK_COUNT(), TURRET_PACK_COST(), text('Laser-pakke', 'Laser pack'));
      }, true);
    }
    return { panel, manual, auto, hint: document.getElementById('v79ShopLaserHint'), buyOne, buyPack };
  }

  function refreshShopLaserPanel(){
    const bits = ensureShopLaserPanel();
    if (!bits) return;
    const count = inv();
    const disabledPlace = !canUseShop() || count <= 0;
    if (bits.manual) {
      bits.manual.textContent = text(`🎯 Plasser selv (${count})`, `🎯 Place manually (${count})`);
      bits.manual.disabled = disabledPlace;
    }
    if (bits.auto) {
      bits.auto.textContent = count > 0
        ? text(`🤖 Auto-plasser (${count})`, `🤖 Auto-place (${count})`)
        : text('🤖 Auto-plasser: kjøp laser først', '🤖 Auto-place: buy laser first');
      bits.auto.disabled = disabledPlace;
    }
    if (bits.hint) {
      bits.hint.textContent = count > 0
        ? text(`Du har ${count} laser klar. Velg Plasser selv for å velge rute, eller Auto-plasser for at systemet gjør det.`, `You have ${count} laser(s) ready. Choose manual placement or auto-place.`)
        : text('Kjøp Laser-tårn først. Da aktiveres knappene under.', 'Buy a laser tower first. Then the buttons below activate.');
    }
    try {
      if (bits.buyOne) bits.buyOne.disabled = !canUseShop() || Number(score || 0) < TURRET_COST() || count >= MAX_TURRETS();
      if (bits.buyPack) bits.buyPack.disabled = !canUseShop() || Number(score || 0) < TURRET_PACK_COST() || count + PACK_COUNT() > MAX_TURRETS();
    } catch(_) {}
  }

  const previousOpenPowerShopV79 = window.openPowerShop || (typeof openPowerShop === 'function' ? openPowerShop : null);
  if (typeof previousOpenPowerShopV79 === 'function' && !previousOpenPowerShopV79.__v79ShopWrapped) {
    const wrappedShop = function openPowerShopV79(){
      const result = previousOpenPowerShopV79.apply(this, arguments);
      [0, 60, 160, 360].forEach(delay => setTimeout(refreshShopLaserPanel, delay));
      return result;
    };
    wrappedShop.__v79ShopWrapped = true;
    window.openPowerShop = globalThis.openPowerShop = wrappedShop;
    try { openPowerShop = wrappedShop; } catch(_) {}
  }

  const previousBuyShopItemV79 = window.buyShopItem || (typeof buyShopItem === 'function' ? buyShopItem : null);
  if (typeof previousBuyShopItemV79 === 'function' && !previousBuyShopItemV79.__v79ShopBuyWrapped) {
    const wrappedBuy = function buyShopItemV79(item){
      if (String(item || '') === 'turret') return buyLaser(1, TURRET_COST(), text('Laser-tårn', 'Laser tower'));
      return previousBuyShopItemV79.apply(this, arguments);
    };
    wrappedBuy.__v79ShopBuyWrapped = true;
    window.buyShopItem = globalThis.buyShopItem = wrappedBuy;
    try { buyShopItem = wrappedBuy; } catch(_) {}
  }
  const previousBuyPackV79 = window.buyTurretPack || (typeof buyTurretPack === 'function' ? buyTurretPack : null);
  if (typeof previousBuyPackV79 === 'function' && !previousBuyPackV79.__v79ShopPackWrapped) {
    const wrappedPack = function buyTurretPackV79(){
      return buyLaser(PACK_COUNT(), TURRET_PACK_COST(), text('Laser-pakke', 'Laser pack'));
    };
    wrappedPack.__v79ShopPackWrapped = true;
    window.buyTurretPack = globalThis.buyTurretPack = wrappedPack;
    try { buyTurretPack = wrappedPack; } catch(_) {}
  }

  /* Pause: keep only game HUD/actions visible, never show start/menu cards while paused. */
  function stabilizePauseView(){
    try {
      const active = Boolean(gameRunning);
      document.body.classList.toggle('paused-state', active && Boolean(paused));
      document.body.classList.toggle('playing-state', active && !Boolean(paused));
      if (active) document.body.classList.remove('menu-state');
      const summary = document.getElementById('preGameSummary');
      if (summary && active) summary.setAttribute('aria-hidden', 'true');
      const pauseBtn = document.getElementById('pauseButton');
      if (pauseBtn && active) {
        pauseBtn.textContent = paused ? text('▶️ Fortsett', '▶️ Resume') : text('⏸️ Pause', '⏸️ Pause');
        pauseBtn.disabled = false;
      }
    } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncPlayerNameUi(false);
    fixSummaryDateCard();
    ensureWinnerTwoColumns();
    refreshShopLaserPanel();
    stabilizePauseView();
  });
  setTimeout(() => {
    syncPlayerNameUi(false);
    fixSummaryDateCard();
    ensureWinnerTwoColumns();
    refreshShopLaserPanel();
    stabilizePauseView();
  }, 350);
  setInterval(() => {
    syncPlayerNameUi(false);
    fixSummaryDateCard();
    stabilizePauseView();
    const shop = document.getElementById('shopModal');
    if (shop && (shop.open || shop.hasAttribute('open'))) refreshShopLaserPanel();
    const winners = document.getElementById('winnerBoardModal');
    if (winners && (winners.open || winners.hasAttribute('open'))) ensureWinnerTwoColumns();
  }, 900);
})();


/* --------------------------------------------------------------------------
   V80: Winner tab only - final readable layout, no visible sync/countdown text
   -------------------------------------------------------------------------- */
(function v80WinnerOnlyPatch(){
  if (window.__ragiJoyV80WinnerOnlyPatch) return;
  window.__ragiJoyV80WinnerOnlyPatch = true;

  function noLang(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function tx(no, en){ return noLang() ? no : en; }

  function hideSyncNoise(root){
    if (!root) return;
    const noisySelectors = [
      '#v75WinnerControlPanel', '#v75WinnerFilters', '#v75MineEmpty',
      '#v64WinnerInfoBox', '#v70WinnerInfoBox', '#v77WinnerInfo', '#v79WinnerInfo',
      '.v64-winner-info', '.v70-winner-info', '.v77-winner-info', '.v79-winner-info',
      '.v75-winner-control', '.v75-winner-filters', '.v77-panel-note', '.v79-panel-note'
    ];
    noisySelectors.forEach(sel => root.querySelectorAll(sel).forEach(el => {
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
      el.style.display = 'none';
    }));

    root.querySelectorAll('#dailyTopPanel > p, #dailyTopPanel > small, #dailyTopPanel > em, p, small, em').forEach(el => {
      const value = (el.textContent || '').toLowerCase();
      const syncWords = ['oppdater', 'synk', 'sync', 'refresh', 'automatisk', 'automatic', 'nullstilles', 'ryddes', '24 timer', '24 hours', 'ca.'];
      if (el.closest('#winnerList')) return;
      if (syncWords.some(word => value.includes(word))) {
        el.hidden = true;
        el.setAttribute('aria-hidden', 'true');
        el.style.display = 'none';
      }
    });
  }

  function ensureBox(id, titleText){
    let box = document.getElementById(id);
    if (!box) {
      box = document.createElement('section');
      box.id = id;
      box.className = 'v80-board-box';
      const title = document.createElement('h3');
      title.className = 'v80-board-title';
      box.appendChild(title);
    }
    box.className = 'v80-board-box';
    let title = box.querySelector(':scope > .v80-board-title');
    if (!title) {
      title = document.createElement('h3');
      title.className = 'v80-board-title';
      box.prepend(title);
    }
    title.textContent = titleText;
    return box;
  }

  function normalizeWinnerBoard(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    const card = dialog.querySelector('.winner-card') || dialog;
    const list = document.getElementById('winnerList') || card.querySelector('.winner-list');
    let daily = document.getElementById('dailyTopPanel');
    if (!card || !list) return;

    dialog.classList.add('v80-winner-modal', 'v79-winner-modal');
    dialog.classList.remove('v75-filter-global', 'v75-filter-daily', 'v75-filter-mine');
    dialog.dataset.v75Filter = 'all';

    const title = document.getElementById('winnersTitle');
    if (title) title.textContent = tx('🏆 Top 10 vinnerresultat', '🏆 Top 10 winners');
    const subtitle = document.getElementById('winnersSubtitle');
    if (subtitle) subtitle.hidden = true;

    hideSyncNoise(dialog);

    let grid = document.getElementById('v80WinnerGrid');
    if (!grid) {
      grid = document.createElement('div');
      grid.id = 'v80WinnerGrid';
      grid.className = 'v80-winner-grid';
      const anchor = title || card.firstElementChild;
      if (anchor && anchor.parentElement === card) anchor.insertAdjacentElement('afterend', grid);
      else card.prepend(grid);
    }
    grid.className = 'v80-winner-grid';

    const dailyBox = ensureBox('v80DailyBox', tx('⏱️ Dagens Top 10', '⏱️ Today\'s Top 10'));
    const globalBox = ensureBox('v80GlobalBox', tx('🏆 Top 10 totalt', '🏆 All-time Top 10'));

    if (!daily) {
      daily = document.createElement('section');
      daily.id = 'dailyTopPanel';
      daily.innerHTML = `<ol class="v41-daily-list"></ol>`;
    }
    daily.classList.remove('v79-board-panel', 'v77-board-panel');
    daily.querySelectorAll('h3, p, small, em').forEach(el => {
      if (el.tagName.toLowerCase() === 'h3') el.remove();
      else {
        el.hidden = true;
        el.style.display = 'none';
      }
    });

    if (dailyBox.parentElement !== grid) grid.appendChild(dailyBox);
    if (globalBox.parentElement !== grid) grid.appendChild(globalBox);
    if (daily.parentElement !== dailyBox) dailyBox.appendChild(daily);
    if (list.parentElement !== globalBox) globalBox.appendChild(list);

    list.querySelectorAll('.v75-mine-hidden').forEach(row => row.classList.remove('v75-mine-hidden'));
    dialog.querySelectorAll('#winnerList .winner-row, #winnerList li, #dailyTopPanel li').forEach(row => {
      row.classList.remove('v75-mine-hidden');
      row.style.display = '';
    });

    const closeButton = document.getElementById('winnersCloseButton');
    if (closeButton) {
      closeButton.textContent = tx('Lukk', 'Close');
      if (closeButton.parentElement !== card) card.appendChild(closeButton);
    }

    [dialog, card, grid, dailyBox, globalBox, list, daily].forEach(el => {
      if (!el) return;
      el.style.maxHeight = '';
      el.style.height = '';
      el.style.overflow = '';
    });
  }

  const previousShow = window.showWinnerBoard || (typeof showWinnerBoard === 'function' ? showWinnerBoard : null);
  if (typeof previousShow === 'function' && !previousShow.__v80WinnerWrapped) {
    const wrapped = function showWinnerBoardV80(){
      const result = previousShow.apply(this, arguments);
      [0, 80, 220, 520].forEach(delay => setTimeout(normalizeWinnerBoard, delay));
      return result;
    };
    wrapped.__v80WinnerWrapped = true;
    window.showWinnerBoard = globalThis.showWinnerBoard = wrapped;
    try { showWinnerBoard = wrapped; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', () => setTimeout(normalizeWinnerBoard, 450));
  document.addEventListener('click', event => {
    if (event.target && event.target.closest && event.target.closest('#winnerBoardButton, [onclick*="showWinnerBoard"]')) {
      [50, 250, 600].forEach(delay => setTimeout(normalizeWinnerBoard, delay));
    }
  }, true);

  let running = false;
  setInterval(() => {
    if (running) return;
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog || !(dialog.open || dialog.hasAttribute('open'))) return;
    running = true;
    requestAnimationFrame(() => {
      normalizeWinnerBoard();
      running = false;
    });
  }, 1500);
})();


/* --------------------------------------------------------------------------
   V81: ONLY stable winner board + front menu after pause/end + feedback only
   -------------------------------------------------------------------------- */
(function v81StableWinnerMenuFeedbackOnly(){
  if (window.__ragiJoyV81StableWinnerMenuFeedbackOnly) return;
  window.__ragiJoyV81StableWinnerMenuFeedbackOnly = true;

  const WINNERS_KEY_V81 = 'ragiJoyMazeWinnersV33';
  const DAILY_KEY_V81 = 'ragiJoyMazeDailyTop10V41';

  function v81No(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function v81Text(no, en){ return v81No() ? no : en; }
  function v81Escape(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function v81Number(value){
    const number = Number(value || 0);
    try { return number.toLocaleString(v81No() ? 'nb-NO' : undefined); }
    catch(_) { return String(number); }
  }
  function v81ArrayFromStorage(key){
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
      if (parsed && typeof parsed === 'object') return Object.values(parsed);
      return [];
    } catch(_) {
      return [];
    }
  }
  function v81DifficultyLabel(value){
    const key = String(value || '').toLowerCase();
    const no = {
      easy: 'Enkel',
      normal: 'Middels',
      hard: 'Vanskelig',
      extreme: 'Ekstrem'
    };
    const en = {
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      extreme: 'Extreme'
    };
    return (v81No() ? no[key] : en[key]) || value || (v81No() ? 'Ukjent' : 'Unknown');
  }
  function v81CountryCode(entry){
    const raw = String(
      entry.countryCode ||
      entry.country ||
      entry.countryIso ||
      entry.languageCountry ||
      entry.lang ||
      entry.locale ||
      (v81No() ? 'NO' : 'US')
    ).trim();
    const upper = raw.toUpperCase();
    if (upper.includes('NOR') || upper.includes('NORG') || upper === 'NB-NO' || upper === 'NN-NO' || upper === 'NO') return 'NO';
    if (upper.includes('UNITED STATES') || upper === 'EN-US' || upper === 'US') return 'US';
    if (upper.includes('UNITED KINGDOM') || upper === 'EN-GB' || upper === 'GB' || upper === 'UK') return 'GB';
    const match = upper.match(/([A-Z]{2})(?:$|[-_])/);
    if (match) return match[1];
    if (/^[A-Z]{2}$/.test(upper)) return upper;
    return v81No() ? 'NO' : 'US';
  }
  function v81CountryName(code){
    const c = String(code || 'NO').toUpperCase();
    const mapNo = { NO:'Norge', SE:'Sverige', DK:'Danmark', FI:'Finland', US:'USA', GB:'Storbritannia', LK:'Sri Lanka', IN:'India', DE:'Tyskland', FR:'Frankrike', ES:'Spania' };
    const mapEn = { NO:'Norway', SE:'Sweden', DK:'Denmark', FI:'Finland', US:'USA', GB:'United Kingdom', LK:'Sri Lanka', IN:'India', DE:'Germany', FR:'France', ES:'Spain' };
    return (v81No() ? mapNo[c] : mapEn[c]) || c;
  }
  function v81FlagChip(entry){
    const code = v81CountryCode(entry);
    const lower = code.toLowerCase();
    return `<span class="v81-chip"><img class="v81-flag-img" src="https://flagcdn.com/w40/${v81Escape(lower)}.png" alt="${v81Escape(code)}"> ${v81Escape(v81CountryName(code))}</span>`;
  }
  function v81NormalizeEntries(entries){
    return (Array.isArray(entries) ? entries : [])
      .filter(Boolean)
      .map(entry => ({
        ...entry,
        name: String(entry.name || entry.playerName || entry.alias || entry.player || (v81No() ? 'Spiller' : 'Player')).trim() || (v81No() ? 'Spiller' : 'Player'),
        score: Number(entry.score || entry.points || 0) || 0,
        level: Number(entry.level || entry.levelReached || entry.stage || 1) || 1,
        difficulty: String(entry.difficulty || entry.mode || 'normal'),
        createdAt: Number(entry.createdAt || entry.time || entry.timestamp || entry.date || 0) || 0
      }))
      .sort((a, b) => (b.score - a.score) || (b.level - a.level) || (b.createdAt - a.createdAt))
      .slice(0, 10);
  }
  function v81DailyEntries(){
    const now = Date.now();
    return v81NormalizeEntries(v81ArrayFromStorage(DAILY_KEY_V81).filter(entry => {
      const ts = Number(entry && (entry.createdAt || entry.time || entry.timestamp || entry.date || 0));
      return !ts || now - ts < 24 * 60 * 60 * 1000;
    }));
  }
  function v81TotalEntries(){
    return v81NormalizeEntries(v81ArrayFromStorage(WINNERS_KEY_V81));
  }
  function v81Rows(entries, emptyText){
    if (!entries.length) return `<div class="v81-empty">${v81Escape(emptyText)}</div>`;
    return `<ol class="v81-winner-list">${entries.map((entry, index) => `
      <li class="v81-winner-row">
        <span class="v81-rank">#${index + 1}</span>
        <span class="v81-player">
          <strong class="v81-name">${v81Escape(entry.name)}</strong>
          <span class="v81-meta">
            <span class="v81-chip">${v81Escape(v81DifficultyLabel(entry.difficulty))} • L${v81Escape(entry.level)}</span>
            ${v81FlagChip(entry)}
          </span>
        </span>
        <strong class="v81-score">${v81Number(entry.score)}</strong>
      </li>`).join('')}</ol>`;
  }
  function v81CloseWinnerBoard(){
    const dialog = document.getElementById('winnerBoardModal');
    if (!dialog) return;
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch(_) {}
    dialog.removeAttribute('open');
  }
  function v81EnsureWinnerDialog(){
    let dialog = document.getElementById('winnerBoardModal');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'winnerBoardModal';
      document.body.appendChild(dialog);
    }
    dialog.className = 'winner-modal v81-winner-modal';
    dialog.oncancel = (event) => {
      event.preventDefault();
      v81CloseWinnerBoard();
    };
    return dialog;
  }
  function v81ShowWinnerBoard(){
    const dialog = v81EnsureWinnerDialog();
    const daily = v81DailyEntries();
    const total = v81TotalEntries();
    dialog.innerHTML = `
      <div class="v81-winner-card">
        <header class="v81-winner-head">
          <div>
            <h2 class="v81-winner-title">🏆 Top 10 vinnerresultat</h2>
            <p class="v81-winner-subtitle">${v81Escape(v81Text('Stabil oversikt uten synlig oppdatering. Beste score vises tydelig.', 'Stable overview without visible updating. Best scores are shown clearly.'))}</p>
          </div>
          <button class="v81-winner-close" type="button" aria-label="Lukk">×</button>
        </header>
        <div class="v81-winner-grid">
          <section class="v81-board-panel">
            <h3>⏱️ ${v81Escape(v81Text('Dagens Top 10', 'Today Top 10'))}</h3>
            ${v81Rows(daily, v81Text('Ingen dagsresultater ennå.', 'No daily scores yet.'))}
          </section>
          <section class="v81-board-panel">
            <h3>🏆 ${v81Escape(v81Text('Top 10 totalt', 'Top 10 total'))}</h3>
            ${v81Rows(total, v81Text('Ingen resultater lagret ennå.', 'No scores saved yet.'))}
          </section>
        </div>
        <button class="v81-winner-footer" type="button">${v81Escape(v81Text('Lukk', 'Close'))}</button>
      </div>`;
    dialog.querySelector('.v81-winner-close')?.addEventListener('click', v81CloseWinnerBoard);
    dialog.querySelector('.v81-winner-footer')?.addEventListener('click', v81CloseWinnerBoard);
    try { if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal(); else dialog.setAttribute('open', ''); }
    catch(_) { dialog.setAttribute('open', ''); }
  }

  window.showWinnerBoard = globalThis.showWinnerBoard = v81ShowWinnerBoard;
  window.closeWinnerBoard = globalThis.closeWinnerBoard = v81CloseWinnerBoard;
  try { showWinnerBoard = v81ShowWinnerBoard; } catch(_) {}
  try { closeWinnerBoard = v81CloseWinnerBoard; } catch(_) {}

  function v81ShowFrontMenu(){
    try { if (typeof closeEndRunDialog === 'function') closeEndRunDialog(); } catch(_) {}
    ['shopModal', 'howToModal', 'v64FeedbackDialog', 'championModal'].forEach(id => {
      const dialog = document.getElementById(id);
      if (!dialog) return;
      try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch(_) {}
      dialog.removeAttribute('open');
      dialog.classList.add('hidden');
    });

    try { clearInterval(enemyTimer); } catch(_) {}
    try { clearTimeout(enemyTimer); } catch(_) {}
    try { if (typeof stopMusic === 'function') stopMusic(); } catch(_) {}

    try { gameRunning = false; } catch(_) {}
    try { paused = false; } catch(_) {}
    try { onlineMode = false; } catch(_) {}

    document.body.classList.remove('playing-state', 'paused-state', 'online-state');
    document.body.classList.add('menu-state');

    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const levelOverlay = document.getElementById('levelOverlay');
    if (startScreen) {
      startScreen.classList.remove('hidden');
      startScreen.hidden = false;
      startScreen.style.display = '';
    }
    if (endScreen) {
      endScreen.classList.add('hidden');
      endScreen.hidden = false;
      endScreen.style.display = '';
    }
    if (levelOverlay) {
      levelOverlay.classList.add('hidden');
      levelOverlay.hidden = false;
      levelOverlay.style.display = '';
    }

    const preGame = document.getElementById('preGameSummary');
    if (preGame) {
      preGame.hidden = false;
      preGame.style.display = '';
    }

    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) pauseButton.textContent = v81Text('⏸️ Pause', '⏸️ Pause');

    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    try { if (typeof updateStartMenuStats === 'function') updateStartMenuStats(); } catch(_) {}
    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    setTimeout(v81SyncFeedbackButton, 40);
  }

  window.goToMainMenu = globalThis.goToMainMenu = v81ShowFrontMenu;
  window.returnToMainMenuFromPause = globalThis.returnToMainMenuFromPause = v81ShowFrontMenu;
  try { goToMainMenu = v81ShowFrontMenu; } catch(_) {}
  try { returnToMainMenuFromPause = v81ShowFrontMenu; } catch(_) {}

  function v81IsFrontPage(){
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const winner = document.getElementById('winnerBoardModal');
    const isMenu = document.body.classList.contains('menu-state') &&
      !document.body.classList.contains('playing-state') &&
      !document.body.classList.contains('paused-state') &&
      !document.body.classList.contains('online-state');
    const startVisible = !!(startScreen && !startScreen.classList.contains('hidden') && startScreen.style.display !== 'none');
    const endVisible = !!(endScreen && !endScreen.classList.contains('hidden'));
    const winnerOpen = !!(winner && (winner.open || winner.hasAttribute('open')));
    return isMenu && startVisible && !endVisible && !winnerOpen;
  }
  function v81SyncFeedbackButton(){
    const button = document.getElementById('v64FeedbackButton');
    const dialog = document.getElementById('v64FeedbackDialog');
    const show = v81IsFrontPage();
    if (button) {
      button.hidden = !show;
      button.style.display = show ? '' : 'none';
      button.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    if (!show && dialog && (dialog.open || dialog.hasAttribute('open'))) {
      try { if (typeof dialog.close === 'function') dialog.close(); } catch(_) {}
      dialog.removeAttribute('open');
      dialog.classList.add('hidden');
    }
  }
  function v81StabilizePauseScreen(){
    if (!document.body.classList.contains('paused-state')) return;
    const startScreen = document.getElementById('startScreen');
    const preGame = document.getElementById('preGameSummary');
    if (startScreen) startScreen.classList.add('hidden');
    if (preGame) preGame.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    v81SyncFeedbackButton();
    v81StabilizePauseScreen();
  });
  setInterval(() => {
    v81SyncFeedbackButton();
    v81StabilizePauseScreen();
  }, 350);
})();



/* --------------------------------------------------------------------------
   V82: ONLY main-menu confirmation during an active/paused run
   - Clicking Hovedmeny/Main menu while a match is running or paused now asks
     for confirmation first.
   - Yes ends the current run and returns to the real front menu with all menu
     choices visible.
   - No closes only the confirmation and keeps the match paused.
   -------------------------------------------------------------------------- */
(function v82MainMenuConfirmOnly(){
  if (window.__ragiJoyV82MainMenuConfirmOnly) return;
  window.__ragiJoyV82MainMenuConfirmOnly = true;

  const hardMainMenuV82 = window.goToMainMenu || (typeof goToMainMenu === 'function' ? goToMainMenu : null);

  function noLang(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function tx(no, en){ return noLang() ? no : en; }
  function closeDialogById(id){
    const dialog = document.getElementById(id);
    if (!dialog) return;
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch(_) {}
    dialog.removeAttribute('open');
    dialog.classList.add('hidden');
  }

  function ensureMainMenuConfirmV82(){
    let dialog = document.getElementById('v82MainMenuConfirmDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'v82MainMenuConfirmDialog';
    dialog.className = 'v82-mainmenu-confirm-dialog';
    document.body.appendChild(dialog);
    dialog.addEventListener('cancel', function(event){
      event.preventDefault();
      closeMainMenuConfirmV82();
    });
    dialog.addEventListener('click', function(event){
      if (event.target === dialog) closeMainMenuConfirmV82();
    });
    return dialog;
  }

  function renderMainMenuConfirmV82(){
    const dialog = ensureMainMenuConfirmV82();
    dialog.innerHTML = `
      <div class="v82-mainmenu-confirm-card">
        <button class="v82-confirm-x" type="button" data-v82-no aria-label="Close">×</button>
        <p class="v82-confirm-kicker">${tx('BEKREFT HOVEDMENY', 'CONFIRM MAIN MENU')}</p>
        <h2>${tx('Avslutte spillet?', 'End the game?')}</h2>
        <p>${tx('Hvis du går til hovedmenyen blir denne kampen avsluttet. Du kommer tilbake til forsiden med alle menyvalgene.', 'If you go to the main menu, this run will be ended. You will return to the front page with all menu choices.')}</p>
        <div class="v82-confirm-actions">
          <button type="button" class="v82-confirm-yes" data-v82-yes>${tx('Ja, avslutt og gå til hovedmeny', 'Yes, end and go to main menu')}</button>
          <button type="button" class="v82-confirm-no" data-v82-no>${tx('Nei, bli i pause', 'No, stay paused')}</button>
        </div>
      </div>`;
    dialog.querySelectorAll('[data-v82-no]').forEach(btn => btn.addEventListener('click', closeMainMenuConfirmV82));
    dialog.querySelector('[data-v82-yes]')?.addEventListener('click', confirmGoMainMenuV82);
    return dialog;
  }

  function closeMainMenuConfirmV82(){
    const dialog = document.getElementById('v82MainMenuConfirmDialog');
    if (dialog) {
      try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch(_) {}
      dialog.removeAttribute('open');
    }
    try {
      if (gameRunning) paused = true;
      document.body.classList.add('paused-state');
      document.body.classList.remove('playing-state');
      if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi();
    } catch(_) {}
  }

  function confirmGoMainMenuV82(){
    closeDialogById('v82MainMenuConfirmDialog');
    closeDialogById('endRunDialog');
    closeDialogById('shopModal');
    closeDialogById('v64FeedbackDialog');
    closeDialogById('howToModal');

    try { clearInterval(enemyTimer); } catch(_) {}
    try { clearTimeout(enemyTimer); } catch(_) {}
    try { clearTimeout(powerTimer); } catch(_) {}

    try { gameRunning = false; } catch(_) {}
    try { paused = false; } catch(_) {}
    try { onlineMode = false; } catch(_) {}

    if (typeof hardMainMenuV82 === 'function') {
      try { hardMainMenuV82(); } catch(_) {}
    }

    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const levelScreen = document.getElementById('levelScreen') || document.getElementById('levelOverlay');
    const preGame = document.getElementById('preGameSummary');
    if (startScreen) {
      startScreen.classList.remove('hidden');
      startScreen.hidden = false;
      startScreen.style.display = '';
    }
    if (endScreen) {
      endScreen.classList.add('hidden');
      endScreen.hidden = false;
      endScreen.style.display = '';
    }
    if (levelScreen) {
      levelScreen.classList.add('hidden');
      levelScreen.hidden = false;
      levelScreen.style.display = '';
    }
    if (preGame) {
      preGame.hidden = false;
      preGame.style.display = '';
    }

    document.body.classList.remove('playing-state', 'paused-state', 'online-state');
    document.body.classList.add('menu-state');
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    try { if (typeof updateStartMenuStats === 'function') updateStartMenuStats(); } catch(_) {}
    try { if (messageBar) messageBar.textContent = tx('Kampen ble avsluttet. Du er tilbake i hovedmenyen.', 'The run was ended. You are back in the main menu.'); } catch(_) {}
  }

  function showMainMenuConfirmV82(){
    try { if (gameRunning) paused = true; } catch(_) {}
    try { document.body.classList.add('paused-state'); document.body.classList.remove('playing-state'); } catch(_) {}
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    const dialog = renderMainMenuConfirmV82();
    try { if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal(); else dialog.setAttribute('open', ''); }
    catch(_) { dialog.setAttribute('open', ''); }
  }

  function returnToMainMenuFromPauseV82(){
    let active = false;
    try { active = Boolean(gameRunning || document.body.classList.contains('paused-state') || document.body.classList.contains('playing-state')); } catch(_) {}
    if (active) {
      showMainMenuConfirmV82();
      return;
    }
    confirmGoMainMenuV82();
  }

  window.returnToMainMenuFromPause = globalThis.returnToMainMenuFromPause = returnToMainMenuFromPauseV82;
  try { returnToMainMenuFromPause = returnToMainMenuFromPauseV82; } catch(_) {}

  document.addEventListener('click', function(event){
    const btn = event.target && event.target.closest && event.target.closest('#v82DisabledMenuSelector');
    if (!btn) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    returnToMainMenuFromPauseV82();
  }, true);
})();


/* --------------------------------------------------------------------------
   V83: MAIN MENU HARD FIX ONLY
   Purpose:
   - When Hovedmeny/Main menu is clicked during a run, pause/end-run dialog,
     show one confirmation first.
   - YES forcibly returns to the real front menu with all menu choices visible.
   - NO closes the confirmation and keeps the run paused.
   - Uses a WINDOW capture listener so older document-level click handlers cannot
     steal the click before this fix runs.
   -------------------------------------------------------------------------- */
(function v83MainMenuHardFixOnly(){
  if (window.__ragiJoyV83MainMenuHardFixOnly) return;
  window.__ragiJoyV83MainMenuHardFixOnly = true;

  function isNo(){
    try { return String(currentLanguage || 'no').toLowerCase().startsWith('no'); }
    catch (_) { return true; }
  }
  function txt(no, en){ return isNo() ? no : en; }

  function closeDialog(dialog){
    if (!dialog) return;
    try { if (dialog.open && typeof dialog.close === 'function') dialog.close(); } catch (_) {}
    dialog.removeAttribute('open');
    dialog.classList.add('hidden');
  }

  function closeAllBlockingDialogs(){
    ['v83MainMenuConfirmDialog','v82MainMenuConfirmDialog','endRunDialog','shopModal','howToModal','customizeModal','friendModal','v64FeedbackDialog','winnerBoardModal'].forEach(id => {
      closeDialog(document.getElementById(id));
    });
  }

  function ensureConfirmDialog(){
    let dialog = document.getElementById('v83MainMenuConfirmDialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = 'v83MainMenuConfirmDialog';
    dialog.className = 'v82-mainmenu-confirm-dialog';
    document.body.appendChild(dialog);

    dialog.addEventListener('cancel', function(event){
      event.preventDefault();
      stayPaused();
    });
    dialog.addEventListener('click', function(event){
      if (event.target === dialog) stayPaused();
    });
    return dialog;
  }

  function renderConfirmDialog(){
    const dialog = ensureConfirmDialog();
    dialog.innerHTML = `
      <div class="v82-mainmenu-confirm-card">
        <button class="v82-confirm-x" type="button" data-v83-no aria-label="Close">×</button>
        <p class="v82-confirm-kicker">${txt('BEKREFT HOVEDMENY', 'CONFIRM MAIN MENU')}</p>
        <h2>${txt('Tilbake til startmeny?', 'Return to start menu?')}</h2>
        <p>${txt('Hvis du går tilbake til startmenyen, avsluttes denne kampen og du mister poengsummen fra runden. Er du sikker?', 'If you return to the start menu, this run ends and you lose the score from this round. Are you sure?')}</p>
        <div class="v82-confirm-actions">
          <button type="button" class="v82-confirm-yes" data-v83-yes>${txt('Ja, avslutt og gå til startmeny', 'Yes, end and go to start menu')}</button>
          <button type="button" class="v82-confirm-no" data-v83-no>${txt('Nei, bli i pause', 'No, stay paused')}</button>
        </div>
      </div>`;
    dialog.querySelectorAll('[data-v83-no]').forEach(btn => btn.addEventListener('click', stayPaused));
    const yes = dialog.querySelector('[data-v83-yes]');
    if (yes) yes.addEventListener('click', forceReturnToFrontMenu);
    return dialog;
  }

  function markPausedBehindConfirm(){
    try { if (typeof gameRunning !== 'undefined' && gameRunning) paused = true; } catch (_) {}
    try { clearTimeout(enemyTimer); } catch (_) {}
    try { clearInterval(enemyTimer); } catch (_) {}
    document.body.classList.remove('playing-state');
    document.body.classList.add('paused-state');
    document.body.classList.remove('menu-state');
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch (_) {}
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) pauseButton.textContent = txt('▶️ Fortsett', '▶️ Resume');
  }

  function showMainMenuConfirm(){
    markPausedBehindConfirm();
    closeDialog(document.getElementById('v82MainMenuConfirmDialog'));
    const dialog = renderConfirmDialog();
    dialog.classList.remove('hidden');
    try {
      if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
      else dialog.setAttribute('open', '');
    } catch (_) {
      dialog.setAttribute('open', '');
    }
  }

  function stayPaused(){
    closeDialog(document.getElementById('v83MainMenuConfirmDialog'));
    closeDialog(document.getElementById('v82MainMenuConfirmDialog'));
    try { if (typeof gameRunning !== 'undefined' && gameRunning) paused = true; } catch (_) {}
    document.body.classList.remove('menu-state','playing-state');
    document.body.classList.add('paused-state');
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch (_) {}
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) pauseButton.textContent = txt('▶️ Fortsett', '▶️ Resume');
  }

  function resetBoardWithoutStartingTimers(){
    try {
      levelIndex = 0;
      score = 0;
      combo = 1;
      powerMode = false;
      shield = false;
      portalOpen = false;
      onlineMode = false;
      remotePlayer = null;
      roomCode = '';
      playerSlot = null;
      lives = difficultySettings[selectedDifficulty].lives;
      const level = levels[0];
      if (level) {
        map = cloneMap(level.map);
        player = { ...level.player };
        enemies = (typeof buildRandomEnemySetForLevel === 'function') ? buildRandomEnemySetForLevel(level, 0) : [];
        diamondsLeft = (typeof countTiles === 'function') ? countTiles(TILE.DOT) : 0;
        try { applyLevelTheme(level); } catch (_) {}
      }
    } catch (_) {}
  }

  function forceReturnToFrontMenu(){
    closeAllBlockingDialogs();

    try { clearTimeout(enemyTimer); } catch (_) {}
    try { clearInterval(enemyTimer); } catch (_) {}
    try { clearTimeout(powerTimer); } catch (_) {}
    try { clearInterval(musicTimer); } catch (_) {}
    try { if (typeof stopMusic === 'function') stopMusic(); } catch (_) {}
    try { if (typeof detachRoomListener === 'function') detachRoomListener(); } catch (_) {}

    try { gameRunning = false; } catch (_) {}
    try { paused = false; } catch (_) {}
    resetBoardWithoutStartingTimers();

    const start = document.getElementById('startScreen');
    const end = document.getElementById('endScreen');
    const level = document.getElementById('levelScreen') || document.getElementById('levelOverlay');
    const pre = document.getElementById('preGameSummary');
    const msg = document.getElementById('messageBar');

    document.body.classList.remove('playing-state','paused-state','online-state','game-active');
    document.body.classList.add('menu-state');

    if (start) {
      start.classList.remove('hidden');
      start.hidden = false;
      start.style.removeProperty('display');
    }
    if (end) {
      end.classList.add('hidden');
      end.hidden = false;
      end.style.removeProperty('display');
    }
    if (level) {
      level.classList.add('hidden');
      level.hidden = false;
      level.style.removeProperty('display');
    }
    if (pre) {
      pre.hidden = false;
      pre.classList.remove('hidden');
      pre.style.removeProperty('display');
    }

    try { if (typeof drawGame === 'function') drawGame(); } catch (_) {}
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch (_) {}
    try { if (typeof updateStartMenuStats === 'function') updateStartMenuStats(); } catch (_) {}
    try { if (typeof updateDifficultyScoreBadges === 'function') updateDifficultyScoreBadges(); } catch (_) {}

    if (msg) msg.textContent = txt('Kampen ble avsluttet. Du er tilbake på startsiden.', 'The run was ended. You are back on the start screen.');

    // One extra pass after older intervals have reacted.
    setTimeout(() => {
      document.body.classList.remove('playing-state','paused-state','online-state','game-active');
      document.body.classList.add('menu-state');
      if (start) { start.classList.remove('hidden'); start.style.removeProperty('display'); }
      if (pre) { pre.hidden = false; pre.classList.remove('hidden'); pre.style.removeProperty('display'); }
      if (end) end.classList.add('hidden');
      if (level) level.classList.add('hidden');
    }, 80);
  }

  function mainMenuRequested(){
    let active = false;
    try { active = Boolean(gameRunning || document.body.classList.contains('playing-state') || document.body.classList.contains('paused-state')); } catch (_) {}
    if (active) showMainMenuConfirm();
    else forceReturnToFrontMenu();
  }

  window.returnToMainMenuFromPause = globalThis.returnToMainMenuFromPause = mainMenuRequested;
  window.goToMainMenu = globalThis.goToMainMenu = function goToMainMenuV83(){
    let active = false;
    try { active = Boolean(gameRunning || document.body.classList.contains('playing-state') || document.body.classList.contains('paused-state')); } catch (_) {}
    if (active) showMainMenuConfirm();
    else forceReturnToFrontMenu();
  };
  try { returnToMainMenuFromPause = window.returnToMainMenuFromPause; } catch (_) {}
  try { goToMainMenu = window.goToMainMenu; } catch (_) {}

  function isMainMenuClickTarget(event){
    const target = event.target;
    if (!target || !target.closest) return false;
    return Boolean(target.closest('#v83DisabledMenuSelector')); /* disabled by V85 */
  }

  // Window capture runs before older document capture handlers.
  window.addEventListener('click', function(event){
    if (!isMainMenuClickTarget(event)) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    mainMenuRequested();
  }, true);

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('menuFromPauseButton');
    if (btn) btn.onclick = null;
  });
  setTimeout(function(){
    const btn = document.getElementById('menuFromPauseButton');
    if (btn) btn.onclick = null;
  }, 300);
})();


/* --------------------------------------------------------------------------
   V85: ONLY main-menu return + laser pause/cleanup fix
   - All Hovedmeny/Main menu buttons use the same confirmation.
   - YES clears active lasers/effects and returns to the real start menu.
   - Pause freezes laser lifetime; Resume continues the remaining time.
   -------------------------------------------------------------------------- */
(function v85MainMenuAndLaserFix(){
  if (window.__ragiJoyV85MainMenuAndLaserFix) return;
  window.__ragiJoyV85MainMenuAndLaserFix = true;

  let turretPauseStartedAt = 0;

  function isNo(){
    try { return String(currentLanguage || localStorage.getItem('ragiJoyLanguage') || 'no').toLowerCase().startsWith('no'); }
    catch(_) { return true; }
  }
  function tx(no, en){ return isNo() ? no : en; }
  function byId(id){ return document.getElementById(id); }

  function closeDialogElement(el){
    if (!el) return;
    try { if (el.open && typeof el.close === 'function') el.close(); } catch(_) {}
    el.removeAttribute('open');
    el.classList.add('hidden');
  }

  function closeGameDialogs(){
    [
      'v85MainMenuConfirmDialog', 'v83MainMenuConfirmDialog', 'v82MainMenuConfirmDialog',
      'finalMainMenuConfirmDialog', 'endRunDialog', 'shopModal', 'winnerBoardModal',
      'howToModal', 'customizeModal', 'profileNameModal', 'feedbackDialog',
      'v64FeedbackDialog', 'dailyRecordCelebration', 'friendModal', 'friendLobbyModal'
    ].forEach(id => closeDialogElement(byId(id)));

    document.querySelectorAll('dialog[open]').forEach(closeDialogElement);
  }

  function removeLaserVisuals(){
    document.querySelectorAll('.laser-beam-effect, .laser-impact-effect').forEach(el => el.remove());
    document.querySelectorAll('.turret-cell').forEach(cell => {
      cell.classList.remove('turret-cell');
      delete cell.dataset.turret;
      cell.removeAttribute('data-turret');
    });
    const hud = byId('v70LaserHud');
    if (hud) {
      hud.classList.add('hidden');
      hud.innerHTML = '';
    }
  }

  function clearLasersCompletely(){
    try { v23Turrets = []; } catch(_) {}
    try { v23TurretInventory = 0; } catch(_) {}
    try { v23PlacingTurret = false; } catch(_) {}
    try { v23SlowUntil = 0; } catch(_) {}
    try { if (typeof v23StopTurretLoop === 'function') v23StopTurretLoop(); } catch(_) {}
    try { document.body.classList.remove('turret-placement-active'); } catch(_) {}
    turretPauseStartedAt = 0;
    removeLaserVisuals();
  }

  function pauseLaserClock(){
    if (turretPauseStartedAt) return;
    let list = [];
    try { list = Array.isArray(v23Turrets) ? v23Turrets : []; } catch(_) { list = []; }
    if (!list.length) return;

    const now = Date.now();
    turretPauseStartedAt = now;
    list.forEach(turret => {
      const remaining = Math.max(0, Number(turret.expiresAt || now) - now);
      turret.__v85RemainingMs = remaining;
      turret.__v85LastShotAt = Number(turret.lastShotAt || 0);
    });
    renderPausedLaserHud();
  }

  function resumeLaserClock(){
    if (!turretPauseStartedAt) return;
    const now = Date.now();
    const pausedFor = Math.max(0, now - turretPauseStartedAt);
    let list = [];
    try { list = Array.isArray(v23Turrets) ? v23Turrets : []; } catch(_) { list = []; }

    list.forEach(turret => {
      if (typeof turret.__v85RemainingMs === 'number') {
        turret.expiresAt = now + Math.max(0, turret.__v85RemainingMs);
      } else if (Number.isFinite(Number(turret.expiresAt))) {
        turret.expiresAt = Number(turret.expiresAt) + pausedFor;
      }
      if (Number(turret.__v85LastShotAt || 0)) {
        turret.lastShotAt = Number(turret.__v85LastShotAt) + pausedFor;
      }
      delete turret.__v85RemainingMs;
      delete turret.__v85LastShotAt;
    });
    turretPauseStartedAt = 0;
    try { if (typeof updateLaserHud === 'function') updateLaserHud(); } catch(_) {}
  }

  function renderPausedLaserHud(){
    if (!turretPauseStartedAt) return;
    let list = [];
    try { list = Array.isArray(v23Turrets) ? v23Turrets : []; } catch(_) { list = []; }
    const active = list.filter(t => Number(t.__v85RemainingMs || 0) > 0);
    const hud = byId('v70LaserHud');
    if (!hud || !active.length || !gameRunning) return;
    const longest = Math.max(...active.map(t => Number(t.__v85RemainingMs || 0)));
    const seconds = Math.max(0, Math.ceil(longest / 1000));
    hud.classList.remove('hidden');
    hud.innerHTML = `<span>⏸️ ${tx('Laser er pauset', 'Lasers paused')}: <b>${active.length}</b></span><span>⏳ ${tx('igjen ca.', 'left about')} <b>${seconds}s</b></span><small>${tx('Fortsett spillet for at laserne skal skyte videre.', 'Resume the game so the lasers keep shooting.')}</small>`;
  }

  function setPauseUi(){
    const active = Boolean(gameRunning);
    const pauseButton = byId('pauseButton');
    if (pauseButton) {
      pauseButton.textContent = paused ? tx('▶️ Fortsett', '▶️ Resume') : tx('⏸️ Pause', '⏸️ Pause');
      pauseButton.disabled = !active;
      pauseButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }
    document.body.classList.toggle('paused-state', Boolean(active && paused));
    document.body.classList.toggle('playing-state', Boolean(active && !paused));
    document.body.classList.toggle('menu-state', Boolean(!active));
  }

  function pauseGameForMenu(){
    if (!gameRunning) return;
    paused = true;
    try { clearInterval(enemyTimer); } catch(_) {}
    try { clearTimeout(enemyTimer); } catch(_) {}
    pauseLaserClock();
    setPauseUi();
    if (messageBar) messageBar.textContent = tx('Pause aktivert. Velg Fortsett eller Hovedmeny.', 'Paused. Choose Resume or Main menu.');
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    setPauseUi();
  }

  function togglePauseV85(){
    if (!gameRunning) return;
    const nextPaused = !paused;
    paused = nextPaused;
    try { clearInterval(enemyTimer); } catch(_) {}
    try { clearTimeout(enemyTimer); } catch(_) {}

    if (paused) {
      pauseLaserClock();
      if (messageBar) messageBar.textContent = tx('Pause aktivert. Laser-tiden er også pauset.', 'Paused. Laser time is paused too.');
    } else {
      resumeLaserClock();
      try { enemyTimer = setTimeout(moveEnemies, getEnemyDelay()); } catch(_) {}
      try { if (typeof v23StartTurretLoop === 'function') v23StartTurretLoop(); } catch(_) {}
      if (messageBar) messageBar.textContent = t('resumed');
    }

    setPauseUi();
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    setPauseUi();
    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    if (paused) setTimeout(renderPausedLaserHud, 40);
  }

  function resetBoardToFirstLevel(){
    try {
      const first = levels && levels[0];
      if (!first) return;
      map = cloneMap(first.map);
      player = { ...first.player };
      enemies = (typeof buildRandomEnemySetForLevel === 'function') ? buildRandomEnemySetForLevel(first, 0) : (first.enemies || []).map(e => ({ ...e }));
      diamondsLeft = (typeof countTiles === 'function') ? countTiles(TILE.DOT) : 0;
      try { applyLevelTheme(first); } catch(_) {}
    } catch(_) {}
  }

  function forceRealStartMenu(){
    closeGameDialogs();

    try { clearInterval(enemyTimer); } catch(_) {}
    try { clearTimeout(enemyTimer); } catch(_) {}
    try { clearTimeout(powerTimer); } catch(_) {}
    try { clearTimeout(levelTimer); } catch(_) {}
    try { clearInterval(syncTimer); } catch(_) {}
    try { if (typeof detachRoomListener === 'function') detachRoomListener(); } catch(_) {}
    try { if (typeof stopMusic === 'function') stopMusic(); } catch(_) {}

    clearLasersCompletely();

    try { onlineMode = false; } catch(_) {}
    try { remotePlayer = null; } catch(_) {}
    try { roomCode = ''; } catch(_) {}
    try { playerSlot = null; } catch(_) {}
    try { gameRunning = false; } catch(_) {}
    try { paused = false; } catch(_) {}
    try { score = 0; } catch(_) {}
    try { levelIndex = 0; } catch(_) {}
    try { combo = 1; } catch(_) {}
    try { powerMode = false; } catch(_) {}
    try { shield = false; } catch(_) {}
    try { portalOpen = false; } catch(_) {}
    try { lives = difficultySettings[selectedDifficulty].lives; } catch(_) {}

    resetBoardToFirstLevel();

    const body = document.body;
    const start = byId('startScreen');
    const end = byId('endScreen');
    const level = byId('levelScreen') || byId('levelOverlay');
    const pre = byId('preGameSummary');
    const msg = byId('messageBar');

    body.classList.add('menu-state');
    body.classList.remove('playing-state','paused-state','game-active','online-state','friend-playing-state','run-ended-state','turret-placement-active');

    if (start) {
      start.classList.remove('hidden');
      start.hidden = false;
      start.removeAttribute('aria-hidden');
      start.style.display = '';
      start.style.visibility = '';
      start.style.opacity = '';
      start.style.pointerEvents = '';
    }
    if (end) {
      end.classList.add('hidden');
      end.removeAttribute('open');
      end.style.display = '';
    }
    if (level) {
      level.classList.add('hidden');
      level.removeAttribute('open');
      level.style.display = '';
    }
    if (pre) {
      pre.classList.remove('hidden');
      pre.hidden = false;
      pre.removeAttribute('aria-hidden');
      pre.style.display = '';
    }
    if (msg) {
      msg.textContent = '';
      msg.style.display = '';
    }

    try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    clearLasersCompletely();
    try { if (typeof v23UpdateShopUi === 'function') v23UpdateShopUi(); } catch(_) {}
    try { if (typeof updateScoreDisplay === 'function') updateScoreDisplay(); } catch(_) {}
    try { if (typeof updateStartMenuStats === 'function') updateStartMenuStats(); } catch(_) {}
    try { if (typeof updatePreGameSummary === 'function') updatePreGameSummary(); } catch(_) {}
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}

    body.classList.add('menu-state');
    body.classList.remove('playing-state','paused-state','game-active','online-state','turret-placement-active');
    if (start) start.classList.remove('hidden');
    if (end) end.classList.add('hidden');
    if (level) level.classList.add('hidden');
    if (pre) pre.classList.remove('hidden');
    removeLaserVisuals();

    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(_) { try { window.scrollTo(0, 0); } catch(__) {} }

    [40, 120, 300, 700].forEach(delay => setTimeout(() => {
      body.classList.add('menu-state');
      body.classList.remove('playing-state','paused-state','game-active','online-state','turret-placement-active');
      if (start) start.classList.remove('hidden');
      if (end) end.classList.add('hidden');
      if (level) level.classList.add('hidden');
      if (pre) pre.classList.remove('hidden');
      clearLasersCompletely();
      try { if (typeof drawGame === 'function') drawGame(); } catch(_) {}
    }, delay));
  }

  function ensureConfirmDialog(){
    let dialog = byId('v85MainMenuConfirmDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'v85MainMenuConfirmDialog';
    dialog.className = 'v85-mainmenu-dialog';
    document.body.appendChild(dialog);

    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      stayPaused();
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) stayPaused();
    });
    return dialog;
  }

  function renderConfirmDialog(){
    const dialog = ensureConfirmDialog();
    dialog.innerHTML = `
      <div class="v85-mainmenu-card">
        <button type="button" class="v85-mainmenu-x" data-v85-no>×</button>
        <p class="v85-mainmenu-kicker">${tx('BEKREFT HOVEDMENY', 'CONFIRM MAIN MENU')}</p>
        <h2>${tx('Tilbake til startmeny?', 'Return to start menu?')}</h2>
        <p>${tx('Hvis du går tilbake til startmenyen nå, avsluttes kampen og du mister score for denne runden. Er du sikker?', 'If you return to the start menu now, this run ends and you lose the score from this round. Are you sure?')}</p>
        <div class="v85-mainmenu-actions">
          <button type="button" class="v85-mainmenu-yes" data-v85-yes>${tx('Ja, avslutt og gå til startmeny', 'Yes, end and go to start menu')}</button>
          <button type="button" class="v85-mainmenu-no" data-v85-no>${tx('Nei, bli i pause', 'No, stay paused')}</button>
        </div>
      </div>`;
    dialog.querySelector('[data-v85-yes]')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      forceRealStartMenu();
    });
    dialog.querySelectorAll('[data-v85-no]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      stayPaused();
    }));
    return dialog;
  }

  function showMainMenuConfirm(){
    pauseGameForMenu();
    closeDialogElement(byId('v83MainMenuConfirmDialog'));
    closeDialogElement(byId('v82MainMenuConfirmDialog'));
    closeDialogElement(byId('finalMainMenuConfirmDialog'));
    const dialog = renderConfirmDialog();
    dialog.classList.remove('hidden');
    try { if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal(); else dialog.setAttribute('open',''); }
    catch(_) { dialog.setAttribute('open',''); }
  }

  function stayPaused(){
    closeDialogElement(byId('v85MainMenuConfirmDialog'));
    if (gameRunning) paused = true;
    pauseLaserClock();
    setPauseUi();
    if (messageBar) messageBar.textContent = tx('Pause aktivert. Trykk Fortsett for å spille videre.', 'Paused. Press Resume to continue.');
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    setPauseUi();
    renderPausedLaserHud();
  }

  function handleMainMenuRequest(){
    const active = Boolean(gameRunning || document.body.classList.contains('playing-state') || document.body.classList.contains('paused-state'));
    if (active) showMainMenuConfirm();
    else forceRealStartMenu();
  }

  window.togglePause = globalThis.togglePause = togglePauseV85;
  try { togglePause = togglePauseV85; } catch(_) {}
  window.returnToMainMenuFromPause = globalThis.returnToMainMenuFromPause = handleMainMenuRequest;
  try { returnToMainMenuFromPause = handleMainMenuRequest; } catch(_) {}
  window.goToMainMenu = globalThis.goToMainMenu = function goToMainMenuV85(){
    const active = Boolean(gameRunning || document.body.classList.contains('playing-state') || document.body.classList.contains('paused-state'));
    if (active) showMainMenuConfirm();
    else forceRealStartMenu();
  };
  try { goToMainMenu = window.goToMainMenu; } catch(_) {}

  window.addEventListener('click', function(event){
    const target = event.target && event.target.closest ? event.target.closest('#pauseButton') : null;
    if (!target) return;
    if (window.__v86SuppressPauseClickUntil && Date.now() < window.__v86SuppressPauseClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    togglePauseV85();
  }, true);

  window.addEventListener('click', function(event){
    const target = event.target && event.target.closest ? event.target.closest('#menuFromPauseButton, .v41-menu-now, #mainMenuButton') : null;
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    handleMainMenuRequest();
  }, true);

  /* If the original End-run dialog is rendered after this patch, remove old inline behavior. */
  function normalizeMenuButtons(){
    const ids = ['menuFromPauseButton', 'mainMenuButton'];
    ids.forEach(id => {
      const btn = byId(id);
      if (!btn) return;
      btn.onclick = null;
      btn.removeAttribute('onclick');
    });
    document.querySelectorAll('.v41-menu-now').forEach(btn => {
      btn.onclick = null;
      btn.removeAttribute('onclick');
    });
  }

  const oldShowEndRun = window.showEndRunDialog || (typeof showEndRunDialog === 'function' ? showEndRunDialog : null);
  if (typeof oldShowEndRun === 'function' && !oldShowEndRun.__v85Wrapped) {
    const wrapped = function showEndRunDialogV85(){
      const result = oldShowEndRun.apply(this, arguments);
      setTimeout(normalizeMenuButtons, 0);
      setTimeout(normalizeMenuButtons, 60);
      return result;
    };
    wrapped.__v85Wrapped = true;
    window.showEndRunDialog = globalThis.showEndRunDialog = wrapped;
    try { showEndRunDialog = wrapped; } catch(_) {}
  }

  const oldStart = window.startGame || (typeof startGame === 'function' ? startGame : null);
  if (typeof oldStart === 'function' && !oldStart.__v85LaserResetWrapped) {
    const wrappedStart = function startGameV85(){
      clearLasersCompletely();
      const result = oldStart.apply(this, arguments);
      turretPauseStartedAt = 0;
      return result;
    };
    wrappedStart.__v85LaserResetWrapped = true;
    window.startGame = globalThis.startGame = wrappedStart;
    try { startGame = wrappedStart; } catch(_) {}
  }

  normalizeMenuButtons();
  setInterval(() => {
    normalizeMenuButtons();
    if (paused && gameRunning) renderPausedLaserHud();
  }, 350);
})();


/* --------------------------------------------------------------------------
   V86: større spillknapper + pause reagerer på første trykk
   Kun denne delen er endret.
   -------------------------------------------------------------------------- */
(function v86BiggerButtonsAndFirstTapPause(){
  if (window.__ragiJoyV86Patch) return;
  window.__ragiJoyV86Patch = true;

  function byId(id){ return document.getElementById(id); }

  function normalizePauseButton(){
    const btn = byId('pauseButton');
    if (!btn) return;
    btn.onclick = null;
    btn.removeAttribute('onclick');
    btn.disabled = !(typeof gameRunning !== 'undefined' && gameRunning);
    btn.style.touchAction = 'manipulation';
  }

  function runPauseNow(event){
    const btn = event && event.target && event.target.closest ? event.target.closest('#pauseButton') : null;
    if (!btn) return;
    const active = Boolean(typeof gameRunning !== 'undefined' && gameRunning);
    if (!active) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();

    // Hindrer at den etterfølgende click-eventen toggler pause tilbake igjen.
    window.__v86SuppressPauseClickUntil = Date.now() + 650;

    btn.disabled = false;
    try {
      if (typeof togglePauseV85 === 'function') togglePauseV85();
      else if (typeof window.togglePause === 'function') window.togglePause();
      else if (typeof togglePause === 'function') togglePause();
    } catch(_) {}

    // Sørg for riktig tekst/state etter første trykk.
    try { if (typeof v30UpdatePlayUi === 'function') v30UpdatePlayUi(); } catch(_) {}
    try {
      if (typeof gameRunning !== 'undefined' && gameRunning) {
        document.body.classList.toggle('paused-state', Boolean(paused));
        document.body.classList.toggle('playing-state', !paused);
        const pauseBtn = byId('pauseButton');
        if (pauseBtn) {
          const no = String((typeof currentLanguage !== 'undefined' ? currentLanguage : 'no') || 'no').toLowerCase().startsWith('no');
          pauseBtn.textContent = paused ? (no ? '▶️ Fortsett' : '▶️ Resume') : '⏸️ Pause';
          pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
          pauseBtn.disabled = false;
        }
      }
    } catch(_) {}
  }

  // Pointerdown gjør at pause svarer umiddelbart på PC og mobil, ikke først etter click-delay.
  window.addEventListener('pointerdown', runPauseNow, true);
  window.addEventListener('touchstart', function(event){
    // Fallback for eldre mobilnettlesere uten stabil pointer-events.
    if (window.PointerEvent) return;
    runPauseNow(event);
  }, { capture: true, passive: false });

  document.addEventListener('DOMContentLoaded', normalizePauseButton);
  setTimeout(normalizePauseButton, 100);
  setInterval(normalizePauseButton, 500);
})();
