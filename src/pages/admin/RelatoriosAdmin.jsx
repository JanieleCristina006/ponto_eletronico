import React, { useState } from "react";

export const RelatoriosAdmin = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState("presenca");

  const dadosFalsos = [
    { nome: "João Silva", entradas: 20, horas: "160h", faltas: 1 },
    { nome: "Ana Costa", entradas: 22, horas: "176h", faltas: 0 },
    { nome: "Pedro Souza", entradas: 18, horas: "144h", faltas: 2 },
    { nome: "Marina Rocha", entradas: 21, horas: "168h", faltas: 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Relatórios Administrativos</h1>

      {/* Filtro de Tipo de Relatório */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2 font-medium">Selecionar Tipo de Relatório:</label>
        <select
          value={tipoRelatorio}
          onChange={(e) => setTipoRelatorio(e.target.value)}
          className="border rounded-lg p-2 w-full max-w-sm bg-white text-gray-700"
        >
          <option value="presenca">Presença</option>
          <option value="horas">Horas Trabalhadas</option>
          <option value="faltas">Faltas</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Funcionário</th>
              <th className="py-3 px-6 text-left">Entradas</th>
              <th className="py-3 px-6 text-left">Horas Trabalhadas</th>
              <th className="py-3 px-6 text-left">Faltas</th>
            </tr>
          </thead>
          <tbody>
            {dadosFalsos.map((usuario, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                <td className="py-4 px-6">{usuario.nome}</td>
                <td className="py-4 px-6">{usuario.entradas}</td>
                <td className="py-4 px-6">{usuario.horas}</td>
                <td className="py-4 px-6">{usuario.faltas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
