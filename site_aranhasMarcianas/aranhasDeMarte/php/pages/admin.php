<?php
$editing = $state['editing'];
$questions = $state['questions'];
$letters = ['A', 'B', 'C', 'D'];
$themes = $state['studies'];
$adminThemeId = $state['adminThemeId'];
$adminTheme = null;
foreach ($themes as $theme) {
  if ($theme['id'] === $adminThemeId) {
    $adminTheme = $theme;
    break;
  }
}
if ($adminTheme === null && $themes && !$state['adminNewTheme']) {
  $adminTheme = $themes[0];
}
$studyEditing = $state['adminStudyEditing'];
$studyTypes = ['text' => 'Texto', 'video' => 'Vídeo', 'image' => 'Imagem', 'review' => 'Revisão'];
?>
<section class="view"><p class="eyebrow">Administrador</p><h1>Perguntas</h1>
  <div class="admin-grid">
    <div class="panel"><h2><?= $editing ? 'Editar pergunta' : 'Nova pergunta' ?></h2>
      <form class="form question-form" novalidate>
        <label class="field">Enunciado<textarea name="q" rows="3" required><?= app_escape($editing['q'] ?? '') ?></textarea></label>
        <fieldset style="border:0;padding:0;display:grid;gap:10px"><legend class="field" style="margin-bottom:8px">Respostas (marque a correta)</legend>
          <?php foreach ($letters as $key => $letter): ?>
            <div class="ans">
              <input type="radio" name="a" value="<?= $key ?>" aria-label="Resposta <?= $letter ?> é a correta" <?= ($editing['a'] ?? 0) === $key ? 'checked' : '' ?>>
              <input class="field-input" style="background:var(--ink);border:2px solid transparent;border-radius:var(--r);padding:12px 14px;width:100%"
                name="o<?= $key ?>" placeholder="Resposta <?= $letter ?>" value="<?= app_escape($editing['o'][$key] ?? '') ?>" required>
            </div>
          <?php endforeach; ?>
        </fieldset>
        <div class="form-error" role="alert" hidden></div>
        <div class="actions" style="margin-top:0">
          <button class="btn green" type="submit"><?= $editing ? 'Salvar alterações' : 'Adicionar' ?></button>
          <?php if ($editing): ?><button class="btn dark" type="button" data-cancel>Cancelar</button><?php endif; ?>
        </div>
      </form>
    </div>
    <div class="panel"><h2><?= count($questions) ?> <?= count($questions) === 1 ? 'pergunta cadastrada' : 'perguntas cadastradas' ?></h2>
      <?php if ($questions): ?>
        <ul class="q-list">
          <?php foreach ($questions as $question): ?>
            <li class="q-item"><p><?= app_escape($question['q']) ?></p>
              <ul>
                <?php foreach ($question['o'] as $key => $option): ?>
                  <li class="<?= $key === $question['a'] ? 'right' : '' ?>"><?= $letters[$key] ?>. <?= app_escape($option) ?><?= $key === $question['a'] ? ' ✓' : '' ?></li>
                <?php endforeach; ?>
              </ul>
              <div class="row"><button class="btn dark sm" data-edit="<?= $question['id'] ?>">Editar</button>
                <button class="btn danger sm" data-del="<?= $question['id'] ?>">Excluir</button></div>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <p class="empty">Nenhuma pergunta ainda. Use o formulário para adicionar a primeira.</p>
      <?php endif; ?>
    </div>
  </div>
  <section class="study-admin">
    <p class="eyebrow">Biblioteca musical</p><h2>Temas e estudos</h2>
    <div class="study-manager">
      <div class="study-theme-panel">
        <?php if ($themes): ?>
          <label class="field">Tema selecionado
            <select class="field-input" data-theme-select>
              <?php foreach ($themes as $theme): ?>
                <option value="<?= $theme['id'] ?>" <?= $adminTheme && $adminTheme['id'] === $theme['id'] ? 'selected' : '' ?>><?= app_escape($theme['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
        <?php endif; ?>
        <form class="form theme-form" data-theme-form novalidate>
          <label class="field"><?= $adminTheme ? 'Nome do tema' : 'Nome do novo tema' ?>
            <input class="field-input" type="text" name="themeName" value="<?= app_escape($adminTheme['name'] ?? '') ?>" maxlength="80" required>
          </label>
          <div class="actions">
            <button class="btn green" type="submit"><?= $adminTheme ? 'Salvar tema' : 'Criar tema' ?></button>
            <?php if ($adminTheme): ?><button class="btn dark" type="button" data-delete-theme>Excluir tema</button><?php endif; ?>
            <button class="btn outline" type="button" data-new-theme>Novo tema</button>
          </div>
        </form>
      </div>
      <div class="study-items-panel">
        <?php if ($adminTheme): ?>
          <div class="study-items-heading"><h3>Estudos em <?= app_escape($adminTheme['name']) ?></h3>
            <button class="btn green sm" type="button" data-new-study>Novo estudo</button></div>
          <?php if ($adminTheme['studies']): ?>
            <ul class="study-admin-list">
              <?php foreach ($adminTheme['studies'] as $study): ?>
                <li><span><b><?= app_escape($study['title']) ?></b><small><?= $studyTypes[$study['type']] ?></small></span>
                  <div class="row"><button class="btn dark sm" type="button" data-edit-study="<?= $study['id'] ?>">Editar</button>
                    <button class="btn danger sm" type="button" data-delete-study="<?= $study['id'] ?>">Excluir</button></div>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php else: ?>
            <p class="empty">Este tema ainda não tem estudos.</p>
          <?php endif; ?>
        <?php else: ?>
          <p class="empty">Crie um tema para começar a adicionar estudos.</p>
        <?php endif; ?>
      </div>
    </div>
    <?php if ($adminTheme): ?>
      <form class="form study-form" data-study-form novalidate>
        <h3><?= $studyEditing ? 'Editar estudo' : 'Adicionar estudo ao tema' ?></h3>
        <div class="study-form-grid">
          <label class="field">Título
            <input class="field-input" type="text" name="studyTitle" value="<?= app_escape($studyEditing['title'] ?? '') ?>" maxlength="120" required>
          </label>
          <label class="field">Formato
            <select class="field-input" name="studyType" data-study-type>
              <?php foreach ($studyTypes as $type => $label): ?>
                <option value="<?= $type ?>" <?= ($studyEditing['type'] ?? 'text') === $type ? 'selected' : '' ?>><?= $label ?></option>
              <?php endforeach; ?>
            </select>
          </label>
        </div>
        <label class="field study-payload" data-study-fields="text" <?= ($studyEditing['type'] ?? 'text') !== 'text' ? 'hidden' : '' ?>>Conteúdo do texto
          <textarea class="field-input" name="studyBody" rows="5"><?= app_escape($studyEditing['body'] ?? '') ?></textarea>
        </label>
        <div class="study-payload" data-study-fields="video image" <?= !in_array($studyEditing['type'] ?? '', ['video', 'image'], true) ? 'hidden' : '' ?>>
          <label class="field">URL ou caminho do arquivo
            <input class="field-input" type="text" name="studySource" value="<?= app_escape($studyEditing['source'] ?? '') ?>" placeholder="assets/images/exemplo.jpg">
          </label>
          <label class="field study-payload" data-study-fields="image" <?= ($studyEditing['type'] ?? '') !== 'image' ? 'hidden' : '' ?>>Texto alternativo da imagem
            <input class="field-input" type="text" name="studyAlt" value="<?= app_escape($studyEditing['alt'] ?? '') ?>" maxlength="180">
          </label>
        </div>
        <div class="study-payload" data-study-fields="review" <?= ($studyEditing['type'] ?? '') !== 'review' ? 'hidden' : '' ?>>
          <label class="field">Questão da revisão
            <textarea class="field-input" name="reviewQuestion" rows="2"><?= app_escape($studyEditing['question'] ?? '') ?></textarea>
          </label>
          <fieldset class="review-editor"><legend>Alternativas (marque a correta)</legend>
            <?php for ($key = 0; $key < 4; $key++): ?>
              <label class="review-editor-option"><input type="radio" name="reviewAnswer" value="<?= $key ?>" <?= ($studyEditing['answer'] ?? 0) === $key ? 'checked' : '' ?>>
                <input class="field-input" type="text" name="reviewOption<?= $key ?>" value="<?= app_escape($studyEditing['options'][$key] ?? '') ?>" placeholder="Alternativa <?= $letters[$key] ?>"></label>
            <?php endfor; ?>
          </fieldset>
          <label class="field">Explicação da resposta
            <textarea class="field-input" name="reviewExplanation" rows="2"><?= app_escape($studyEditing['explanation'] ?? '') ?></textarea>
          </label>
        </div>
        <div class="form-error" data-study-error role="alert" hidden></div>
        <div class="actions"><button class="btn green" type="submit"><?= $studyEditing ? 'Salvar alterações' : 'Adicionar estudo' ?></button>
          <?php if ($studyEditing): ?><button class="btn dark" type="button" data-cancel-study>Cancelar</button><?php endif; ?>
        </div>
      </form>
    <?php endif; ?>
  </section>
</section>