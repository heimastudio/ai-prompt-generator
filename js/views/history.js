/* Riwayat prompt: cari, filter, salin, buka lagi, hapus. */
(function (root) {
  const Skena = root.Skena;
  const { esc, formatDate } = Skena.utils;
  const ui = Skena.ui;
  const log = Skena.store.history;

  const TYPES = [
    { id: "all", label: "Semua" },
    { id: "image", label: "Gambar", route: "gambar" },
    { id: "veo", label: "Video Veo", route: "veo" },
    { id: "storyboard", label: "Storyboard", route: "storyboard" },
  ];

  const typeInfo = (id) => TYPES.find((t) => t.id === id);

  let filter = "all";
  let query = "";

  function preview(entry) {
    return entry.blocks && entry.blocks[0] ? entry.blocks[0].text : entry.copyText;
  }

  function row(entry) {
    return `<article class="entry">
      <div class="entry__head">
        <div class="entry__title"><span class="tag">${esc(typeInfo(entry.type).label)}</span><h2 style="font-size:var(--text-md)">${esc(entry.title)}</h2></div>
        <span class="entry__date">${esc(formatDate(entry.createdAt))}</span>
      </div>
      <p class="entry__text">${esc(preview(entry))}</p>
      <div class="btn-row">
        <button class="btn btn--small btn--saga" type="button" data-act="copy" data-id="${esc(entry.id)}">Salin</button>
        <button class="btn btn--small" type="button" data-act="open" data-id="${esc(entry.id)}">Buka lagi</button>
        <button class="btn btn--small btn--danger" type="button" data-act="delete" data-id="${esc(entry.id)}">Hapus</button>
      </div>
    </article>`;
  }

  function render(root) {
    root.innerHTML = `
      <header class="page-head"><h1>Riwayat prompt</h1>
      <p>Setiap kali kamu menekan Buat prompt, hasilnya tersimpan di browser ini.</p></header>
      <div class="toolbar">
        <input class="input toolbar__search" id="log-search" type="search" placeholder="Cari di riwayat" aria-label="Cari di riwayat" value="${esc(query)}">
        <button class="btn btn--danger" type="button" id="log-clear">Hapus semua riwayat</button>
      </div>
      <div class="chips" id="log-filter" style="margin-bottom:var(--space-4)">
        ${TYPES.map((t) => `<label class="chip"><input type="radio" name="log-type" value="${t.id}"${t.id === filter ? " checked" : ""}><span>${t.label}</span></label>`).join("")}
      </div>
      <div id="log-list"></div>`;

    const list = root.querySelector("#log-list");

    function draw() {
      const q = query.toLowerCase();
      const entries = log.all().filter(
        (e) => (filter === "all" || e.type === filter) && (!q || (e.title + " " + e.copyText).toLowerCase().includes(q))
      );
      list.innerHTML = entries.length
        ? `<div class="log">${entries.map(row).join("")}</div>`
        : `<div class="empty"><p>${log.all().length ? "Tidak ada riwayat yang cocok." : "Riwayat masih kosong. Buat prompt pertamamu."}</p>${log.all().length ? "" : `<a class="btn btn--primary" href="#gambar">Buat prompt gambar</a>`}</div>`;
      root.querySelector("#log-clear").disabled = !log.all().length;
      Skena.refreshNav();
    }

    root.querySelector("#log-search").addEventListener("input", (event) => {
      query = event.target.value;
      draw();
    });
    root.querySelector("#log-filter").addEventListener("change", (event) => {
      filter = event.target.value;
      draw();
    });
    root.querySelector("#log-clear").addEventListener("click", () => {
      ui.confirmDialog({
        title: "Hapus semua riwayat?",
        body: "Semua prompt di riwayat browser ini hilang dan tidak bisa dikembalikan.",
        action: "Hapus semua",
        onConfirm() {
          log.clear();
          ui.toast("Riwayat dihapus");
          draw();
        },
      });
    });
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-act]");
      if (!button) return;
      const entry = log.all().find((e) => e.id === button.dataset.id);
      if (!entry) return;
      if (button.dataset.act === "copy") ui.copy(entry.copyText, "Prompt");
      if (button.dataset.act === "open") Skena.openWith(typeInfo(entry.type).route, entry.input);
      if (button.dataset.act === "delete") {
        log.remove(entry.id);
        ui.toast("Riwayat dihapus");
        draw();
      }
    });

    draw();
  }

  Skena.views.riwayat = { label: "Riwayat", render };
})(window);
