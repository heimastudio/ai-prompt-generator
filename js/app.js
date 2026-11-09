/* Router berbasis hash dan inisialisasi aplikasi. */
(function (root) {
  const Skena = root.Skena;
  const ROUTES = ["gambar", "veo", "storyboard", "karakter", "riwayat"];
  const DEFAULT_ROUTE = "gambar";
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");
  let pendingRestore = null;

  const currentRoute = () => {
    const hash = location.hash.slice(1);
    return ROUTES.includes(hash) ? hash : DEFAULT_ROUTE;
  };

  function count(route) {
    if (route === "karakter") return Skena.store.characters.all().length;
    if (route === "riwayat") return Skena.store.history.all().length;
    return null;
  }

  Skena.refreshNav = function () {
    const active = currentRoute();
    nav.innerHTML = ROUTES.map((route) => {
      const n = count(route);
      return `<a class="nav__link" href="#${route}"${route === active ? ' aria-current="page"' : ""}>
        <span>${Skena.views[route].label}</span>${n === null ? "" : `<span class="nav__count">${n}</span>`}</a>`;
    }).join("");
  };

  function render() {
    const restore = pendingRestore;
    pendingRestore = null;
    Skena.views[currentRoute()].render(view, restore);
    Skena.refreshNav();
    root.scrollTo(0, 0);
  }

  /** Buka halaman generator dengan isian dari riwayat. */
  Skena.openWith = function (route, input) {
    pendingRestore = input;
    if (currentRoute() === route) render();
    else location.hash = route;
  };

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
  }

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const dark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && root.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = dark ? "light" : "dark";
    applyTheme(next);
    Skena.store.theme.set(next);
  });

  root.addEventListener("hashchange", render);
  applyTheme(Skena.store.theme.get());
  render();
})(window);
