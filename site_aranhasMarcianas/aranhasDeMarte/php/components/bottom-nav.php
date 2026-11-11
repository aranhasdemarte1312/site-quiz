<nav class="bottom-nav" aria-label="Principal">
  <?php foreach ($navItems as [$id, $label]): ?>
    <a href="#<?= app_escape($id) ?>" <?= $activeTab === $id ? 'aria-current="page"' : '' ?>>
      <svg viewBox="0 0 24 24" aria-hidden="true"><?= $icons[$id] ?></svg><?= app_escape($label) ?>
    </a>
  <?php endforeach; ?>
</nav>