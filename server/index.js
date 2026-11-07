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

app.listen(3001, () => {
  console.log('Servidor a correr em http://localhost:3001');
});
