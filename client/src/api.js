const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function pedir(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (resposta.status === 204) return null;

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || 'Algo correu mal');
  return dados;
}

export const listarClientes = () => pedir('/clientes');

export const criarCliente = (cliente) =>
  pedir('/clientes', { method: 'POST', body: JSON.stringify(cliente) });

export const editarCliente = (id, cliente) =>
  pedir(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(cliente) });

export const apagarCliente = (id) => pedir(`/clientes/${id}`, { method: 'DELETE' });
