const artworks = [
  {
    title: "Tattoo 1",
    image: "artwork/Angel Gone Nomad.jpg"
  },
  {
    title: "Tattoo 2",
    image: "artwork/Humid Shower.jpg"
  },
  {
    title: "Tattoo 3",
    image: "artwork/Mausoleum's Guest.jpg"
  },
  {
    title: "Tattoo 4",
    image: "artwork/No Matches in the Abyss.jpg"
  },
  {
    title: "Tattoo 5",
    image: "artwork/Renard.jpg"
  },
  {
    title: "Tattoo 6",
    image: "artwork/Resting Cathedral.jpg"
  }
];
 
const spinnerTrack = document.getElementById("spinnerTrack");
const spinButton = document.getElementById("spinButton");
const spinCount = document.getElementById("spinCount");
const result = document.getElementById("result");
const selectedGallery = document.getElementById("selectedGallery");
 
let spinsUsed = Number(sessionStorage.getItem("spinsUsed")) || 0;
let selectedTattoos = JSON.parse(sessionStorage.getItem("selectedTattoos")) || [];
 
function updateSpins() {
  const left = 3 - spinsUsed;
 
  spinCount.textContent = `Spins left: ${left}`;
 
  if (left <= 0) {
    spinButton.disabled = true;
    spinButton.innerText = "No Spins Left";
  }
}
 
function buildSpinner() {
  spinnerTrack.innerHTML = "";
 
  for (let i = 0; i < 8; i++) {
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
  const finalIndex = 30 + originalIndex;
  const finalX = -(finalIndex * cardWidth) + 400;
 
  spinnerTrack.style.transform = `translateX(${finalX}px)`;
 
  setTimeout(() => {
    spinsUsed++;
 
    selectedTattoos.push(selectedArtwork);
 
    sessionStorage.setItem("spinsUsed", spinsUsed);
    sessionStorage.setItem("selectedTattoos", JSON.stringify(selectedTattoos));
 
    showSelectedTattoos();
    updateSpins();
 
    if (spinsUsed < 3 && availableArtworks.length > 1) {
      spinButton.disabled = false;
    }
  }, 4000);
}
 
buildSpinner();
showSelectedTattoos();
updateSpins();
 
spinButton.addEventListener("click", spin);
