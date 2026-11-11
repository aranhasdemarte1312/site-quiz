<?php
$componentData = require __DIR__ . '/php/components/icons.php';
$navItems = $componentData['nav'];
$icons = $componentData['icons'];
$route = 'inicio';
$activeTab = $route;
$session = null;

function app_escape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Aranhas de Marte</title>
<link rel="icon" type="image/png" href="assets/images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap" rel="stylesheet">
<!-- base -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/buttons.css">
<link rel="stylesheet" href="css/forms.css">
<!-- componentes -->
<link rel="stylesheet" href="css/header.css">
<link rel="stylesheet" href="css/footer.css">
<link rel="stylesheet" href="css/bottom-nav.css">
<!-- páginas -->
<link rel="stylesheet" href="css/quiz.css">
<link rel="stylesheet" href="css/ranking.css">
<link rel="stylesheet" href="css/study.css">
<link rel="stylesheet" href="css/profile.css">
<link rel="stylesheet" href="css/login.css">
<link rel="stylesheet" href="css/admin.css">
</head>
<body>
<div id="header"><?php require __DIR__ . '/php/components/header.php'; ?></div>
<main id="app" tabindex="-1"></main>
<div id="footer"><?php require __DIR__ . '/php/components/footer.php'; ?></div>
<div id="bottom-nav"><?php require __DIR__ . '/php/components/bottom-nav.php'; ?></div>

<!-- núcleo -->
<script src="js/store.js"></script>
<!-- interações -->
<script src="js/interactions.js"></script>
<!-- app -->
<script src="js/router.js"></script>
<script src="js/main.js"></script>
</body>
</html>