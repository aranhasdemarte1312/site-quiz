// Eventos globais (delegação) e início do app
document.addEventListener("click", e => {
  const go = e.target.closest("[data-go]");
  if (go) App.go(go.dataset.go);
  if (e.target.closest("[data-start]")) App.pages.quiz.start();
  if (e.target.closest("[data-logout]")) { App.store.logout(); App.go("inicio"); }
});
App.start();
