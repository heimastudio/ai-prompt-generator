/* Penyimpanan data di browser. Kalau localStorage tidak tersedia,
   data tetap jalan di memori selama halaman terbuka.
   Mau pindah ke backend? Cukup ganti read() dan write() di file ini. */
(function (root) {
  const Skena = root.Skena;
  const PREFIX = "skena.";
  const HISTORY_LIMIT = 80;
  const memory = {};

  function read(key, fallback) {
    try {
      const raw = root.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return key in memory ? memory[key] : fallback;
    }
  }

  function write(key, value) {
    memory[key] = value;
    try {
      root.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  const EXAMPLE_CHARACTER = {
    name: "Sari (contoh)",
    role: "Tokoh utama video klip",
    descriptor: "a Javanese woman in her mid-20s",
    face: "soft oval face, warm brown eyes, small mole under the left eye",
    hair: "long straight black hair with a center part",
    body: "slim build, medium height, tan skin",
    outfit: "mustard yellow kebaya top with a dark batik sarong",
    accessories: "small silver earrings, jasmine flower behind the right ear",
    color: "#f6b21b",
  };

  Skena.store = {
    read,
    write,

    theme: {
      get: () => read("theme", null),
      set: (value) => write("theme", value),
    },

    characters: {
      all() {
        if (!read("seeded", false)) {
          write("seeded", true);
          write("characters", [{ ...EXAMPLE_CHARACTER, id: Skena.utils.uid(), updatedAt: Date.now() }]);
        }
        return read("characters", []);
      },
      get(id) {
        return this.all().find((c) => c.id === id) || null;
      },
      getMany(ids) {
        const all = this.all();
        return (ids || []).map((id) => all.find((c) => c.id === id)).filter(Boolean);
      },
      save(data) {
        const list = this.all();
        const record = { ...data, id: data.id || Skena.utils.uid(), updatedAt: Date.now() };
        const index = list.findIndex((c) => c.id === record.id);
        if (index >= 0) list[index] = record;
        else list.unshift(record);
        write("characters", list);
        return record;
      },
      remove(id) {
        write("characters", this.all().filter((c) => c.id !== id));
      },
    },

    history: {
      all: () => read("history", []),
      /** Hasil yang sama persis dengan entri terakhir tidak disimpan dua kali. */
      add(result) {
        let list = read("history", []);
        if (list[0] && list[0].copyText === result.copyText) return list[0];
        const entry = { ...result, id: Skena.utils.uid(), createdAt: Date.now() };
        list = [entry, ...list].slice(0, HISTORY_LIMIT);
        // Kalau kuota penuh, buang entri terlama sampai muat.
        while (!write("history", list) && list.length > 1) list.pop();
        return entry;
      },
      remove(id) {
        write("history", read("history", []).filter((e) => e.id !== id));
      },
      clear() {
        write("history", []);
      },
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
