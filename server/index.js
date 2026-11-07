const express = require('express');

const app = express();

app.get('/', (req, res) =>{
  res.json({mensagem : 'API a funcionar'});
});

app.listen(3001, () => {
  console.log('Servidor a correr em https://Localhost:3001');
});
