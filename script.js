const artworks = [
  {
    //title: "Tattoo 1",
    image: "artwork/alien.jpeg"
  },
  {
    //title: "Tattoo 2",
    image: "artwork/angel-paw.jpeg"
  },
  {
    //title: "Tattoo 3",
    image: "artwork/angel.jpeg"
  },
  {
    //title: "Tattoo 4",
    image: "artwork/bandaid-with-heart.jpeg"
  },
  {
   //title: "Tattoo 5",
    image: "artwork/bandaid.jpeg"
  },
  {
    //title: "Tattoo 6",
    image: "artwork/barbed-heart.jpeg"
  }

  // Add the rest of your images here the same way:
  // {
  //   title: "Tattoo 7",
  //   image: "artwork/your-file-name.jpeg"
  // },
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

  for (let i = 0; i < 4; i++) {
    artworks.forEach((art) => {
      const card = document.createElement("div");

      card.className = "art-card";

      const img = document.createElement("img");

      img.src = art.image;
      img.alt = art.title;

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
      <img src="${tattoo.image}" alt="${tattoo.title}">
      <p>${tattoo.title}</p>
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
    return !selectedTattoos.some((selected) => selected.title === art.title);
  });

  if (availableArtworks.length === 0) {
    spinButton.disabled = true;
    spinButton.innerText = "No Tattoos Left";
    return;
  }

  const selectedIndex = Math.floor(Math.random() * availableArtworks.length);
  const selectedArtwork = availableArtworks[selectedIndex];

  const originalIndex = artworks.findIndex((art) => {
    return art.title === selectedArtwork.title;
  });

  const cardWidth = 170;

  const minimumFullLoops = 2;
  const randomExtraCards = Math.floor(Math.random() * artworks.length);

  const spinDistance =
    ((artworks.length * minimumFullLoops) + randomExtraCards + originalIndex) * cardWidth;

  currentPosition -= spinDistance;

  spinnerTrack.style.transition =
    "transform 5.5s cubic-bezier(0.15, 0.85, 0.15, 1)";

  spinnerTrack.style.transform =
    `translateX(${currentPosition}px)`;

  setTimeout(() => {
    spinsUsed++;

    selectedTattoos.push(selectedArtwork);

    sessionStorage.setItem("spinsUsed", spinsUsed);
    sessionStorage.setItem("selectedTattoos", JSON.stringify(selectedTattoos));

    showSelectedTattoos();
    updateSpins();

    if (spinsUsed < 3 && availableArtworks.length > 1) {
      spinButton.disabled = false;
      spinButton.innerText = "Spin";
    }
  }, 5500);
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
