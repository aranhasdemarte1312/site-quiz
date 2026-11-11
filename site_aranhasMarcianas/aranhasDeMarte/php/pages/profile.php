<?php
$stats = $state['stats'];
$total = $stats['ok'] + $stats['err'];
$percent = $total ? (int) round($stats['ok'] / $total * 100) : 0;
?>
<section class="view">
  <h1>Meu desempenho</h1>
  <?php if ($session === null): ?><p class="lead">Entre na sua conta para acompanhar sua jornada musical.</p><?php endif; ?>
  <div class="donut" style="--p:<?= $percent ?>" role="img" aria-label="<?= $percent ?>% de aproveitamento">
    <div><strong><?= $percent ?>%</strong><small>de aproveitamento</small></div>
  </div>
  <ul class="legend"><li class="ok">Acertos</li><li class="err">Erros</li></ul>
  <div class="stat"><i class="ico ok">✓</i><div><b><?= $stats['ok'] ?> acertos</b><small><?= $percent ?>% das questões</small></div></div>
  <div class="stat"><i class="ico err">✕</i><div><b><?= $stats['err'] ?> erros</b><small><?= $total ? 100 - $percent : 0 ?>% das questões</small></div></div>
  <p class="total">Total de questões <b><?= $total ?></b></p>
  <div class="actions">
    <?php if ($session === null): ?><a class="btn green" href="#login">Entrar</a><?php endif; ?>
    <button class="btn dark" data-reset>Zerar progresso</button>
  </div>
</section>