import React, { useEffect, useState,useRef  } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConection";
import { doc, getDoc,setDoc,updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState({});

const navigate = useNavigate();
const pdfRef = useRef();

// Buscar nome e role do usuário
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
    if (usuario) {
      const docRef = doc(db, "users", usuario.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setNome(dados.nome || "Usuário");

        if (dados.role === "admin") {
          setIsAdmin(true);
        }

        // 🔁 Busca os pontos quando usuário estiver logado
        await buscarPontos(usuario.uid);
      }
    }
  });

  return () => unsubscribe();
}, []);

async function buscarPontos(uid) {
  if (!uid) return;

  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];

  const docRef = doc(db, "registros", uid, "dias", dataFormatada);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setPontos(docSnap.data());
  } else {
    setPontos({});
  }
}

  async function baterPonto() {
    const user = auth.currentUser;
    const uid = user.uid;

    const agora = new Date();
    const dataFormatada = agora.toISOString().split("T")[0];
    const horaFormatada = agora.toTimeString().split(" ")[0].slice(0, 5);

    const docRef = doc(db, "registros", uid, "dias", dataFormatada);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        entrada: horaFormatada,
      });
      alert("Entrada registrada com sucesso!");
    } else {
      const dados = docSnap.data();

      if (!dados.inicioAlmoco) {
        await updateDoc(docRef, { inicioAlmoco: horaFormatada });
        alert("Início do almoço registrado!");
      } else if (!dados.voltaAlmoco) {
        await updateDoc(docRef, { voltaAlmoco: horaFormatada });
        alert("Volta do almoço registrada!");
      } else if (!dados.inicioCafe) {
        await updateDoc(docRef, { inicioCafe: horaFormatada });
        alert("Início do café registrado!");
      } else if (!dados.voltaCafe) {
        await updateDoc(docRef, { voltaCafe: horaFormatada });
        alert("Volta do café registrada!");
      } else if (!dados.saida) {
        await updateDoc(docRef, { saida: horaFormatada });
        alert("Saída registrada! Tenha um bom descanso 🌙");
      } else {
        alert("Todos os pontos do dia já foram registrados!");
      }
    }

    await buscarPontos(uid);
  }

  function horaParaMinutos(hora) {
    if (!hora) return 0;
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  }

  function calcularTotalTrabalhado(pontos) {
    const entrada = horaParaMinutos(pontos.entrada);
    const saida = horaParaMinutos(pontos.saida);
    const inicioAlmoco = horaParaMinutos(pontos.inicioAlmoco);
    const voltaAlmoco = horaParaMinutos(pontos.voltaAlmoco);
    const inicioCafe = horaParaMinutos(pontos.inicioCafe);
    const voltaCafe = horaParaMinutos(pontos.voltaCafe);
  
    const totalBruto = saida - entrada;
    const pausaAlmoco = voltaAlmoco - inicioAlmoco;
    const pausaCafe = voltaCafe - inicioCafe;
  
    const totalLiquido = totalBruto - pausaAlmoco - pausaCafe;
    return totalLiquido;
  }

  function formatarMinutos(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}min`;
  }
  

  async function gerarPDF() {
    const input = pdfRef.current;
  
    if (!input) return;
  
    // Adiciona classe que limpa estilos visuais incompatíveis
    input.classList.add("pdf-puro");
  
    try {
      const canvas = await html2canvas(input, {
        useCORS: true,
        backgroundColor: "#ffffff",
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("relatorio-do-dia.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      // Remove a classe depois de gerar
      input.classList.remove("pdf-puro");
    }
  }

  function compararEntradaSaida(pontos) {
    const entradaEsperada = "08:00";
    const saidaEsperada = "17:00";
  
    const entradaReal = pontos.entrada;
    const saidaReal = pontos.saida;
  
    if (!entradaReal || !saidaReal) return null;
  
    const minutosEntradaEsperada = horaParaMinutos(entradaEsperada);
    const minutosSaidaEsperada = horaParaMinutos(saidaEsperada);
    const minutosEntradaReal = horaParaMinutos(entradaReal);
    const minutosSaidaReal = horaParaMinutos(saidaReal);
  
    const diferencaEntrada = minutosEntradaEsperada - minutosEntradaReal;
    const diferencaSaida = minutosSaidaReal - minutosSaidaEsperada;
  
    return {
      entrada: diferencaEntrada,
      saida: diferencaSaida,
    };
  }

  function formatarMinutosParaHoraEmin(minutos) {
    const abs = Math.abs(minutos);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}min`;
  }
  
  
  

  return (
    <div className="min-h-screen flex bg-gray-100">

    {/* Sidebar */}
    <aside className="w-64 bg-[#35122E] text-white hidden md:flex flex-col p-6 space-y-6">
      <div className="text-2xl font-bold tracking-wide">PontoApp</div>
      <nav className="space-y-4">
        <a href="#" className="hover:text-[#D0E4AE]">Dashboard</a>
        <a href="#" className="hover:text-[#D0E4AE]">Relatórios</a>
        <a href="#" className="hover:text-[#D0E4AE]">Configurações</a>
      </nav>
      <div className="mt-auto text-sm text-gray-300">© 2025 Janiele Dev</div>
    </aside>
  
    {/* Conteúdo principal */}
    <main className="flex-1 p-6 md:p-10">
  
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#6B256F]">Bem-vinda, Janiele!</h1>
          <p className="text-gray-500">Resumo do seu dia</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/admin/registrar")}
            className="mt-4 md:mt-0 bg-[#6B256F] hover:bg-[#582158] text-white font-semibold py-2 px-5 rounded-xl shadow"
          >
            Acessar Painel Administrativo
          </button>
        )}
      </header>
  
      {/* Grid de cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
        {/* Status Entrada/Saída */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#6B256F]">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Status de Entrada/Saída</h2>
          {pontos.entrada && pontos.saida ? (
            (() => {
              const diferenca = compararEntradaSaida(pontos);
              return (
                <>
                  <p className={`font-medium ${diferenca.entrada >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Entrada: {formatarMinutosParaHoraEmin(diferenca.entrada)} {diferenca.entrada >= 0 ? "adiantado" : "atrasado"}
                  </p>
                  <p className={`font-medium ${diferenca.saida >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    Saída: {formatarMinutosParaHoraEmin(diferenca.saida)} {diferenca.saida >= 0 ? "mais tarde" : "mais cedo"}
                  </p>
                </>
              );
            })()
          ) : (
            <p className="text-gray-500">Ponto incompleto para calcular horário</p>
          )}
        </div>
  
        {/* Cronômetro de almoço */}
        <div className="bg-[#D0E4AE] p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="text-2xl font-bold text-[#194B32] mb-2">00:30:00</div>
          <p className="text-[#194B32] mb-4">Faltam 30 minutos para o almoço</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#194B32] hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Notificar no WhatsApp
          </button>
        </div>
  
        {/* Registro de Ponto */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-[#35122E] mb-4">Registro de Ponto</h2>
          <button
            onClick={baterPonto}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            Bater Ponto
          </button>
        </div>
      </div>
  
      {/* Grid com pontos do dia e jornada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
  
        {/* Pontos do Dia */}
        <div ref={pdfRef} className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-[#35122E] mb-4">Pontos do Dia {new Date().toLocaleDateString()}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p>Entrada: {pontos.entrada || "--:--"}</p>
              <p>Início Almoço: {pontos.inicioAlmoco || "--:--"}</p>
              <p>Volta Almoço: {pontos.voltaAlmoco || "--:--"}</p>
            </div>
            <div>
              <p>Início Café: {pontos.inicioCafe || "--:--"}</p>
              <p>Fim Café: {pontos.voltaCafe || "--:--"}</p>
              <p className="font-semibold">Saída: {pontos.saida || "--:--"}</p>
            </div>
          </div>
        </div>
  
        {/* Resumo da Jornada */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-[#35122E] mb-4">Resumo de Jornada</h2>
          {pontos.entrada && pontos.saida ? (
            <>
              <p className="text-gray-800 text-lg mb-2">
                Total trabalhado: <span className="font-bold">
                  {formatarMinutos(calcularTotalTrabalhado(pontos))}
                </span>
              </p>
              {8 * 60 - calcularTotalTrabalhado(pontos) > 0 ? (
                <p className="text-red-600 text-lg">
                  Você ainda deve{" "}
                  <span className="font-bold">
                    {formatarMinutos(8 * 60 - calcularTotalTrabalhado(pontos))}
                  </span>
                </p>
              ) : (
                <p className="text-green-600 text-lg">
                  Você excedeu{" "}
                  <span className="font-bold">
                    {formatarMinutos(Math.abs(8 * 60 - calcularTotalTrabalhado(pontos)))}
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-lg">Jornada incompleta</p>
          )}
        </div>
      </div>
  
      {/* Botões de Relatório */}
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={gerarPDF}
          className="bg-[#9384DB] hover:bg-indigo-600 text-white font-bold py-2 px-5 rounded-xl"
        >
          Baixar Relatório do Dia
        </button>
        <button
          className="bg-[#6B256F] hover:bg-[#582158] text-white font-bold py-2 px-5 rounded-xl"
        >
          Baixar Relatório Mensal
        </button>
      </div>
  
    </main>
    </div>
   
   

  );
};
