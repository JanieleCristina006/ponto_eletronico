import { useState, useEffect } from "react";
import { auth, db } from "../FirebaseConection";
import { doc, getDoc } from "firebase/firestore";
import { buscarFeriadosNacionais } from '../utils/buscarFeriadosNacionais'

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

function horaParaMinutos(hora) {
  if (!hora) return 0;
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function calcularMinutosTrabalhados(pontos) {
  const entrada = horaParaMinutos(pontos.entrada);
  const saida = horaParaMinutos(pontos.saida);

  const pausaAlmoco = pontos.voltaAlmoco && pontos.inicioAlmoco
    ? horaParaMinutos(pontos.voltaAlmoco) - horaParaMinutos(pontos.inicioAlmoco)
    : 0;

  const pausaCafe = pontos.voltaCafe && pontos.inicioCafe
    ? horaParaMinutos(pontos.voltaCafe) - horaParaMinutos(pontos.inicioCafe)
    : 0;

  return saida - entrada - pausaAlmoco - pausaCafe;
}

function formatarData(data) {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function useJornadaSemanal(semanasAtras = 0) {
  const [dados, setDados] = useState([]);
  const [intervaloSemana, setIntervaloSemana] = useState("");

  useEffect(() => {
    async function buscar() {
      const user = auth.currentUser;
      if (!user) return;

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const hojeFormatado = hoje.toISOString().split("T")[0];

      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1 - semanasAtras * 7);
      inicioSemana.setHours(0, 0, 0, 0);

      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(fimSemana.getDate() + 4);

      setIntervaloSemana(
        `${formatarData(inicioSemana)} - ${formatarData(fimSemana)}${semanasAtras === 0 ? " (Atual)" : ""}`
      );

      const anoAtual = inicioSemana.getFullYear();
      const feriados = await buscarFeriadosNacionais(anoAtual);

      const registros = [];

      for (let i = 0; i < 5; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(dia.getDate() + i);
        dia.setHours(0, 0, 0, 0);

        const label = diasDaSemana[i];
        const dataId = dia.toISOString().split("T")[0];
        const atual = dataId === hojeFormatado && semanasAtras === 0;
        const isFuturo = dia > hoje && semanasAtras === 0;
        const isFeriado = feriados.includes(dataId);

        // 👉 Registro de feriado
        if (isFeriado) {
          registros.push({
            dia: label,
            minutos: null,
            faltou: false,
            atual: false,
            feriado: true,
            
          });
          continue;
        }

        const docRef = doc(db, "registros", user.uid, "dias", dataId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const pontos = docSnap.data();
          if (pontos.entrada && pontos.saida) {
            registros.push({
              dia: label,
              minutos: calcularMinutosTrabalhados(pontos),
              faltou: false,
              atual,
              feriado: false,
            });
            continue;
          }
        }

        registros.push({
          dia: label,
          minutos: isFuturo ? null : 0,
          faltou: !isFuturo && !atual,
          atual,
          feriado: false,
        });
      }

      setDados(registros);
    }

    buscar();
  }, [semanasAtras]);

  return { dados, intervaloSemana };
}

