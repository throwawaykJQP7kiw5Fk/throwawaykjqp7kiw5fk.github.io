// Force-feeds porn
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://corsproxy.io/?url=https%3A%2F%2Fweb.archive.org%2Fweb%2F20250813155448if_%2Fhttps%3A%2F%2Fi.l4r.io%2F&key=12345678", true);

xhr.onload = function() {
  if (xhr.status === 200) {
    const xmlDoc = xhr.responseXML;
    
    for (const element of xmlDoc.querySelectorAll("Key")) {
        const image = document.createElement("img");
        image.src = "https://i.l4r.io/" + encodeURI(element.textContent);
        document.body.appendChild(image);
    }
  }
};

xhr.send();
