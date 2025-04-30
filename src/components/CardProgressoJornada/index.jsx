import { FiClock } from "react-icons/fi";

export const CardProgressoJornada = ({ tempoTrabalhadoMin = 0 }) => {
  const jornadaTotalMin = 480; // 8 horas * 60 minutos
  const porcentagem = Math.min((tempoTrabalhadoMin / jornadaTotalMin) * 100, 100);

  const horas = Math.floor(tempoTrabalhadoMin / 60);
  const minutos = tempoTrabalhadoMin % 60;
  const faltamMin = Math.max(0, jornadaTotalMin - tempoTrabalhadoMin);
  const faltamHoras = Math.floor(faltamMin / 60);
  const faltamMinutos = faltamMin % 60;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow transition flex flex-col gap-4">
      <div className="flex items-center gap-3 text-gray-700">
        <FiClock className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500">Jornada de Hoje</p>
          <p className="text-base font-semibold text-gray-800">
            {horas}h {minutos}min trabalhados de 8h
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${porcentagem}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600">
        Faltam{" "}
        <strong className="text-purple-600">
          {faltamHoras}h {faltamMinutos}min
        </strong>{" "}
        para completar sua jornada
      </p>
    </div>
  );
};
