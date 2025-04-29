import { useNavigate } from "react-router-dom";

export const UsuariosAdmin = () => {
  const navigate = useNavigate();

  const usuariosFalsos = [
    { nome: "João Silva", email: "joao@email.com", cargo: "Administrador", status: "Ativo" },
    { nome: "Ana Costa", email: "ana@email.com", cargo: "Funcionário", status: "Ativo" },
    { nome: "Pedro Souza", email: "pedro@email.com", cargo: "Funcionário", status: "Inativo" },
    { nome: "Marina Rocha", email: "marina@email.com", cargo: "Administrador", status: "Ativo" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        <button
          onClick={() => navigate("/admin/usuarios/novo")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          + Novo Usuário
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosFalsos.map((usuario, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${usuario.cargo === "Administrador" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                    {usuario.cargo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${usuario.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {usuario.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded-lg text-xs">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-xs">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
