// Fotoğraf detay sayfası: 3B görüntü + anı bilgileri

const photoView = document.getElementById("photoView");
const notFoundEl = document.getElementById("photoNotFound");

async function initPhotoPage() {
  const id = getParam("id");

  let list = [];
  try {
    list = await Store.listMemories();
  } catch (err) {
    notFoundEl.textContent = "Bir hata oluştu: " + (err.message || err);
    notFoundEl.hidden = false;
    return;
  }

  const index = list.findIndex((m) => String(m.id) === String(id));
  const memory = index >= 0 ? list[index] : null;

  if (!memory) {
    notFoundEl.hidden = false;
    return;
  }

  photoView.hidden = false;

  const img = document.getElementById("photoImage");
  img.src = memory.image;
  img.alt = memory.title;

  document.title = `${memory.title} — Mahallende Gez`;
  document.getElementById("photoTitle").textContent = memory.title;
  document.getElementById("photoStory").textContent = memory.story || "";

  const yearEl = document.getElementById("photoYear");
  yearEl.textContent = memory.year || "Tarih belirsiz";
  yearEl.hidden = !memory.year;

  document.getElementById("photoPlace").textContent =
    "📍 " + memory.district + (memory.neighborhood ? " · " + memory.neighborhood : "");

  const dateStr = formatMemoryDate(memory.createdAt);
  document.getElementById("photoCredit").textContent = dateStr ? `Yükleme: ${dateStr}` : "";

  // 3B sahne
  const stage = document.querySelector(".stage");
  stage._tilt = new Tilt3D(stage, { max: 16, scale: 1.01 });

  // Önceki / sonraki
  const prev = document.getElementById("prevMem");
  const next = document.getElementById("nextMem");
  if (index > 0) {
    prev.href = `photo.html?id=${encodeURIComponent(list[index - 1].id)}`;
    prev.title = list[index - 1].title;
  } else {
    prev.classList.add("disabled");
  }
  if (index < list.length - 1) {
    next.href = `photo.html?id=${encodeURIComponent(list[index + 1].id)}`;
    next.title = list[index + 1].title;
  } else {
    next.classList.add("disabled");
  }

  // Mobil jiroskop butonu
  const gyroBtn = document.getElementById("gyroBtn");
  const hint = document.getElementById("stageHint");
  const isTouch = matchMedia("(pointer: coarse)").matches;
  if (!isTouch) {
    gyroBtn.hidden = true;
  }
  gyroBtn.addEventListener("click", async () => {
    const ok = await stage._tilt.enableGyro();
    if (ok) {
      gyroBtn.hidden = true;
      hint.textContent = "📱 Telefonu eğ — görüntü seninle hareket ediyor";
    } else {
      hint.textContent = "Bu cihazda hareket izni verilemedi.";
    }
  });
}

initPhotoPage();
