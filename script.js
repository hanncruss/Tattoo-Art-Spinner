const artworks = [
  { image: "artwork/alien.jpeg" },
  { image: "artwork/angel-paw.jpeg" },
  { image: "artwork/angel.jpeg" },
  { image: "artwork/bandaid-with-heart.jpeg" },
  { image: "artwork/bandaid.jpeg" },
  { image: "artwork/barbed-heart.jpeg" }

  // Add the rest the same way:
  // { image: "artwork/your-file-name.jpeg" },
];

const spinnerTrack = document.getElementById("spinnerTrack");
const spinButton = document.getElementById("spinButton");
const resetButton = document.getElementById("resetButton");
const spinCount = document.getElementById("spinCount");
const result = document.getElementById("result");
const selectedGallery = document.getElementById("selectedGallery");

let spinsUsed = Number(sessionStorage.getItem("spinsUsed")) || 0;
let selectedTattoos = JSON.parse(sessionStorage.getItem("selectedTattoos")) || [];
let currentPosition = 0;

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

  for (let i = 0; i < 2; i++) {
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

function getCardStep() {
  const firstCard = document.querySelector(".art-card");

  if (!firstCard) return 240;

  const cardStyle = window.getComputedStyle(firstCard);
  const trackStyle = window.getComputedStyle(spinnerTrack);

  const cardWidth = firstCard.offsetWidth;
  const cardMarginLeft = parseFloat(cardStyle.marginLeft) || 0;
  const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
  const gap =
    parseFloat(trackStyle.columnGap) ||
    parseFloat(trackStyle.gap) ||
    0;

  return cardWidth + cardMarginLeft + cardMarginRight + gap;
}

function showSelectedTattoos() {
  selectedGallery.innerHTML = "";

  selectedTattoos.forEach((tattoo) => {
    const item = document.createElement("div");
    item.className = "selected-item";

    item.innerHTML = `
      <img src="${tattoo.image}" alt="Selected tattoo design">
    `;

    selectedGallery.appendChild(item);
  });

  if (selectedTattoos.length > 0) {
    result.classList.remove("hidden");
  } else {
    result.classList.add("hidden");
  }
}

function spin() {
  if (spinsUsed >= 3) return;

  spinButton.disabled = true;

  const availableArtworks = artworks.filter((art) => {
    return !selectedTattoos.some((selected) => selected.image === art.image);
  });

  if (availableArtworks.length === 0) {
    spinButton.disabled = true;
    spinButton.innerText = "No Tattoos Left";
    return;
  }

  const selectedIndex = Math.floor(Math.random() * availableArtworks.length);
  const selectedArtwork = availableArtworks[selectedIndex];

  const originalIndex = artworks.findIndex((art) => {
    return art.image === selectedArtwork.image;
  });

  const cardStep = getCardStep();

  const fullLoops = 5;
  const randomExtraCards = Math.floor(Math.random() * artworks.length);

  const spinDistance =
    ((artworks.length * fullLoops) + randomExtraCards + originalIndex) * cardStep;

  currentPosition -= spinDistance;

  spinnerTrack.style.transition =
    "transform 6.5s cubic-bezier(0.12, 0.75, 0.2, 1)";

  spinnerTrack.style.transform = `translateX(${currentPosition}px)`;

  setTimeout(() => {
    spinsUsed++;

    selectedTattoos.push(selectedArtwork);

    sessionStorage.setItem("spinsUsed", spinsUsed);
    sessionStorage.setItem("selectedTattoos", JSON.stringify(selectedTattoos));

    showSelectedTattoos();
    updateSpins();

    if (spinsUsed < 3 && selectedTattoos.length < artworks.length) {
      spinButton.disabled = false;
      spinButton.innerText = "Spin";
    }
  }, 6500);
}

function resetSpinner() {
  sessionStorage.removeItem("spinsUsed");
  sessionStorage.removeItem("selectedTattoos");

  spinsUsed = 0;
  selectedTattoos = [];
  currentPosition = 0;

  spinnerTrack.style.transition = "none";
  spinnerTrack.style.transform = "translateX(0px)";

  selectedGallery.innerHTML = "";
  result.classList.add("hidden");

  spinButton.disabled = false;
  spinButton.innerText = "Spin";

  updateSpins();
}

buildSpinner();
showSelectedTattoos();
updateSpins();

spinButton.addEventListener("click", spin);
resetButton.addEventListener("click", resetSpinner);
