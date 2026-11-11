// Estado global, "banco" local (localStorage) e sessão. Troque por chamadas à API depois.
window.App = { components: {}, pages: {} };

App.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

(() => {
  const KEY = "quiz-v2";
  const DEFAULT_QUESTIONS = [
    { id: 1, q: "Qual instrumento tem teclas pretas e brancas?", o: ["Violino", "Piano", "Flauta", "Bateria"], a: 1 },
    { id: 2, q: "Qual gênero musical é conhecido pela improvisação e pelo uso frequente de saxofone?", o: ["Blues", "Jazz", "Sertanejo", "Reggae"], a: 1 },
    { id: 3, q: "Qual instrumento de percussão é presença marcante no samba?", o: ["Agogô", "Pandeiro", "Triângulo", "Atabaque"], a: 1 },
    { id: 4, q: "Qual gênero costuma destacar guitarra elétrica, baixo e bateria?", o: ["Samba", "Rock", "Bossa nova", "Forró"], a: 1 },
  ];
  const LEGACY_DEFAULT_QUESTIONS = [
    { id: 1, q: "Qual é a capital do Brasil?", o: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"], a: 1 },
    { id: 2, q: "Quanto é 7 × 8?", o: ["54", "56", "64", "48"], a: 1 },
    { id: 3, q: "Qual planeta é conhecido como planeta vermelho?", o: ["Vênus", "Júpiter", "Marte", "Mercúrio"], a: 2 },
    { id: 4, q: "Em que ano os portugueses chegaram ao Brasil?", o: ["1492", "1500", "1530", "1822"], a: 1 },
  ];
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
  // Login de demonstração (somente front-end, NÃO é seguro)
  const ADMIN = { email: "admin@quiz.com", pass: "admin123" };
  const PTS = 260;

  let data = { ok: 0, err: 0, points: 0, questions: DEFAULT_QUESTIONS, studies: DEFAULT_STUDIES, session: null };
  let migratedQuestions = false;
  let migratedStudies = false;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || {};
    Object.assign(data, saved);
    if (JSON.stringify(saved.questions) === JSON.stringify(LEGACY_DEFAULT_QUESTIONS)) {
      data.questions = DEFAULT_QUESTIONS;
      migratedQuestions = true;
    }
    if (!Array.isArray(saved.studies)) {
      data.studies = DEFAULT_STUDIES;
      migratedStudies = true;
    }
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  if (migratedQuestions || migratedStudies) save();

  App.store = {
    PTS,
    ADMIN_EMAIL: ADMIN.email, ADMIN_PASS: ADMIN.pass,
    get questions() { return data.questions; },
    get studies() { return data.studies; },
    get stats() { return { ok: data.ok, err: data.err, points: data.points }; },
    get session() { return data.session; },
    get isAdmin() { return data.session?.role === "admin"; },

    login(email, pass) {
      email = email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Digite um e-mail válido." };
      if (pass.length < 4) return { error: "A senha precisa ter pelo menos 4 caracteres." };
      if (email === ADMIN.email) {
        if (pass !== ADMIN.pass) return { error: "E-mail ou senha incorretos." };
        data.session = { name: "Admin", email, role: "admin" };
      } else {
        const n = email.split("@")[0];
        data.session = { name: n[0].toUpperCase() + n.slice(1), email, role: "user" };
      }
      save(); return { session: data.session };
    },
    logout() { data.session = null; save(); },

    addResult(ok, err) { data.ok += ok; data.err += err; data.points += ok * PTS; save(); },
    resetStats() { data.ok = data.err = data.points = 0; save(); },

    saveQuestion(q) {
      const i = data.questions.findIndex(x => x.id === q.id);
      if (i >= 0) data.questions[i] = q;
      else data.questions.push({ ...q, id: Date.now() });
      save();
    },
    deleteQuestion(id) { data.questions = data.questions.filter(q => q.id !== id); save(); },

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
