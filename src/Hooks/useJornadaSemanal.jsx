import { useState, useEffect } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../FirebaseConection";

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

function horaParaMinutos(hora) {
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

export function useJornadaSemanal(semanasAtras = 0) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function buscar() {
      const user = auth.currentUser;
      if (!user) return;

      const hoje = new Date();
      hoje.setDate(hoje.getDate() - semanasAtras * 7);

      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(inicioSemana.getDate() - (inicioSemana.getDay() - 1));

      const registros = [];

      for (let i = 0; i < 5; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(dia.getDate() + i);

        const dataId = dia.toISOString().split("T")[0];
        const label = diasDaSemana[i];

        const docRef = doc(db, "registros", user.uid, "dias", dataId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosPonto = docSnap.data();
          if (dadosPonto.entrada && dadosPonto.saida) {
            registros.push({
              dia: label,
              minutos: calcularMinutosTrabalhados(dadosPonto),
              faltou: false,
            });
            continue;
          }
        }

        registros.push({ dia: label, minutos: 0, faltou: true });
      }

      setDados(registros);
    }

    buscar();
  }, [semanasAtras]);

  return dados;
}
