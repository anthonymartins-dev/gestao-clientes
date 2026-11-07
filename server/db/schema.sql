CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

INSERT INTO clientes (nome, email) VALUES
  ('Maria Silva', 'maria@email.com'),
  ('João Santos', 'joao@email.com')
ON CONFLICT (email) DO NOTHING;
