import { FiAlertCircle } from "react-icons/fi";

export const CardAtrasos = ({ diasAtrasados = 0 }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
      <FiAlertCircle className="text-yellow-500 text-2xl" />
      <div>
        <p className="text-sm text-gray-500">Atrasos</p>
        <p className="text-base font-bold text-gray-800">
          {diasAtrasados} dia(s) com atraso
        </p>
      </div>
    </div>
  );
};
