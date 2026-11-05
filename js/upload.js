// Yükleme sayfası: dosya seçimi, önizleme ve kayıt

const form = document.getElementById("uploadForm");
const authGate = document.getElementById("authGate");
const demoBanner = document.getElementById("demoBanner");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const dropHint = document.getElementById("dropHint");
const previewWrap = document.getElementById("previewWrap");
const previewImg = document.getElementById("previewImg");
const clearBtn = document.getElementById("clearPhoto");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

let selectedFile = null;

/* ---------- statik alanlar ---------- */

function fillSelects() {
  const districtSelect = document.getElementById("districtSelect");
  DISTRICTS.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    districtSelect.appendChild(opt);
  });

  const yearSelect = document.getElementById("yearSelect");
  YEARS.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });
}

/* ---------- dosya seçimi ---------- */

function acceptFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus(statusEl, "Sadece resim dosyaları yükleyebilirsin.", "error");
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    setStatus(statusEl, "Dosya çok büyük (en fazla 15 MB).", "error");
    return;
  }
  selectedFile = file;
  previewImg.src = URL.createObjectURL(file);
  dropHint.hidden = true;
  previewWrap.hidden = false;
  setStatus(statusEl, "");
  initTiltEffects(previewWrap);
}

dropzone.addEventListener("click", (e) => {
  if (e.target.closest("#clearPhoto")) return;
  fileInput.click();
});

dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => acceptFile(fileInput.files[0]));

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);

dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  acceptFile(file);
});

clearBtn.addEventListener("click", () => {
  selectedFile = null;
  fileInput.value = "";
  previewImg.src = "";
  previewWrap.hidden = true;
  dropHint.hidden = false;
});

/* ---------- gönderim ---------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedFile) {
    setStatus(statusEl, "Önce bir fotoğraf seç.", "error");
    return;
  }

  const title = document.getElementById("titleInput").value.trim();
  const district = document.getElementById("districtSelect").value;
  const neighborhood = document.getElementById("neighborhoodInput").value.trim();
  const year = document.getElementById("yearSelect").value;
  const story = document.getElementById("storyInput").value.trim();

  if (title.length < 2) {
    setStatus(statusEl, "Başlık en az 2 karakter olmalı.", "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus(statusEl, "Yükleniyor…");

  try {
    await Store.addMemory({ title, district, neighborhood, year, story, file: selectedFile });
    setStatus(statusEl, "Anın galeriye eklendi! 🎉", "ok");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  } catch (err) {
    setStatus(statusEl, "Yükleme başarısız: " + (err.message || err), "error");
    submitBtn.disabled = false;
  }
});

/* ---------- başlangıç ---------- */

async function initUpload() {
  fillSelects();
  demoBanner.hidden = Store.isConfigured();

  const user = await Store.getUser();
  if (user) {
    form.hidden = false;
  } else {
    authGate.hidden = false;
    document.getElementById("gateLogin").href =
      "auth.html?sonraki=" + encodeURIComponent("upload.html");
  }
}

initUpload();
