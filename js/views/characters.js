/* Database karakter: daftar, tambah, ubah, hapus, salin deskripsi. */
(function (root) {
  const Skena = root.Skena;
  const { esc, clean } = Skena.utils;
  const ui = Skena.ui;
  const db = Skena.store.characters;

  const schema = [
    { name: "name", label: "Nama", placeholder: "Sari" },
    { name: "role", label: "Peran", placeholder: "Tokoh utama video klip" },
    { name: "descriptor", label: "Gambaran umum", full: true, placeholder: "a Javanese woman in her mid-20s", hint: "Tulis deskripsi dalam bahasa Inggris dan sespesifik mungkin." },
    { name: "face", label: "Wajah", full: true, placeholder: "soft oval face, warm brown eyes, small mole under the left eye" },
    { name: "hair", label: "Rambut", placeholder: "long straight black hair" },
    { name: "body", label: "Tubuh & kulit", placeholder: "slim build, tan skin" },
    { name: "outfit", label: "Pakaian", full: true, placeholder: "mustard yellow kebaya with a dark batik sarong" },
    { name: "accessories", label: "Aksesori", full: true, placeholder: "small silver earrings" },
    { name: "color", label: "Warna penanda", type: "color" },
  ];

  const SHEET = [
    ["Wajah", "face"],
    ["Rambut", "hair"],
    ["Tubuh", "body"],
    ["Pakaian", "outfit"],
    ["Aksesori", "accessories"],
  ];

  let query = "";

  function card(c) {
    const rows = SHEET.filter(([, key]) => clean(c[key]))
      .map(([label, key]) => `<dt>${label}</dt><dd>${esc(c[key])}</dd>`)
      .join("");
    const color = /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : "";
    return `<article class="person" style="--person-color:${color || "var(--accent)"}">
      <div><h2>${esc(c.name)}</h2><p class="person__role">${esc(c.role || c.descriptor || "")}</p></div>
      <dl class="person__sheet">${rows}</dl>
      <div class="btn-row">
        <button class="btn btn--small btn--saga" type="button" data-act="copy" data-id="${esc(c.id)}">Salin deskripsi</button>
        <button class="btn btn--small" type="button" data-act="edit" data-id="${esc(c.id)}">Ubah</button>
        <button class="btn btn--small btn--danger" type="button" data-act="delete" data-id="${esc(c.id)}">Hapus</button>
      </div>
    </article>`;
  }

  function openForm(existing, refresh) {
    const values = existing || { color: "#2231a8" };
    const el = ui.openDialog(`
      <h2>${existing ? "Ubah karakter" : "Tambah karakter"}</h2>
      <form id="char-form" class="panel" style="border:0;padding:0" novalidate>
        <div class="form-grid">${ui.renderFields(schema, values)}</div>
        <p class="form-error" role="alert"></p>
        <div class="btn-row"><button class="btn btn--primary" type="submit">Simpan karakter</button>
        <button class="btn" type="button" data-cancel>Batal</button></div>
      </form>`);
    el.querySelector("[data-cancel]").addEventListener("click", ui.closeDialog);
    el.querySelector("#char-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = ui.readForm(event.target, schema);
      if (!clean(data.name)) {
        el.querySelector(".form-error").textContent = "Isi nama karakter.";
        return;
      }
      db.save({ ...existing, ...data });
      ui.closeDialog();
      ui.toast("Karakter disimpan");
      refresh();
    });
  }

  function render(root) {
    function draw() {
      const q = query.toLowerCase();
      const people = db.all().filter((c) => !q || JSON.stringify(c).toLowerCase().includes(q));
      list.innerHTML = people.length
        ? `<div class="cast">${people.map(card).join("")}</div>`
        : `<div class="empty"><p>${query ? "Tidak ada karakter yang cocok." : "Belum ada karakter. Tambahkan satu supaya tokohmu sama di semua prompt."}</p></div>`;
      Skena.refreshNav();
    }

    root.innerHTML = `
      <header class="page-head"><h1>Database karakter</h1>
      <p>Simpan ciri tokohmu sekali. Deskripsi yang sama persis akan masuk ke setiap prompt supaya wajah dan pakaiannya konsisten.</p></header>
      <div class="toolbar">
        <input class="input toolbar__search" id="char-search" type="search" placeholder="Cari karakter" aria-label="Cari karakter" value="${esc(query)}">
        <button class="btn btn--primary" type="button" id="char-add">Tambah karakter</button>
      </div>
      <div id="char-list"></div>`;

    const list = root.querySelector("#char-list");
    root.querySelector("#char-add").addEventListener("click", () => openForm(null, draw));
    root.querySelector("#char-search").addEventListener("input", (event) => {
      query = event.target.value;
      draw();
    });
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-act]");
      if (!button) return;
      const c = db.get(button.dataset.id);
      if (!c) return;
      if (button.dataset.act === "copy") ui.copy(Skena.gen.characterBlock(c), "Deskripsi");
      if (button.dataset.act === "edit") openForm(c, draw);
      if (button.dataset.act === "delete") {
        ui.confirmDialog({
          title: `Hapus ${c.name}?`,
          body: "Karakter ini hilang dari database. Prompt yang sudah ada di riwayat tidak berubah.",
          action: "Hapus karakter",
          onConfirm() {
            db.remove(c.id);
            ui.toast("Karakter dihapus");
            draw();
          },
        });
      }
    });

    draw();
  }

  Skena.views.karakter = { label: "Karakter", render };
})(window);
