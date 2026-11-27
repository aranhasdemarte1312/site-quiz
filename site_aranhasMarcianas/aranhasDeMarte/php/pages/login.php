<?php
/*
DECLARAÇÃO DE USO DE INTELIGÊNCIA ARTIFICIAL

Ferramenta: Claude, Copilot
Etapa: Desenvolvimento
Finalidade: Auxílio no coding em php e identificação de seções por comentários

Validação: Código analisado, corrigido e testado pelo aluno.
*/

?>

<section class="view login-view"><h1>Entrar</h1>
  <div class="tabs" role="tablist" aria-label="Tipo de acesso">
    <button type="button" class="tab is-active" role="tab" aria-selected="true" data-tab="user">Jogador</button>
    <button type="button" class="tab" role="tab" aria-selected="false" data-tab="admin">Administrador</button>
  </div>

  <!-- Jogador: entrar -->
  <form class="form" data-form="login-user" novalidate>
    <label class="field">E-mail<input type="email" name="email" autocomplete="username" required></label>
    <label class="field">Senha<input type="password" name="pass" autocomplete="current-password" required></label>
    <div class="form-error" role="alert" hidden></div>
    <div class="actions"><button class="btn green" type="submit">Entrar</button></div>
    <p class="switch">Ainda não tem conta? <button type="button" class="link" data-show="register">Criar conta</button></p>
  </form>

  <!-- Jogador: cadastro -->
  <form class="form" data-form="register" novalidate hidden>
    <label class="field">Nome<input type="text" name="name" autocomplete="name" maxlength="80" required></label>
    <label class="field">E-mail<input type="email" name="email" autocomplete="username" required></label>
    <label class="field">Senha (mínimo 8 caracteres)<input type="password" name="pass" autocomplete="new-password" minlength="8" required></label>
    <div class="form-error" role="alert" hidden></div>
    <div class="actions"><button class="btn green" type="submit">Criar conta</button></div>
    <p class="switch">Já tem conta? <button type="button" class="link" data-show="login-user">Entrar</button></p>
  </form>

  <!-- Administrador -->
  <form class="form" data-form="login-admin" novalidate hidden>
    <p class="hint" style="margin-top:0">Acesso restrito. Contas de administrador são criadas pela equipe no servidor.</p>
    <label class="field">E-mail do administrador<input type="email" name="email" autocomplete="username" required></label>
    <label class="field">Senha<input type="password" name="pass" autocomplete="current-password" required></label>
    <div class="form-error" role="alert" hidden></div>
    <div class="actions"><button class="btn dark" type="submit">Entrar como administrador</button></div>
  </form>
</section>
