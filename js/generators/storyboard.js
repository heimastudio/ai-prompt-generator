/* Generator storyboard: lirik -> daftar adegan dengan prompt gambar & Veo. */
(function (root) {
  const Skena = root.Skena;
  const { clean, timecode } = Skena.utils;
  const { parseLyrics, findMotifs, describeCast, consistencyLine, joinNames, shortName, sentence, paragraph } = Skena.gen;

  /* Ritme visual per bagian lagu. Diputar bergiliran supaya shot tidak monoton. */
  const DIRECTION = {
    intro: { shots: ["extremewide", "wide"], moves: ["crane", "dollyin"], energy: "slow, atmospheric opening" },
    verse: { shots: ["medium", "mediumclose", "full", "close"], moves: ["tracking", "static", "dollyin", "handheld"], energy: "intimate storytelling" },
    prechorus: { shots: ["mediumclose", "close"], moves: ["dollyin", "orbit"], energy: "tension building" },
    chorus: { shots: ["wide", "medium", "close", "full"], moves: ["orbit", "crane", "tracking", "dollyin"], energy: "emotional peak, high energy" },
    bridge: { shots: ["close", "extremeclose", "mediumclose"], moves: ["static", "dollyin"], energy: "quiet, reflective turning point" },
    interlude: { shots: ["wide", "extremeclose"], moves: ["pan", "tracking"], energy: "instrumental breathing moment" },
    outro: { shots: ["full", "wide", "extremewide"], moves: ["dollyout", "crane"], energy: "slow resolution, fading away" },
  };

  const FALLBACK_ACTIONS = [
    "walks slowly, lost in thought",
    "pauses and looks into the distance",
    "looks down, then lifts the gaze with quiet resolve",
    "sits by a window, fingers tracing the frame",
  ];

  const TONE = {
    sad: "cool muted tones, soft shadows",
    happy: "warm glowing tones, gentle highlights",
    soft: "natural balanced tones",
  };

  function dominantTone(motifs) {
    if (!motifs.length) return "soft";
    const score = { sad: 0, happy: 0, soft: 0 };
    motifs.forEach((m) => (score[m.tone] += 1));
    return Object.keys(score).sort((a, b) => score[b] - score[a])[0];
  }

  function groupLines(lines, size) {
    const groups = [];
    for (let i = 0; i < lines.length; i += size) groups.push(lines.slice(i, i + size).join(" / "));
    return groups;
  }

  function storyboard(input, characters) {
    const sections = parseLyrics(input.lyrics);
    if (!sections.length) return { error: "Tempel lirik lagunya dulu." };

    const duration = Number(input.duration);
    const group = Number(input.lineGroup) || 1;
    const style = Skena.pick("musicStyles", input.style);
    const location = clean(input.location);
    const who = characters.length ? joinNames(characters.map(shortName)) : "the main character";
    const scenes = [];
    const perKind = {};

    sections.forEach((section) => {
      const beats = section.lines.length ? groupLines(section.lines, group) : [""];
      beats.forEach((lyric) => {
        const direction = DIRECTION[section.kind];
        const turn = (perKind[section.kind] = (perKind[section.kind] || 0) + 1) - 1;
        const number = scenes.length + 1;
        scenes.push(
          buildScene({
            number,
            section,
            lyric,
            start: (number - 1) * duration,
            duration,
            shotId: direction.shots[turn % direction.shots.length],
            moveId: direction.moves[turn % direction.moves.length],
            energy: direction.energy,
            fallback: FALLBACK_ACTIONS[turn % FALLBACK_ACTIONS.length],
            mode: input.mode,
            who,
            style,
            location,
            characters,
            ratio: input.ratio,
          })
        );
      });
    });

    const total = scenes.length * duration;
    const notes = ["Timecode dihitung dari durasi klip, belum dari ketukan lagu. Sesuaikan lagi saat editing."];
    if (!characters.length) notes.push("Pilih karakter supaya tokohnya konsisten di semua adegan.");

    const title = clean(input.title) || "Storyboard tanpa judul";
    const result = {
      type: "storyboard",
      title,
      input,
      scenes,
      blocks: [],
      meta: [
        { label: "Adegan", value: String(scenes.length) },
        { label: "Total", value: timecode(total) },
        { label: "Per klip", value: duration + " detik" },
        { label: "Rasio", value: input.ratio },
      ],
      notes,
    };
    result.copyText = formatBoard(result);
    return result;
  }

  function buildScene(s) {
    const motifs = s.lyric ? findMotifs(s.lyric) : [];
    const tone = dominantTone(motifs);
    const instrumental = !s.lyric;
    const performing = !instrumental && (s.mode === "performance" || (s.mode === "mix" && s.section.kind === "chorus"));

    let action;
    if (performing) action = "sings with feeling directly toward the camera, lips clearly moving";
    else if (motifs[0]) action = motifs[0].action;
    else if (instrumental) action = "appears small within the landscape, moving quietly";
    else action = s.fallback;

    // Motif pertama sudah jadi aksi, jadi latar diambil dari motif berikutnya.
    const envFrom = motifs.find((m, i) => m.env && (performing || i > 0));
    const setting = [s.location, envFrom && envFrom.env].filter(Boolean).join(", ");
    const shot = Skena.pick("shots", s.shotId);
    const camera = Skena.pick("cameraMoves", s.moveId);
    const cast = describeCast(s.characters) || s.who;
    const lyricLine = s.lyric ? `The moment visually interprets this lyric without showing any text: "${s.lyric.replace(/"/g, "'")}".` : "";

    const shared = paragraph(
      s.location || envFrom ? sentence("The setting is " + setting) : "",
      lyricLine,
      sentence(s.style, TONE[tone], s.energy),
      consistencyLine(s.characters)
    );

    const imagePrompt = paragraph(
      sentence(`${shot} of ${cast}, who ${action}`),
      shared,
      `Aspect ratio ${s.ratio}.`,
      "Avoid text, watermark, distorted hands."
    );

    const veoPrompt = [
      paragraph(sentence(`${shot} with ${camera}: ${cast}`), sentence(`${s.who} ${action}`), shared),
      "No spoken dialogue and no singing voice. The song is added in editing.",
      "Ambient noise: very quiet room tone.",
    ].join("\n");

    return {
      number: s.number,
      kind: s.section.kind,
      section: s.section.label,
      lyric: s.lyric,
      start: s.start,
      end: s.start + s.duration,
      shotId: s.shotId,
      shotLabel: Skena.labelOf("shots", s.shotId),
      moveLabel: Skena.labelOf("cameraMoves", s.moveId),
      motifs: motifs.map((m) => m.label),
      performing,
      visual: `${s.who} ${action}.`,
      imagePrompt,
      veoPrompt,
    };
  }

  function formatScene(scene) {
    return [
      `ADEGAN ${scene.number} | ${scene.section} | ${timecode(scene.start)}-${timecode(scene.end)}`,
      scene.lyric ? `Lirik: ${scene.lyric}` : "Lirik: (instrumental)",
      `Shot: ${scene.shotLabel}, ${scene.moveLabel}`,
      "",
      "PROMPT GAMBAR:",
      scene.imagePrompt,
      "",
      "PROMPT VEO:",
      scene.veoPrompt,
    ].join("\n");
  }

  function formatBoard(board) {
    return [`STORYBOARD: ${board.title}`, ...board.scenes.map(formatScene)].join("\n\n------------------------------\n\n");
  }

  Object.assign(Skena.gen, { storyboard, formatScene, formatBoard });
})(typeof window !== "undefined" ? window : globalThis);
