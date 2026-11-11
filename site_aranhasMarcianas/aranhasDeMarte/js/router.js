// Roteador simples por hash (#inicio, #quiz, #admin...)
(() => {
  const $ = s => document.querySelector(s);
  const PROTECTED = { admin: () => App.store.isAdmin };
  const ROUTES = ["inicio", "quiz", "fim", "perfil", "estudos", "ranking", "login", "admin"];
  let route = "inicio";
  let renderToken = 0;

  App.go = id => (location.hash === "#" + id ? App.refresh() : (location.hash = id));
  App.refresh = () => draw(route);

  async function draw(id) {
    if (!ROUTES.includes(id)) id = "inicio";
    if (PROTECTED[id] && !PROTECTED[id]()) { location.replace("#login"); return; }
    const token = ++renderToken;
    route = id;
    const app = $("#app");
    try {
      const response = await fetch("components.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: id,
          session: App.store.session,
          state: {
            stats: App.store.stats,
            questions: App.store.questions,
            studies: App.store.studies,
            last: App.last,
            quiz: App.pageState.quiz,
            editing: App.pageState.adminEditing,
            selectedThemeId: App.pageState.selectedThemeId,
            adminThemeId: App.pageState.adminThemeId,
            adminNewTheme: App.pageState.adminNewTheme,
            adminStudyEditing: App.pageState.adminStudyEditing,
          },
        }),
      });
      if (!response.ok) throw new Error(`Component request failed: ${response.status}`);
      const rendered = await response.json();
      if (token !== renderToken) return;
      app.innerHTML = rendered.page;
      app.classList.toggle("wide", !!rendered.wide);
      $("#header").innerHTML = rendered.header;
      $("#footer").innerHTML = rendered.footer;
      $("#bottom-nav").innerHTML = rendered.bottomNav;
      App.pages[id]?.mount?.(app);
    } catch (error) {
      console.error("Could not load PHP views.", error);
    }
    window.scrollTo(0, 0);
  }

  App.start = () => {
    window.addEventListener("hashchange", () => draw(location.hash.slice(1)));
    draw(location.hash.slice(1) || "inicio");
  };
})();
