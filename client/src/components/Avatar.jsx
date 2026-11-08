const TONS = [
  'bg-[#e3ece7] text-[#24493c]',
  'bg-[#f1e6d6] text-[#7a5524]',
  'bg-[#e6e3ee] text-[#4a4470]',
  'bg-[#efe0dc] text-[#8a3f31]',
  'bg-[#dfe8ee] text-[#2f5670]',
];

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function Avatar({ nome }) {
  const tom = TONS[nome.length % TONS.length];

  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${tom}`}
    >
      {iniciais(nome)}
    </span>
  );
}
