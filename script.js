const artworks = [
  { image: "artwork/alien.jpeg" },
  { image: "artwork/angel-paw.jpeg" },
  { image: "artwork/angel.jpeg" },
  { image: "artwork/bandaid-with-heart.jpeg" },
  { image: "artwork/bandaid.jpeg" },
  { image: "artwork/barbed-heart.jpeg" }
];

const spinnerTrack = document.getElementById("spinnerTrack");
const spinButton = document.getElementById("spinButton");
const spinCount = document.getElementById("spinCount");
const result = document.getElementById("result");
const selectedGallery = document.getElementById("selectedGallery");

let spinsUsed =
  Number(sessionStorage.getItem("spinsUsed")) || 0;

let selectedTattoos =
  JSON.parse(sessionStorage.getItem("selectedTattoos")) || [];

const repeatCount = 20;
const spinTime = 6500;

function updateSpins() {
  const left = 3 - spinsUsed;

  spinCount.textContent = `Spins left: ${left}`;

  if (left <= 0) {
    spinButton.disabled = true;
    spinButton.innerText = "No Spins Left";
  } else {
    spinButton.disabled = false;
    spinButton.innerText = "Spin";
  }
}

function buildSpinner() {
  spinnerTrack.innerHTML = "";

  for (let i = 0; i < repeatCount; i++) {
    artworks.forEach((art) => {
      const card = document.createElement("div");

      card.className = "art-card";

      const img = document.createElement("img");

      img.src = art.image;
      img.alt = "Tattoo design";

      card.appendChild(img);
      spinnerTrack.appendChild(card);
    });
  }
}

function showSelectedTattoos() {
  selectedGallery.innerHTML = "";

  selectedTattoos.forEach((tattoo) => {
    const item = document.createElement("div");

    item.className = "selected-item";

    item.innerHTML = `
      <img src="${tattoo.image}" alt="Selected tattoo">
    `;

    selectedGallery.appendChild(item);
  });

  if (selectedTattoos.length > 0