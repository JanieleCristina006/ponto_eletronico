// React
import React, { useEffect, useRef, useState } from "react";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConection";

// Navegação
import { useNavigate } from "react-router-dom";

// Bibliotecas externas
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FiXCircle, FiTrendingUp, FiLogIn,
  FiLogOut,
  FiCoffee,
  FiSun,
  FiMoon,
  FiClock,
} from 'react-icons/fi';
import { BiTimeFive } from "react-icons/bi";

import Logo from '../../assets/image.png'


// Ícones
import { Clock } from "lucide-react";



// Componentes
import { AcoesRelatorio } from "../../components/AcoesRelatorio";
import { CardProximaAcao } from "../../components/CardProximaAcao";
import { CardRelatorioPonto } from "../../components/CardRelatorioPonto";
import { CardResumo } from "../../components/CardResumo";
import { CardResumoJornada } from "../../components/CardResumoJornada";
import { GraficoJornada } from "../../components/GraficoJornada";
import { Header } from "../../components/Header";
import { StatusEntradaSaida } from "../../components/StatusEntradaSaida";


export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState({});
  const [mensagemCard, setMensagemCard] = useState("");
  const [tempoCard, setTempoCard] = useState(null);
  const [tempoTrabalhadoAtual, setTempoTrabalhadoAtual] = useState(null);
  const [totalFaltas, setTotalFaltas] = useState(0);



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

    async function verificarFaltas() {
      const user = auth.currentUser;
      if (!user) return;
  
      const totalFaltas = await contarFaltas(user.uid);
      setTotalFaltas(totalFaltas);
    }

    return () => unsubscribe();
    verificarFaltas();
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
  
      // 🔄 Tempo trabalhado ao vivo
      if (pontos.entrada && !pontos.saida) {
        const entrada = criarData(pontos.entrada);
  
        let pausas = 0;
        if (pontos.inicioAlmoco && pontos.voltaAlmoco) {
          pausas += horaParaMinutos(pontos.voltaAlmoco) - horaParaMinutos(pontos.inicioAlmoco);
        }
        if (pontos.inicioCafe && pontos.voltaCafe) {
          pausas += horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe);
        }
  
        const diffMinutos = Math.floor((agora - entrada) / 60000);
        const tempoReal = diffMinutos - pausas;
        setTempoTrabalhadoAtual(tempoReal > 0 ? tempoReal : 0);
      }
  
      // Mensagens de ações
      if (pontos.entrada && !pontos.inicioAlmoco) {
        const entrada = criarData(pontos.entrada);
        const horaAlmocoPrevista = new Date(entrada.getTime() + 4 * 60 * 60 * 1000);
        const segundos = Math.floor((horaAlmocoPrevista - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para o almoço`);
        setTempoCard(segundos);
      } else if (pontos.inicioAlmoco && !pontos.voltaAlmoco) {
        const inicio = criarData(pontos.inicioAlmoco);
        const restante = calcularRestante(inicio, 60);
        const minutos = Math.floor(restante / 60);
        setMensagemCard(`Faltam ${minutos} minutos para voltar do almoço`);
        setTempoCard(restante);
      } else if (pontos.voltaAlmoco && !pontos.inicioCafe) {
        const volta = criarData(pontos.voltaAlmoco);
        const horaCafePrevista = new Date(volta.getTime() + 2 * 60 * 60 * 1000);
        const segundos = Math.floor((horaCafePrevista - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para o café`);
        setTempoCard(segundos);
      } else if (pontos.inicioCafe && !pontos.voltaCafe) {
        const inicio = criarData(pontos.inicioCafe);
        const restante = calcularRestante(inicio, 15);
        const minutos = Math.floor(restante / 60);
        setMensagemCard(`Faltam ${minutos} minutos para voltar do café`);
        setTempoCard(restante);
      } else if (pontos.voltaCafe && !pontos.saida) {
        const entrada = criarData(pontos.entrada);
        const fimPrevisto = new Date(entrada.getTime() + 8 * 60 * 60 * 1000);
        const segundos = Math.floor((fimPrevisto - agora) / 1000);
        const minutos = Math.floor(segundos / 60);
        setMensagemCard(`Faltam ${minutos} minutos para finalizar sua jornada`);
        setTempoCard(segundos);
      } else if (pontos.saida) {
        setMensagemCard("Parabéns! Jornada concluída 🥳");
        setTempoCard(null);
      }
  
    }, 1000);
  
    return () => clearInterval(intervalo);
  }, [pontos]);
  
  function getDiasUteisDoMes() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
  
    const diasUteis = [];
  
    const totalDias = new Date(ano, mes + 1, 0).getDate();
  
    for (let dia = 1; dia <= totalDias; dia++) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
  
      if (diaSemana !== 0 && diaSemana !== 6) {
        const dataFormatada = data.toISOString().split("T")[0];
        diasUteis.push(dataFormatada);
      }
    }
  
    return diasUteis;
  }

  async function contarFaltas(uid) {
    const diasUteis = getDiasUteisDoMes();
    let faltas = 0;
  
    for (const dia of diasUteis) {
      const docRef = doc(db, "registros", uid, "dias", dia);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        faltas++;
      }
    }
  
    return faltas;
  }
  
  
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
  
 

  function compararEntradaSaida(pontos) {
    const entradaEsperada = "08:00";
    const saidaEsperada = "18:00";
  
    const entradaReal = pontos.entrada;
    const saidaReal = pontos.saida;
  
    if (!entradaReal || !saidaReal) return null;
  
    const entradaEsperadaMin = horaParaMinutos(entradaEsperada);
    const saidaEsperadaMin = horaParaMinutos(saidaEsperada);
    const entradaRealMin = horaParaMinutos(entradaReal);
    const saidaRealMin = horaParaMinutos(saidaReal);
  
    return {
      entrada: entradaEsperadaMin - entradaRealMin, // positivo = adiantado, negativo = atrasado
      saida: saidaRealMin - saidaEsperadaMin,        // positivo = mais tarde, negativo = mais cedo
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

  function calcularTempoTrabalhadoAoVivo(pontos) {
    const agora = new Date();
    const [h, m] = pontos.entrada.split(":").map(Number);
    const entrada = new Date();
    entrada.setHours(h, m, 0, 0);
  
    let pausas = 0;
  
    if (pontos.inicioAlmoco && pontos.voltaAlmoco) {
      pausas += horaParaMinutos(pontos.voltaAlmoco) - horaParaMinutos(pontos.inicioAlmoco);
    }
  
    if (pontos.inicioCafe && pontos.voltaCafe) {
      pausas += horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe);
    }
  
    const diffMinutos = Math.floor((agora - entrada) / 60000);
    const tempoReal = diffMinutos - pausas;
  
    return tempoReal > 0 ? tempoReal : 0;
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
         <div className="flex-1 p-6 md:p-10 space-y-10 w-full bg-[#F8FAFC]">
            {/* Header */}
            <Header
              nome={nome}
              isAdmin={isAdmin}
              onClickAdmin={() => navigate("/admin/registrar")}
            />

            {/* Grid principal com Pontos do Dia + Cards Resumo Rápido */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              
              {/* Pontos do Dia */}
              <div className="bg-white shadow-md rounded-2xl p-6 xl:col-span-2 flex flex-col lg:flex-row items-center justify-between gap-8">
                  {/* Texto e pontos */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Pontos do Dia {new Date().toLocaleDateString()}
                    </h2>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FiLogIn className="text-[#4F46E5]" />
                        Entrada: <span className="font-medium text-gray-800">{pontos.entrada || "--"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiSun className="text-yellow-500" />
                        Início Almoço: <span className="font-medium text-gray-800">{pontos.inicioAlmoco || "--"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiSun className="text-yellow-500" />
                        Volta Almoço: <span className="font-medium text-gray-800">{pontos.voltaAlmoco || "--"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiCoffee className="text-orange-500" />
                        Início Café: <span className="font-medium text-gray-800">{pontos.inicioCafe || "--"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiCoffee className="text-orange-500" />
                        Fim Café: <span className="font-medium text-gray-800">{pontos.fimCafe || "--"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FiLogOut className="text-red-500" />
                        Saída: <span className="font-medium text-gray-800">{pontos.saida || "--"}</span>
                      </p>
                    </div>

                    <button
                      onClick={baterPonto}
                      className="mt-6 inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 transition-colors text-white font-medium py-2 px-4 rounded-lg shadow"
                    >
                      <FiClock className="w-5 h-5" />
                      Registrar Ponto
                    </button>
                  </div>

                  {/* Ilustração */}
                  <div className="hidden lg:block w-44 xl:w-52">
                    <img
                      src={Logo}
                      alt="Ilustração ponto eletrônico"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
              </div>

              {/* Cards Resumo Rápido (vertical alinhado com o card principal) */}
              <div className="flex flex-col gap-4 h-full self-stretch">
              <CardResumo
                  icone={<BiTimeFive className="text-xl" />}
                  titulo="Tempo Trabalhado"
                  valor={
                    pontos.saida
                      ? formatarMinutos(calcularTotalTrabalhado(pontos))
                      : tempoTrabalhadoAtual !== null
                        ? formatarMinutos(tempoTrabalhadoAtual)
                        : "--:--"
                  }
                  corIcone="text-[#10B981]"
              />


              <CardResumo
                icone={<FiXCircle className="text-xl" />}
                titulo="Faltas"
                valor={`${totalFaltas} ${totalFaltas === 1 ? "dia" : "dias"}`}
                corIcone="text-[#EF4444]"
              />


              <CardResumo
                icone={<FiTrendingUp className="text-xl" />}
                titulo="Horas Extras"
                valor={
                  pontos.saida
                    ? formatarMinutos(calcularHorasExtras(pontos))
                    : "0h 00min"
                }
                corIcone="text-[#6366F1]"
              />

              </div>
            </div>

            {/* Cards Detalhados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatusEntradaSaida
                pontos={pontos}
                compararEntradaSaida={compararEntradaSaida}
                formatarMinutosParaHoraEmin={formatarMinutosParaHoraEmin}
              />
              <CardProximaAcao
                tempoCard={tempoCard}
                mensagemCard={mensagemCard}
                onNotificar={() => setShowModal(true)}
              />
              <CardResumoJornada
                pontos={pontos}
                calcularTotalTrabalhado={calcularTotalTrabalhado}
                calcularHorasExtras={calcularHorasExtras}
                formatarMinutos={formatarMinutos}
              />
            </div>

            {/* Gráfico Jornada Semanal */}
            <GraficoJornada dados={dadosGrafico} />
         </div>
 



    </>
  )

}
