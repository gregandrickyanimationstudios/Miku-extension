// ===============================
// 1️⃣ Version info
// ===============================
const CURRENT_VERSION = "0.4.8";
const LATEST_VERSION = "0.4.8";

// ===============================
// 2️⃣ Prerelease detection
// ===============================
function isPrerelease(version) {
  const parts = version.split(".").map(Number);
  return parts[0] < 1;
}
const prerelease = isPrerelease(CURRENT_VERSION);
// ===============================
// 🎨 Pixel Paint State
// ===============================
let paintCanvas = null;
let paintCtx = null;
let painting = false;
let pixelPaintEnabled = false;
let pageMenu = null;

// ===============================
// 3️⃣ Outfits and animations
// ===============================
const mikuOutfits = {
  lay: {
    idle: [
      "miku-lay-wave-1.png",
      "miku-lay-wave-3.png",
      "miku-lay-wave-4.png",
      "miku-lay-wave-5.png",
      "miku-lay-wave-4.png",
      "miku-lay-wave-3.png",
    ]
  },
  portal: {
    idle: [
      "miku-portal-wave-1.png",
      "miku-portal-wave-2.png",
      "miku-portal-wave-3.png",
      "miku-portal-wave-4.png",
      "miku-portal-wave-3.png",
      "miku-portal-wave-2.png"
    ]
  }
};

let currentOutfit = "lay";
let currentAnimation = "idle";
let currentFrame = 0;
let animationInterval = null;

// ===============================
// 4️⃣ Remove old Miku
// ===============================
const oldMiku = document.getElementById("pixel-miku-helper");
if (oldMiku) oldMiku.remove();

// ===============================
// 5️⃣ Create Miku image
// ===============================
const img = document.createElement("img");
img.id = "pixel-miku-helper";
img.src = chrome.runtime.getURL(mikuOutfits[currentOutfit][currentAnimation][0]);
img.style.position = "fixed";
img.style.bottom = "10px";
img.style.left = "10px";
img.style.width = "100px";
img.style.height = "100px";
img.style.zIndex = 9999;
img.style.cursor = "grab";
img.style.userSelect = "none";
document.body.appendChild(img);

// ===============================
// 6️⃣ Animation engine
// ===============================
function startMikuAnimation(speed = 350) {
  stopMikuAnimation();

  const frames = mikuOutfits[currentOutfit][currentAnimation]
    .map(f => chrome.runtime.getURL(f));

  img.src = frames[0];
  currentFrame = 0;

  animationInterval = setInterval(() => {
    currentFrame = (currentFrame + 1) % frames.length;
    img.src = frames[currentFrame];
  }, speed);
}

function stopMikuAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

function switchOutfit(outfit) {
  if (!mikuOutfits[outfit]) return;
  currentOutfit = outfit;
  currentAnimation = "idle";
  startMikuAnimation(350);
  mikuSpeak(`Switching outfit...`, 2000);
}
// ===============================
// 🎨 Pixel Paint Functions
// ===============================
function enablePixelPaint() {
  if (pixelPaintEnabled) return;
  pixelPaintEnabled = true;

  paintCanvas = document.createElement("canvas");
  paintCanvas.id = "miku-pixel-paint";
  paintCanvas.width = window.innerWidth;
  paintCanvas.height = window.innerHeight;

  paintCanvas.style.position = "fixed";
  paintCanvas.style.top = "0";
  paintCanvas.style.left = "0";
  paintCanvas.style.zIndex = "9998";
  paintCanvas.style.cursor = "crosshair";

  document.body.appendChild(paintCanvas);

  paintCtx = paintCanvas.getContext("2d");
  paintCtx.strokeStyle = "#000000"; // BLACK brush
  paintCtx.lineWidth = 8;
  paintCtx.lineCap = "square";
  paintCtx.imageSmoothingEnabled = false;

  paintCanvas.addEventListener("mousedown", startPaint);
  paintCanvas.addEventListener("mousemove", drawPaint);
  window.addEventListener("mouseup", stopPaint);
}

function disablePixelPaint() {
  if (!pixelPaintEnabled) return;
  pixelPaintEnabled = false;

  paintCanvas.remove();
  paintCanvas = null;
  paintCtx = null;
}

function togglePixelPaint() {
  if (pixelPaintEnabled) {
    disablePixelPaint();
  } else {
    enablePixelPaint();
  }
}

function startPaint(e) {
  painting = true;
  paintCtx.beginPath();
  paintCtx.moveTo(e.clientX, e.clientY);
}

function drawPaint(e) {
  if (!painting) return;
  paintCtx.lineTo(e.clientX, e.clientY);
  paintCtx.stroke();
}

function stopPaint() {
  painting = false;
}

// ===============================
// 7️⃣ Draggable logic
// ===============================
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

