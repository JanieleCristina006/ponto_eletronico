import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

import { useJornadaSemanal } from "../../Hooks/useJornadaSemanal";

export const GraficoJornada = () => {
  const [semanaSelecionada, setSemanaSelecionada] = useState(0); // 0 = atual
  const dados = useJornadaSemanal(semanaSelecionada);

  if (!dados.length) return <p>Carregando gráfico...</p>;

  const totalExtras = dados.reduce((acc, item) => {
    const extra = item.minutos - 480;
    return extra > 0 ? acc + extra : acc;
  }, 0);

  const horasExtras = Math.floor(totalExtras / 60);
  const minutosExtras = totalExtras % 60;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
    {/* Cabeçalho com Título, Legenda e Filtro */}
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      {/* Título + legenda */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#35122E]">Jornada Semanal</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#6B256F]" />
            <span className="text-gray-600">Presença</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-black" />
            <span className="text-gray-600">Falta</span>
          </div>
        </div>
      </div>
  
      {/* Horas extras + filtro de semana */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-[#6B256F] font-medium">
          Horas Extras: {horasExtras}h {minutosExtras}min
        </p>
        <select
          className="border border-gray-300 text-sm rounded-md px-2 py-1"
          value={semanaSelecionada}
          onChange={(e) => setSemanaSelecionada(Number(e.target.value))}
        >
          <option value={0}>Semana Atual</option>
          <option value={1}>Semana Passada</option>
          <option value={2}>2 Semanas Atrás</option>
        </select>
      </div>
    </div>
  
    {/* Gráfico */}
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={dados}
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        barCategoryGap={25}
      >
        <CartesianGrid strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="dia" />
        <YAxis
          tickFormatter={(min) => `${Math.floor(min / 60)}h`}
          domain={[0, 600]}
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
            const isFaltou = payload.faltou;
            const minHeight = 8;
            const finalHeight = height < minHeight ? minHeight : height;
            const finalY = height < minHeight ? y + (height - minHeight) : y;
            const color = isFaltou ? "#000000" : "#6B256F";
  
            return (
              <rect
                x={x}
                y={finalY}
                width={width}
                height={finalHeight}
                rx={6}
                ry={6}
                fill={color}
                style={{
                  stroke: "#35122E",
                  strokeWidth: 0.3,
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
    const { minutos, faltou } = payload[0].payload;

    if (faltou) {
      return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-md p-3 text-sm">
          <p className="text-[#35122E] font-semibold">{label}</p>
          <p className="text-red-600 font-medium">Faltou</p>
          <p className="text-gray-600">Deveria cumprir: 8h 0min</p>
        </div>
      );
    }

    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    const extras = minutos - 480;

    return (
      <div className="bg-white border border-gray-300 rounded-xl shadow-md p-3 text-sm">
        <p className="text-[#35122E] font-semibold">{label}</p>
        <p>Jornada: {horas}h {min}min</p>
        {extras > 0 && (
          <p className="text-[#6B256F]">Horas Extras: {Math.floor(extras / 60)}h {extras % 60}min</p>
        )}
      </div>
    );
  }

  return null;
};
