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
