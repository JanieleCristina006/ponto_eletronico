export const CardResumoJornada = ({ pontos, calcularTotalTrabalhado, calcularHorasExtras, formatarMinutos }) => {
    const temDados = pontos.entrada && pontos.saida;
  
    if (!temDados) {
      return (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-base font-semibold mb-2">Resumo de Jornada</h3>
          <p className="text-sm text-gray-500">Jornada incompleta</p>
        </div>
      );
    }
  
    const total = calcularTotalTrabalhado(pontos);
    const horasExtras = calcularHorasExtras(pontos);
    const diferenca = 8 * 60 - total;
  
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold mb-2">Resumo de Jornada</h3>
        <p className="text-sm mb-1">Total trabalhado: <strong>{formatarMinutos(total)}</strong></p>
        {horasExtras > 0 ? (
          <p className="text-sm text-green-600">
            Você fez <strong>{formatarMinutos(horasExtras)}</strong> de horas extras hoje 💪
          </p>
        ) : (
          <p className="text-sm text-red-600">
            Você ainda deve <strong>{formatarMinutos(Math.abs(diferenca))}</strong>
          </p>
        )}
      </div>
    );
  }