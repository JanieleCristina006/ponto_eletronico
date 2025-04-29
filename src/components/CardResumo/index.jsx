export const CardResumo = ({ icone, titulo, valor, corIcone, valorClass = "", className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md px-5 py-4 flex items-center justify-between transition hover:shadow-sm ${className}`}>
      {/* Ícone */}
      <div className={`text-xl ${corIcone}`}>
        {icone}
      </div>

      {/* Conteúdo */}
      <div className="text-end">
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className={`text-lg font-bold text-gray-800 ${valorClass}`}>{valor}</p>
      </div>
    </div>
  );
};
