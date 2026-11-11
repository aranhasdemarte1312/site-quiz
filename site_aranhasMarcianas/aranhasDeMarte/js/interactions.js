App.pageState = {
  quiz: { questions: [], index: 0, picks: [] },
  adminEditing: null,
  selectedThemeId: null,
  adminThemeId: null,
  adminNewTheme: false,
  adminStudyEditing: null,
};

App.pages.quiz = {
  start() {
    App.pageState.quiz = { questions: [...App.store.questions], index: 0, picks: [] };
    App.go("quiz");
  },
  mount(root) {
    const quiz = App.pageState.quiz;
    root.querySelectorAll(".opt").forEach(button => {
      button.onclick = () => {
        quiz.picks[quiz.index] = Number(button.dataset.k);
        App.refresh();
      };
    });
    root.querySelector("[data-back]")?.addEventListener("click", () => {
      quiz.index--;
      App.refresh();
    });
    root.querySelector("[data-next]")?.addEventListener("click", () => {
      if (quiz.index < quiz.questions.length - 1) {
        quiz.index++;
        App.refresh();
        return;
      }
      const correct = quiz.picks.filter((pick, index) => pick === quiz.questions[index].a).length;
      App.last = { ok: correct, err: quiz.questions.length - correct };
      App.store.addResult(correct, App.last.err);
      App.go("fim");
    });
  },
};

App.pages.perfil = {
  mount(root) {
    root.querySelector("[data-reset]")?.addEventListener("click", () => {
      if (confirm("Zerar acertos, erros e pontos?")) {
        App.store.resetStats();
        App.refresh();
      }
    });
  },
};

App.pages.estudos = {
  mount(root) {
    root.querySelectorAll("[data-open-theme]").forEach(button => {
      button.onclick = () => {
        App.pageState.selectedThemeId = Number(button.dataset.openTheme);
        App.refresh();
      };
    });
    root.querySelector("[data-back-themes]")?.addEventListener("click", () => {
      App.pageState.selectedThemeId = null;
      App.refresh();
    });
    root.querySelectorAll("[data-check-review]").forEach(button => {
      button.onclick = () => {
        const id = button.dataset.checkReview;
        const selected = root.querySelector(`input[name="review-${id}"]:checked`);
        const feedback = root.querySelector(`[data-review-feedback="${id}"]`);
        if (!selected) {
          feedback.textContent = "Escolha uma alternativa para conferir.";
          feedback.classList.remove("is-correct");
          feedback.classList.add("is-incorrect");
          feedback.hidden = false;
          return;
        }
        const correct = Number(selected.value) === Number(button.dataset.answer);
        feedback.textContent = correct
          ? `Resposta correta! ${button.dataset.explanation}`
          : `Ainda não. Reveja o tema e tente novamente. ${button.dataset.explanation}`;
        feedback.classList.toggle("is-correct", correct);
        feedback.classList.toggle("is-incorrect", !correct);
        feedback.hidden = false;
      };
    });
  },
};

App.pages.login = {
  mount(root) {
    const form = root.querySelector(".question-form");
    const error = form.querySelector(".form-error");
    form.onsubmit = event => {
      event.preventDefault();
      const result = App.store.login(form.email.value, form.pass.value);
      if (result.error) {
        error.textContent = result.error;
        error.hidden = false;
        return;
      }
      App.go(result.session.role === "admin" ? "admin" : "inicio");
    };
  },
};

