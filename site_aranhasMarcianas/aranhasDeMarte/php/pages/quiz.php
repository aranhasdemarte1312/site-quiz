<?php
$quiz = $state['quiz'];
$questions = $quiz['questions'];
$index = $quiz['index'];
if (!$questions): ?>
  <section class="view"><h1>Questionário</h1>
    <p class="empty">Ainda não há perguntas. Peça ao administrador para cadastrar algumas.</p>
    <div class="actions"><a class="btn dark" href="#inicio">Voltar</a></div>
  </section>
<?php else:
    $question = $questions[$index];
    $selected = $quiz['picks'][$index] ?? null;
    $last = $index === count($questions) - 1;
?>
  <section class="view">
    <p class="eyebrow"><?= $index + 1 ?> de <?= count($questions) ?></p>
    <h1><?= app_escape($question['q']) ?></h1>
    <div class="options" role="radiogroup">
      <?php foreach ($question['o'] as $key => $option): ?>
        <?php $isSelected = $selected !== null && $selected !== false && $selected === $key; ?>
        <button class="opt <?= $isSelected ? 'sel' : '' ?>" role="radio" aria-checked="<?= $isSelected ? 'true' : 'false' ?>" data-k="<?= $key ?>"><?= app_escape($option) ?></button>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <?php if ($index): ?><button class="btn dark" data-back>Voltar</button><?php endif; ?>
      <button class="btn green" data-next <?= $selected === null || $selected === false ? 'disabled' : '' ?>><?= $last ? 'Terminar' : 'Próxima' ?></button>
    </div>
  </section>
<?php endif; ?>