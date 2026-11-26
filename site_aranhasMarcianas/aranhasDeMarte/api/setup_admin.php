<?php
// Cria (ou redefine) a conta de administrador. Rode UMA vez e depois APAGUE este arquivo.
//   Terminal: php setup_admin.php admin@quiz.com "SuaSenhaForte"
//   Navegador (só localhost): setup_admin.php?email=admin@quiz.com&pass=SuaSenhaForte
require __DIR__ . '/php/lib/bootstrap.php';

$isCli = PHP_SAPI === 'cli';
if (!$isCli && !in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
    http_response_code(403);
    exit('Rode este script apenas em localhost.');
}
$email = strtolower(trim($isCli ? ($argv[1] ?? '') : ($_GET['email'] ?? '')));
$pass  = $isCli ? ($argv[2] ?? '') : ($_GET['pass'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
    exit("Informe um e-mail válido e uma senha de pelo menos 8 caracteres.\n");
}
$hash = password_hash($pass, PASSWORD_DEFAULT);
$stmt = app_db()->prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES ('Admin', ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin'"
);
$stmt->execute([$email, $hash]);
echo "Administrador {$email} pronto. Apague o arquivo setup_admin.php.\n";
