import { FiClock } from "react-icons/fi";

export const CardProgressoJornada = ({ tempoTrabalhadoMin = 0 }) => {
  const tempo = Number(tempoTrabalhadoMin) || 0;
  const jornadaTotalMin = 480;

  const porcentagem = Math.min((tempo / jornadaTotalMin) * 100, 100);

  const horas = Math.floor(tempo / 60);
  const minutos = tempo % 60;

  const faltamMin = Math.max(0, jornadaTotalMin - tempo);
  const faltamHoras = Math.floor(faltamMin / 60);
  const faltamMinutos = faltamMin % 60;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow transition flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-100">
        <FiClock className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Jornada de Hoje</p>
          <p className="text-base font-semibold text-gray-800 dark:text-white">
            {horas}h {minutos}min trabalhados de 8h
          </p>
        </div>
      </div>

      <div className="w-45 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${porcentagem}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Faltam{" "}
        <strong className="text-purple-600 dark:text-purple-400">
          {faltamHoras}h {faltamMinutos}min
        </strong>{" "}
        para completar sua jornada
      </p>
    </div>
  );
};
