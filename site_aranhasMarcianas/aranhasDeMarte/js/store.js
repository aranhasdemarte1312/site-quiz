// Estado do app. Contas e perguntas vêm do servidor (MySQL via api/*.php).
// Apenas desempenho (acertos/erros/pontos) e estudos continuam no localStorage.
window.App = { components: {}, pages: {} };

App.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

(() => {
  const KEY = "quiz-v3";
  const PTS = 260;
  const DEFAULT_STUDIES = [
    {
      id: 101,
      name: "Gêneros brasileiros",
      studies: [
        { id: 1001, type: "text", title: "Samba: ritmo e comunidade", body: "Nascido de encontros de matrizes africanas e brasileiras, o samba reúne canto, dança e percussão. Pandeiro, surdo e tamborim ajudam a criar camadas rítmicas que conversam entre si." },
        { id: 1002, type: "review", title: "Revisão: samba", question: "Qual instrumento costuma marcar a pulsação grave de uma bateria de escola de samba?", options: ["Surdo", "Flauta", "Violino", "Guitarra"], answer: 0, explanation: "O surdo sustenta a pulsação grave e ajuda a conduzir a bateria." },
      ],
    },
    {
      id: 102,
      name: "Rock e suas vertentes",
      studies: [
        { id: 2001, type: "text", title: "A linguagem do rock", body: "Guitarra elétrica, baixo e bateria formam uma combinação muito associada ao rock. O gênero abriga muitas vertentes, de arranjos diretos e dançantes a experimentações psicodélicas e progressivas." },
        { id: 2002, type: "review", title: "Revisão: rock", question: "Qual instrumento costuma conduzir riffs e solos no rock?", options: ["Guitarra elétrica", "Harpa", "Clarinete", "Berimbau"], answer: 0, explanation: "A guitarra elétrica é conhecida pelos riffs e solos, embora o rock tenha muitas formações diferentes." },
      ],
    },
    {
      id: 103,
      name: "Instrumentos musicais",
      studies: [
        { id: 3001, type: "text", title: "Famílias de instrumentos", body: "Instrumentos podem produzir som por cordas vibrantes, colunas de ar ou superfícies percutidas. Escutar o timbre e observar como o som é produzido ajuda a reconhecer cada família." },
        { id: 3002, type: "review", title: "Revisão: instrumentos", question: "Qual destes instrumentos pertence à família das madeiras?", options: ["Flauta", "Trompete", "Tímpano", "Violoncelo"], answer: 0, explanation: "A flauta é classificada como instrumento de sopro da família das madeiras." },
      ],
    },
  ];

  let data = { ok: 0, err: 0, points: 0, studies: DEFAULT_STUDIES };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem("quiz-v2")) || {};
    for (const k of ["ok", "err", "points"]) if (Number.isFinite(saved[k])) data[k] = saved[k];
    if (Array.isArray(saved.studies)) data.studies = saved.studies;
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  save();

  // Estado vindo do servidor (nunca persistido no navegador)
  let session = null;
  let csrf = "";
  let questions = [];

  async function api(url, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (csrf) headers["X-CSRF-Token"] = csrf;
    let res;
    try {
      res = await fetch(url, { method, headers, credentials: "same-origin", body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (e) {
      throw new Error("Não foi possível conectar ao servidor.");
    }
    let json = {};
    try { json = await res.json(); } catch (e) {}
    if (!res.ok) {
      const err = new Error(json.error || "Erro ao falar com o servidor.");
      err.status = res.status;
      throw err;
    }
    return json;
  }
  const applyAuth = r => { session = r.user || null; if (r.csrf) csrf = r.csrf; };

  App.store = {
    PTS,
    get questions() { return questions; },
    get studies() { return data.studies; },
    get stats() { return { ok: data.ok, err: data.err, points: data.points }; },
    get session() { return session; },
    get isAdmin() { return session?.role === "admin"; },

    // Carrega sessão e perguntas do servidor
    async init() {
      try { applyAuth(await api("api/auth.php?action=me")); } catch (e) { console.error(e); }
      await this.loadQuestions();
    },
    async loadQuestions() {
      try { questions = (await api("api/questions.php")).questions; }
      catch (e) { console.error(e); questions = []; }
      return questions;
    },

    // Autenticação — retorna { session } ou { error }
    async login(email, pass, as = "user") {
      email = email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Digite um e-mail válido." };
      if (!pass) return { error: "Digite sua senha." };
      try { applyAuth(await api("api/auth.php?action=login", { method: "POST", body: { email, pass, as } })); return { session }; }
      catch (e) { return { error: e.message }; }
    },
    async register(name, email, pass) {
      name = name.trim(); email = email.trim().toLowerCase();
      if (!name) return { error: "Informe seu nome." };
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Digite um e-mail válido." };
      if (pass.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
      try { applyAuth(await api("api/auth.php?action=register", { method: "POST", body: { name, email, pass } })); return { session }; }
      catch (e) { return { error: e.message }; }
    },
    async logout() {
      try { applyAuth(await api("api/auth.php?action=logout", { method: "POST", body: {} })); }
      catch (e) { session = null; }
    },

    addResult(ok, err) {
      data.ok += ok; data.err += err; data.points += ok * PTS; save();
      // Jogadores logados também somam no ranking do banco (falha de rede não trava o quiz)
      if (session?.role === "user") {
        api("api/ranking.php", { method: "POST", body: { ok, err } }).catch(e => console.error(e));
      }
    },
    resetStats() { data.ok = data.err = data.points = 0; save(); },

    // CRUD de perguntas (admin) — lançam Error com a mensagem do servidor
    async saveQuestion(q) {
      const body = { q: q.q, o: q.o, a: q.a };
      if (q.id) await api("api/questions.php?id=" + encodeURIComponent(q.id), { method: "PUT", body });
      else await api("api/questions.php", { method: "POST", body });
      await this.loadQuestions();
    },
    async deleteQuestion(id) {
      await api("api/questions.php?id=" + encodeURIComponent(id), { method: "DELETE" });
      await this.loadQuestions();
    },

    saveTheme(theme) {
      const current = data.studies.find(item => item.id === theme.id);
      if (current) current.name = theme.name;
      else {
        const created = { id: Date.now(), name: theme.name, studies: [] };
        data.studies.push(created);
        save();
        return created;
      }
      save();
      return current;
    },
    deleteTheme(id) {
      data.studies = data.studies.filter(theme => theme.id !== id);
      save();
    },
    saveStudy(themeId, study) {
      const theme = data.studies.find(item => item.id === themeId);
      if (!theme) return null;
      const current = theme.studies.find(item => item.id === study.id);
      if (current) Object.assign(current, study);
      else {
        study.id = Date.now();
        theme.studies.push(study);
      }
      save();
      return current || study;
    },
    deleteStudy(themeId, studyId) {
      const theme = data.studies.find(item => item.id === themeId);
      if (!theme) return;
      theme.studies = theme.studies.filter(study => study.id !== studyId);
      save();
    },
  };
})();
