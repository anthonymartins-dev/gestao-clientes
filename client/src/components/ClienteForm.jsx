import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const VAZIO = { nome: '', email: '', telefone: '', empresa: '' };

function Campo({ rotulo, obrigatorio, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {rotulo}
        {obrigatorio && <span className="text-danger"> *</span>}
      </span>
      <input
        className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-3 focus:ring-brand/15"
        {...props}
      />
    </label>
  );
}

export default function ClienteForm({ cliente, aoGuardar, aoFechar }) {
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [aGuardar, setAGuardar] = useState(false);

  const editar = Boolean(cliente);

  useEffect(() => {
    setDados(cliente ? { ...VAZIO, ...cliente } : VAZIO);
    setErro('');
  }, [cliente]);

  useEffect(() => {
    const fechar = (e) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  async function submeter(e) {
    e.preventDefault();
    setAGuardar(true);
    setErro('');
    try {
      await aoGuardar(dados);
    } catch (err) {
      setErro(err.message);
      setAGuardar(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-ink/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <form
        onSubmit={submeter}
        className="animar w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-xl shadow-ink/10"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              {editar ? 'Editar cliente' : 'Novo cliente'}
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              {editar ? 'Atualiza os dados de contacto.' : 'Adiciona um contacto à tua lista.'}
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-muted transition hover:bg-line/60 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Campo rotulo="Nome" obrigatorio value={dados.nome} onChange={mudar('nome')} autoFocus />
          <Campo
            rotulo="Email"
            obrigatorio
            type="email"
            value={dados.email}
            onChange={mudar('email')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Telefone" value={dados.telefone ?? ''} onChange={mudar('telefone')} />
            <Campo rotulo="Empresa" value={dados.empresa ?? ''} onChange={mudar('empresa')} />
          </div>
        </div>

        {erro && (
          <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{erro}</p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={aoFechar}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-line/60 hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={aGuardar}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
          >
            {aGuardar ? 'A guardar…' : editar ? 'Guardar alterações' : 'Adicionar cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}
