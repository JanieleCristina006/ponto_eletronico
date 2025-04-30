import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { auth, db } from "../../FirebaseConection";
import { collection, getDocs } from "firebase/firestore";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import IlustracaoVazia from "../../assets/sem-dados.svg";

// ⏱️ Funções utilitárias
const horaParaMinutos = (hora) => {
  if (!hora || hora === "--:--") return 0;
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

const calcularTotal = ({ entrada, saida, inicioAlmoco, voltaAlmoco }) => {
  const entradaMin = horaParaMinutos(entrada);
  const saidaMin = horaParaMinutos(saida);
  const almoco = horaParaMinutos(voltaAlmoco) - horaParaMinutos(inicioAlmoco || "00:00");
  const cafe = 15;
  const bruto = saidaMin - entradaMin;
  const liquido = bruto - almoco - cafe;

  if (entradaMin && saidaMin && liquido > 0) {
    const h = Math.floor(liquido / 60).toString().padStart(2, "0");
    const m = (liquido % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }
  return "--:--";
};

const formatarDataBonita = (data) => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

// 📄 Documento PDF
const DocumentoPDF = ({ registros }) => (
  <Document>
    <Page size="A4" style={estilos.page}>
      <Text style={estilos.title}>Relatório de Ponto</Text>
      <View style={[estilos.row, estilos.header]}>
        <Text style={estilos.cell}>Data</Text>
        <Text style={estilos.cell}>Entrada</Text>
        <Text style={estilos.cell}>Início Almoço</Text>
        <Text style={estilos.cell}>Fim Almoço</Text>
        <Text style={estilos.cell}>Café</Text>
        <Text style={estilos.cell}>Saída</Text>
        <Text style={estilos.cell}>Total</Text>
      </View>
      {registros.map((item, index) => (
        <View style={estilos.row} key={index}>
          <Text style={estilos.cell}>{item.data}</Text>
          <Text style={estilos.cell}>{item.entrada}</Text>
          <Text style={estilos.cell}>{item.inicioAlmoco}</Text>
          <Text style={estilos.cell}>{item.voltaAlmoco}</Text>
          <Text style={estilos.cell}>{item.cafe}</Text>
          <Text style={estilos.cell}>{item.saida}</Text>
          <Text style={estilos.cell}>{item.total}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

// 🎨 Estilos do PDF
const estilos = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 18, marginBottom: 10 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#eee", padding: 4 },
  cell: { flex: 1, fontSize: 10 },
  header: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
});

export const Relatorio = () => {
  const hoje = new Date().toISOString().split("T")[0];
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState(hoje);
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // segunda-feira da semana atual
    setDataInicio(d.toISOString().split("T")[0]);
    setDataFim(hoje);
  }, []);

  useEffect(() => {
    if (dataInicio && dataFim) buscarRegistros();
  }, [dataInicio, dataFim]);

  const buscarRegistros = async () => {
    setCarregando(true);
    const user = auth.currentUser;
    if (!user) return;

    const diasRef = collection(db, "registros", user.uid, "dias");
    const snapshot = await getDocs(diasRef);
    const lista = [];

    snapshot.forEach((doc) => {
      const dataDoc = doc.id;
      const info = doc.data();

      if (dataDoc >= dataInicio && dataDoc <= dataFim) {
        lista.push({
          data: formatarDataBonita(dataDoc),
          entrada: info.entrada || "--:--",
          inicioAlmoco: info.inicioAlmoco || "--:--",
          voltaAlmoco: info.voltaAlmoco || "--:--",
          cafe: info.inicioCafe || "--:--",
          saida: info.saida || "--:--",
          total: calcularTotal({
            entrada: info.entrada,
            saida: info.saida,
            inicioAlmoco: info.inicioAlmoco,
            voltaAlmoco: info.voltaAlmoco,
          }),
        });
      }
    });

    lista.sort((a, b) => a.data.localeCompare(b.data));
    setDados(lista);
    setCarregando(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📊 Relatório de Ponto
        </h1>
        {!carregando && dados.length > 0 && (
          <PDFDownloadLink
            document={<DocumentoPDF registros={dados} />}
            fileName="relatorio-ponto.pdf"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
          >
            {({ loading }) =>
              loading ? "Gerando PDF..." : (<><FiDownload /> Baixar PDF</>)
            }
          </PDFDownloadLink>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">📅 Data de Início</label>
            <input
              type="date"
              value={dataInicio}
              max={hoje}
              onChange={(e) => setDataInicio(e.target.value)}
              className="max-w-[220px] border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">📅 Data de Fim</label>
            <input
              type="date"
              value={dataFim}
              max={hoje}
              onChange={(e) => setDataFim(e.target.value)}
              className="max-w-[220px] border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Selecione o intervalo de datas para visualizar os registros.
        </p>
      </div>

      {/* Tabela ou mensagem */}
      {!carregando && dados.length > 0 ? (
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
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((linha, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{linha.data}</td>
                  <td className="px-6 py-3">{linha.entrada}</td>
                  <td className="px-6 py-3">{linha.inicioAlmoco}</td>
                  <td className="px-6 py-3">{linha.voltaAlmoco}</td>
                  <td className="px-6 py-3">{linha.cafe}</td>
                  <td className="px-6 py-3">{linha.saida}</td>
                  <td className="px-6 py-3 font-bold">{linha.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !carregando && (
        <div className="text-center mt-10">
          <img src={IlustracaoVazia} alt="Sem dados" className="mx-auto w-60 h-auto mb-4" />
          <p className="text-sm text-gray-500">Nenhum ponto encontrado nesse período.</p>
        </div>
      )}
    </div>
  );
};
