"use strict";
// Force-feeds porn
// To prevent a rare edge case of redirects from randomized timestamps being rate-limited on shared proxy IPs, an array of numbers is used.
// If a capture is removed or a number doesn't exist otherwise, it should redirect to the closest capture.
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
    const updateProg = () => {
      bar.value = Number(bar.value) + 1;
    }
    const xmlDoc = xhr.responseXML;
    // reversing because the end is usually more unpredictable than the start, prob due to user-initiated self-deletion
    const keys = [...xmlDoc.querySelectorAll("Key")].reverse();
    keys.unshift(xmlDoc.querySelector("NextMarker"));
    document.querySelector("#bar").max = keys.length;
    
    for (const element of keys) {
      const image = document.createElement("img");
      image.src = "https://i.l4r.io/" + encodeURI(element.textContent);
      // {once: true} for ur ram cleanup
      image.addEventListener("load", updateProg, {once: true});
      image.addEventListener("error", updateProg, {once: true});
      document.body.appendChild(image);
    }
  }
};

xhr.send();
