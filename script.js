"use strict";

const arr = [
  "20240405060243",
  "20240515053250",
  "20240515054017",
  "20240528234916",
  "20240528234916",
  "20240531231939",
  "20240621051412",
  "20240723152909",
  "20240803041605",
  "20240908101850",
  "20240912210553",
  "20240912223140",
  "20241015161914",
  "20241029090053",
  "20241112211034",
  "20241204064031",
  "20250119034904",
  "20250129010313",
  "20250212080804",
  "20250219022937",
  "20250324034827",
  "20250328162718",
  "20250424102911",
  "20250424204050",
  "20250513040925",
  "20250617123114",
  "20250620171136",
  "20250813155448"
];

const xhr = new XMLHttpRequest();
xhr.open("GET", `https://corsproxy.io/?url=https%3A%2F%2Fweb.archive.org%2Fweb%2F${arr[Math.floor(Math.random()*arr.length)]}if_%2Fhttps%3A%2F%2Fi.l4r.io%2F&key=12345678`, true);

xhr.onload = function() {
  if (xhr.status === 200) {
    const bar = document.querySelector("#bar");
    const forBar = document.querySelector("#forBar");
    const container = document.querySelector("#div");
    
    const xmlDoc = xhr.responseXML;
    const keys = [...xmlDoc.querySelectorAll("Key")].reverse();
    
    bar.max = keys.length;
    let i = 0;

    // This function handles exactly one image at a time
    const loadNextImage = () => {
      // Base case: stop when all images are processed
      if (i >= keys.length) return;

      const image = new Image();
      image.style.maxWidth = "100%";
      image.src = "https://i.l4r.io/" + encodeURI(keys[i].textContent);

      // Setup a clean tracking function for this single image
      const onComplete = () => {
        i++;
        bar.value = i;
        
        const calc = `${(i / keys.length * 100).toFixed(1)}%`;
        bar.innerHTML = calc;
        forBar.innerText = i === keys.length ? "✅ Loaded (100.0%):" : `Loading (${calc}):`;
        
        // CRUCIAL: Only trigger the next image download AFTER this one finishes
        loadNextImage();
      };

      // Since we move to the next image sequentially, simple { once: true } 
      // is perfectly sufficient for automatic RAM cleanup of the listener
      image.addEventListener("load", onComplete, { once: true });
      image.addEventListener("error", onComplete, { once: true });

      // Prepend to display immediately as it loads
      container.prepend(image);
    };

    // Kickstart the sequential chain
    loadNextImage();
  }
};

xhr.send();
