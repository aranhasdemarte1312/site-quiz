<?php
$stats = $state['stats'];
$total = $stats['ok'] + $stats['err'];
$name = $session['name'] ?? 'Visitante';
?>
<section class="view">
  <p class="eyebrow">Boas-vindas</p>
  <h1>Oi, <?= app_escape($name) ?></h1>
  <p class="lead">Explore gêneros, reconheça instrumentos e conquiste seu lugar na trilha sonora.</p>
  <ul class="info">
    <li><span>Questionário</span><b><?= count($state['questions']) ?> perguntas</b></li>
    <li><span>Desempenho</span><b><?= $total ? app_escape($stats['err'] . ' erros, ' . $stats['ok'] . ' acertos') : 'Sem respostas ainda' ?></b></li>
    <li><span>Sua jornada</span><b><?= number_format($stats['points'], 0, ',', '.') ?> pontos</b></li>
  </ul>
  <div class="actions"><button class="btn green" data-start>Começar</button></div>
</section>