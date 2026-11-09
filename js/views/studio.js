/* Kerangka halaman generator: form di kiri, hasil di kanan.
   Halaman baru cukup memanggil Skena.studio({...}). */
(function (root) {
  const Skena = root.Skena;
  const { esc } = Skena.utils;
  const ui = Skena.ui;

  /**
   * @param {object} c
   * @param {HTMLElement} c.root       Tempat render
   * @param {string} c.heading         Judul halaman
   * @param {string} c.lead            Keterangan singkat
   * @param {Array}  c.schema          Definisi field form
   * @param {object} c.defaults        Nilai awal form
   * @param {Function} c.generate      (input, karakter) => hasil
   * @param {object} [c.restore]       Input dari riwayat
   * @param {Function} [c.afterRender] (hasil) => HTML tambahan di bawah
   * @param {Function} [c.bindExtra]   (elemen, hasil) => pasang event
   */
  Skena.studio = function (c) {
    const values = { ...c.defaults, ...(c.restore || {}) };
    if (!c.restore && Array.isArray(values.characters) && !values.characters.length) {
      const first = Skena.store.characters.all()[0];
      if (first) values.characters = [first.id];
    }

    c.root.innerHTML = `
      <header class="page-head"><h1>${esc(c.heading)}</h1><p>${esc(c.lead)}</p></header>
      <div class="studio">
        <form class="panel" id="studio-form" novalidate>
          <div class="form-grid">${ui.renderFields(c.schema, values)}</div>
          <p class="form-error" id="form-error" role="alert"></p>
          <div class="btn-row"><button class="btn btn--primary" type="submit">Buat prompt</button></div>
        </form>
        <div class="studio__output" id="output"></div>
      </div>
      <div id="output-extra"></div>`;

    const form = c.root.querySelector("#studio-form");
    const errorEl = c.root.querySelector("#form-error");
    const output = c.root.querySelector("#output");
    const extra = c.root.querySelector("#output-extra");

    function run(save) {
      const input = ui.readForm(form, c.schema);
      const characters = Skena.store.characters.getMany(input.characters);
      const result = c.generate(input, characters);
      if (result.error) {
        errorEl.textContent = save ? result.error : "";
        return;
      }
      errorEl.textContent = "";
      output.innerHTML = ui.renderSlate(result);
      ui.bindSlate(output, result);
      if (c.afterRender) {
        extra.innerHTML = c.afterRender(result);
        c.bindExtra(extra, result, output);
      }
      if (save) {
        Skena.store.history.add(result);
        Skena.refreshNav();
        ui.toast("Prompt dibuat dan masuk riwayat");
        if (window.innerWidth <= 1040) output.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      run(true);
    });

    run(false);
  };
})(window);
