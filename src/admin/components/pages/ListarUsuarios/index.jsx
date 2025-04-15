import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../FirebaseConection";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const lista = [];

        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });

        setUsuarios(lista);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    buscarUsuarios();
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#f8f6f8] p-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#35122E] mb-6">Lista de Funcionários</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left divide-y divide-gray-200">
            <thead className="bg-[#6B256F] text-white text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Função</th>
                <th className="px-6 py-3">Criado em</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 even:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.nome}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 capitalize text-gray-700">{user.role}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.criadoEm?.toDate().toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6">
                    Nenhum funcionário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
