/* Semua preset ada di sini. Tambah pilihan baru cukup dengan satu baris:
   { id: "unik", label: "Teks di menu", prompt: "english phrase for the prompt" } */
(function (root) {
  const Skena = root.Skena;
  const none = (label) => ({ id: "", label: label || "Bebas", prompt: "" });

  Skena.options = {
    imageFormats: [
      { id: "natural", label: "Gemini / Imagen / ChatGPT" },
      { id: "midjourney", label: "Midjourney" },
      { id: "tags", label: "Stable Diffusion / FLUX" },
    ],

    imageStyles: [
      { id: "cinematic", label: "Foto sinematik", prompt: "cinematic film still, photorealistic" },
      { id: "editorial", label: "Foto editorial", prompt: "high-end editorial photograph" },
      { id: "documentary", label: "Foto jurnalistik", prompt: "candid documentary photograph" },
      { id: "anime", label: "Anime", prompt: "detailed anime illustration" },
      { id: "3dcute", label: "3D imut", prompt: "cute stylized 3D render, soft rounded shapes" },
      { id: "watercolor", label: "Cat air", prompt: "delicate watercolor painting" },
      { id: "poster", label: "Poster grafis", prompt: "bold graphic poster illustration" },
      { id: "vintage", label: "Film analog", prompt: "vintage 35mm analog film photograph with natural grain" },
    ],

    videoStyles: [
      { id: "cinematic", label: "Sinematik", prompt: "Cinematic, photorealistic, shallow depth of field" },
      { id: "documentary", label: "Dokumenter", prompt: "Handheld documentary realism" },
      { id: "musicvideo", label: "Video klip", prompt: "Stylish music video look with rich color grading" },
      { id: "anime", label: "Anime", prompt: "Hand-drawn anime style animation" },
      { id: "3dcute", label: "3D imut", prompt: "Cute stylized 3D animation, soft rounded shapes" },
      { id: "vintage", label: "Film analog", prompt: "Vintage 16mm film look with natural grain" },
    ],

    musicStyles: [
      { id: "koplo", label: "Dangdut koplo panggung", prompt: "energetic Indonesian dangdut koplo music video, colorful stage lights, festive crowd atmosphere" },
      { id: "dangdutsad", label: "Dangdut sendu desa", prompt: "nostalgic Javanese village music video, natural tones, 35mm film texture" },
      { id: "poppcine", label: "Pop Indonesia sinematik", prompt: "cinematic Indonesian pop music video, elegant color grading, shallow depth of field" },
      { id: "idol", label: "Girl group idol", prompt: "polished virtual idol group music video, glossy set design, vibrant synchronized lighting" },
      { id: "kids", label: "Lagu anak 3D", prompt: "bright cheerful 3D animated children's song video, soft rounded shapes, pastel colors" },
      { id: "indie", label: "Indie analog", prompt: "dreamy indie music video, vintage analog film look, soft halation" },
    ],

    shots: [
      none(),
      { id: "extremewide", label: "Sangat lebar", prompt: "extreme wide shot" },
      { id: "wide", label: "Lebar", prompt: "wide shot" },
      { id: "full", label: "Seluruh badan", prompt: "full body shot" },
      { id: "medium", label: "Sebatas pinggang", prompt: "medium shot" },
      { id: "mediumclose", label: "Sebatas dada", prompt: "medium close-up" },
      { id: "close", label: "Wajah", prompt: "close-up" },
      { id: "extremeclose", label: "Detail mata/tangan", prompt: "extreme close-up" },
    ],

    angles: [
      none(),
      { id: "eye", label: "Sejajar mata", prompt: "eye-level angle" },
      { id: "low", label: "Dari bawah", prompt: "low angle" },
      { id: "high", label: "Dari atas", prompt: "high angle" },
      { id: "dutch", label: "Miring", prompt: "dutch angle" },
      { id: "overhead", label: "Tepat di atas", prompt: "overhead top-down view" },
      { id: "drone", label: "Udara", prompt: "aerial view" },
    ],

    cameraMoves: [
      { id: "static", label: "Diam", prompt: "a locked-off static camera" },
      { id: "dollyin", label: "Dolly maju", prompt: "a slow dolly-in" },
      { id: "dollyout", label: "Dolly mundur", prompt: "a slow dolly-out" },
      { id: "pan", label: "Pan", prompt: "a smooth pan" },
      { id: "tilt", label: "Tilt", prompt: "a slow upward tilt" },
      { id: "tracking", label: "Tracking", prompt: "smooth tracking movement" },
      { id: "orbit", label: "Mengitari subjek", prompt: "a slow orbit around the subject" },
      { id: "crane", label: "Crane", prompt: "a rising crane move" },
      { id: "handheld", label: "Handheld", prompt: "a subtle handheld camera" },
    ],

    lenses: [
      none(),
      { id: "24", label: "24mm lebar", prompt: "24mm wide lens" },
      { id: "35", label: "35mm", prompt: "35mm lens" },
      { id: "50", label: "50mm", prompt: "50mm lens" },
      { id: "85", label: "85mm potret", prompt: "85mm portrait lens with shallow depth of field" },
    ],

    lighting: [
      none(),
      { id: "golden", label: "Golden hour", prompt: "warm golden hour sunlight" },
      { id: "soft", label: "Cahaya lembut", prompt: "soft diffused window light" },
      { id: "dramatic", label: "Dramatis", prompt: "dramatic low-key lighting with deep shadows" },
      { id: "neon", label: "Neon", prompt: "vibrant neon lighting" },
      { id: "stage", label: "Lampu panggung", prompt: "colorful concert stage lighting with haze" },
      { id: "moon", label: "Cahaya bulan", prompt: "cool blue moonlight" },
      { id: "overcast", label: "Mendung", prompt: "soft overcast daylight" },
    ],

    moods: [
      none(),
      { id: "melancholic", label: "Sendu", prompt: "melancholic" },
      { id: "romantic", label: "Romantis", prompt: "romantic" },
      { id: "joyful", label: "Ceria", prompt: "joyful" },
      { id: "tense", label: "Tegang", prompt: "tense" },
      { id: "dreamy", label: "Melamun", prompt: "dreamy" },
      { id: "epic", label: "Megah", prompt: "epic" },
      { id: "nostalgic", label: "Nostalgia", prompt: "nostalgic" },
    ],

    imageRatios: [
      { id: "1:1", label: "1:1" },
      { id: "4:5", label: "4:5" },
      { id: "16:9", label: "16:9" },
      { id: "9:16", label: "9:16" },
    ],

    videoRatios: [
      { id: "16:9", label: "16:9" },
      { id: "9:16", label: "9:16" },
    ],

    durations: [
      { id: "4", label: "4 detik" },
      { id: "6", label: "6 detik" },
      { id: "8", label: "8 detik" },
    ],

    audioModes: [
      { id: "on", label: "Pakai audio" },
      { id: "off", label: "Tanpa audio" },
    ],

    sceneLengths: [
      { id: "1", label: "1 baris per adegan" },
      { id: "2", label: "2 baris per adegan" },
    ],

    boardModes: [
      { id: "mix", label: "Cerita + nyanyi di reff" },
      { id: "story", label: "Cerita saja" },
      { id: "performance", label: "Nyanyi saja" },
    ],
  };

  /** Ambil frasa prompt dari sebuah preset. */
  Skena.pick = (listName, id) => {
    const found = Skena.options[listName].find((o) => o.id === id);
    return found && found.prompt ? found.prompt : "";
  };

  /** Ambil label yang terlihat pengguna. */
  Skena.labelOf = (listName, id) => {
    const found = Skena.options[listName].find((o) => o.id === id);
    return found ? found.label : "";
  };
})(typeof window !== "undefined" ? window : globalThis);
