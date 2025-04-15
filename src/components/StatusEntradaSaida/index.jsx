import { FiLogIn, FiLogOut } from "react-icons/fi";

export const StatusEntradaSaida = ({ pontos, compararEntradaSaida, formatarMinutosParaHoraEmin }) => {
  const temEntrada = !!pontos.entrada;
  const temSaida = !!pontos.saida;
  const diferenca = compararEntradaSaida(pontos); // pode retornar parcial

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <span>Status de Entrada/Saída</span>
      </h3>

      <div className="space-y-2">
        {temEntrada ? (
          <p className={`flex items-center gap-2 text-sm ${diferenca?.entrada >= 0 ? "text-green-600" : "text-red-600"}`}>
            <FiLogIn className="text-base" />
            Entrada: {formatarMinutosParaHoraEmin(Math.abs(diferenca.entrada))} {diferenca.entrada >= 0 ? "adiantado" : "atrasado"}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Entrada não registrada</p>
        )}

        {temSaida ? (
          <p className={`flex items-center gap-2 text-sm ${diferenca?.saida >= 0 ? "text-blue-600" : "text-red-600"}`}>
            <FiLogOut className="text-base" />
            Saída: {formatarMinutosParaHoraEmin(Math.abs(diferenca.saida))} {diferenca.saida >= 0 ? "mais tarde" : "mais cedo"}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Saída ainda não registrada</p>
        )}
      </div>
    </div>
  );
};
