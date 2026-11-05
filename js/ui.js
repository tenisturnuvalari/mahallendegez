// Ortak arayüz yardımcıları: kimlik alanı, kaçış, durum mesajları

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setStatus(el, message, type = "") {
  if (!el) return;
  el.textContent = message;
  el.className = "form-status" + (type ? " " + type : "");
}

function formatMemoryDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function renderAuthArea() {
  const el = document.getElementById("authArea");
  if (!el) return;

  let user = null;
  try {
    user = await Store.getUser();
  } catch {
    user = null;
  }

  if (user) {
    const name = (user.email || "sen").split("@")[0];
    el.innerHTML = `
      <span class="user-chip">👤 ${escapeHtml(name)}</span>
      <button type="button" class="link-btn" id="logoutBtn">Çıkış</button>
    `;
    const btn = document.getElementById("logoutBtn");
    if (btn) {
      btn.addEventListener("click", async () => {
        try {
          await Store.signOut();
        } finally {
          window.location.href = "index.html";
        }
      });
    }
  } else {
    el.innerHTML = `<a href="auth.html" class="nav-cta">Giriş yap</a>`;
  }
}

document.addEventListener("DOMContentLoaded", renderAuthArea);
