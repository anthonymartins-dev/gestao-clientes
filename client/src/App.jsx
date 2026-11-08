import { useEffect, useMemo, useState } from 'react';
import { Mail, Pencil, Phone, Plus, Search, Trash2, Users } from 'lucide-react';
import { apagarCliente, criarCliente, editarCliente, listarClientes } from './api.js';
import Avatar from './components/Avatar.jsx';
import ClienteForm from './components/ClienteForm.jsx';
import ConfirmarApagar from './components/ConfirmarApagar.jsx';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [formulario, setFormulario] = useState(null);
  const [aApagar, setAApagar] = useState(null);
  const [aviso, setAviso] = useState('');

  async function carregar() {
    setErro('');
    try {
      setClientes(await listarClientes());
    } catch {
      setErro('Não foi possível ligar ao servidor. Confirma que a API está a correr.');
    } finally {
      setACarregar(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), 2600);
    return () => clearTimeout(t);
  }, [aviso]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter((c) =>
      [c.nome, c.email, c.empresa, c.telefone].some((v) => v?.toLowerCase().includes(termo))
    );
  }, [clientes, busca]);

  async function guardar(dados) {
    if (formulario?.id) {
      await editarCliente(formulario.id, dados);
      setAviso('Cliente atualizado');
    } else {
      await criarCliente(dados);
      setAviso('Cliente adicionado');
    }
    setFormulario(null);
    await carregar();
  }

  async function confirmarApagar() {
    await apagarCliente(aApagar.id);
    setAApagar(null);
    setAviso('Cliente apagado');
    await carregar();
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-brand uppercase">Gestão de clientes</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Clientes
          </h1>
          <p className="mt-2 text-muted">
            {aCarregar
              ? 'A carregar…'
              : `${clientes.length} ${clientes.length === 1 ? 'contacto registado' : 'contactos registados'}`}
          </p>
        </div>
        <button
          onClick={() => setFormulario({})}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover"
        >
          <Plus size={17} />
          Novo cliente
        </button>
      </header>

      <div className="relative mt-8">
        <Search
          size={17}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por nome, email, empresa ou telefone"
          className="w-full rounded-xl border border-line bg-card py-3 pr-4 pl-10 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-3 focus:ring-brand/15"
        />
      </div>

      <main className="mt-5">
        {erro ? (
          <div className="rounded-2xl border border-line bg-card p-10 text-center">
            <p className="text-danger">{erro}</p>
            <button
              onClick={carregar}
              className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-medium transition hover:bg-line/50"
            >
              Tentar de novo
            </button>
          </div>
        ) : aCarregar ? (
          <div className="space-y-px overflow-hidden rounded-2xl border border-line bg-line">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-card p-4">
                <div className="size-9 animate-pulse rounded-full bg-line" />
                <div className="h-4 w-40 animate-pulse rounded bg-line" />
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card/60 px-6 py-16 text-center">
            <Users className="mx-auto text-muted" size={28} strokeWidth={1.5} />
            <h2 className="mt-3 font-serif text-xl font-semibold">
              {busca ? 'Nenhum resultado' : 'Ainda não tens clientes'}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {busca
                ? 'Experimenta outra pesquisa.'
                : 'Adiciona o primeiro contacto para começar.'}
            </p>
          </div>
        ) : (
          <ul className="animar divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {filtrados.map((c) => (
              <li
                key={c.id}
                className="group flex items-center gap-4 p-4 transition hover:bg-paper/70 sm:px-5"
              >
                <Avatar nome={c.nome} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.nome}</p>
                  <p className="truncate text-sm text-muted">{c.empresa || 'Sem empresa'}</p>
                </div>

                <div className="hidden min-w-0 flex-1 text-sm text-muted md:block">
                  <p className="flex items-center gap-2 truncate">
                    <Mail size={14} className="shrink-0" />
                    {c.email}
                  </p>
                  {c.telefone && (
                    <p className="mt-1 flex items-center gap-2">
                      <Phone size={14} className="shrink-0" />
                      {c.telefone}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                  <button
                    onClick={() => setFormulario(c)}
                    aria-label={`Editar ${c.nome}`}
                    className="rounded-lg p-2 text-muted transition hover:bg-line/70 hover:text-ink"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setAApagar(c)}
                    aria-label={`Apagar ${c.nome}`}
                    className="rounded-lg p-2 text-muted transition hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {formulario && (
        <ClienteForm
          cliente={formulario.id ? formulario : null}
          aoGuardar={guardar}
          aoFechar={() => setFormulario(null)}
        />
      )}

      {aApagar && (
        <ConfirmarApagar
          cliente={aApagar}
          aoConfirmar={confirmarApagar}
          aoFechar={() => setAApagar(null)}
        />
      )}

      {aviso && (
        <div className="animar fixed right-4 bottom-4 z-30 rounded-lg bg-ink px-4 py-2.5 text-sm text-white shadow-lg">
          {aviso}
        </div>
      )}
    </div>
  );
}
