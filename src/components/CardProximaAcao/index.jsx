



export const CardProximaAcao = ({ tempoCard, mensagemCard, onNotificar }) => {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold mb-2">Próxima Ação</h3>
        {typeof tempoCard === "number" && tempoCard > 0 ? (
          <>
            <p className="text-xl font-bold text-gray-800">
              {new Date(tempoCard * 1000).toISOString().substr(11, 8)}
            </p>
            <p className="text-sm text-gray-500">{mensagemCard}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Hora da próxima ação! 🚀</p>
        )}
  
        <button
          onClick={onNotificar}
          className="mt-4 w-full bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-md"
        >
          Notificar no WhatsApp
        </button>
      </div>
    );
  }