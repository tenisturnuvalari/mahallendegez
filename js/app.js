// Mahallende Gez - uygulama mantığı

const state = {
  category: "all",
  query: "",
};

const grid = document.getElementById("placesGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const filtersEl = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: "Diğer", icon: "📍" };
}

function renderFilters() {
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = cat.id;
    btn.textContent = `${cat.icon} ${cat.label}`;
    filtersEl.appendChild(btn);
  });
}

function getFilteredPlaces() {
  const q = state.query.trim().toLocaleLowerCase("tr");
  return PLACES.filter((place) => {
    const matchCategory = state.category === "all" || place.category === state.category;
    const matchQuery =
      !q ||
      place.name.toLocaleLowerCase("tr").includes(q) ||
      place.neighborhood.toLocaleLowerCase("tr").includes(q) ||
      place.description.toLocaleLowerCase("tr").includes(q);
    return matchCategory && matchQuery;
  });
}

function renderPlaces() {
  const places = getFilteredPlaces();
  grid.innerHTML = "";

  resultCount.textContent = `${places.length} yer`;
  emptyState.hidden = places.length > 0;

  places.forEach((place) => {
    const cat = getCategory(place.category);
    const card = document.createElement("article");
    card.className = "place-card";
    card.innerHTML = `
      <div class="place-icon" aria-hidden="true">${cat.icon}</div>
      <div class="place-body">
        <div class="place-top">
          <h3>${place.name}</h3>
          <span class="rating" title="Puan">★ ${place.rating.toFixed(1)}</span>
        </div>
        <span class="place-category">${cat.label}</span>
        <p class="place-desc">${place.description}</p>
        <span class="place-neighborhood">📍 ${place.neighborhood}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  state.category = btn.dataset.category;
  filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderPlaces();
});

function handleSearch() {
  state.query = searchInput.value;
  renderPlaces();
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("input", handleSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

renderFilters();
renderPlaces();
