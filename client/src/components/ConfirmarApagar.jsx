import { useEffect, useState } from 'react';

export default function ConfirmarApagar({ cliente, aoConfirmar, aoFechar }) {
  const [aApagar, setAApagar] = useState(false);

  useEffect(() => {
    const fechar = (e) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  async function confirmar() {
    setAApagar(true);
    await aoConfirmar();
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-ink/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div className="animar w-full max-w-sm rounded-2xl border border-line bg-card p-6 shadow-xl shadow-ink/10">
        <h2 className="font-serif text-2xl font-semibold">Apagar cliente?</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          <strong className="font-medium text-ink">{cliente.nome}</strong> vai ser removido da
          lista. Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={aoFechar}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-line/60 hover:text-ink"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={aApagar}
            className="rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {aApagar ? 'A apagar…' : 'Apagar'}
          </button>
        </div>
      </div>
    </div>
  );
}
