// Eventos globais (delegação) e início do app
document.addEventListener("click", async e => {
  const go = e.target.closest("[data-go]");
  if (go) App.go(go.dataset.go);
  if (e.target.closest("[data-start]")) App.pages.quiz.start();
  if (e.target.closest("[data-logout]")) { await App.store.logout(); App.go("inicio"); }
});
// Carrega sessão e perguntas do servidor antes de desenhar a primeira tela
App.store.init().finally(() => App.start());
