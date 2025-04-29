import { FiMail, FiCalendar, FiEdit2, FiUser } from "react-icons/fi";

export const Perfil = () => {
  const nome = "Janiele Cristina";
  const email = "janiele@exemplo.com";
  const dataCadastro = "14/04/2024";

  return (
    <div className="flex-1 p-6 md:p-10 w-full bg-[#F8FAFC]">
      <h1 className="text-2xl font-bold text-[#35122E] mb-6 flex items-center gap-2">
        <FiUser className="text-purple-700" /> Meu Perfil
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
            {nome[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{nome}</h2>
            <p className="text-sm text-gray-500">Funcionária desde {dataCadastro}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-500" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <span>Cadastro: {dataCadastro}</span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-[#6B256F] hover:bg-[#571c59] text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow transition">
          <FiEdit2 className="text-sm" />
          Editar Perfil
        </button>
      </div>
    </div>
  );
};
