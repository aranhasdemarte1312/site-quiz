<?php
/*
DECLARAÇÃO DE USO DE INTELIGÊNCIA ARTIFICIAL

Ferramenta: Claude, Copilot
Etapa: Desenvolvimento
Finalidade: Auxílio no coding em php e identificação de seções por comentários

Validação: Código analisado, corrigido e testado pelo aluno.
*/

// Credenciais do banco. Padrão do XAMPP: usuário root, sem senha.
// Em produção, use um usuário dedicado com senha forte (ou variáveis de ambiente).
return [
    'db_host' => getenv('QUIZ_DB_HOST') ?: '127.0.0.1',
    'db_name' => getenv('QUIZ_DB_NAME') ?: 'quiz_musical',
    'db_user' => getenv('QUIZ_DB_USER') ?: 'root',
    'db_pass' => getenv('QUIZ_DB_PASS') ?: '',
];
