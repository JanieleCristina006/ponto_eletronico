import {
  FiLogIn,
  FiLogOut,
  FiCoffee,
  FiSun,
} from "react-icons/fi";

export const CardRelatorioPonto = ({ pontos, data, pdfRef, onClickBaterPonto }) => {
  return (
    <div ref={pdfRef} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <h3 className="text-base font-semibold mb-3">Pontos do Dia {data}</h3>
      
      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <FiLogIn /> Entrada: {pontos.entrada || "--:--"}
          </p>
          <p className="flex items-center gap-2">
            <FiSun /> Início Almoço: {pontos.inicioAlmoco || "--:--"}
          </p>
          <p className="flex items-center gap-2">
            <FiLogIn /> Volta Almoço: {pontos.voltaAlmoco || "--:--"}
          </p>
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <FiCoffee /> Início Café: {pontos.inicioCafe || "--:--"}
          </p>
          <p className="flex items-center gap-2">
            <FiCoffee /> Fim Café: {pontos.voltaCafe || "--:--"}
          </p>
          <p className="flex items-center gap-2">
            <FiLogOut /> Saída: {pontos.saida || "--:--"}
          </p>
        </div>
      </div>

      <button
        onClick={onClickBaterPonto}
        className="mt-6 cursor-pointer bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 w-full rounded-md transition-transform hover:scale-105"
      >
        Registrar Novo Ponto
      </button>
    </div>
  );
};
