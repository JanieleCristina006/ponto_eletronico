import React, { useEffect, useState,useRef  } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConection";
import { doc, getDoc,setDoc,updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Briefcase, Clock, Download, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sidebar } from '../../components/Sidebar'



export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState({});
  const [mensagemCard, setMensagemCard] = useState("");
  const [tempoCard, setTempoCard] = useState(null); // segundos
  const [avisado, setAvisado] = useState(false);



const navigate = useNavigate();
const pdfRef = useRef();

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
          await buscarPontos(usuario.uid);
        }
      }
    });

    return () => unsubscribe();
  }, []);

 
  useEffect(() => {
    if (!pontos.entrada) return;
  
    const intervalo = setInterval(() => {
      const agora = new Date();
  
      function criarData(horaStr) {
        const [h, m] = horaStr.split(":").map(Number);
        const data = new Date();
        data.setHours(h, m, 0, 0);
        return data;
      }
  
      function minutosParaSegundos(min) {
        return min * 60;
      }
  
      function calcularRestante(inicio, duracaoMinutos) {
        const fim = new Date(inicio.getTime() + minutosParaSegundos(duracaoMinutos) * 1000);
        return Math.max(0, Math.floor((fim - agora) / 1000));
      }
  
      // 1. Entrada → ainda não iniciou almoço
      if (pontos.entrada && !pontos.inicioAlmoco) {
        const entrada = criarData(pontos.entrada);
        const horaAlmocoPrevista = new Date(entrada.getTime() + 4 * 60 * 60 * 1000); // 4h após entrada
        const segundos = Math.floor((horaAlmocoPrevista - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para o almoço`);
        setTempoCard(segundos);
      }
  
      // 2. Iniciou almoço → ainda não voltou
      else if (pontos.inicioAlmoco && !pontos.voltaAlmoco) {
        const inicio = criarData(pontos.inicioAlmoco);
        const restante = calcularRestante(inicio, 60); // 1h de almoço
        const minutos = Math.floor(restante / 60);
        setMensagemCard(`Faltam ${minutos} minutos para voltar do almoço`);
        setTempoCard(restante);
      }
  
      // 3. Voltou do almoço → ainda não foi para o café
      else if (pontos.voltaAlmoco && !pontos.inicioCafe) {
        const volta = criarData(pontos.voltaAlmoco);
        const horaCafePrevista = new Date(volta.getTime() + 2 * 60 * 60 * 1000); // 2h depois
        const segundos = Math.floor((horaCafePrevista - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para o café`);
        setTempoCard(segundos);
      }
  
      // 4. Início do café → ainda não voltou
      else if (pontos.inicioCafe && !pontos.voltaCafe) {
        const inicio = criarData(pontos.inicioCafe);
        const restante = calcularRestante(inicio, 15); // 15 min de café
        const minutos = Math.floor(restante / 60);
        setMensagemCard(`Faltam ${minutos} minutos para voltar do café`);
        setTempoCard(restante);
      }
  
      // 5. Voltou do café → ainda não saiu
      else if (pontos.voltaCafe && !pontos.saida) {
        const entrada = criarData(pontos.entrada);
        const fimPrevisto = new Date(entrada.getTime() + 8 * 60 * 60 * 1000); // 8h de jornada
        const segundos = Math.floor((fimPrevisto - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para finalizar sua jornada`);
        setTempoCard(segundos);
      }
  
      // 6. Jornada completa
      else if (pontos.saida) {
        setMensagemCard("Parabéns! Jornada concluída 🥳");
        setTempoCard(null);
      }
  
    }, 1000);
  
    return () => clearInterval(intervalo);
  }, [pontos]);
  
  
  
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

  function formatarSegundos(segundos) {
    if (segundos <= 0) return "00:00:00";
    
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
  
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function calcularHorasExtras(pontos) {
    const entrada = horaParaMinutos(pontos.entrada);
    const saida = horaParaMinutos(pontos.saida);
  
    if (!entrada || !saida) return null;
  
    const pausaAlmoco = horaParaMinutos(pontos.voltaAlmoco) - horaParaMinutos(pontos.inicioAlmoco || "00:00");
    const pausaCafe = horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe || "00:00");
  
    const jornadaTotal = saida - entrada;
    const jornadaLiquida = jornadaTotal - pausaAlmoco - pausaCafe;
  
    const excedente = jornadaLiquida - 480; // 480 minutos = 8h
  
    return excedente > 0 ? excedente : 0;
  }

  const dadosGrafico = [
    { dia: 'Seg', minutos: 480 },
    { dia: 'Ter', minutos: 450 },
    { dia: 'Qua', minutos: 500 },
    { dia: 'Qui', minutos: 470 },
    { dia: 'Sex', minutos: 495 },
  ];
  
  
  

  return(
    <>
      

    <div className="min-h-screen bg-[#F1F5F9] text-gray-800 font-[Inter]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col gap-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#4F46E5]">PontoApp</h1>
          <nav className="flex flex-col gap-4 text-sm">
            <a href="#" className="text-gray-700 hover:text-[#4F46E5] font-medium">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-[#4F46E5] font-medium">Relatórios</a>
            <a href="#" className="text-gray-700 hover:text-[#4F46E5] font-medium">Configurações</a>
          </nav>
          <div className="mt-auto text-xs text-gray-400">© 2025 Janiele Dev</div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 space-y-10 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Bem-vinda, {nome}!</h2>
              <p className="text-sm text-gray-500">Resumo do seu dia</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/registrar")}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2 rounded-lg shadow"
              >
                Acessar Painel Administrativo
              </button>
            )}
          </div>

          {/* Cards Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
              <Briefcase className="text-[#4F46E5]" />
              <div>
                <p className="text-sm text-gray-500">Total de Pontos</p>
                <p className="text-lg font-bold">{Object.keys(pontos).length}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
              <Clock className="text-[#10B981]" />
              <div>
                <p className="text-sm text-gray-500">Tempo Trabalhado</p>
                <p className="text-lg font-bold">{pontos.saida ? formatarMinutos(calcularTotalTrabalhado(pontos)) : '--:--'}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
              <Download className="text-[#6366F1]" />
              <div>
                <p className="text-sm text-gray-500">Relatórios</p>
                <p className="text-lg font-bold">3</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
              <Activity className="text-[#F59E0B]" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-green-600">Online</p>
              </div>
            </div>
          </div>

          {/* Cards Detalhados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status de Entrada/Saída */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-base font-semibold mb-2">Status de Entrada/Saída</h3>
              {pontos.entrada && pontos.saida ? (() => {
                const diferenca = compararEntradaSaida(pontos);
                return (
                  <>
                    <p className={`text-sm ${diferenca.entrada >= 0 ? "text-green-600" : "text-red-600"}`}>Entrada: {formatarMinutosParaHoraEmin(diferenca.entrada)} {diferenca.entrada >= 0 ? "adiantado" : "atrasado"}</p>
                    <p className={`text-sm ${diferenca.saida >= 0 ? "text-blue-600" : "text-red-600"}`}>Saída: {formatarMinutosParaHoraEmin(diferenca.saida)} {diferenca.saida >= 0 ? "mais tarde" : "mais cedo"}</p>
                  </>
                );
              })() : <p className="text-sm text-gray-500">Ponto incompleto para calcular horário</p>}
            </div>

            {/* Próxima Ação */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-base font-semibold mb-2">Próxima Ação</h3>
              {typeof tempoCard === "number" && tempoCard > 0 ? (
                <>
                  <p className="text-xl font-bold text-gray-800">{formatarSegundos(tempoCard)}</p>
                  <p className="text-sm text-gray-500">{mensagemCard}</p>
                </>
              ) : <p className="text-sm text-gray-500">Hora da próxima ação! 🚀</p>}
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 w-full bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-md"
              >
                Notificar no WhatsApp
              </button>
            </div>

            {/* Jornada */}
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-base font-semibold mb-2">Resumo de Jornada</h3>
              {pontos.entrada && pontos.saida ? (() => {
                const total = calcularTotalTrabalhado(pontos);
                const horasExtras = calcularHorasExtras(pontos);
                const diferenca = 8 * 60 - total;
                return (
                  <>
                    <p className="text-sm mb-1">Total trabalhado: <strong>{formatarMinutos(total)}</strong></p>
                    {horasExtras > 0 ? (
                      <p className="text-sm text-green-600">Você fez <strong>{formatarMinutos(horasExtras)}</strong> de horas extras hoje 💪</p>
                    ) : (
                      <p className="text-sm text-red-600">Você ainda deve <strong>{formatarMinutos(Math.abs(diferenca))}</strong></p>
                    )}
                  </>
                );
              })() : <p className="text-sm text-gray-500">Jornada incompleta</p>}
            </div>
          </div>

          {/* Gráfico: Resumo Semanal */}
<div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
  <h3 className="text-base font-semibold mb-4">Resumo Semanal de Jornada</h3>
  <ResponsiveContainer width="100%" height={240}>
    <BarChart data={dadosGrafico} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dia" />
      <YAxis tickFormatter={(min) => `${Math.floor(min / 60)}h`} />
      <Tooltip formatter={(value) => `${Math.floor(value / 60)}h ${value % 60}min`} />
      <Bar dataKey="minutos" fill="#4F46E5" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>


          {/* Relatórios e Pontos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={pdfRef} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-base font-semibold mb-3">Pontos do Dia {new Date().toLocaleDateString()}</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <p>Entrada: {pontos.entrada || "--:--"}</p>
                  <p>Início Almoço: {pontos.inicioAlmoco || "--:--"}</p>
                  <p>Volta Almoço: {pontos.voltaAlmoco || "--:--"}</p>
                </div>
                <div>
                  <p>Início Café: {pontos.inicioCafe || "--:--"}</p>
                  <p>Fim Café: {pontos.voltaCafe || "--:--"}</p>
                  <p>Saída: {pontos.saida || "--:--"}</p>
                </div>
              </div>
              <button
                onClick={baterPonto}
                className="mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 w-full rounded-md"
              >
                Registrar Novo Ponto
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={gerarPDF}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white py-3 rounded-md shadow"
              >
                Baixar Relatório do Dia
              </button>
              <button
                className="bg-[#A855F7] hover:bg-[#9333EA] text-white py-3 rounded-md shadow"
              >
                Baixar Relatório Mensal
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

 
 


    </>
  )

}
