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

function getCardStep() {
  const firstCard = document.querySelector(".art-card");

  if (!firstCard) return 140;

  const trackStyle =
    window.getComputedStyle(spinnerTrack);

  const gap =
    parseFloat(trackStyle.columnGap) ||
    parseFloat(trackStyle.gap) ||
    0;

  return firstCard.offsetWidth + gap;
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
    return !selectedTattoos.some((selected) => {
      return selected.image === art.image;
    });
  });

  if (availableArtworks.length === 0) {
    spinButton.innerText = "No Tattoos Left";
    return;
  }

  const selectedArtwork =
    availableArtworks[
      Math.floor(Math.random() * availableArtworks.length)
    ];

  const originalIndex = artworks.findIndex((art) => {
    return art.image === selectedArtwork.image;
  });

  const cardStep = getCardStep();

  const cardWidth =
    document.querySelector(".art-card").offsetWidth;

  const windowWidth =
    document.querySelector(".spinner-window").offsetWidth;

  const startLoop = 3;
  const landingLoop = 15;

  const startX =
    windowWidth / 2 -
    startLoop * artworks.length * cardStep -
    cardWidth / 2;

  const landingIndex =
    landingLoop * artworks.length + originalIndex;

  const centerAdjustment = cardWidth * 0.08;

  const finalX =
    windowWidth / 2 -
    landingIndex * cardStep -
    cardWidth / 2 +
    centerAdjustment;

  spinnerTrack.style.transition = "none";
  spinnerTrack.style.transform = `translateX(${startX}px)`;

  spinnerTrack.offsetHeight;

  spinnerTrack.style.transition =
    `transform ${spinTime}ms cubic-bezier(0.12, 0.75, 0.2, 1)`;

  spinnerTrack.style.transform =
    `translateX(${finalX}px)`;

  setTimeout(() => {
    spinsUsed++;

    selectedTattoos.push(selectedArtwork);

    sessionStorage.setItem(
      "spinsUsed",
      spinsUsed
    );

    sessionStorage.setItem(
      "selectedTattoos",
      JSON.stringify(selectedTattoos)
    );

    showSelectedTattoos();
    updateSpins();

    if (
      spinsUsed < 3 &&
      selectedTattoos.length < artworks.length
    ) {
      spinButton.disabled = false;
      spinButton.innerText = "Spin";
    }
  }, spinTime);
}

buildSpinner();
showSelectedTattoos();
updateSpins();

spinButton.addEventListener("click", spin);