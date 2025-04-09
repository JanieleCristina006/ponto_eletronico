import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConection";

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
      // 1. Cria usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;
  
      // 2. Salva no Firestore com o mesmo UID
      await setDoc(doc(db, "users", uid), {
        nome: nome,
        email: email,
        role: role,
        criadoEm: new Date()
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Cadastrar Novo Usuário</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block mb-1 font-medium">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded"
              placeholder="Digite o nome"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-1 font-medium">Função</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded"
            >
              <option value="funcionario">Funcionário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col md:flex-row gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
            >
              Cadastrar Usuário
            </button>
            <button
              type="button"
              onClick={irParaLista}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded"
            >
              Ver lista de funcionários
            </button>
          </div>

          {mensagem && (
            <p className="col-span-2 text-center text-green-600 font-semibold mt-4">
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
