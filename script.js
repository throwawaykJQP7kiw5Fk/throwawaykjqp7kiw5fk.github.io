"use strict";

// Inspired by Genshin Impact's far more comprehensive warning
const warn = confirm("⚠️ Warning: A very small percentage of individuals may experience seizures. Even if you have no prior history of seizures or epilepsy, certain conditions may affect how your body responds to photosensitivity. Please close the tab and consult your physician if you have personal or family history of seizures or epilepsy before continuing. Like most sites containing adult content, cancelling will redirect you to Google.");
if (!warn) window.location.replace("https://www.google.com");

const xhr = new XMLHttpRequest();
xhr.open("GET", "keys.txt", true);

// Fetch the file as UTF-8 text
xhr.responseType = "text";

xhr.onload = function() {
  const bar = document.querySelector("#bar");
  const forBar = document.querySelector("#forBar");
  const container = document.querySelector("#div");

  if (xhr.status !== 200) {
    if (forBar) forBar.innerText = "❌ Proxy Network Error";
    return;
  }

  // XMLHttpRequest decodes the response as text.
  // Split on LF and remove CR from CRLF files.
  const keys = xhr.response
    .split("\n")
    .map(key => key.replace(/\r$/, "").trim())
    .filter(key => key.length > 0);

  if (keys.length === 0) {
    if (forBar) forBar.innerText = "⚠️ No keys found in keys.txt.";
    return;
  }

  const shuffledKeys = [...keys].sort(function() {
    return 0.5 - Math.random();
  });

  bar.max = shuffledKeys.length;
  let i = 0;

  const loadNextImage = () => {
    if (i >= shuffledKeys.length) return;

    const image = document.createElement("img");
    image.style.maxWidth = "100%";

    const onComplete = () => {
      i++;
      bar.value = i;
      const calc = `${i}/${shuffledKeys.length}`;
      bar.innerHTML = calc;
      forBar.innerText = i === shuffledKeys.length
        ? `✅ Loaded (${calc}):`
        : `Loading (${calc}):`;

      image.onload = null;
      image.onerror = null;

      loadNextImage();
    };

    image.onload = onComplete;
    image.onerror = onComplete;

    // Set source last to prevent synchronous race conditions
    image.src = "https://i.l4r.io/" + encodeURI(shuffledKeys[i]);

    if (container) {
      container.prepend(image);
    }
  };

  loadNextImage();
};

xhr.onerror = function() {
  const forBar = document.querySelector("#forBar");
  if (forBar) forBar.innerText = "❌ Blocked by Guest Mode Network Policy";
};

xhr.send();
