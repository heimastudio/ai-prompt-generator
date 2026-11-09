(function (root) {
  const Skena = root.Skena;
  const { esc, timecode } = Skena.utils;
  const ui = Skena.ui;

  const EXAMPLE = `[Intro]

[Verse 1]
Udan tiba ing wayah wengi
Aku dewe ngenteni ing stasiun
Kelingan esemmu biyen
Saiki mung kari kenangan

[Reff]
Rembulan dadi seksi
Tresnoku ora bakal lungo
Sanajan kowe wis adoh
Atiku isih ngenteni

[Outro]`;

  const schema = [
    { type: "section", label: "Lagu" },
    { name: "title", label: "Judul lagu", full: true, placeholder: "Judul lagu" },
    { type: "textarea", name: "lyrics", label: "Lirik", full: true, rows: 12, placeholder: "[Verse 1]\nBaris lirik...\n\n[Reff]\nBaris lirik...", hint: "Tandai bagian dengan [Intro], [Verse], [Reff], [Bridge], [Outro]. Tanpa tanda, bait dipisah baris kosong." },
    { type: "section", label: "Arah visual" },
    { type: "characters", name: "characters", label: "Karakter", full: true },
    { name: "location", label: "Lokasi utama", full: true, placeholder: "an old train station in a Javanese town" },
    { type: "select", name: "style", label: "Gaya video", options: "musicStyles" },
    { type: "select", name: "mode", label: "Konsep", options: "boardModes" },
    { type: "radio", name: "lineGroup", label: "Pembagian adegan", options: "sceneLengths", full: true },
    { type: "radio", name: "duration", label: "Durasi klip", options: "durations" },
    { type: "radio", name: "ratio", label: "Rasio", options: "videoRatios" },
  ];

  const defaults = {
    title: "Contoh: Ngenteni ing Stasiun",
    lyrics: EXAMPLE,
    characters: [],
    location: "an old train station in a Javanese town",
    style: "dangdutsad",
    mode: "mix",
    lineGroup: "1",
    duration: "8",
    ratio: "16:9",
  };

  function sceneCard(scene) {
    const tags = [scene.section, scene.performing ? "Nyanyi" : "", ...scene.motifs]
      .filter(Boolean)
      .map((t) => `<span class="tag">${esc(t)}</span>`)
      .join("");
    return `<article class="scene">
      <header class="scene__top">
        ${ui.frameGlyph(scene.shotId)}
        <div class="scene__info">
          <div class="scene__number"><span>Adegan ${scene.number}</span><span class="scene__time">${timecode(scene.start)}-${timecode(scene.end)}</span></div>
          <div class="scene__shot">${esc(scene.shotLabel)}, ${esc(scene.moveLabel)}</div>
          <div class="scene__lyric">${esc(scene.lyric || "Instrumental")}</div>
        </div>
      </header>
      <div class="scene__body">
        <div class="scene__tags">${tags}</div>
        <p class="scene__visual">${esc(scene.visual)}</p>
        <div class="btn-row">
          <button class="btn btn--small" type="button" data-copy="imagePrompt" data-scene="${scene.number}">Salin prompt gambar</button>
          <button class="btn btn--small" type="button" data-copy="veoPrompt" data-scene="${scene.number}">Salin prompt Veo</button>
        </div>
        <details><summary>Lihat prompt</summary>
          <pre class="scene__prompt">${esc(scene.imagePrompt)}</pre>
          <pre class="scene__prompt">${esc(scene.veoPrompt)}</pre>
        </details>
      </div>
    </article>`;
  }

  function board(result) {
    return `<div class="board-head"><h2>Daftar adegan</h2>
      <button class="btn btn--primary" type="button" data-copy-all>Salin semua adegan</button></div>
      <div class="board">${result.scenes.map(sceneCard).join("")}</div>`;
  }

  function bind(el, result) {
    el.querySelector("[data-copy-all]").addEventListener("click", () => ui.copy(result.copyText, "Storyboard"));
    el.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", () => {
        const scene = result.scenes[Number(button.dataset.scene) - 1];
        ui.copy(scene[button.dataset.copy], `Prompt adegan ${scene.number}`);
      });
    });
  }

  Skena.views.storyboard = {
    label: "Storyboard",
    render(root, restore) {
      Skena.studio({
        root,
        heading: "Storyboard dari lirik",
        lead: "Tempel lirik, dan tiap baris jadi adegan lengkap dengan shot, timecode, prompt gambar, dan prompt Veo.",
        schema,
        defaults,
        restore,
        generate: Skena.gen.storyboard,
        afterRender: board,
        bindExtra: bind,
      });
    },
  };
})(window);
