import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useJornadaSemanal } from "../../Hooks/useJornadaSemanal";

export const GraficoJornada = ({ nome }) => {
  const [semanaSelecionada, setSemanaSelecionada] = useState(0);
  const { dados } = useJornadaSemanal(semanaSelecionada);

  if (nome === "Visitante") {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md text-center text-gray-500 dark:text-gray-300">
        O gráfico não está disponível no modo visitante.
      </div>
    );
  }

  if (!dados.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-300">Carregando gráfico...</p>
    );

  const totalExtras = dados.reduce((acc, item) => {
    const extra = item.minutos - 480;
    return extra > 0 ? acc + extra : acc;
  }, 0);
  const horasExtras = Math.floor(totalExtras / 60);
  const minutosExtras = totalExtras % 60;

  const gerarSemanas = () => {
    const semanas = [];
    for (let i = 0; i < 3; i++) {
      const hoje = new Date();
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1 - i * 7);
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(fimSemana.getDate() + 4);

      const formato = (data) =>
        data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

      const label = `${formato(inicioSemana)} - ${formato(fimSemana)}${i === 0 ? " (Atual)" : ""}`;
      semanas.push({ label, value: i });
    }
    return semanas;
  };

  const semanasDisponiveis = gerarSemanas();

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[#35122E] dark:text-white">Jornada Semanal</h3>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <Legenda cor="#6B256F" texto="Presença" />
            <Legenda cor="#000000" texto="Falta" />
            <Legenda cor="#22C55E" texto="Dia Atual" />
            <Legenda cor="#EAB308" texto="Feriado" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-[#6B256F] dark:text-purple-300 font-medium">
            Horas Extras: {horasExtras}h {minutosExtras}min
          </p>
          <select
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm rounded-md px-2 py-1 text-gray-800 dark:text-gray-100 transition-colors"
            value={semanaSelecionada}
            onChange={(e) => setSemanaSelecionada(Number(e.target.value))}
          >
            {semanasDisponiveis.map((semana) => (
              <option key={semana.value} value={semana.value}>
                {semana.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dados}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          barCategoryGap={25}
        >
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="dia" tick={{ fill: '#6B7280' }} />
          <YAxis
            tickFormatter={(min) => `${Math.floor(min / 60)}h`}
            domain={[0, 600]}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={480}
            stroke="#10B981"
            strokeDasharray="4 4"
            label={{
              value: "Meta (8h)",
              position: "right",
              fill: "#10B981",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="minutos"
            shape={({ x, y, width, height, payload }) => {
              const minHeight = 8;
              const finalHeight = height < minHeight ? minHeight : height;
              const finalY = height < minHeight ? y + (height - minHeight) : y;

              let cor = "#6B256F";
              if (payload.feriado) cor = "#EAB308";
              else if (payload.faltou && !payload.atual) cor = "#000";
              else if (payload.atual) cor = "#22C55E";

              return (
                <rect
                  x={x}
                  y={finalY}
                  width={width}
                  height={finalHeight}
                  rx={6}
                  ry={6}
                  fill={cor}
                  style={{
                    stroke: payload.atual ? "#22C55E" : "#35122E",
                    strokeWidth: payload.atual ? 2 : 0.3,
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
                  }}
                />
              );
            }}
            radius={[6, 6, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { minutos, faltou, atual, feriado } = payload[0].payload;

    const baseClass =
      "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md p-3 text-sm text-gray-800 dark:text-gray-100";

    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    const extras = minutos - 480;

    if (feriado) {
      return (
        <div className={baseClass}>
          <p className="text-[#35122E] dark:text-purple-300 font-semibold">{label}</p>
          <p className="text-yellow-600 dark:text-yellow-400 font-medium">Feriado Nacional 🎉</p>
          <p className="text-gray-600 dark:text-gray-300">Dia não trabalhado</p>
        </div>
      );
    }

    if (faltou && !atual) {
      return (
        <div className={baseClass}>
          <p className="text-[#35122E] dark:text-purple-300 font-semibold">{label}</p>
          <p className="text-red-600 font-medium">Faltou</p>
          <p className="text-gray-600 dark:text-gray-300">Deveria cumprir: 8h 0min</p>
        </div>
      );
    }

    if (faltou && atual) {
      return (
        <div className={baseClass}>
          <p className="text-[#35122E] dark:text-purple-300 font-semibold">{label}</p>
          <p className="text-yellow-600 dark:text-yellow-400 font-medium">Jornada em andamento</p>
          <p className="text-gray-600 dark:text-gray-300">Deveria cumprir: 8h 0min</p>
        </div>
      );
    }

    return (
      <div className={baseClass}>
        <p className="text-[#35122E] dark:text-purple-300 font-semibold">{label}</p>
        <p>Jornada: {horas}h {min}min</p>
        {extras > 0 && (
          <p className="text-[#6B256F] dark:text-purple-300">
            Horas Extras: {Math.floor(extras / 60)}h {extras % 60}min
          </p>
        )}
      </div>
    );
  }

  return null;
};

const Legenda = ({ cor, texto }) => (
  <div className="flex items-center gap-1">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cor }} />
    <span className="text-gray-600 dark:text-gray-300">{texto}</span>
  </div>
);