App.pages.admin = {
  mount(root) {
    const form = root.querySelector("form");
    const error = root.querySelector(".form-error");
    const editing = App.pageState.adminEditing;
    form.onsubmit = event => {
      event.preventDefault();
      const question = form.q.value.trim();
      const options = [0, 1, 2, 3].map(index => form[`o${index}`].value.trim());
      if (!question || options.some(option => !option)) {
        error.textContent = "Preencha o enunciado e as 4 respostas.";
        error.hidden = false;
        return;
      }
      App.store.saveQuestion({ id: editing?.id, q: question, o: options, a: Number(form.a.value) });
      App.pageState.adminEditing = null;
      App.refresh();
    };
    root.querySelector("[data-cancel]")?.addEventListener("click", () => {
      App.pageState.adminEditing = null;
      App.refresh();
    });
    root.querySelectorAll("[data-edit]").forEach(button => {
      button.onclick = () => {
        App.pageState.adminEditing = App.store.questions.find(question => question.id === Number(button.dataset.edit)) || null;
        App.refresh();
        window.scrollTo(0, 0);
      };
    });
    root.querySelectorAll("[data-del]").forEach(button => {
      button.onclick = () => {
        const id = Number(button.dataset.del);
        if (!confirm("Excluir esta pergunta?")) return;
        App.store.deleteQuestion(id);
        if (App.pageState.adminEditing?.id === id) App.pageState.adminEditing = null;
        App.refresh();
      };
    });

    const themeSelect = root.querySelector("[data-theme-select]");
    if (themeSelect && App.pageState.adminThemeId === null) {
      App.pageState.adminThemeId = Number(themeSelect.value);
    }
    themeSelect?.addEventListener("change", () => {
      App.pageState.adminThemeId = Number(themeSelect.value);
      App.pageState.adminNewTheme = false;
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });

    const themeForm = root.querySelector("[data-theme-form]");
    themeForm?.addEventListener("submit", event => {
      event.preventDefault();
      const name = themeForm.themeName.value.trim();
      if (!name) return;
      const theme = App.store.saveTheme({ id: App.pageState.adminThemeId, name });
      App.pageState.adminThemeId = theme.id;
      App.pageState.adminNewTheme = false;
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });
    root.querySelector("[data-new-theme]")?.addEventListener("click", () => {
      App.pageState.adminThemeId = null;
      App.pageState.adminNewTheme = true;
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });
    root.querySelector("[data-delete-theme]")?.addEventListener("click", () => {
      if (!confirm("Excluir este tema e todos os estudos dele?")) return;
      App.store.deleteTheme(App.pageState.adminThemeId);
      App.pageState.adminThemeId = App.store.studies[0]?.id ?? null;
      App.pageState.adminNewTheme = false;
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });

    const studyForm = root.querySelector("[data-study-form]");
    const typeSelect = studyForm?.querySelector("[data-study-type]");
    const updateStudyFields = () => {
      const type = typeSelect.value;
      studyForm.querySelectorAll("[data-study-fields]").forEach(fields => {
        fields.hidden = !fields.dataset.studyFields.split(" ").includes(type);
      });
    };
    typeSelect?.addEventListener("change", updateStudyFields);
    if (typeSelect) updateStudyFields();

    root.querySelector("[data-new-study]")?.addEventListener("click", () => {
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });
    root.querySelectorAll("[data-edit-study]").forEach(button => {
      button.onclick = () => {
        const theme = App.store.studies.find(item => item.id === App.pageState.adminThemeId);
        App.pageState.adminStudyEditing = theme?.studies.find(item => item.id === Number(button.dataset.editStudy)) || null;
        App.refresh();
      };
    });
    root.querySelectorAll("[data-delete-study]").forEach(button => {
      button.onclick = () => {
        if (!confirm("Excluir este estudo?")) return;
        App.store.deleteStudy(App.pageState.adminThemeId, Number(button.dataset.deleteStudy));
        App.pageState.adminStudyEditing = null;
        App.refresh();
      };
    });
    studyForm?.addEventListener("submit", event => {
      event.preventDefault();
      const type = typeSelect.value;
      const study = {
        id: App.pageState.adminStudyEditing?.id,
        type,
        title: studyForm.studyTitle.value.trim(),
      };
      const studyError = studyForm.querySelector("[data-study-error]");
      let message = "";
      if (!study.title) message = "Informe um título para o estudo.";
      else if (type === "text") {
        study.body = studyForm.studyBody.value.trim();
        if (!study.body) message = "Escreva o conteúdo do estudo.";
      } else if (type === "video" || type === "image") {
        study.source = studyForm.studySource.value.trim();
        study.alt = type === "image" ? studyForm.studyAlt.value.trim() : "";
        if (!study.source) message = "Informe o caminho ou URL do arquivo.";
        else if (/^(?:javascript|data):/i.test(study.source) || study.source.startsWith("//")) message = "Use um caminho local ou uma URL HTTP/HTTPS.";
        else if (type === "image" && !study.alt) message = "Descreva a imagem no texto alternativo.";
      } else {
        study.question = studyForm.reviewQuestion.value.trim();
        study.options = [0, 1, 2, 3].map(index => studyForm[`reviewOption${index}`].value.trim());
        const answer = studyForm.querySelector('input[name="reviewAnswer"]:checked');
        study.answer = answer ? Number(answer.value) : -1;
        study.explanation = studyForm.reviewExplanation.value.trim();
        if (!study.question || study.options.some(option => !option) || study.answer < 0) message = "Preencha a questão, as quatro alternativas e marque a correta.";
      }
      if (message) {
        studyError.textContent = message;
        studyError.hidden = false;
        return;
      }
      App.store.saveStudy(App.pageState.adminThemeId, study);
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });
    root.querySelector("[data-cancel-study]")?.addEventListener("click", () => {
      App.pageState.adminStudyEditing = null;
      App.refresh();
    });
  },
};