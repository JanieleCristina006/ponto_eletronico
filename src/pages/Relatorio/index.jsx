import { useState } from "react";
import { FiDownload } from "react-icons/fi";

export const Relatorio = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const dados = [
    { data: "2025-04-10", entrada: "08:00", almocoInicio: "12:00", almocoFim: "13:00", cafe: "16:00", saida: "17:30", total: "08:30" },
    { data: "2025-04-11", entrada: "08:15", almocoInicio: "12:10", almocoFim: "13:10", cafe: "16:15", saida: "17:45", total: "08:00" },
  ];

  const baixarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, selecione o período do relatório.");
      return;
    }

    alert(`Gerando relatório de ${dataInicio} até ${dataFim}...`);
  };

  return (
    <div className="p-6">
      {/* Título e botão */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="ícone">📊</span> Relatório de Ponto
        </h1>
        <button
          onClick={baixarRelatorio}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          <FiDownload className="text-lg" />
          Baixar Relatório em PDF
        </button>
      </div>

      {/* Filtro de período */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
  <div className="flex flex-wrap gap-6">
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 font-medium mb-1">📅 Data de Início</label>
      <input
        type="date"
        className="max-w-[220px] border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 font-medium mb-1">📅 Data de Fim</label>
      <input
        type="date"
        className="max-w-[220px] border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
      />
    </div>
  </div>
  <p className="text-xs text-gray-400 mt-3">Selecione o intervalo de datas para visualizar os registros.</p>
</div>


      {/* Tabela de registros */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Entrada</th>
              <th className="px-6 py-3">Início Almoço</th>
              <th className="px-6 py-3">Fim Almoço</th>
              <th className="px-6 py-3">Café</th>
              <th className="px-6 py-3">Saída</th>
              <th className="px-6 py-3">Total do Dia</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((linha, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{linha.data}</td>
                <td className="px-6 py-3">{linha.entrada}</td>
                <td className="px-6 py-3">{linha.almocoInicio}</td>
                <td className="px-6 py-3">{linha.almocoFim}</td>
                <td className="px-6 py-3">{linha.cafe}</td>
                <td className="px-6 py-3">{linha.saida}</td>
                <td className="px-6 py-3 font-bold">{linha.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
