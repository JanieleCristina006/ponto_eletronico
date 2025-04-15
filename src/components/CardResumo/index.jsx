export const CardResumo = ({ icone, titulo, valor, corIcone, valorClass = "" }) => {
    return (
      <div className="`bg-white shadow-md rounded-2xl p-6 flex items-start gap-4 ${className}`">
        <div className={corIcone}>{icone}</div>
        <div>
          <p className="text-sm text-gray-500">{titulo}</p>
          <p className={`text-lg font-bold ${valorClass}`}>{valor}</p>
        </div>
      </div>
    );
  } 