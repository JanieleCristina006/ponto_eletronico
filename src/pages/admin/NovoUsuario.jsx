import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NovoUsuario = () => {
  const navigate = useNavigate();

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("funcionario");
  const [permissao, setPermissao] = useState("operacional");
  const [statusEmail, setStatusEmail] = useState("nao-verificado");

  const handleCadastrar = (e) => {
    e.preventDefault();
    const novoUsuario = {
      nomeCompleto: `${primeiroNome} ${sobrenome}`,
      email,
      cargo,
      permissao,
      statusEmail,
    };
    console.log("Cadastrar:", novoUsuario);
    alert("Usuário cadastrado com sucesso!");
    navigate("/admin/usuarios");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Adicionar Novo Usuário</h1>

      <form onSubmit={handleCadastrar} className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center space-y-3">
          <img
            className="w-24 h-24 rounded-full object-cover"
            src="https://via.placeholder.com/150"
            alt="Avatar Padrão"
          />
          <input type="file" className="block text-sm text-gray-500" />
          <span className="text-xs text-gray-400">(Opcional) SVG, PNG, JPG, até 800x400px</span>
        </div>

        {/* Formulário de duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Primeiro Nome</label>
            <input
              type="text"
              value={primeiroNome}
              onChange={(e) => setPrimeiroNome(e.target.value)}
              required
              className="w-full border rounded-lg p-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Sobrenome</label>
            <input
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
              className="w-full border rounded-lg p-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg p-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Cargo</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full border rounded-lg p-3 bg-gray-50"
            >
              <option value="funcionario">Funcionário</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Permissão de Usuário</label>
            <select
              value={permissao}
              onChange={(e) => setPermissao(e.target.value)}
              className="w-full border rounded-lg p-3 bg-gray-50"
            >
              <option value="operacional">Operacional</option>
              <option value="financeiro">Financeiro</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Status de Email</label>
            <select
              value={statusEmail}
              onChange={(e) => setStatusEmail(e.target.value)}
              className="w-full border rounded-lg p-3 bg-gray-50"
            >
              <option value="verificado">Verificado</option>
              <option value="nao-verificado">Não Verificado</option>
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};
