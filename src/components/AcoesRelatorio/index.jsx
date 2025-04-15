import { FiDownload, FiCalendar, FiFileText } from "react-icons/fi";

export const AcoesRelatorio = ({ onGerarPDF }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Botão diário */}
      <button
        onClick={onGerarPDF}
        className="flex items-center justify-center gap-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-3 px-5 rounded-xl shadow transition-colors duration-300"
      >
        <FiCalendar className="text-xl" />
        <span>Baixar Relatório do Dia</span>
        <FiDownload className="text-xl" />
      </button>

      {/* Botão mensal */}
      <button
        className="flex items-center justify-center gap-3 bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold py-3 px-5 rounded-xl shadow transition-colors duration-300"
      >
        <FiFileText className="text-xl" />
        <span>Baixar Relatório Mensal</span>
        <FiDownload className="text-xl" />
      </button>
    </div>
  );
};
