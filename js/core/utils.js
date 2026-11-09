/* Helper umum. Semua modul menempel ke satu namespace: window.Skena. */
(function (root) {
  const Skena = (root.Skena = root.Skena || {});
  Skena.views = Skena.views || {};

  const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  Skena.utils = {
    /** Wajib dipakai untuk setiap teks pengguna yang masuk ke HTML. */
    esc: (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ESCAPES[c]),

    uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8),

    clean: (value) => String(value == null ? "" : value).replace(/\s+/g, " ").trim(),

    capitalize: (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : ""),

    /** 75 -> "01:15" */
    timecode: (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    },

    formatDate: (timestamp) =>
      new Date(timestamp).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  };
})(typeof window !== "undefined" ? window : globalThis);
