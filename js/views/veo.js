(function (root) {
  const Skena = root.Skena;

  const schema = [
    { type: "section", label: "Adegan" },
    { type: "characters", name: "characters", label: "Karakter", full: true },
    { name: "subject", label: "Subjek tambahan", full: true, placeholder: "an elderly becak driver" },
    { type: "textarea", name: "action", label: "Aksi", full: true, rows: 2, placeholder: "She walks across the platform and stops as the train arrives", hint: "Satu aksi utama per klip biasanya paling stabil." },
    { name: "location", label: "Lokasi", full: true, placeholder: "an old train station at dusk" },
    { type: "section", label: "Kamera & gaya" },
    { type: "select", name: "shot", label: "Ukuran shot", options: "shots" },
    { type: "select", name: "camera", label: "Gerak kamera", options: "cameraMoves" },
    { type: "select", name: "lens", label: "Lensa", options: "lenses" },
    { type: "select", name: "style", label: "Gaya", options: "videoStyles" },
    { type: "select", name: "lighting", label: "Pencahayaan", options: "lighting" },
    { type: "select", name: "mood", label: "Suasana", options: "moods" },
    { type: "section", label: "Audio" },
    { type: "radio", name: "audio", label: "Audio", options: "audioModes", full: true },
    { name: "speaker", label: "Pembicara", placeholder: "Otomatis karakter pertama" },
    { name: "language", label: "Bahasa dialog", placeholder: "Javanese" },
    { name: "dialogue", label: "Dialog", full: true, placeholder: "Aku isih ngenteni kowe." },
    { name: "delivery", label: "Cara bicara", placeholder: "softly, holding back tears" },
    { name: "sfx", label: "Efek suara (SFX)", placeholder: "distant train horn" },
    { name: "ambient", label: "Suara sekitar", placeholder: "rain on a tin roof" },
    { name: "music", label: "Musik", placeholder: "faint gamelan melody" },
    { type: "section", label: "Setting model" },
    { type: "radio", name: "duration", label: "Durasi", options: "durations" },
    { type: "radio", name: "ratio", label: "Rasio", options: "videoRatios" },
    { name: "negative", label: "Tambahan yang dihindari", full: true, placeholder: "cars, modern buildings" },
  ];

  const defaults = {
    characters: [],
    subject: "",
    action: "She walks along the platform, stops, and looks toward the arriving train",
    location: "an old colonial train station at dusk",
    shot: "medium",
    camera: "dollyin",
    lens: "50",
    style: "cinematic",
    lighting: "golden",
    mood: "nostalgic",
    audio: "on",
    speaker: "",
    language: "Javanese",
    dialogue: "Aku isih ngenteni kowe.",
    delivery: "softly, holding back tears",
    sfx: "distant train horn",
    ambient: "light rain on a tin roof",
    music: "",
    duration: "8",
    ratio: "16:9",
    negative: "",
  };

  Skena.views.veo = {
    label: "Video Veo",
    render(root, restore) {
      Skena.studio({
        root,
        heading: "Prompt video Google Veo",
        lead: "Susun kamera, aksi, dan audio untuk satu klip. Durasi dan rasio dipisah karena diatur di setting model.",
        schema,
        defaults,
        restore,
        generate: Skena.gen.veo,
      });
    },
  };
})(window);
