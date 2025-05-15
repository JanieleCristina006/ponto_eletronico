export const CardHorasExtras = ({ totalMinutos, formatarMinutos }) => {
  const temExtras = totalMinutos > 0;

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <h3 className="text-base font-semibold mb-2">Horas Extras do Mês</h3>
      {temExtras ? (
        <p className="text-sm text-green-600">
          Você acumulou <strong>{formatarMinutos(totalMinutos)}</strong> de horas extras neste mês 🎉
        </p>
      ) : (
        <p className="text-sm text-gray-500">Nenhuma hora extra registrada até agora.</p>
      )}
    </div>
  );
};
