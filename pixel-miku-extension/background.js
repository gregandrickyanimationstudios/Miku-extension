let rc = false;
if (rc = true) {// Create top-level menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "miku-root",
    title: "Pixel Miku Menu",
    contexts: ["all"]
  });

  // help
  chrome.contextMenus.create({
    id: "help",
    parentId: "miku-root",
    title: "help",
    contexts: ["all"]
  });

  // Suggest music
  chrome.contextMenus.create({
    id: "music",
    parentId: "miku-root",
    title: "Suggest a Miku song 🎵",
    contexts: ["all"]
  });

  // Language help
  chrome.contextMenus.create({
    id: "language",
    parentId: "miku-root",
    title: "Practice Japanese 🇯🇵",
    contexts: ["all"]
  });

  // Change outfit (future)
  chrome.contextMenus.create({
    id: "outfit",
    parentId: "miku-root",
    title: "Change outfit 👗",
    contexts: ["all"]
  });
});

// Handle clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "help") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => alert("Is the Extension not working correctly? Try refreshing either tab or Extension.")
    });
  } else if (info.menuItemId === "music") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => alert("Try listening to 'World is Mine' by Miku 🐾")
    });
  } else if (info.menuItemId === "language") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => alert("今日はいい日ですね! (It’s a good day today!)")
    });
  } else if (info.menuItemId === "outfit") {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => alert("Pick a new outfit in the popup soon! 👗")
    });
  }

});
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pixel-miku-root",
    title: "Pixel Miku Extension",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "toggle-pixel-paint",
    parentId: "pixel-miku-root",
    title: "Toggle Pixel Paint",
    contexts: ["all"]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggle-pixel-paint") {
    chrome.tabs.sendMessage(tab.id, {
      action: "togglePixelPaint"
    });
  }
});
}