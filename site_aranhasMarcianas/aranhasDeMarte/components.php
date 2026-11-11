<?php
header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$pageTemplates = [
    'inicio' => 'home.php',
    'quiz' => 'quiz.php',
    'fim' => 'end.php',
    'perfil' => 'profile.php',
    'estudos' => 'study.php',
    'ranking' => 'ranking.php',
    'login' => 'login.php',
    'admin' => 'admin.php',
];
$route = isset($payload['route']) && is_string($payload['route']) ? $payload['route'] : 'inicio';
if (!isset($pageTemplates[$route])) {
    $route = 'inicio';
}
$rawState = isset($payload['state']) && is_array($payload['state']) ? $payload['state'] : [];
$rawStats = isset($rawState['stats']) && is_array($rawState['stats']) ? $rawState['stats'] : [];
$stats = [
    'ok' => max(0, (int) ($rawStats['ok'] ?? 0)),
    'err' => max(0, (int) ($rawStats['err'] ?? 0)),
    'points' => max(0, (int) ($rawStats['points'] ?? 0)),
];

function app_normalize_question($question): ?array
{
    if (!is_array($question) || !isset($question['q']) || !is_string($question['q']) || !isset($question['o']) || !is_array($question['o'])) {
        return null;
    }
    $options = array_values(array_filter($question['o'], 'is_string'));
    $answer = filter_var($question['a'] ?? null, FILTER_VALIDATE_INT);
    if (count($options) !== 4 || $answer === false || $answer < 0 || $answer > 3) {
        return null;
    }
    return [
        'id' => (int) ($question['id'] ?? 0),
        'q' => $question['q'],
        'o' => $options,
        'a' => $answer,
    ];
}

function app_normalize_questions($questions): array
{
    if (!is_array($questions)) {
        return [];
    }
    return array_values(array_filter(array_map('app_normalize_question', $questions)));
}

function app_normalize_study_item($study): ?array
{
    if (!is_array($study) || !isset($study['type'], $study['title']) || !is_string($study['title'])) {
        return null;
    }
    $type = $study['type'];
    if (!in_array($type, ['video', 'image', 'text', 'review'], true)) {
        return null;
    }
    $id = filter_var($study['id'] ?? 0, FILTER_VALIDATE_INT);
    $normalized = [
        'id' => $id === false ? 0 : $id,
        'type' => $type,
        'title' => $study['title'],
    ];
    if ($type === 'text') {
        $normalized['body'] = isset($study['body']) && is_string($study['body']) ? $study['body'] : '';
    } elseif ($type === 'video' || $type === 'image') {
        $source = isset($study['source']) && is_string($study['source']) ? trim($study['source']) : '';
        $scheme = parse_url($source, PHP_URL_SCHEME);
        $normalized['source'] = ($scheme === null || in_array(strtolower($scheme), ['http', 'https'], true)) && substr($source, 0, 2) !== '//'
            ? $source
            : '';
        $normalized['alt'] = isset($study['alt']) && is_string($study['alt']) ? $study['alt'] : '';
    } else {
        $options = isset($study['options']) && is_array($study['options'])
            ? array_values(array_filter($study['options'], 'is_string'))
            : [];
        $answer = filter_var($study['answer'] ?? null, FILTER_VALIDATE_INT);
        $normalized['question'] = isset($study['question']) && is_string($study['question']) ? $study['question'] : '';
        $normalized['options'] = count($options) === 4 ? $options : ['', '', '', ''];
        $normalized['answer'] = $answer !== false && $answer >= 0 && $answer < 4 ? $answer : 0;
        $normalized['explanation'] = isset($study['explanation']) && is_string($study['explanation']) ? $study['explanation'] : '';
    }
    return $normalized;
}

