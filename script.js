"use strict";

const xhr = new XMLHttpRequest();
xhr.open("GET", "site-xml.xml", true);

// Guest Mode requires explicit handling of text/xml mappings
xhr.responseType = "document"; 

xhr.onload = function() {
  const bar = document.querySelector("#bar");
  const forBar = document.querySelector("#forBar");
  const container = document.querySelector("#div");

  if (xhr.status !== 200) {
    if (forBar) forBar.innerText = "❌ Proxy Network Error";
    return;
  }

  // Guest Mode Safety: Check if response parsed correctly 
  const xmlDoc = xhr.responseXML;
  if (!xmlDoc) {
    if (forBar) forBar.innerText = "❌ XML Parsing Failed (Guest Mode block)";
    return;
  }

  const keyElements = xmlDoc.querySelectorAll("Key");
  if (!keyElements || keyElements.length === 0) {
    if (forBar) forBar.innerText = "⚠️ No keys found in XML data.";
    return;
  }

  const keys = [...keyElements].reverse();
  bar.max = keys.length;
  let i = 0;

  const loadNextImage = () => {
    if (i >= keys.length) return;

    // Guest mode safe image creation via standard DOM
    const image = document.createElement("img");
    image.style.maxWidth = "100%";
    
    const onComplete = () => {
      i++;
      bar.value = i;
      const calc = `${(i / keys.length * 100).toFixed(1)}%`;
      bar.innerHTML = calc;
      forBar.innerText = i === keys.length ? "✅ Loaded (100.0%):" : `Loading (${calc}):`;
      
      // Free memory instantly inside guest environment
      image.onload = null;
      image.onerror = null;
      
      loadNextImage();
    };

    image.onload = onComplete;
    image.onerror = onComplete;
    
    // Set source last to prevent synchronous race conditions
    image.src = "https://i.l4r.io/" + encodeURI(keys[i].textContent.trim());
    
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
