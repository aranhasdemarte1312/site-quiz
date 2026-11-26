<?php
require __DIR__ . '/../php/lib/bootstrap.php';

function row_to_question(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'q'  => $r['statement'],
        'o'  => [$r['option_a'], $r['option_b'], $r['option_c'], $r['option_d']],
        'a'  => (int) $r['correct_option'],
    ];
}

/** Valida o corpo e devolve [statement, a, b, c, d, correct]. */
function parse_question(array $in): array
{
    $q = trim((string) ($in['q'] ?? ''));
    $o = isset($in['o']) && is_array($in['o']) ? array_values($in['o']) : [];
    $a = filter_var($in['a'] ?? null, FILTER_VALIDATE_INT);
    if ($q === '' || mb_strlen($q) > 500) {
        app_json(['error' => 'O enunciado é obrigatório (até 500 caracteres).'], 422);
    }
    if (count($o) !== 4) {
        app_json(['error' => 'Informe as 4 respostas.'], 422);
    }
    foreach ($o as $i => $opt) {
        $opt = is_string($opt) ? trim($opt) : '';
        if ($opt === '' || mb_strlen($opt) > 255) {
            app_json(['error' => 'Cada resposta é obrigatória (até 255 caracteres).'], 422);
        }
        $o[$i] = $opt;
    }
    if ($a === false || $a < 0 || $a > 3) {
        app_json(['error' => 'Marque a resposta correta.'], 422);
    }
    return [$q, $o[0], $o[1], $o[2], $o[3], $a];
}

try {
    $db = app_db();
    $method = $_SERVER['REQUEST_METHOD'];

    // READ — público (o quiz precisa das perguntas)
    if ($method === 'GET') {
        $rows = $db->query('SELECT * FROM questions ORDER BY id')->fetchAll();
        app_json(['questions' => array_map('row_to_question', $rows)]);
    }

    // CREATE / UPDATE / DELETE — somente administrador
    $admin = app_require_admin();

    if ($method === 'POST') {
        [$q, $a, $b, $c, $d, $k] = parse_question(app_body());
        $db->prepare('INSERT INTO questions (statement, option_a, option_b, option_c, option_d, correct_option, created_by) VALUES (?,?,?,?,?,?,?)')
           ->execute([$q, $a, $b, $c, $d, $k, $admin['id']]);
        $id = (int) $db->lastInsertId();
        app_json(['question' => ['id' => $id, 'q' => $q, 'o' => [$a, $b, $c, $d], 'a' => $k]], 201);
    }

    if ($method === 'PUT') {
        $in = app_body();
        $id = filter_var($_GET['id'] ?? $in['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id === null) {
            app_json(['error' => 'ID inválido.'], 400);
        }
        [$q, $a, $b, $c, $d, $k] = parse_question($in);
        $stmt = $db->prepare('UPDATE questions SET statement=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=? WHERE id=?');
        $stmt->execute([$q, $a, $b, $c, $d, $k, $id]);
        $exists = $db->prepare('SELECT COUNT(*) FROM questions WHERE id = ?');
        $exists->execute([$id]);
        if (!(int) $exists->fetchColumn()) {
            app_json(['error' => 'Pergunta não encontrada.'], 404);
        }
        app_json(['question' => ['id' => $id, 'q' => $q, 'o' => [$a, $b, $c, $d], 'a' => $k]]);
    }

    if ($method === 'DELETE') {
        $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id === null) {
            app_json(['error' => 'ID inválido.'], 400);
        }
        $stmt = $db->prepare('DELETE FROM questions WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            app_json(['error' => 'Pergunta não encontrada.'], 404);
        }
        app_json(['deleted' => $id]);
    }

    app_json(['error' => 'Método não permitido.'], 405);
} catch (Throwable $e) {
    error_log($e->getMessage());
    app_json(['error' => 'Erro no servidor. Verifique a conexão com o banco de dados.'], 500);
}
