// Veri katmanı: Supabase bağlıysa buluta, değilse demo/yerel depoya yazar.

const Store = (() => {
  const DEMO_KEY = "mg_demo_memories";
  const DEMO_USER_KEY = "mg_demo_user";
  const DEMO_LIMIT = 12;

  const isConfigured = () =>
    typeof SUPABASE_URL === "string" &&
    SUPABASE_URL.startsWith("http") &&
    typeof SUPABASE_ANON_KEY === "string" &&
    SUPABASE_ANON_KEY.length > 30 &&
    typeof supabase !== "undefined";

  let client = null;
  function getClient() {
    if (!client) client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  }

  /* ---------- yerel (demo) depolama ---------- */

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(DEMO_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeLocal(list) {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(list.slice(-DEMO_LIMIT)));
    } catch {
      // kota dolu -> en eskisini düşür ve tekrar dene
      const trimmed = list.slice(-Math.floor(DEMO_LIMIT / 2));
      try {
        localStorage.setItem(DEMO_KEY, JSON.stringify(trimmed));
      } catch {
        /* sessiz geç */
      }
    }
  }

  function readDemoUser() {
    try {
      return JSON.parse(localStorage.getItem(DEMO_USER_KEY));
    } catch {
      return null;
    }
  }

  /* ---------- görsel hazırlama ---------- */

  async function downscaleImage(file, maxDim = 1400, quality = 0.85) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close && bitmap.close();
    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Görsel dönüştürülemedi."))),
        "image/jpeg",
        quality
      );
    });
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Dosya okunamadı."));
      reader.readAsDataURL(blob);
    });
  }

  /* ---------- anılar ---------- */

  function mapRow(row) {
    let image = "";
    if (row.image_path) {
      const { data } = getClient().storage.from("memories").getPublicUrl(row.image_path);
      image = data.publicUrl;
    }
    return {
      id: row.id,
      title: row.title,
      district: row.district,
      neighborhood: row.neighborhood,
      year: row.year,
      story: row.story,
      image,
      createdAt: row.created_at,
      demo: false,
    };
  }

  async function listMemories() {
    if (isConfigured()) {
      const { data, error } = await getClient()
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    }
    return [...readLocal()].reverse().concat(DEMO_MEMORIES);
  }

  async function getMemory(id) {
    const list = await listMemories();
    return list.find((m) => String(m.id) === String(id)) || null;
  }

  async function addMemory({ title, district, neighborhood, year, story, file }) {
    const user = await getUser();
    if (!user) throw new Error("Önce giriş yapmalısın.");

    const blob = await downscaleImage(file);

    if (isConfigured()) {
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error: upError } = await getClient()
        .storage.from("memories")
        .upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600" });
      if (upError) throw upError;

      const { error } = await getClient().from("memories").insert({
        user_id: user.id,
        title,
        district,
        neighborhood: neighborhood || null,
        year: year || null,
        story: story || null,
        image_path: path,
      });
      if (error) {
        await getClient().storage.from("memories").remove([path]);
        throw error;
      }
      return { ok: true };
    }

    const dataURL = await blobToDataURL(blob);
    const memory = {
      id: "local-" + Date.now(),
      title,
      district,
      neighborhood,
      year,
      story,
      image: dataURL,
      createdAt: new Date().toISOString(),
      demo: true,
    };
    const list = readLocal();
    list.push(memory);
    writeLocal(list);
    return { ok: true, memory };
  }

  /* ---------- kimlik ---------- */

  async function getUser() {
    if (isConfigured()) {
      const {
        data: { user },
      } = await getClient().auth.getUser();
      return user;
    }
    return readDemoUser();
  }

  async function signUp(email, password) {
    if (isConfigured()) {
      const { data, error } = await getClient().auth.signUp({ email, password });
      if (error) throw error;
      return { needsConfirm: !data.session };
    }
    const user = { id: "demo-user", email };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    return { needsConfirm: false };
  }

  async function signIn(email, password) {
    if (isConfigured()) {
      const { error } = await getClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { needsConfirm: false };
    }
    const user = { id: "demo-user", email };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    return { needsConfirm: false };
  }

  async function signOut() {
    if (isConfigured()) {
      const { error } = await getClient().auth.signOut();
      if (error) throw error;
      return;
    }
    localStorage.removeItem(DEMO_USER_KEY);
  }

  return {
    isConfigured,
    listMemories,
    getMemory,
    addMemory,
    getUser,
    signUp,
    signIn,
    signOut,
  };
})();
