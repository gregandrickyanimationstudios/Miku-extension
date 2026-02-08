// ===============================
// Encouragement messages
// ===============================
const messages = [
  "You’re doing great.",
  "Small progress still counts.",
  "I’m proud of you.",
  "Take your time. You’ve got this.",
  "Keep going — you’re learning."
];

document.addEventListener("DOMContentLoaded", () => {
  const messageEl = document.getElementById("message");
  const encourageBtn = document.getElementById("encourageBtn");

  if (encourageBtn && messageEl) {
    encourageBtn.addEventListener("click", () => {
      const random = Math.floor(Math.random() * messages.length);
      messageEl.textContent = messages[random];
    });
  }

  setupSongSystem();
  setupDuolingo();
  setupTokens();
});

// ===============================
// Music suggestion system
// ===============================
let currentSong = null;
let currentCategory = null;
let songDB = {};

function setupSongSystem() {
  fetch(chrome.runtime.getURL("songs.txt"))
    .then(res => res.text())
    .then(text => {
      let category = "";
      text.split("\n").forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith("#")) {
          category = line.substring(1).trim();
          songDB[category] = [];
        } else if (category) {
          songDB[category].push(line);
        }
      });
    });

  const suggestBtn = document.getElementById("suggest-song");
  const likeBtn = document.getElementById("like-song");

  if (suggestBtn) {
    suggestBtn.addEventListener("click", suggestSong);
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", likeCurrentSong);
  }
}

function suggestSong() {
  chrome.storage.local.get("likes", data => {
    const likes = data.likes || {};
    const categories = Object.keys(songDB);
    if (categories.length === 0) return;

    const weighted = [];

    categories.forEach(cat => {
      const weight = (likes[cat]?.length || 0) + 1;
      for (let i = 0; i < weight; i++) weighted.push(cat);
    });

    currentCategory = weighted[Math.floor(Math.random() * weighted.length)];
    const songs = songDB[currentCategory];
    currentSong = songs[Math.floor(Math.random() * songs.length)];

    alert(`Suggested song:\n${currentSong}\n(${currentCategory})`);
  });
}

function likeCurrentSong() {
  if (!currentSong || !currentCategory) return;

  chrome.storage.local.get("likes", data => {
    const likes = data.likes || {};
    if (!likes[currentCategory]) likes[currentCategory] = [];

    if (!likes[currentCategory].includes(currentSong)) {
      likes[currentCategory].push(currentSong);
    }

    chrome.storage.local.set({ likes }, () => {
      alert(`Got it! More ${currentCategory} songs will be suggested.`);
    });
  });
}

// ===============================
// Duolingo info (manual input)
// ===============================
function setupDuolingo() {
  const saveBtn = document.getElementById("save-duo-info");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const language = document.getElementById("duo-language")?.value || "";
    const streak = parseInt(
      document.getElementById("duo-streak")?.value,
      10
    ) || 0;

    chrome.storage.local.set(
      { duoLanguage: language, duoStreak: streak },
      () => alert("Learning info saved.")
    );
  });
}

// ===============================
// Token storage (local only)
// ===============================
function setupTokens() {
  const saveSpotify = document.getElementById("save-spotify");
  const saveDiscord = document.getElementById("save-discord");

  if (saveSpotify) {
    saveSpotify.addEventListener("click", () => {
      const token = document.getElementById("spotify-token")?.value;
      if (!token) return;

      chrome.storage.local.set({ spotifyToken: token }, () => {
        alert("Spotify token saved.");
      });
    });
  }

  if (saveDiscord) {
    saveDiscord.addEventListener("click", () => {
      const token = document.getElementById("discord-token")?.value;
      if (!token) return;

      chrome.storage.local.set({ discordToken: token }, () => {
        alert("Discord token saved.");
      });
    });
  }
}
const menuToggleBtn = document.getElementById("toggle-page-menu");

chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
  menuToggleBtn.textContent = pageMenuEnabled ? "Disable Page Menu" : "Enable Page Menu";
});

menuToggleBtn.addEventListener("click", () => {
  chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
    const newValue = !pageMenuEnabled;
    chrome.storage.local.set({ pageMenuEnabled: newValue }, () => {
      menuToggleBtn.textContent = newValue ? "Disable Page Menu" : "Enable Page Menu";
 
      const togglePageMenuBtn = document.getElementById("toggle-page-menu");

// Load current state from storage
chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
  togglePageMenuBtn.textContent = pageMenuEnabled ? "Disable Right-Click Menu" : "Enable Right-Click Menu";
});

// When user clicks the button
togglePageMenuBtn.addEventListener("click", () => {
  chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
    const newState = !pageMenuEnabled;
    chrome.storage.local.set({ pageMenuEnabled: newState }, () => {
      togglePageMenuBtn.textContent = newState ? "Disable Right-Click Menu" : "Enable Right-Click Menu";

      // Notify the content script to update immediately
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setPageMenuEnabled", value: newState });
        const togglePageMenuBtn = document.getElementById("toggle-page-menu");

// Load current state from storage (default is true)
chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
  if (pageMenuEnabled === undefined) pageMenuEnabled = true;
  togglePageMenuBtn.textContent = pageMenuEnabled ? "Disable Right-Click Paint" : "Enable Right-Click Paint";
});

// When user clicks the button
togglePageMenuBtn.addEventListener("click", () => {
  chrome.storage.local.get("pageMenuEnabled", ({ pageMenuEnabled }) => {
    const newState = !pageMenuEnabled;
    chrome.storage.local.set({ pageMenuEnabled: newState }, () => {
      togglePageMenuBtn.textContent = newState ? "Disable Right-Click Paint" : "Enable Right-Click Paint";

      // Send message to content script to update immediately
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setPageMenuEnabled", value: newState });
      });
    });
  });
});

