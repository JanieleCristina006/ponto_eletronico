export const CardHorasExtras = ({ totalMinutos, formatarMinutos }) => {
  const temExtras = totalMinutos > 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm transition-colors">
      <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-white">
        Horas Extras do Mês
      </h3>

      {temExtras ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          Você acumulou <strong>{formatarMinutos(totalMinutos)}</strong> de horas extras neste mês 🎉
        </p>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Nenhuma hora extra registrada até agora.
        </p>
      )}
    </div>
  );
};
