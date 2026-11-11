<?php
$levels = [
    ['title' => 'Ouvinte curioso', 'points' => 0],
    ['title' => 'Ritmista', 'points' => 520],
    ['title' => 'Pop Star', 'points' => 1560],
    ['title' => 'Rock Star', 'points' => 3120],
    ['title' => 'Lenda da música', 'points' => 5200],
];
$points = $state['stats']['points'];
$currentIndex = 0;
foreach ($levels as $index => $level) {
    if ($points >= $level['points']) {
        $currentIndex = $index;
    }
}
$currentLevel = $levels[$currentIndex];
$nextLevel = $levels[$currentIndex + 1] ?? null;
$remaining = $nextLevel ? $nextLevel['points'] - $points : 0;
$progress = $nextLevel
    ? (int) round(($points - $currentLevel['points']) / ($nextLevel['points'] - $currentLevel['points']) * 100)
    : 100;
?>
<section class="view"><p class="eyebrow">Sua evolução</p><h1>Sua trilha sonora</h1>
  <div class="rank-current">
    <p class="rank-kicker">Seu título atual</p>
    <div class="rank-title"><span class="rank-note" aria-hidden="true">♪</span><strong><?= app_escape($currentLevel['title']) ?></strong></div>
    <p class="rank-score"><?= number_format($points, 0, ',', '.') ?> pontos acumulados</p>
    <?php if ($nextLevel): ?>
      <div class="rank-progress-heading"><span>Próximo nível: <?= app_escape($nextLevel['title']) ?></span><b>Faltam <?= number_format($remaining, 0, ',', '.') ?> pts</b></div>
      <div class="rank-track" role="progressbar" aria-label="Progresso até <?= app_escape($nextLevel['title']) ?>" aria-valuemin="0" aria-valuemax="100" aria-valuenow="<?= $progress ?>">
        <i style="width:<?= $progress ?>%"></i>
      </div>
      <p class="rank-progress-note">Cada acerto vale 260 pontos.</p>
    <?php else: ?>
      <p class="rank-progress-note">Você alcançou o nível máximo. Continue jogando para ampliar sua pontuação.</p>
    <?php endif; ?>
  </div>
  <h2 class="rank-heading">Faixas da sua jornada</h2>
  <ol class="rank">
    <?php foreach ($levels as $index => $level): ?>
      <?php $levelState = $index < $currentIndex ? 'is-earned' : ($index === $currentIndex ? 'is-current' : 'is-locked'); ?>
      <li class="<?= $levelState ?>" <?= $index === $currentIndex ? 'aria-current="step"' : '' ?>>
        <span class="pos"><?= $index < $currentIndex ? '✓' : $index + 1 ?></span>
        <span><?= app_escape($level['title']) ?><?= $index === $currentIndex ? ' · atual' : '' ?></span>
        <b><?= number_format($level['points'], 0, ',', '.') ?> pts</b>
      </li>
    <?php endforeach; ?>
  </ol>
  <div class="actions">
    <button class="btn dark" data-go="perfil">Ver desempenho</button>
    <button class="btn green" data-start>Jogar agora</button>
  </div>
</section>