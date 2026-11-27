<?php
/*
DECLARAÇÃO DE USO DE INTELIGÊNCIA ARTIFICIAL

Ferramenta: Claude, Copilot
Etapa: Desenvolvimento
Finalidade: Auxílio no coding em php e identificação de seções por comentários

Validação: Código analisado, corrigido e testado pelo aluno.
*/

$state = $state ?? [];
$result = $state['last'];
?>
<section class="view">
  <p class="eyebrow">Fim</p><h1>Obrigado!</h1>
  <ul class="info">
    <li><span>Acertos</span><b><?= $result['ok'] ?></b></li>
    <li><span>Erros</span><b><?= $result['err'] ?></b></li>
    <li><span>Pontos</span><b>+<?= $result['ok'] * 260 ?></b></li>
  </ul>
  <div class="actions">
    <button class="btn green" data-start>Recomeçar</button>
    <button class="btn outline" data-go="ranking">Ver meu nível</button>
  </div>
</section>