// 3B tilt (eğim) efekti — fare, dokunmatik ve jiroskop desteği

class Tilt3D {
  constructor(el, options = {}) {
    this.el = el;
    this.inner = el.querySelector(".tilt-inner") || el;
    this.max = options.max ?? 10;
    this.scale = options.scale ?? 1.02;
    this.gyroBound = false;

    el.classList.add("tilt");
    this.inner.style.setProperty("--scale", String(this.scale));

    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);

    el.addEventListener("pointermove", this.onMove);
    el.addEventListener("pointerleave", this.onLeave);
    el.addEventListener("pointerdown", this.onMove);
  }

  apply(rx, ry, mx, my) {
    const inner = this.inner;
    inner.style.setProperty("--rx", rx.toFixed(2) + "deg");
    inner.style.setProperty("--ry", ry.toFixed(2) + "deg");
    inner.style.setProperty("--mx", (mx * 100).toFixed(1) + "%");
    inner.style.setProperty("--my", (my * 100).toFixed(1) + "%");
  }

  onMove(e) {
    const rect = this.el.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const rx = (0.5 - py) * this.max * 2;
    const ry = (px - 0.5) * this.max * 2;
    this.el.classList.add("tilt-active");
    this.apply(rx, ry, px, py);
  }

  onLeave() {
    this.el.classList.remove("tilt-active");
    this.apply(0, 0, 0.5, 0.5);
  }

  // Telefonun eğimi ile 3B (cihaz izni gerekebilir)
  async enableGyro() {
    const DOE = window.DeviceOrientationEvent;
    if (!DOE) return false;

    if (typeof DOE.requestPermission === "function") {
      try {
        const res = await DOE.requestPermission();
        if (res !== "granted") return false;
      } catch {
        return false;
      }
    }

    if (this.gyroBound) return true;
    this.gyroBound = true;

    window.addEventListener("deviceorientation", (e) => {
      const gamma = Math.max(-30, Math.min(30, e.gamma || 0)); // sol-sağ
      const beta = Math.max(-30, Math.min(30, (e.beta || 0) - 30)); // öne-arka
      const ry = (gamma / 30) * this.max;
      const rx = (-beta / 30) * this.max;
      this.el.classList.add("tilt-active");
      this.apply(rx, ry, 0.5 + gamma / 60, 0.5 + beta / 60);
    });
    return true;
  }
}

// sayfadaki tüm [data-tilt] öğelerini başlat
function initTiltEffects(root = document) {
  root.querySelectorAll("[data-tilt]").forEach((el) => {
    if (el._tilt) return;
    const max = Number(el.dataset.tiltMax) || 10;
    el._tilt = new Tilt3D(el, { max });
  });
}
