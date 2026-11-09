/* Generator prompt Google Veo.
   Rumus: kamera + subjek + aksi + konteks + gaya, lalu audio
   (dialog dalam tanda kutip, "SFX:", "Ambient noise:").
   Durasi, rasio, dan audio adalah setting model, bukan teks prompt. */
(function (root) {
  const Skena = root.Skena;
  const { clean } = Skena.utils;
  const { describeCast, consistencyLine, sentence, paragraph } = Skena.gen;

  const WORDS_PER_SECOND = 2.5;
  const BASE_NEGATIVE = "subtitles, captions, on-screen text, watermark, distorted faces";

  function veo(input, characters) {
    const cast = describeCast(characters);
    const subject = [cast, clean(input.subject)].filter(Boolean).join(", ");
    if (!subject) return { error: "Isi subjek atau pilih minimal satu karakter." };
    if (!clean(input.action)) return { error: "Isi aksi: apa yang terjadi selama klip berjalan." };

    const shot = Skena.pick("shots", input.shot) || "medium shot";
    const camera = Skena.pick("cameraMoves", input.camera);
    const lens = Skena.pick("lenses", input.lens);
    const opening = [shot, "with", camera, lens && "on a " + lens].filter(Boolean).join(" ");

    const visual = paragraph(
      sentence(opening + ": " + subject),
      sentence(input.action),
      input.location ? sentence("The setting is " + clean(input.location)) : "",
      sentence(Skena.pick("videoStyles", input.style), Skena.pick("lighting", input.lighting), moodPhrase(input.mood)),
      consistencyLine(characters)
    );

    const audioOn = input.audio !== "off";
    const audioLines = audioOn ? buildAudio(input, characters) : [];
    const text = [visual, ...audioLines].join("\n");
    const negative = [BASE_NEGATIVE, clean(input.negative)].filter(Boolean).join(", ");
    const settings = `Durasi: ${input.duration} detik\nRasio: ${input.ratio}\nAudio: ${audioOn ? "aktif" : "mati"}`;

    const notes = [];
    const words = clean(input.dialogue).split(" ").filter(Boolean).length;
    const limit = Math.floor(Number(input.duration) * WORDS_PER_SECOND);
    if (audioOn && words > limit) {
      notes.push(`Dialog ${words} kata berisiko terpotong. Untuk klip ${input.duration} detik, usahakan maksimal sekitar ${limit} kata.`);
    }

    const blocks = [
      { label: "Prompt Veo", text },
      { label: "Negative prompt", text: negative },
      { label: "Setting model", text: settings },
    ];

    return {
      type: "veo",
      title: clean(input.action).slice(0, 70),
      input,
      blocks,
      meta: [
        { label: "Durasi", value: input.duration + " detik" },
        { label: "Rasio", value: input.ratio },
        { label: "Audio", value: audioOn ? "Aktif" : "Mati" },
        { label: "Karakter", value: String(characters.length) },
      ],
      notes,
      copyText: text + "\n\nNegative prompt: " + negative,
    };
  }

  function moodPhrase(id) {
    const mood = Skena.pick("moods", id);
    return mood ? mood + " atmosphere" : "";
  }

  function buildAudio(input, characters) {
    const lines = [];
    const dialogue = clean(input.dialogue);
    if (dialogue) {
      const speaker = clean(input.speaker) || (characters[0] ? Skena.gen.shortName(characters[0]) : "The character");
      const how = [clean(input.language) && "in " + clean(input.language), clean(input.delivery)].filter(Boolean).join(", ");
      lines.push(`${speaker} says${how ? " " + how : ""}: "${dialogue.replace(/"/g, "'")}"`);
    }
    if (clean(input.sfx)) lines.push("SFX: " + clean(input.sfx));
    if (clean(input.ambient)) lines.push("Ambient noise: " + clean(input.ambient));
    if (clean(input.music)) lines.push("Music: " + clean(input.music));
    return lines;
  }

  Skena.gen.veo = veo;
})(typeof window !== "undefined" ? window : globalThis);
