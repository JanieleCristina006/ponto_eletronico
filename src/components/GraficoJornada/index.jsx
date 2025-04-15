import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const todasAsSemanas = {
  semana1: [
    { dia: "Seg", minutos: 480,faltou: false },
    { dia: "Ter", minutos:   0,faltou: true },
    { dia: "Qua", minutos: 520,faltou: false },
    { dia: "Qui", minutos: 0,faltou: true },
    { dia: "Sex", minutos: 600,faltou: false },
  ],
  semana2: [
    { dia: "Seg", minutos: 300,faltou: false },
    { dia: "Ter", minutos: 510,faltou: false },
    { dia: "Qua", minutos:   0,faltou: true },
    { dia: "Qui", minutos: 450,faltou: false },
    { dia: "Sex", minutos: 400,faltou: false },
  ],
};

export const GraficoJornada = () => {
  const [semanaSelecionada, setSemanaSelecionada] = useState("semana1");

  // ⬇️ AQUI ENTRA O CÁLCULO DO TOTAL DE HORAS EXTRAS
  const totalExtras = todasAsSemanas[semanaSelecionada].reduce((acc, item) => {
    const extra = item.minutos - 480;
    return extra > 0 ? acc + extra : acc;
  }, 0);

  const horasExtras = Math.floor(totalExtras / 60);
  const minutosExtras = totalExtras % 60;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Topo com título, total de extras e select */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#35122E]">
          Jornada Semanal
        </h3>

        <div className="flex items-center gap-4">
          <p className="text-sm text-[#6B256F] font-medium whitespace-nowrap">
             Horas Extras: {horasExtras}h {minutosExtras}min
          </p>

          <select
            className="border border-gray-300 text-sm rounded-md px-2 py-1"
            value={semanaSelecionada}
            onChange={(e) => setSemanaSelecionada(e.target.value)}
          >
            <option value="semana1">Semana 01</option>
            <option value="semana2">Semana 02</option>
          </select>
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={todasAsSemanas[semanaSelecionada]}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          barCategoryGap={25}
        >
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(min) => `${Math.floor(min / 60)}h`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="minutos"
            barSize={16}
            radius={[6, 6, 0, 0]}
            shape={(props) => {
              const { x, y, width, height, payload } = props;

              // Se faltou, força uma barrinha pequena visível
              const isFaltou = payload.faltou;
              const adjustedHeight = isFaltou ? 10 : height;
              const adjustedY = isFaltou ? y + (height - 10) : y;
              const color = isFaltou ? "#000000" : "#6B256F";

              return (
                <rect
                  x={x}
                  y={adjustedY}
                  width={width}
                  height={adjustedHeight}
                  rx={6}
                  ry={6}
                  fill={color}
                />
              );
            }}
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

