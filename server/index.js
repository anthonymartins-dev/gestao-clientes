const express = require('express');

const app = express();
app.use(express.json());

let clientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria@email.com' },
  { id: 2, nome: 'João Santos', email: 'joao@email.com' },
];

app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/clientes', (req, res) => {
  const novo = {
    id: Date.now(),
    nome: req.body.nome,
    email: req.body.email,
  };

  clientes.push(novo);
  res.status(201).json(novo);
});

app.put('/clientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  cliente.nome = req.body.nome;
  cliente.email = req.body.email;
  res.json(cliente);
});

app.delete('/clientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const existe = clientes.some((c) => c.id === id);

  if (!existe) {
    return res.status(404).json({ erro: 'Cliente não encontrado' });
  }

  clientes = clientes.filter((c) => c.id !== id);
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('Servidor a correr em http://localhost:3001');
});
