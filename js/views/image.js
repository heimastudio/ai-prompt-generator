(function (root) {
  const Skena = root.Skena;

  const schema = [
    { type: "section", label: "Isi gambar" },
    { type: "characters", name: "characters", label: "Karakter", full: true, hint: "Deskripsi lengkap karakter otomatis masuk ke prompt." },
    { name: "subject", label: "Subjek tambahan", full: true, placeholder: "a young street musician", hint: "Tulis dalam bahasa Inggris untuk hasil terbaik." },
    { name: "action", label: "Aksi", placeholder: "holding an umbrella and looking at the sky" },
    { name: "location", label: "Lokasi", placeholder: "an old train station in Malang" },
    { type: "section", label: "Gaya & komposisi" },
    { type: "radio", name: "format", label: "Format untuk", options: "imageFormats", full: true },
    { type: "select", name: "style", label: "Gaya", options: "imageStyles" },
    { type: "select", name: "shot", label: "Ukuran shot", options: "shots" },
    { type: "select", name: "angle", label: "Sudut kamera", options: "angles" },
    { type: "select", name: "lighting", label: "Pencahayaan", options: "lighting" },
    { type: "select", name: "mood", label: "Suasana", options: "moods" },
    { name: "palette", label: "Palet warna", placeholder: "indigo and warm amber" },
    { type: "radio", name: "ratio", label: "Rasio", options: "imageRatios", full: true },
    { name: "details", label: "Detail tambahan", full: true, placeholder: "light rain, reflections on wet tiles" },
    { name: "negative", label: "Yang harus dihindari", full: true, placeholder: "Kosongkan untuk memakai daftar standar" },
  ];

  const defaults = {
    characters: [],
    subject: "",
    action: "holding a paper umbrella and looking down the platform",
    location: "an old colonial train station in Malang",
    format: "natural",
    style: "cinematic",
    shot: "medium",
    angle: "eye",
    lighting: "golden",
    mood: "nostalgic",
    palette: "indigo and warm amber",
    ratio: "16:9",
    details: "light rain, reflections on wet tiles",
    negative: "",
  };

  Skena.views.gambar = {
    label: "Gambar",
    render(root, restore) {
      Skena.studio({
        root,
        heading: "Prompt gambar",
        lead: "Pilih karakter, atur gaya dan komposisi, lalu salin prompt sesuai format model yang kamu pakai.",
        schema,
        defaults,
        restore,
        generate: Skena.gen.image,
      });
    },
  };
})(window);
