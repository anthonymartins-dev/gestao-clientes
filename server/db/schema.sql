CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  empresa VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS telefone VARCHAR(30);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS empresa VARCHAR(100);

INSERT INTO clientes (nome, email, telefone, empresa) VALUES
  ('Maria Silva', 'maria@email.com', '912 345 678', 'Studio Aurora'),
  ('João Santos', 'joao@email.com', '923 456 789', 'Santos & Filhos'),
  ('Ana Costa', 'ana.costa@email.com', '934 567 890', 'Costa Arquitetura'),
  ('Pedro Almeida', 'pedro@email.com', '965 432 109', 'Almeida Consultoria'),
  ('Carla Ferreira', 'carla@email.com', '916 789 012', NULL)
ON CONFLICT (email) DO NOTHING;
