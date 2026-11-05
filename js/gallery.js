// Ana sayfa: galeri listeleme, arama ve ilçe filtresi

const galleryState = {
  district: "all",
  query: "",
  memories: [],
};

const gridEl = document.getElementById("memoriesGrid");
const emptyEl = document.getElementById("emptyState");
const loadEl = document.getElementById("loadState");
const countEl = document.getElementById("resultCount");
const filtersEl = document.getElementById("districtFilters");
const searchEl = document.getElementById("searchInput");

function renderFilters() {
  const districts = [...new Set(galleryState.memories.map((m) => m.district).filter(Boolean))];
  const ordered = [...DISTRICTS.filter((d) => districts.includes(d)), ...districts.filter((d) => !DISTRICTS.includes(d))];

  filtersEl.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.district = "all";
  allBtn.textContent = "Tümü";
  filtersEl.appendChild(allBtn);

  ordered.forEach((d) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.district = d;
    btn.textContent = d;
    filtersEl.appendChild(btn);
  });
}

function filteredMemories() {
  const q = galleryState.query.trim().toLocaleLowerCase("tr");
  return galleryState.memories.filter((m) => {
    const matchDistrict = galleryState.district === "all" || m.district === galleryState.district;
    if (!matchDistrict) return false;
    if (!q) return true;
    return [m.title, m.district, m.neighborhood, m.year, m.story]
      .filter(Boolean)
      .some((v) => String(v).toLocaleLowerCase("tr").includes(q));
  });
}

function renderGallery() {
  const list = filteredMemories();
  gridEl.innerHTML = "";
  countEl.textContent = `${list.length} anı`;
  emptyEl.hidden = list.length > 0;

  list.forEach((m) => {
    const card = document.createElement("a");
    card.className = "memory-card";
    card.href = `photo.html?id=${encodeURIComponent(m.id)}`;
    card.setAttribute("data-tilt", "");
    card.dataset.tiltMax = "8";
    card.innerHTML = `
      <div class="tilt-inner">
        <img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.title)}" loading="lazy">
        <span class="shine"></span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          ${m.year ? `<span class="year-badge">${escapeHtml(m.year)}</span>` : ""}
          <span class="place-tag">📍 ${escapeHtml(m.district)}${m.neighborhood ? " · " + escapeHtml(m.neighborhood) : ""}</span>
        </div>
        <h3>${escapeHtml(m.title)}</h3>
        ${m.story ? `<p class="story-line">${escapeHtml(m.story)}</p>` : ""}
      </div>
    `;
    gridEl.appendChild(card);
  });

  initTiltEffects(gridEl);
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  galleryState.district = btn.dataset.district;
  filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderGallery();
});

searchEl.addEventListener("input", () => {
  galleryState.query = searchEl.value;
  renderGallery();
});

async function initGallery() {
  try {
    galleryState.memories = await Store.listMemories();
  } catch (err) {
    loadEl.textContent = "Anılar yüklenemedi: " + (err.message || err);
    return;
  }
  loadEl.hidden = true;
  renderFilters();
  renderGallery();
  initTiltEffects();
}

initGallery();
