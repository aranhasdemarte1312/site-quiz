-- Aranhas de Marte - banco de dados (MySQL / MariaDB, compatível com XAMPP)
-- Importe este arquivo no phpMyAdmin ou rode: mysql -u root < database/schema.sql

CREATE DATABASE IF NOT EXISTS quiz_musical
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_musical;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(80)  NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questions (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  statement      VARCHAR(500) NOT NULL,
  option_a       VARCHAR(255) NOT NULL,
  option_b       VARCHAR(255) NOT NULL,
  option_c       VARCHAR(255) NOT NULL,
  option_d       VARCHAR(255) NOT NULL,
  correct_option TINYINT UNSIGNED NOT NULL,          -- 0=A, 1=B, 2=C, 3=D
  created_by     INT UNSIGNED NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_correct CHECK (correct_option BETWEEN 0 AND 3),
  CONSTRAINT fk_questions_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ranking (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  points     INT UNSIGNED NOT NULL DEFAULT 0,
  correct    INT UNSIGNED NOT NULL DEFAULT 0,
  errors     INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ranking_user (user_id),
  KEY idx_ranking_points (points),
  CONSTRAINT fk_ranking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO questions (statement, option_a, option_b, option_c, option_d, correct_option)
SELECT * FROM (
  SELECT 'Qual instrumento tem teclas pretas e brancas?' AS s, 'Violino' AS a, 'Piano' AS b, 'Flauta' AS c, 'Bateria' AS d, 1 AS k
  UNION ALL SELECT 'Qual gênero musical é conhecido pela improvisação e pelo uso frequente de saxofone?', 'Blues', 'Jazz', 'Sertanejo', 'Reggae', 1
  UNION ALL SELECT 'Qual instrumento de percussão é presença marcante no samba?', 'Agogô', 'Pandeiro', 'Triângulo', 'Atabaque', 1
  UNION ALL SELECT 'Qual gênero costuma destacar guitarra elétrica, baixo e bateria?', 'Samba', 'Rock', 'Bossa nova', 'Forró', 1
) seed
WHERE NOT EXISTS (SELECT 1 FROM questions);
-- O administrador é criado pelo script setup_admin.php (a senha não fica no SQL).
