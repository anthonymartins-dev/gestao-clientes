require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function validar({ nome, email }) {
  if (!nome || !nome.trim()) return 'O nome é obrigatório';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return 'Email inválido';
  return null;
}

function limpar(corpo) {
  return {
    nome: corpo.nome?.trim(),
    email: corpo.email?.trim().toLowerCase(),
    telefone: corpo.telefone?.trim() || null,
    empresa: corpo.empresa?.trim() || null,
  };
}

app.get('/clientes', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM clientes ORDER BY nome');
    res.json(resultado.rows);
  } catch {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

app.post('/clientes', async (req, res) => {
  const dados = limpar(req.body);
  const problema = validar(dados);
  if (problema) return res.status(400).json({ erro: problema });

  try {
    const resultado = await pool.query(
      `INSERT INTO clientes (nome, email, telefone, empresa)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [dados.nome, dados.email, dados.telefone, dados.empresa]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Email já registado' });
    }
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

app.put('/clientes/:id', async (req, res) => {
  const dados = limpar(req.body);
  const problema = validar(dados);
  if (problema) return res.status(400).json({ erro: problema });

  try {
    const resultado = await pool.query(
      `UPDATE clientes
       SET nome = $1, email = $2, telefone = $3, empresa = $4
       WHERE id = $5 RETURNING *`,
      [dados.nome, dados.email, dados.telefone, dados.empresa, req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Email já registado' });
    }
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    const resultado = await pool.query('DELETE FROM clientes WHERE id = $1', [
      req.params.id,
    ]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
