// Giriş / kayıt sayfası

const authForm = document.getElementById("authForm");
const authStatus = document.getElementById("authStatus");
const authBtn = document.getElementById("authBtn");
const authNote = document.getElementById("authNote");

let mode = "login"; // login | signup

function setMode(next) {
  mode = next;
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });

  const isLogin = mode === "login";
  document.getElementById("authTitle").textContent = isLogin ? "Tekrar hoş geldin" : "Aramıza katıl";
  document.getElementById("authSub").textContent = isLogin
    ? "Anılarını yüklemeye devam etmek için giriş yap."
    : "Mahalle anılarını paylaşmak için hesap oluştur.";
  authBtn.textContent = isLogin ? "Giriş Yap" : "Kayıt Ol";
  document.getElementById("passwordInput").autocomplete = isLogin ? "current-password" : "new-password";
  authNote.hidden = true;
  setStatus(authStatus, "");
}

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => setMode(tab.dataset.mode));
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  if (password.length < 6) {
    setStatus(authStatus, "Şifre en az 6 karakter olmalı.", "error");
    return;
  }

  authBtn.disabled = true;
  setStatus(authStatus, mode === "login" ? "Giriş yapılıyor…" : "Kayıt oluşturuluyor…");

  try {
    const result = mode === "login" ? await Store.signIn(email, password) : await Store.signUp(email, password);

    if (result.needsConfirm) {
      setStatus(authStatus, "Kayıt oluşturuldu! E-postandaki onay bağlantısına tıkla.", "ok");
      authNote.hidden = false;
      authBtn.disabled = false;
      setMode("login");
      setStatus(authStatus, "Kayıt oluşturuldu! E-postanı onaylayıp giriş yapabilirsin.", "ok");
      authNote.hidden = false;
      return;
    }

    setStatus(authStatus, "Tamam! Yönlendiriliyorsun…", "ok");
    const next = getParam("sonraki") || "index.html";
    setTimeout(() => {
      window.location.href = next;
    }, 600);
  } catch (err) {
    const msg = err.message || "";
    setStatus(
      authStatus,
      mode === "login" && msg.includes("Invalid")
        ? "E-posta veya şifre hatalı."
        : msg || "Bir hata oluştu.",
      "error"
    );
    authBtn.disabled = false;
  }
});

// Girişliyse direkt çıkış yap
(async () => {
  const user = await Store.getUser();
  if (user && !getParam("sonraki")) {
    setStatus(authStatus, `${user.email} olarak giriş yaptın.`, "ok");
    document.getElementById("authTitle").textContent = "Hesabın hazır";
    document.getElementById("authSub").textContent = "Yeni anı yüklemek ister misin?";
    authBtn.textContent = "📸 Anı Yükle";
    authForm.onsubmit = (e) => {
      e.preventDefault();
      window.location.href = "upload.html";
    };
  }
})();
