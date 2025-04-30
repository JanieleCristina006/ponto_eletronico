import { FiCoffee, FiSun, FiLogOut } from "react-icons/fi";

const tipoParaIcone = {
  cafe: <FiCoffee className="text-orange-500" />,
  almoco: <FiSun className="text-yellow-500" />,
  saida: <FiLogOut className="text-red-500" />,
};

const tipoParaNome = {
  cafe: "Café da Tarde",
  almoco: "Almoço",
  saida: "Saída",
};

export const CardProximaAcao = ({
  tipo = "cafe",
  horarioPrevisto = "15:30",
  tempoRestante = null,
  onNotificar,
  concluido = false,
}) => {
  const nomeAcao = tipoParaNome[tipo];
  const icone = tipoParaIcone[tipo];

  // Função para formatar segundos em "1h 25min"
  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between gap-3 hover:shadow transition">
      <div className="flex items-center gap-3 text-gray-700">
        {icone}
        <div>
          <p className="text-sm text-gray-500">Próxima Ação</p>
          <p className="text-base font-semibold text-gray-800">
            {nomeAcao} às {horarioPrevisto}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {concluido ? (
          <span className="text-green-600 font-medium">
            {nomeAcao} já concluído!
          </span>
        ) : (
          <span>
            Faltam{" "}
            <strong className="text-purple-600">
              {formatarTempo(tempoRestante)}
            </strong>{" "}
            para o {tipo}
          </span>
        )}
      </div>

      {!concluido && (
        <button
          onClick={onNotificar}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg shadow"
        >
          Notificar {nomeAcao} no WhatsApp
        </button>
      )}
    </div>
  );
};