img.addEventListener("mousedown", e => {
  isDragging = true;
  img.style.cursor = "grabbing";
  offsetX = e.clientX - img.getBoundingClientRect().left;
  offsetY = e.clientY - img.getBoundingClientRect().top;
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  img.style.left = e.clientX - offsetX + "px";
  img.style.top = e.clientY - offsetY + "px";

  if (bubble) {
    const rect = img.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.bottom = window.innerHeight - rect.top + 10 + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  img.style.cursor = "grab";
});

// ===============================
// 8️⃣ Speech bubble
// ===============================
const bubble = document.createElement("div");
bubble.id = "miku-speech-bubble";
bubble.style.position = "fixed";
bubble.style.bottom = "120px";
bubble.style.left = "10px";
bubble.style.padding = "8px 12px";
bubble.style.background = "rgba(255, 255, 255, 0.9)";
bubble.style.border = "2px solid #00BFFF";
bubble.style.borderRadius = "12px";
bubble.style.fontFamily = "sans-serif";
bubble.style.fontSize = "14px";
bubble.style.color = "#000"; // black font
bubble.style.maxWidth = "200px";
bubble.style.display = "none";
bubble.style.zIndex = 10000;
bubble.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
bubble.style.pointerEvents = "none";
document.body.appendChild(bubble);

function mikuSpeak(text, duration = 3000) {
  bubble.textContent = text;
  bubble.style.display = "block";
  const rect = img.getBoundingClientRect();
  bubble.style.left = rect.left + "px";
  bubble.style.bottom = window.innerHeight - rect.top + 10 + "px";

  setTimeout(() => {
    bubble.style.display = "none";
  }, duration);
}

// ===============================
// 9️⃣ Keywords
// ===============================
const keywordResponses = {
  music: "Ooh! I see you’re talking about music! Want me to suggest a song?",
  "Hatsune Miku": "Yay! Hatsune Miku! She's my big inspiration!",
  anime: "Anime?! I love colorful worlds!",
  game: "Gaming time? Let’s find a fun soundtrack!",
  homework: "I haaaaate homework! I'll bear with ya troop.",
  duolingo: "Duolingo! Have you done your lesson today?"
};

const keywordTracker = {};
for (const keyword in keywordResponses) keywordTracker[keyword] = 0;
const MAX_RESPONSES = 2;

// ===============================
// 🔊 Song suggestions
// ===============================
const songs = {
  pop: ["World is Mine", "Tell Your World", "ODDS&ENDS", "Love is War"],
  rock: ["Rolling Girl", "Melt", "Senbonzakura", "Romeo and Cinderella"],
  dance: ["Matryoshka", "Electric Angel", "PoPiPo"],
  "vocaloid-classics": ["Hibikase", "Just Be Friends", "The Disappearance of Hatsune Miku"]
};

let musicSuggestionCount = 0;
const MAX_MUSIC_SUGGESTIONS = 1;

function suggestSong() {
  if (musicSuggestionCount >= MAX_MUSIC_SUGGESTIONS) return;
  const categories = Object.keys(songs);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const songList = songs[category];
  const song = songList[Math.floor(Math.random() * songList.length)];
  mikuSpeak(`I suggest "${song}" from ${category}! 🎵`, 5000);
  musicSuggestionCount++;
}

// ===============================
// 10️⃣ Scan page for keywords
// ===============================
function scanPageForKeywords() {
  const text = document.body.innerText.toLowerCase();
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (text.includes(keyword.toLowerCase()) && keywordTracker[keyword] < MAX_RESPONSES) {
      mikuSpeak(response, 5000);
      keywordTracker[keyword] += 1;
      if (keyword.toLowerCase() === "music") suggestSong();
      break;
    }
  }
}

// ===============================
// 11️⃣ Version check
// ===============================
function checkForUpdate() {
  if (CURRENT_VERSION !== LATEST_VERSION) {
    mikuSpeak("Hey! A new version of me is out! Please refresh your extension", 5000);
  }
}

// ===============================
// 12️⃣ Initial greeting
// ===============================
window.addEventListener("load", () => {
  checkForUpdate();
  scanPageForKeywords();

  if (prerelease) {
    mikuSpeak("Hey! I'm a prerelease version. Things might change!", 4000);
  } else {
    mikuSpeak("I'm a stable version!", 4000);
  }
});

// Scan periodically
setInterval(scanPageForKeywords, 10000);

// ===============================
// 13️⃣ Right-click menu (chat + outfits)
// ===============================
const chatResponses = {
  A: "I'm feeling energetic! Ready to sing some songs with you!",
  B: "Why did the piano get locked out? Because it forgot its keys!",
  C: "Always follow your heart, but remember to take breaks! 💙"
};

img.addEventListener("contextmenu", e => {
  e.preventDefault();
  showChatMenu();
});

function showChatMenu() {
  const oldMenu = document.getElementById("miku-chat-menu");
  if (oldMenu) oldMenu.remove();

  const rect = img.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.id = "miku-chat-menu";
  menu.style.position = "fixed";
  menu.style.left = rect.left + "px";
  menu.style.bottom = window.innerHeight - rect.top + 10 + "px";
  menu.style.background = "#fff";
  menu.style.border = "2px solid #00BFFF";
  menu.style.borderRadius = "8px";
  menu.style.padding = "8px";
  menu.style.zIndex = 10001;
  menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

  // Chat options
  ["A", "B", "C"].forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.style.margin = "4px";
    btn.onclick = () => {
      mikuSpeak(chatResponses[option], 5000);
      menu.remove();
    };
    menu.appendChild(btn);
  });

  // Outfit options
  const outfitHeader = document.createElement("div");
  outfitHeader.textContent = "Switch Outfit:";
  outfitHeader.style.marginTop = "6px";
  outfitHeader.style.fontWeight = "bold";
  menu.appendChild(outfitHeader);

  ["lay", "portal"].forEach(outfit => {
    const btn = document.createElement("button");
    btn.textContent = outfit;
    btn.style.margin = "2px";
    btn.onclick = () => {
      switchOutfit(outfit);
      menu.remove();
    };
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
}
img.style.width;
img.style.height