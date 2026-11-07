require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/clientes', async (req, res) => {
  const resultado = await pool.query('SELECT * FROM clientes ORDER BY id');
  res.json(resultado.rows);
});

app.post('/clientes', async (req, res) => {
  const { nome, email } = req.body;

  try {
    const resultado = await pool.query(
      'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
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
  const { nome, email } = req.body;

  const resultado = await pool.query(
    'UPDATE clientes SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
    [nome, email, req.params.id]
  );

  if (resultado.rowCount === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }
  res.json(resultado.rows[0]);
});

app.delete('/clientes/:id', async (req, res) => {
  const resultado = await pool.query('DELETE FROM clientes WHERE id = $1', [
    req.params.id,
  ]);

  if (resultado.rowCount === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});