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
import {
  FiXCircle,
  FiTrendingUp,
  FiLogIn,
  FiLogOut,
  FiCoffee,
  FiSun,
  FiMoon,
  FiClock,
} from "react-icons/fi";
import { BiTimeFive } from "react-icons/bi";

import Logo from "../../assets/image.png";

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

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        const fim = new Date(
          inicio.getTime() + minutosParaSegundos(duracaoMinutos) * 1000
        );
        return Math.max(0, Math.floor((fim - agora) / 1000));
      }

      // 🔄 Tempo trabalhado ao vivo
      if (pontos.entrada && !pontos.saida) {
        const entrada = criarData(pontos.entrada);

        let pausas = 0;
        if (pontos.inicioAlmoco && pontos.voltaAlmoco) {
          pausas +=
            horaParaMinutos(pontos.voltaAlmoco) -
            horaParaMinutos(pontos.inicioAlmoco);
        }
        if (pontos.inicioCafe && pontos.voltaCafe) {
          pausas +=
            horaParaMinutos(pontos.voltaCafe) -
            horaParaMinutos(pontos.inicioCafe);
        }

        const diffMinutos = Math.floor((agora - entrada) / 60000);
        const tempoReal = diffMinutos - pausas;
        setTempoTrabalhadoAtual(tempoReal > 0 ? tempoReal : 0);
      }

      // Mensagens de ações
      if (pontos.entrada && !pontos.inicioAlmoco) {
        const entrada = criarData(pontos.entrada);
        const horaAlmocoPrevista = new Date(
          entrada.getTime() + 4 * 60 * 60 * 1000
        );
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
      toast.success("Entrada registrada com sucesso!");
    } else {
      const dados = docSnap.data();

      if (!dados.inicioAlmoco) {
        await updateDoc(docRef, { inicioAlmoco: horaFormatada });
        toast.success("Início do almoço registrado!");
      } else if (!dados.voltaAlmoco) {
        await updateDoc(docRef, { voltaAlmoco: horaFormatada });
        toast.success("Volta do almoço registrada!");
      } else if (!dados.inicioCafe) {
        await updateDoc(docRef, { inicioCafe: horaFormatada });
        toast.success("Início do café registrado!");
      } else if (!dados.voltaCafe) {
        await updateDoc(docRef, { voltaCafe: horaFormatada });
        toast.success("Volta do café registrada!");
      } else if (!dados.saida) {
        await updateDoc(docRef, { saida: horaFormatada });
        toast.success("Saída registrada! Tenha um bom descanso 🌙");
      } else {
        toast.success("Todos os pontos do dia já foram registrados!");
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

    const resultado = {};

    if (entradaReal) {
      const entradaEsperadaMin = horaParaMinutos(entradaEsperada);
      const entradaRealMin = horaParaMinutos(entradaReal);
      resultado.entrada = entradaEsperadaMin - entradaRealMin;
    }

    if (saidaReal) {
      const saidaEsperadaMin = horaParaMinutos(saidaEsperada);
      const saidaRealMin = horaParaMinutos(saidaReal);
      resultado.saida = saidaRealMin - saidaEsperadaMin;
    }

    return resultado;
  }

  function formatarMinutosParaHoraEmin(minutos) {
    const abs = Math.abs(minutos);
    const h = Math.floor(abs / 60);
    const m = abs % 60;

    if (h === 0) {
      return `${m}min`;
    }

    return `${h}h ${String(m).padStart(2, "0")}min`;
  }

  function formatarSegundos(segundos) {
    if (segundos <= 0) return "00:00:00";

    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  }

  function calcularHorasExtras(pontos) {
    const entrada = horaParaMinutos(pontos.entrada);
    const saida = horaParaMinutos(pontos.saida);

    if (!entrada || !saida) return null;

    const pausaAlmoco =
      horaParaMinutos(pontos.voltaAlmoco) -
      horaParaMinutos(pontos.inicioAlmoco || "00:00");
    const pausaCafe =
      horaParaMinutos(pontos.voltaCafe) -
      horaParaMinutos(pontos.inicioCafe || "00:00");

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
      pausas +=
        horaParaMinutos(pontos.voltaAlmoco) -
        horaParaMinutos(pontos.inicioAlmoco);
    }

    if (pontos.inicioCafe && pontos.voltaCafe) {
      pausas +=
        horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe);
    }

    const diffMinutos = Math.floor((agora - entrada) / 60000);
    const tempoReal = diffMinutos - pausas;

    return tempoReal > 0 ? tempoReal : 0;
  }

  const dadosGrafico = [
    { dia: "Seg", minutos: 480 },
    { dia: "Ter", minutos: 450 },
    { dia: "Qua", minutos: 500 },
    { dia: "Qui", minutos: 470 },
    { dia: "Sex", minutos: 495 },
  ];

  return (
    <>
      
      <div className="flex-1 p-6 space-y-6 w-full bg-[#F8FAFC]">
      <ToastContainer />
        {/* Header */}
        <Header
          nome={nome}
          isAdmin={isAdmin}
          onClickAdmin={() => navigate("/admin")}
        />

        {/* Grid principal com Pontos do Dia e Resumo Geral */}
        <div className="grid xl:grid-cols-3 gap-4 items-start">
          {/* Card: Pontos do Dia */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-8 col-span-1 xl:col-span-2 h-full">
            {/* Texto e pontos */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Pontos do Dia {new Date().toLocaleDateString()}
              </h2>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FiLogIn className="text-[#4F46E5]" />
                  Entrada:{" "}
                  <span className="font-medium text-gray-800">
                    {pontos.entrada || "--"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FiSun className="text-yellow-500" />
                  Início Almoço:{" "}
                  <span className="font-medium text-gray-800">
                    {pontos.inicioAlmoco || "--"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FiSun className="text-yellow-500" />
                  Volta Almoço:{" "}
                  <span className="font-medium text-gray-800">
                    {pontos.voltaAlmoco || "--"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FiCoffee className="text-orange-500" />
                  Início Café:{" "}
                  <span className="font-medium text-gray-800">
                    {pontos.inicioCafe || "--"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FiCoffee className="text-orange-500" />
                  Fim Café:{" "}
                  <span className="font-medium text-gray-800">
                     {pontos.voltaCafe || "--"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FiLogOut className="text-red-500" />
                  Saída:{" "}
                  <span className="font-medium text-gray-800">
                    {pontos.saida || "--"}
                  </span>
                </p>
              </div>

              <button
                onClick={baterPonto}
                className="mt-6 inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 transition-colors text-white font-medium py-2 px-4 rounded-lg shadow cursor-pointer"
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

          {/* Card agrupado com os resumos */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-3 h-full">
            {/* Bloco: Tempo Trabalhado */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
              <BiTimeFive className="text-[#10B981] text-2xl" />
              <div>
                <p className="text-sm text-gray-500">Tempo Trabalhado</p>
                <p className="text-base font-bold text-gray-800">
                  {pontos.saida
                    ? formatarMinutos(calcularTotalTrabalhado(pontos))
                    : tempoTrabalhadoAtual !== null
                    ? formatarMinutos(tempoTrabalhadoAtual)
                    : "--:--"}
                </p>
              </div>
            </div>

            {/* Bloco: Faltas */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
              <FiXCircle className="text-[#EF4444] text-2xl" />
              <div>
                <p className="text-sm text-gray-500">Faltas</p>
                <p className="text-base font-bold text-gray-800">
                  {`${totalFaltas} ${totalFaltas === 1 ? "dia" : "dias"}`}
                </p>
              </div>
            </div>

            {/* Bloco: Horas Extras */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
              <FiTrendingUp className="text-[#6366F1] text-2xl" />
              <div>
                <p className="text-sm text-gray-500">Horas Extras</p>
                <p className="text-base font-bold text-gray-800">
                  {pontos.saida
                    ? formatarMinutos(calcularHorasExtras(pontos))
                    : "0h 00min"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Detalhados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
};
