import { FiLogIn, FiLogOut } from "react-icons/fi";

export const StatusEntradaSaida = ({
  pontos,
  compararEntradaSaida,
  formatarMinutosParaHoraEmin,
}) => {
  if (!pontos || Object.keys(pontos).length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500">Entrada não registrada</p>
      </div>
    );
  }

  // Agora é seguro chamar
  const diferenca = compararEntradaSaida(pontos) || {};
  const temEntrada = Boolean(pontos.entrada && pontos.entrada.trim() !== "");
  const temSaida = Boolean(pontos.saida && pontos.saida.trim() !== "");

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <span>Status de Entrada/Saída</span>
      </h3>

      <div className="space-y-2">
        {/* Entrada */}
        {temEntrada && diferenca.entrada !== undefined ? (
          <p
            className={`flex items-center gap-2 text-sm ${
              diferenca.entrada >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <FiLogIn className="text-base" />
            Entrada: {pontos.entrada} (
            {formatarMinutosParaHoraEmin(Math.abs(diferenca.entrada))}{" "}
            {diferenca.entrada >= 0 ? "adiantado" : "atrasado"})
          </p>
        ) : (
          <p className="text-sm text-gray-500">Entrada não registrada</p>
        )}

        {/* Saída */}
        {temSaida && diferenca.saida !== undefined ? (
          <p
            className={`flex items-center gap-2 text-sm ${
              diferenca.saida >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            <FiLogOut className="text-base" />
            Saída: {pontos.saida} (
            {formatarMinutosParaHoraEmin(Math.abs(diferenca.saida))}{" "}
            {diferenca.saida >= 0 ? "mais tarde" : "mais cedo"})
          </p>
        ) : (
          <p className="text-sm text-gray-500">Saída ainda não registrada</p>
        )}
      </div>
    </div>
  );
};
