<?php
return [
    'db_host' => getenv('QUIZ_DB_HOST') ?: '127.0.0.1',
    'db_name' => getenv('QUIZ_DB_NAME') ?: 'quiz_musical',
    'db_user' => getenv('QUIZ_DB_USER') ?: 'root',
    'db_pass' => getenv('QUIZ_DB_PASS') ?: '',
];
