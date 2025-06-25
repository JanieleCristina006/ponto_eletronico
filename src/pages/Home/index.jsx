
import React, { useEffect, useRef, useState } from "react";


import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConection";
import { GraficoResumo } from "../../components/GraficoPizza";


import { useNavigate } from "react-router-dom";


import {
  FiXCircle,
  FiTrendingUp,
  FiLogIn,
  FiLogOut,
  FiCoffee,
  FiSun,
  FiClock,
} from "react-icons/fi";


import Logo from "../../assets/image.png";

import { CardProgressoJornada } from "../../components/CardProgressoJornada";
import { CardHorasExtras } from "../../components/CardResumoJornada";
import { GraficoJornada } from "../../components/GraficoJornada";
import { Header } from "../../components/Header";
import { StatusEntradaSaida } from "../../components/StatusEntradaSaida";
import { Footer } from "../../components/Footer/inde";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState(null);

  const [mensagemCard, setMensagemCard] = useState("");
  const [tempoCard, setTempoCard] = useState(null);
  const [tempoTrabalhadoAtual, setTempoTrabalhadoAtual] = useState(null);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [tipoAcao, setTipoAcao] = useState("cafe");
  const [horarioAcao, setHorarioAcao] = useState("15:30");
  const [acaoConcluida, setAcaoConcluida] = useState(false);
  const [diasPontuais, setDiasPontuais] = useState(0);
  const [diasAtrasados, setDiasAtrasados] = useState(0);
  const [horasExtrasDoMes, setHorasExtrasDoMes] = useState(0);




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
          } else {
          
            setNome("Visitante");
          }

          
          await buscarPontos(usuario.uid);

          setTimeout(() => {
            verificarFaltas(usuario.uid);
            verificarPontualidade(usuario.uid);
            calcularHorasExtrasDoMes(usuario.uid);
          }, 500);
        }
      });

      return () => unsubscribe();
    }, []);

  async function verificarFaltas(uid) {
    if (!uid) return;
    const total = await contarFaltas(uid);
    setTotalFaltas(total);
  }
  

  useEffect(() => {
     if (!pontos || !pontos.entrada) return; 
  
    const intervalo = setInterval(() => {
      const agora = new Date();
  
      function criarData(horaStr) {
        const [h, m] = horaStr.split(":").map(Number);
        const data = new Date();
        data.setHours(h, m, 0, 0);
        return data;
      }
  
      function formatarHora(date) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
  
      function segundosRestantes(futuro) {
        return Math.max(0, Math.floor((futuro - new Date()) / 1000));
      }
  
      function minutosParaSegundos(min) {
        return min * 60;
      }
  
      function calcularRestante(inicio, duracaoMinutos) {
        const fim = new Date(inicio.getTime() + minutosParaSegundos(duracaoMinutos) * 1000);
        return Math.max(0, Math.floor((fim - agora) / 1000));
      }
  
      // 🔄 Atualizar tempo trabalhado ao vivo
      if (pontos.entrada && !pontos.saida) {
        const entrada = criarData(pontos.entrada);
  
        let pausas = 0;

        // Pausa almoço
        if (pontos.inicioAlmoco) {
          if (pontos.voltaAlmoco) {
            pausas += horaParaMinutos(pontos.voltaAlmoco) - horaParaMinutos(pontos.inicioAlmoco);
          } else {
            pausas += Math.floor((agora - criarData(pontos.inicioAlmoco)) / 60000);
          }
        }
        
        // Pausa café
        if (pontos.inicioCafe) {
          if (pontos.voltaCafe) {
            pausas += horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe);
          } else {
            pausas += Math.floor((agora - criarData(pontos.inicioCafe)) / 60000);
          }
        }
        
  
                const diffMilissegundos = agora - entrada;
        if (diffMilissegundos > 0) {
          const diffMinutos = Math.floor(diffMilissegundos / 60000);
          const tempoReal = diffMinutos - pausas;
          setTempoTrabalhadoAtual(tempoReal > 0 ? tempoReal : 0);
        } else {
          setTempoTrabalhadoAtual(0); // Evita tempo negativo
        }

      }
  
      // 🔁 Atualizar mensagem do card e tempo
      if (pontos.entrada && !pontos.inicioAlmoco) {
        const entrada = criarData(pontos.entrada);
        const horaAlmoco = new Date(entrada.getTime() + 4 * 60 * 60 * 1000);
        const segundos = segundosRestantes(horaAlmoco);
        setMensagemCard(`Faltam ${Math.floor(segundos / 60)} minutos para o almoço`);
        setTempoCard(segundos);
      } else if (pontos.inicioAlmoco && !pontos.voltaAlmoco) {
        const inicio = criarData(pontos.inicioAlmoco);
        const restante = calcularRestante(inicio, 60);
        setMensagemCard(`Faltam ${Math.floor(restante / 60)} minutos para voltar do almoço`);
        setTempoCard(restante);
      } else if (pontos.voltaAlmoco && !pontos.inicioCafe) {
        const volta = criarData(pontos.voltaAlmoco);
        const horaCafe = new Date(volta.getTime() + 2 * 60 * 60 * 1000);
        const segundos = segundosRestantes(horaCafe);
        setMensagemCard(`Faltam ${Math.floor(segundos / 60)} minutos para o café`);
        setTempoCard(segundos);
      } else if (pontos.inicioCafe && !pontos.voltaCafe) {
        const inicio = criarData(pontos.inicioCafe);
        const restante = calcularRestante(inicio, 15);
        setMensagemCard(`Faltam ${Math.floor(restante / 60)} minutos para voltar do café`);
        setTempoCard(restante);
      } else if (pontos.voltaCafe && !pontos.saida) {
        const entrada = criarData(pontos.entrada);
        const fimJornada = new Date(entrada.getTime() + 8 * 60 * 60 * 1000);
        const segundos = segundosRestantes(fimJornada);
        setMensagemCard(`Faltam ${Math.floor(segundos / 60)} minutos para finalizar sua jornada`);
        setTempoCard(segundos);
      } else if (pontos.saida) {
        setMensagemCard("Parabéns! Jornada concluída 🥳");
        setTempoCard(null);
      }

      if (pontos.entrada && !pontos.inicioCafe) {
        const entrada = criarData(pontos.entrada);
        const cafePrevisto = new Date(entrada.getTime() + 6 * 60 * 60 * 1000);
        setTipoAcao("cafe");
        setHorarioAcao(formatarHora(cafePrevisto));
        setAcaoConcluida(false);
      } else if (pontos.inicioCafe && !pontos.voltaCafe) {
        const inicioCafe = criarData(pontos.inicioCafe);
        const fimPrevisto = new Date(inicioCafe.getTime() + 15 * 60 * 1000);
        setTipoAcao("voltaCafe");
        setHorarioAcao(formatarHora(fimPrevisto));
        setAcaoConcluida(false);
      } else if (pontos.voltaCafe) {
        setTipoAcao("cafe");
        setHorarioAcao("--:--");
        setAcaoConcluida(true);
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

  async function verificarPontualidade(uid) {
    const diasUteis = getDiasUteisDoMes();
    const hoje = new Date().toISOString().split("T")[0];
    const diasDaSemana = diasUteis.filter((d) => d <= hoje).slice(-5); // últimos 5 dias úteis
  
    let pontuais = 0;
    let atrasados = 0;
  
    for (const dia of diasDaSemana) {
      const docRef = doc(db, "registros", uid, "dias", dia);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const dados = docSnap.data();
        const entrada = dados.entrada;
        if (entrada) {
          const minutos = horaParaMinutos(entrada);
          const atraso = minutos - horaParaMinutos("08:00");
  
          if (atraso <= 5) {
            pontuais++;
          } else {
            atrasados++;
          }
        }
      }
    }
  
    setDiasPontuais(pontuais);
    setDiasAtrasados(atrasados);
  }

  async function calcularHorasExtrasDoMes(uid) {
    const diasUteis = getDiasUteisDoMes();
    let totalExtras = 0;
  
    for (const dia of diasUteis) {
      const docRef = doc(db, "registros", uid, "dias", dia);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const dados = docSnap.data();
  
        if (dados.entrada && dados.saida) {
          const extras = calcularHorasExtras(dados);
          totalExtras += extras;
        }
      }
    }
  
    setHorasExtrasDoMes(totalExtras);
  }


  const dadosGrafico = [
    { dia: "Seg", minutos: 480 },
    { dia: "Ter", minutos: 450 },
    { dia: "Qua", minutos: 500 },
    { dia: "Qui", minutos: 470 },
    { dia: "Sex", minutos: 495 },
  ];

  if (pontos === null) {
  return (
    <div className="flex justify-center items-center h-screen text-gray-500">
      Carregando dados do ponto...
    </div>
  );
}


  return (
    <>
      
      <div
       className="flex-1 pl-8 space-y-6 w-full  pb-11  dark:bg-slate-800"
      >
      <ToastContainer />

    
      <Header
        nome={nome === "Visitante" ? "Bem-vindo, visitante!" : nome}
        isAdmin={isAdmin}
        onClickAdmin={() => navigate("/admin")}
      />


    
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 col-span-1 xl:col-span-2 h-full border border-gray-200 dark:border-gray-700 transition-colors">
  
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      Pontos do Dia {new Date().toLocaleDateString()}
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-300">
      <p className="flex items-center gap-2">
        <FiLogIn className="text-[#4F46E5]" />
        Entrada: <span className="font-medium text-gray-800 dark:text-white">{pontos?.entrada || "--"}</span>
      </p>
      <p className="flex items-center gap-2">
        <FiSun className="text-yellow-500" />
        Início Almoço: <span className="font-medium text-gray-800 dark:text-white">{pontos.inicioAlmoco || "--"}</span>
      </p>
      <p className="flex items-center gap-2">
        <FiSun className="text-yellow-500" />
        Volta Almoço: <span className="font-medium text-gray-800 dark:text-white">{pontos.voltaAlmoco || "--"}</span>
      </p>
      <p className="flex items-center gap-2">
        <FiCoffee className="text-orange-500" />
        Início Café: <span className="font-medium text-gray-800 dark:text-white">{pontos.inicioCafe || "--"}</span>
      </p>
      <p className="flex items-center gap-2">
        <FiCoffee className="text-orange-500" />
        Fim Café: <span className="font-medium text-gray-800 dark:text-white">{pontos.voltaCafe || "--"}</span>
      </p>
      <p className="flex items-center gap-2">
        <FiLogOut className="text-red-500" />
        Saída: <span className="font-medium text-gray-800 dark:text-white">{pontos.saida || "--"}</span>
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
  <div className="hidden md:block w-36 xl:w-52">
    <img
      src={Logo}
      alt="Ilustração ponto eletrônico"
      className="w-full h-auto rounded-xl"
    />
  </div>
</div>


        
        

         
          <GraficoResumo
              nome={nome}
              diasPontuais={nome === "Visitante" ? 0 : diasPontuais}
              diasAtrasados={nome === "Visitante" ? 0 : diasAtrasados}
              totalFaltas={nome === "Visitante" ? 0 : totalFaltas}
          />


      </div>


      {pontos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusEntradaSaida
            pontos={pontos}
            compararEntradaSaida={compararEntradaSaida}
            formatarMinutosParaHoraEmin={formatarMinutosParaHoraEmin}
          />

          <CardProgressoJornada
            tempoTrabalhadoMin={
              pontos.saida
                ? calcularTotalTrabalhado(pontos)
                : tempoTrabalhadoAtual || 0
            }
          />

              <CardHorasExtras
                totalMinutos={horasExtrasDoMes}
                formatarMinutos={formatarMinutos}
              />
        </div>
      ) : (
        <div className="text-center text-gray-500 col-span-full">
          Carregando dados do ponto...
        </div>
      )}

      <GraficoJornada dados={dadosGrafico} />
    
    
      
    </div>

     <Footer />
    </>
  );
};
