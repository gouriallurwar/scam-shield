(() => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const current = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["index.html","Home"],["scan.html","Scan"],["learn.html","Learn"],
    ["quiz.html","Quiz"],["dashboard.html","Dashboard"],["about.html","About"]
  ];
  if (header) {
    header.className = "site-nav";
    header.innerHTML = `
      <a class="brand" href="index.html"><span class="brand-mark">⌑</span>Scam<span>Shield</span></a>
      <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
      <nav class="nav-links" id="navLinks" aria-label="Main navigation">
        ${links.map(([href,label]) => `<a href="${href}" class="${current===href?'active':''}">${label}</a>`).join("")}
      </nav>`;
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `<span>© ${new Date().getFullYear()} ScamShield · Educational project</span><span>Detect before you trust. <a href="about.html">About this demo</a></span>`;
  }
  window.ScamShield = {
    read(key, fallback) {
      try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
      catch { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch { console.warn("LocalStorage is unavailable or full."); }
    },
    saveScan(type, label, findings) {
      const history = this.read("ss_scans", []);
      history.unshift({type, label, findings, date:new Date().toISOString()});
      this.write("ss_scans", history.slice(0,20));
    }
  };
})();