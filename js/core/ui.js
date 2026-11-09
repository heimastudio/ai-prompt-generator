/* Komponen antarmuka: form deklaratif, salin, toast, dialog, slate. */
(function (root) {
  const Skena = root.Skena;
  const { esc } = Skena.utils;
  let toastTimer;

  /* ---------- Form ---------- */

  function optionList(field) {
    return typeof field.options === "string" ? Skena.options[field.options] : field.options;
  }

  function renderField(field, values) {
    if (field.type === "section") return `<h2 class="form-section">${esc(field.label)}</h2>`;

    const value = values[field.name] != null ? values[field.name] : "";
    const id = "f-" + field.name;
    const hint = field.hint ? `<small class="field__hint">${esc(field.hint)}</small>` : "";
    const span = field.full ? " field--full" : "";
    let control;

    if (field.type === "textarea") {
      control = `<textarea class="input" id="${id}" name="${field.name}" rows="${field.rows || 3}" placeholder="${esc(field.placeholder || "")}">${esc(value)}</textarea>`;
    } else if (field.type === "select") {
      const items = optionList(field)
        .map((o) => `<option value="${esc(o.id)}"${o.id === value ? " selected" : ""}>${esc(o.label)}</option>`)
        .join("");
      control = `<select class="input" id="${id}" name="${field.name}">${items}</select>`;
    } else if (field.type === "radio") {
      control = chips(field.name, optionList(field), [value], "radio");
      return `<fieldset class="field${span}" style="border:0;padding:0;margin:0"><legend class="field__label" style="padding:0;margin-bottom:6px">${esc(field.label)}</legend>${control}${hint}</fieldset>`;
    } else if (field.type === "characters") {
      const people = Skena.store.characters.all();
      control = people.length
        ? chips(field.name, people.map((c) => ({ id: c.id, label: c.name })), value || [], "checkbox")
        : `<small class="field__hint">Belum ada karakter. Tambahkan di menu <a href="#karakter">Karakter</a>.</small>`;
      return `<fieldset class="field${span}" style="border:0;padding:0;margin:0"><legend class="field__label" style="padding:0;margin-bottom:6px">${esc(field.label)}</legend>${control}${hint}</fieldset>`;
    } else {
      control = `<input class="input" id="${id}" name="${field.name}" type="${field.type || "text"}" value="${esc(value)}" placeholder="${esc(field.placeholder || "")}">`;
    }

    return `<div class="field${span}"><label class="field__label" for="${id}">${esc(field.label)}</label>${control}${hint}</div>`;
  }

  function chips(name, items, selected, type) {
    const body = items
      .map(
        (item) =>
          `<label class="chip"><input type="${type}" name="${name}" value="${esc(item.id)}"${selected.includes(item.id) ? " checked" : ""}><span>${esc(item.label)}</span></label>`
      )
      .join("");
    return `<div class="chips">${body}</div>`;
  }

  function renderFields(schema, values) {
    return schema.map((field) => renderField(field, values)).join("");
  }

  function readForm(form, schema) {
    const data = new FormData(form);
    const out = {};
    schema.forEach((field) => {
      if (field.type === "section") return;
      if (field.type === "characters") out[field.name] = data.getAll(field.name);
      else out[field.name] = (data.get(field.name) || "").toString();
    });
    return out;
  }

  /* ---------- Salin & notifikasi ---------- */

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 1800);
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    area.remove();
    return ok;
  }

  async function copy(text, label) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (error) {
      ok = fallbackCopy(text);
    }
    toast(ok ? (label || "Prompt") + " disalin" : "Browser menolak akses salin. Blok teksnya lalu salin manual.");
    return ok;
  }

  /* ---------- Dialog ---------- */

  function closeDialog() {
    document.getElementById("dialog-root").innerHTML = "";
  }

  function openDialog(html, className) {
    const host = document.getElementById("dialog-root");
    host.innerHTML = `<div class="dialog-backdrop"><div class="dialog ${className || ""}" role="dialog" aria-modal="true">${html}</div></div>`;
    const backdrop = host.firstElementChild;
    backdrop.addEventListener("mousedown", (event) => {
      if (event.target === backdrop) closeDialog();
    });
    backdrop.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDialog();
    });
    const focusable = backdrop.querySelector("input, textarea, select, button");
    if (focusable) focusable.focus();
    return backdrop;
  }

  function confirmDialog({ title, body, action, onConfirm }) {
    const el = openDialog(
      `<h2>${esc(title)}</h2><p>${esc(body)}</p>
       <div class="btn-row"><button class="btn btn--danger" type="button" data-yes>${esc(action)}</button>
       <button class="btn" type="button" data-no>Batal</button></div>`,
      "dialog--small"
    );
    el.querySelector("[data-no]").addEventListener("click", closeDialog);
    el.querySelector("[data-yes]").addEventListener("click", () => {
      closeDialog();
      onConfirm();
    });
  }

  /* ---------- Hasil ---------- */

  function promptBlock(block, index) {
    return `<section class="prompt-block">
      <div class="prompt-block__head"><h3>${esc(block.label)}</h3>
      <button class="btn btn--small${index === 0 ? " btn--saga" : ""}" type="button" data-copy-block="${index}">Salin</button></div>
      <pre class="prompt-text" tabindex="0">${esc(block.text)}</pre>
    </section>`;
  }

  /** Panel slate. `result` adalah keluaran generator. */
  function renderSlate(result) {
    const cells = result.meta
      .map((m) => `<div class="slate__cell"><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`)
      .join("");
    const notes = result.notes && result.notes.length
      ? `<ul class="slate__notes">${result.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`
      : "";
    return `<article class="slate">
      <div class="slate__stripes" aria-hidden="true"></div>
      <div class="slate__meta"><dl class="slate__meta-list">${cells}</dl></div>
      <div class="slate__body">${(result.blocks || []).map(promptBlock).join("")}${notes}</div>
    </article>`;
  }

  function bindSlate(el, result) {
    el.querySelectorAll("[data-copy-block]").forEach((button) => {
      button.addEventListener("click", () => {
        const block = result.blocks[Number(button.dataset.copyBlock)];
        copy(block.text, block.label);
      });
    });
  }

  /* Bagan kecil yang menunjukkan seberapa besar subjek di dalam frame. */
  const FRAME_SCALE = { extremewide: 0.28, wide: 0.45, full: 0.7, medium: 1, mediumclose: 1.35, close: 1.9, extremeclose: 3 };

  function frameGlyph(shotId) {
    const s = FRAME_SCALE[shotId] || 1;
    const cx = 80;
    const headY = 90 - 30 * Math.min(s, 1.4) - 8;
    const r = 13 * s;
    const bodyTop = headY + r + 2;
    return `<svg class="frame" viewBox="0 0 160 90" role="img" aria-label="Komposisi shot">
      <rect width="160" height="90" fill="#f3f4fc"/>
      <path d="M0 74H160" stroke="#c9cee6" stroke-width="1"/>
      <circle cx="${cx}" cy="${headY.toFixed(1)}" r="${r.toFixed(1)}" fill="#2231a8"/>
      <rect x="${(cx - 22 * s).toFixed(1)}" y="${bodyTop.toFixed(1)}" width="${(44 * s).toFixed(1)}" height="${(90 * s).toFixed(1)}" rx="${(12 * s).toFixed(1)}" fill="#2231a8"/>
      <path d="M53 0V90M107 0V90M0 30H160M0 60H160" stroke="#f6b21b" stroke-width=".7"/>
    </svg>`;
  }

  Skena.ui = { renderFields, readForm, toast, copy, openDialog, closeDialog, confirmDialog, renderSlate, bindSlate, frameGlyph };
})(window);
