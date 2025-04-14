import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConection";
import Sidebar from "../../admin/components/Sidebar";
import ListaUsuarios from "../components/pages/ListarUsuarios";

export const RegistrarUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("funcionario");
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        nome,
        email,
        role,
        criadoEm: new Date(),
      });

      setMensagem("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setRole("funcionario");

      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setMensagem("Erro ao cadastrar usuário. Verifique os dados.");
    }
  };

  const irParaLista = () => {
    navigate("/admin/lista-usuarios");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen bg-[#f8f6f8] p-10">
        <div className="bg-white w-full max-w-3xl mx-auto p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#35122E]">
            Cadastrar Novo Usuário
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B256F]"
                placeholder="Digite o nome"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B256F]"
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B256F]"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B256F]"
              >
                <option value="funcionario">Funcionário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="col-span-2 flex flex-col md:flex-row gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-[#6B256F] hover:bg-[#581c5a] text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Cadastrar Usuário
              </button>
              <button
                type="button"
                onClick={irParaLista}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
              >
                Ver lista de funcionários
              </button>
            </div>

            {mensagem && (
              <p
                className={`col-span-2 text-center mt-4 font-semibold ${
                  mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"
                }`}
              >
                {mensagem}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};