function app_normalize_studies($themes): array
{
    if (!is_array($themes)) {
        return [];
    }
    $normalized = [];
    foreach ($themes as $theme) {
        if (!is_array($theme) || !isset($theme['name']) || !is_string($theme['name'])) {
            continue;
        }
        $themeId = filter_var($theme['id'] ?? 0, FILTER_VALIDATE_INT);
        $items = isset($theme['studies']) && is_array($theme['studies']) ? $theme['studies'] : [];
        $normalized[] = [
            'id' => $themeId === false ? 0 : $themeId,
            'name' => $theme['name'],
            'studies' => array_values(array_filter(array_map('app_normalize_study_item', $items))),
        ];
    }
    return $normalized;
}

$questions = app_normalize_questions($rawState['questions'] ?? []);
$rawQuiz = isset($rawState['quiz']) && is_array($rawState['quiz']) ? $rawState['quiz'] : [];
$quizQuestions = app_normalize_questions($rawQuiz['questions'] ?? []);
$quizIndex = max(0, min((int) ($rawQuiz['index'] ?? 0), max(0, count($quizQuestions) - 1)));
$rawPicks = isset($rawQuiz['picks']) && is_array($rawQuiz['picks']) ? $rawQuiz['picks'] : [];
$picks = array_map(static function ($pick) {
    return filter_var($pick, FILTER_VALIDATE_INT);
}, $rawPicks);
$rawLast = isset($rawState['last']) && is_array($rawState['last']) ? $rawState['last'] : [];
$last = [
    'ok' => max(0, (int) ($rawLast['ok'] ?? 0)),
    'err' => max(0, (int) ($rawLast['err'] ?? 0)),
];
$editing = app_normalize_question($rawState['editing'] ?? null);
$studies = app_normalize_studies($rawState['studies'] ?? []);
$selectedThemeId = filter_var($rawState['selectedThemeId'] ?? null, FILTER_VALIDATE_INT);
$adminThemeId = filter_var($rawState['adminThemeId'] ?? null, FILTER_VALIDATE_INT);
$adminStudyEditing = app_normalize_study_item($rawState['adminStudyEditing'] ?? null);
$state = [
    'stats' => $stats,
    'questions' => $questions,
    'last' => $last,
    'quiz' => ['questions' => $quizQuestions, 'index' => $quizIndex, 'picks' => $picks],
    'editing' => $editing,
    'studies' => $studies,
    'selectedThemeId' => $selectedThemeId === false ? null : $selectedThemeId,
    'adminThemeId' => $adminThemeId === false ? null : $adminThemeId,
    'adminNewTheme' => !empty($rawState['adminNewTheme']),
    'adminStudyEditing' => $adminStudyEditing,
];
$sessionData = isset($payload['session']) && is_array($payload['session']) ? $payload['session'] : null;
$session = $sessionData === null ? null : [
    'name' => isset($sessionData['name']) && is_string($sessionData['name']) ? $sessionData['name'] : '',
    'role' => isset($sessionData['role']) && $sessionData['role'] === 'admin' ? 'admin' : 'user',
];
$componentData = require __DIR__ . '/php/components/icons.php';
$navItems = $componentData['nav'];
$icons = $componentData['icons'];
$activeTab = in_array($route, ['quiz', 'fim'], true) ? 'inicio' : $route;

function app_escape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$render = static function (string $file, array $context): string {
    extract($context, EXTR_SKIP);
    ob_start();
    require __DIR__ . '/php/' . $file;
    return (string) ob_get_clean();
};

echo json_encode([
    'page' => $render('pages/' . $pageTemplates[$route], ['state' => $state, 'session' => $session]),
    'wide' => $route === 'admin',
    'header' => $render('components/header.php', ['navItems' => $navItems, 'route' => $route, 'activeTab' => $activeTab, 'session' => $session]),
    'footer' => $render('components/footer.php', []),
    'bottomNav' => $render('components/bottom-nav.php', ['navItems' => $navItems, 'icons' => $icons, 'activeTab' => $activeTab]),
], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);