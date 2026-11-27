<?php
require __DIR__ . '/../php/lib/bootstrap.php';

const POINTS_PER_HIT = 260;

// Desempenho acumulado do usuário logado (zerado para visitantes e administradores)
function user_stats(PDO $db, ?array $user): array
{
    $stats = ['ok' => 0, 'err' => 0, 'points' => 0];
    if ($user === null || ($user['role'] ?? '') !== 'user') {
        return $stats;
    }
    $st = $db->prepare('SELECT points, correct, errors FROM ranking WHERE user_id = ?');
    $st->execute([$user['id']]);
    if ($row = $st->fetch()) {
        $stats = [
            'ok'     => (int) $row['correct'],
            'err'    => (int) $row['errors'],
            'points' => (int) $row['points'],
        ];
    }
    return $stats;
}

try {
    $db = app_db();
    $method = $_SERVER['REQUEST_METHOD'];

    // Lista o ranking (nome vem de users, pontuação/acertos/erros vêm de ranking)
    // e devolve também o desempenho do usuário logado
    if ($method === 'GET') {
        $rows = $db->query(
            'SELECT u.name, r.points, r.correct, r.errors
               FROM ranking r JOIN users u ON u.id = r.user_id
              ORDER BY r.points DESC, r.correct DESC, r.errors ASC, u.name ASC
              LIMIT 20'
        )->fetchAll();
        app_json([
            'ranking' => $rows,
            'stats'   => user_stats($db, app_current_user()),
        ]);
    }

    // Soma o resultado de uma partida ao total do usuário logado
    if ($method === 'POST') {
        $user = app_require_user();
        if ($user['role'] !== 'user') {
            app_json(['recorded' => false, 'stats' => user_stats($db, $user)]); // administradores não entram no ranking
        }
        $in = app_body();
        $ok  = filter_var($in['ok']  ?? null, FILTER_VALIDATE_INT);
        $err = filter_var($in['err'] ?? null, FILTER_VALIDATE_INT);
        $total = (int) $db->query('SELECT COUNT(*) FROM questions')->fetchColumn();
        if ($ok === false || $err === false || $ok < 0 || $err < 0 || $ok + $err < 1 || $ok + $err > $total) {
            app_json(['error' => 'Resultado inválido.'], 422);
        }
        $db->prepare(
            'INSERT INTO ranking (user_id, points, correct, errors) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE points = points + VALUES(points),
                                     correct = correct + VALUES(correct),
                                     errors = errors + VALUES(errors)'
        )->execute([$user['id'], $ok * POINTS_PER_HIT, $ok, $err]);
        app_json(['recorded' => true, 'stats' => user_stats($db, $user)], 201);
    }

    // Zera o desempenho do usuário logado ("Zerar progresso")
    if ($method === 'DELETE') {
        $user = app_require_user();
        if ($user['role'] === 'user') {
            $db->prepare('DELETE FROM ranking WHERE user_id = ?')->execute([$user['id']]);
        }
        app_json(['stats' => user_stats($db, $user)]);
    }

    app_json(['error' => 'Método não permitido.'], 405);
} catch (Throwable $e) {
    error_log($e->getMessage());
    app_json(['error' => 'Erro no servidor. Verifique a conexão com o banco de dados.'], 500);
}