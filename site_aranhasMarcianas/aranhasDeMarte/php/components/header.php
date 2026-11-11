<header class="topbar">
  <a class="brand" href="#inicio" aria-label="Início">
    <?php if (is_file(__DIR__ . '/../../assets/images/logo.png')): ?>
      <img src="assets/images/logo.png" alt="Aranhas de Marte">
    <?php else: ?>
      <span class="logo-fallback">Aranhas de Marte</span>
    <?php endif; ?>
  </a>
  <nav class="desktop-nav" aria-label="Principal">
    <?php foreach ($navItems as [$id, $label]): ?>
      <a href="#<?= app_escape($id) ?>" <?= $activeTab === $id ? 'aria-current="page"' : '' ?>><?= app_escape($label) ?></a>
    <?php endforeach; ?>
  </nav>
  <div class="auth">
    <?php if ($session !== null && $session['role'] === 'admin'): ?>
      <a class="btn dark sm" href="#admin">Admin</a>
      <button class="btn outline sm" data-logout>Sair</button>
    <?php elseif ($session !== null): ?>
      <span class="who"><?= app_escape($session['name']) ?></span>
      <button class="btn outline sm" data-logout>Sair</button>
    <?php else: ?>
      <a class="btn green sm" href="#login">Entrar</a>
    <?php endif; ?>
  </div>
</header>