/* Membaca lirik: memecah bagian lagu dan mengenali motif visual.
   Tambah kata kunci atau motif baru di MOTIFS. */
(function (root) {
  const Skena = root.Skena;
  const { clean } = Skena.utils;

  const HEADER = /^[\s[(*#]*(intro|verse|bait|pre[- ]?chorus|pre[- ]?reff?|reff?|refrain|chorus|bridge|jembatan|interlude|musik|instrumental|outro|coda|ending)\b[\s\d.]*[\])*:]*\s*$/i;

  const KINDS = [
    [/^intro/i, "intro"],
    [/^(verse|bait)/i, "verse"],
    [/^pre/i, "prechorus"],
    [/^(reff?|refrain|chorus)/i, "chorus"],
    [/^(bridge|jembatan)/i, "bridge"],
    [/^(interlude|musik|instrumental)/i, "interlude"],
    [/^(outro|coda|ending)/i, "outro"],
  ];

  const KIND_LABELS = { intro: "Intro", verse: "Verse", prechorus: "Pre-chorus", chorus: "Reff", bridge: "Bridge", interlude: "Interlude", outro: "Outro" };

  function kindOf(header) {
    const found = KINDS.find(([pattern]) => pattern.test(header));
    return found ? found[1] : "verse";
  }

  /** @returns {{kind:string,label:string,lines:string[]}[]} */
  function parseLyrics(text) {
    const sections = [];
    let current = null;

    const start = (kind, labeled) => {
      current = { kind, label: KIND_LABELS[kind], lines: [], labeled };
      sections.push(current);
    };

    String(text || "").split(/\r?\n/).forEach((raw) => {
      const line = clean(raw);
      if (!line) {
        current = null;
        return;
      }
      const header = line.match(HEADER);
      if (header) {
        start(kindOf(header[1]), true);
        return;
      }
      if (!current) start("verse", false);
      current.lines.push(line);
    });

    // Bait tanpa label yang muncul lebih dari sekali hampir pasti reff.
    const counts = {};
    const keyOf = (s) => s.lines.join("|").toLowerCase();
    sections.forEach((s) => (counts[keyOf(s)] = (counts[keyOf(s)] || 0) + 1));
    sections.forEach((s) => {
      if (!s.labeled && s.lines.length && counts[keyOf(s)] > 1) {
        s.kind = "chorus";
        s.label = KIND_LABELS.chorus;
      }
    });

    return sections.filter((s) => s.lines.length || ["intro", "interlude", "outro"].includes(s.kind));
  }

  /* words: Indonesia, Jawa, Inggris. action melanjutkan nama tokoh. */
  const MOTIFS = [
    { id: "hujan", label: "Hujan", tone: "sad", words: ["hujan", "gerimis", "udan", "rain", "raining"], action: "stands still in the falling rain, droplets running down the face", env: "rain falling steadily, wet reflective ground" },
    { id: "bulan", label: "Bulan", tone: "sad", words: ["bulan", "rembulan", "purnama", "moon", "moonlight"], action: "gazes up at a full moon", env: "a large full moon hanging in the night sky" },
    { id: "bintang", label: "Bintang", tone: "soft", words: ["bintang", "lintang", "star", "stars"], action: "lies back and looks up at a sky full of stars", env: "a dense field of stars overhead" },
    { id: "malam", label: "Malam", tone: "sad", words: ["malam", "wengi", "bengi", "night", "gelap", "peteng"], action: "sits alone by a dim light late at night", env: "deep quiet night" },
    { id: "senja", label: "Senja", tone: "soft", words: ["senja", "sore", "surup", "sunset", "dusk"], action: "watches the sun sink low on the horizon", env: "orange dusk sky" },
    { id: "pagi", label: "Pagi", tone: "happy", words: ["pagi", "esuk", "fajar", "morning", "sunrise", "mentari", "srengenge"], action: "opens the window to soft morning sunlight", env: "fresh early morning light" },
    { id: "jalan", label: "Jalan", tone: "soft", words: ["jalan", "dalan", "langkah", "lampah", "road", "street", "walk"], action: "walks slowly down an empty road", env: "a long empty road stretching ahead" },
    { id: "laut", label: "Laut", tone: "soft", words: ["laut", "pantai", "segoro", "ombak", "sea", "ocean", "beach", "wave"], action: "stands at the shoreline as waves wash over the feet", env: "waves rolling onto the shore" },
    { id: "kereta", label: "Stasiun", tone: "sad", words: ["kereta", "stasiun", "sepur", "train", "station"], action: "waits alone on a station platform as a train pulls away", env: "a quiet old train station" },
    { id: "tangis", label: "Air mata", tone: "sad", words: ["tangis", "menangis", "nangis", "tangisan", "luh", "eluh", "cry", "tears", "crying", "air mata"], action: "wipes away a tear, lips trembling", env: "" },
    { id: "kangen", label: "Rindu", tone: "sad", words: ["rindu", "kangen", "kelingan", "ingat", "miss", "remember"], action: "holds an old photograph and smiles sadly at it", env: "" },
    { id: "pergi", label: "Perpisahan", tone: "sad", words: ["pergi", "lungo", "tinggal", "ninggal", "pisah", "leave", "gone", "goodbye"], action: "turns and walks away without looking back", env: "" },
    { id: "cinta", label: "Cinta", tone: "happy", words: ["cinta", "sayang", "tresno", "tresna", "asmara", "love", "kasih"], action: "smiles softly with a hand resting over the heart", env: "" },
    { id: "rumah", label: "Rumah", tone: "soft", words: ["rumah", "omah", "desa", "kampung", "deso", "home", "village"], action: "stands at the front door of a modest village home", env: "a modest Javanese village home" },
    { id: "bunga", label: "Bunga", tone: "soft", words: ["bunga", "kembang", "melati", "mawar", "flower", "rose"], action: "gently holds a small flower in both hands", env: "scattered flower petals" },
    { id: "angin", label: "Angin", tone: "soft", words: ["angin", "bayu", "wind", "breeze"], action: "closes the eyes as the wind moves through the hair", env: "a soft wind moving through the scene" },
    { id: "joget", label: "Joget", tone: "happy", words: ["joget", "goyang", "nari", "menari", "dance", "dancing", "party"], action: "dances freely with a wide smile", env: "" },
  ];

  /* Frasa dua kata dicek pada teks utuh, sisanya per kata. */
  function findMotifs(line) {
    const lower = " " + line.toLowerCase().replace(/[^\p{L}\s]/gu, " ").replace(/\s+/g, " ") + " ";
    return MOTIFS.filter((motif) => motif.words.some((word) => lower.includes(" " + word + " ")));
  }

  Skena.gen = Skena.gen || {};
  Object.assign(Skena.gen, { parseLyrics, findMotifs, MOTIFS });
})(typeof window !== "undefined" ? window : globalThis);
