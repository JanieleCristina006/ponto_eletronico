import { FiCheckCircle } from "react-icons/fi";

export const CardPontualidade = ({ diasPontuais = 0 }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
      <FiCheckCircle className="text-green-500 text-2xl" />
      <div>
        <p className="text-sm text-gray-500">Pontualidade</p>
        <p className="text-base font-bold text-gray-800">
          {diasPontuais} dia(s) pontual
        </p>
      </div>
    </div>
  );
};
