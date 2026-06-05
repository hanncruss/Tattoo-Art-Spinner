const artworks = [
  { image: "artwork/alien.jpeg" },
  { image: "artwork/angel-paw.jpeg" },
  { image: "artwork/angel.jpeg" },
  { image: "artwork/bandaid-with-heart.jpeg" },
  { image: "artwork/bandaid.jpeg" },
  { image: "artwork/barbed-heart.jpeg" },
  { image: "artwork/bomb.jpeg" },
  { image: "artwork/brain.jpeg" },
  { image: "artwork/butterfly.jpeg" },
  { image: "artwork/candle.jpeg" },
  { image: "artwork/chakra.jpeg" },
  { image: "artwork/clover.jpeg" },
  { image: "artwork/cross.jpeg" },
  { image: "artwork/crying-heart.jpeg" },
  { image: "artwork/crystal-ball.jpeg" },
  { image: "artwork/dagger-heart.jpeg" },
  { image: "artwork/daisy.jpeg" },
  { image: "artwork/dead-smile.jpeg" },
  { image: "artwork/diamond.jpeg" },
  { image: "artwork/dripping-smiley.jpeg" },
  { image: "artwork/flame.jpeg" },
  { image: "artwork/flaming-aces.jpeg" },
  { image: "artwork/flower-bandaid.jpeg" },
  { image: "artwork/flying-money.jpeg" },
  { image: "artwork/ghost.jpeg" },
  { image: "artwork/grim-reaper.jpeg" },
  { image: "artwork/heart-eye.jpeg" },
  { image: "artwork/hello-kitty.jpeg" },
  { image: "artwork/hip-ghost.jpeg" },
  { image: "artwork/horseshoe.jpeg" },
  { image: "artwork/infinity.jpeg" },
  { image: "artwork/lightning.jpeg" },
  { image: "artwork/low-battery.jpeg" },
  { image: "artwork/mickey-flip.jpeg" },
  { image: "artwork/money.jpeg" },
  { image: "artwork/mountain.jpeg" },
  { image: "artwork/pizza.jpeg" },
  { image: "artwork/playboy.jpeg" },
  { image: "artwork/relax.jpeg" },
  { image: "artwork/rose.jpeg" },
  { image: "artwork/scorpion.jpeg" },
  { image: "artwork/scream.jpeg" },
  { image: "artwork/ski-mask.jpeg" },
  { image: "artwork/snake.jpeg" },
  { image: "artwork/sparkle-lightning.jpeg" },
  { image: "artwork/spider.jpeg" },
  { image: "artwork/stemmed-rose.jpeg" },
  { image: "artwork/storm.jpeg" },
  { image: "artwork/sun.jpeg" },
  { image: "artwork/theater-masks.jpeg" },
  { image: "artwork/thinking-angel.jpeg" },
  { image: "artwork/triangles.jpeg" },
  { image: "artwork/weed.jpeg" },
  { image: "artwork/window.jpeg" },
  { image: "artwork/ying-yang.jpeg" }
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

const repeatCount = 8;
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

  const startLoop = 1;
  const landingLoop = repeatCount - 2;

  const allCards = document.querySelectorAll(".art-card");

  const startCardIndex =
    startLoop * artworks.length + originalIndex;

  const landingCardIndex =
    landingLoop * artworks.length + originalIndex;

  const startCard = allCards[startCardIndex];
  const landingCard = allCards[landingCardIndex];

  const spinnerWindow =
    document.querySelector(".spinner-window");

  const windowCenter =
    spinnerWindow.offsetWidth / 2;

  const startX =
    windowCenter -
    startCard.offsetLeft -
    startCard.offsetWidth / 2;

  const finalX =
    windowCenter -
    landingCard.offsetLeft -
    landingCard.offsetWidth / 2;

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
