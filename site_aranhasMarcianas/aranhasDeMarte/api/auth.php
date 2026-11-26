<?php
require __DIR__ . '/../php/lib/bootstrap.php';
app_session_start();

function public_user(?array $u): ?array
{
    return $u === null ? null : ['name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']];
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    if ($method === 'GET' && $action === 'me') {
        app_json(['user' => public_user(app_current_user()), 'csrf' => app_csrf_token()]);
    }
    if ($method !== 'POST') {
        app_json(['error' => 'Método não permitido.'], 405);
    }
    $in = app_body();

    if ($action === 'login') {
        $email = strtolower(trim((string) ($in['email'] ?? '')));
        $pass  = (string) ($in['pass'] ?? '');
        $as    = ($in['as'] ?? 'user') === 'admin' ? 'admin' : 'user';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $pass === '') {
            app_json(['error' => 'Informe e-mail e senha válidos.'], 422);
        }
        $stmt = app_db()->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        // Sempre executa um verify (hash falso se o e-mail não existe) para não revelar quais e-mails existem.
        $hash = $row['password_hash'] ?? password_hash('dummy', PASSWORD_DEFAULT);
        $ok = password_verify($pass, $hash) && $row;
        if (!$ok) {
            usleep(400000);
            app_json(['error' => 'E-mail ou senha incorretos.'], 401);
        }
        if ($as === 'admin' && $row['role'] !== 'admin') {
            app_json(['error' => 'Esta conta não é de administrador. Use a aba Jogador.'], 403);
        }
        if ($as === 'user' && $row['role'] === 'admin') {
            app_json(['error' => 'Esta é uma conta de administrador. Use a aba Administrador.'], 403);
        }
        if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
            app_db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
                ->execute([password_hash($pass, PASSWORD_DEFAULT), $row['id']]);
        }
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => (int) $row['id'], 'name' => $row['name'], 'email' => $row['email'], 'role' => $row['role']];
        unset($_SESSION['csrf']);
        app_json(['user' => public_user($_SESSION['user']), 'csrf' => app_csrf_token()]);
    }

    if ($action === 'register') {
        $name  = trim((string) ($in['name'] ?? ''));
        $email = strtolower(trim((string) ($in['email'] ?? '')));
        $pass  = (string) ($in['pass'] ?? '');
        if ($name === '' || mb_strlen($name) > 80) {
            app_json(['error' => 'Informe seu nome (até 80 caracteres).'], 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
            app_json(['error' => 'Digite um e-mail válido.'], 422);
        }
        if (strlen($pass) < 8) {
            app_json(['error' => 'A senha precisa ter pelo menos 8 caracteres.'], 422);
        }
        try {
            $stmt = app_db()->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')");
            $stmt->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT)]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                app_json(['error' => 'Este e-mail já está cadastrado.'], 409);
            }
            throw $e;
        }
        $id = (int) app_db()->lastInsertId();
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => $id, 'name' => $name, 'email' => $email, 'role' => 'user'];
        unset($_SESSION['csrf']);
        app_json(['user' => public_user($_SESSION['user']), 'csrf' => app_csrf_token()], 201);
    }

    if ($action === 'logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        app_json(['user' => null, 'csrf' => app_csrf_token()]);
    }

    app_json(['error' => 'Ação inválida.'], 400);
} catch (Throwable $e) {
    error_log($e->getMessage());
    app_json(['error' => 'Erro no servidor. Verifique a conexão com o banco de dados.'], 500);
}
