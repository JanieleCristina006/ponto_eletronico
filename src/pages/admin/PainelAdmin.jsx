import { FiUsers, FiClipboard, FiUserCheck } from "react-icons/fi";

export const PainelAdmin = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Resumo geral do sistema</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
          <FiUsers size={36} className="text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">25</h2>
          <p className="text-gray-500 text-sm">Usuários Registrados</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
          <FiClipboard size={36} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">12</h2>
          <p className="text-gray-500 text-sm">Relatórios Gerados</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition">
          <FiUserCheck size={36} className="text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">22</h2>
          <p className="text-gray-500 text-sm">Usuários Ativos</p>
        </div>
      </div>

      {/* Futuro: seção de gráficos ou lista rápida */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Cadastrados</h3>

        {/* Exemplo de lista rápida */}
        <ul className="space-y-3">
          <li className="flex items-center justify-between">
            <span className="text-gray-700">João Silva</span>
            <span className="text-xs text-gray-500">Admin</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-700">Ana Costa</span>
            <span className="text-xs text-gray-500">Funcionário</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-700">Pedro Souza</span>
            <span className="text-xs text-gray-500">Funcionário</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
