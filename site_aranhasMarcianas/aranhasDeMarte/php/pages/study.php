<?php
$selectedTheme = null;
foreach ($state['studies'] as $theme) {
    if ($theme['id'] === $state['selectedThemeId']) {
        $selectedTheme = $theme;
        break;
    }
}
$typeLabels = ['text' => 'Leitura', 'video' => 'Vídeo', 'image' => 'Imagem', 'review' => 'Revisão'];
?>
<section class="view">
  <p class="eyebrow">Estudar</p>
  <?php if ($selectedTheme === null): ?>
    <h1>Escolha um tema</h1>
    <?php if ($state['studies']): ?>
      <div class="topics">
        <?php foreach ($state['studies'] as $theme): ?>
          <?php $reviewCount = count(array_filter($theme['studies'], static fn($study) => $study['type'] === 'review')); ?>
          <button class="topic" data-open-theme="<?= $theme['id'] ?>">
            <div class="row"><?= app_escape($theme['name']) ?><em><?= count($theme['studies']) ?> estudos</em></div>
            <small><?= $reviewCount ?> <?= $reviewCount === 1 ? 'questão' : 'questões' ?> de revisão</small>
            <div class="bar"><i style="width:100%"></i></div>
          </button>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <p class="empty">Ainda não há temas publicados. O administrador pode adicionar estudos pelo painel.</p>
    <?php endif; ?>
  <?php else: ?>
    <button class="study-back" data-back-themes>← Todos os temas</button>
    <h1><?= app_escape($selectedTheme['name']) ?></h1>
    <?php if ($selectedTheme['studies']): ?>
      <div class="study-content-list">
        <?php foreach ($selectedTheme['studies'] as $study): ?>
          <article class="study-entry">
            <p class="study-type"><?= $typeLabels[$study['type']] ?></p>
            <h2><?= app_escape($study['title']) ?></h2>
            <?php if ($study['type'] === 'text'): ?>
              <div class="study-copy"><?= nl2br(app_escape($study['body'])) ?></div>
            <?php elseif ($study['type'] === 'video'): ?>
              <?php if ($study['source'] !== ''): ?>
                <video class="study-video" controls preload="metadata"><source src="<?= app_escape($study['source']) ?>">Seu navegador não consegue reproduzir este vídeo.</video>
              <?php else: ?>
                <p class="empty">O vídeo ainda não tem um arquivo associado.</p>
              <?php endif; ?>
            <?php elseif ($study['type'] === 'image'): ?>
              <?php if ($study['source'] !== ''): ?>
                <img class="study-image" src="<?= app_escape($study['source']) ?>" alt="<?= app_escape($study['alt']) ?>" loading="lazy">
              <?php else: ?>
                <p class="empty">A imagem ainda não tem um arquivo associado.</p>
              <?php endif; ?>
            <?php else: ?>
              <fieldset class="review-question">
                <legend><?= app_escape($study['question']) ?></legend>
                <?php foreach ($study['options'] as $key => $option): ?>
                  <label><input type="radio" name="review-<?= $study['id'] ?>" value="<?= $key ?>"><span><?= app_escape($option) ?></span></label>
                <?php endforeach; ?>
                <button class="btn green" type="button" data-check-review="<?= $study['id'] ?>" data-answer="<?= $study['answer'] ?>" data-explanation="<?= app_escape($study['explanation']) ?>">Conferir resposta</button>
                <p class="review-feedback" data-review-feedback="<?= $study['id'] ?>" role="status" hidden></p>
              </fieldset>
            <?php endif; ?>
          </article>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <p class="empty">Este tema ainda não tem estudos.</p>
    <?php endif; ?>
  <?php endif; ?>
</section>