import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#22C55E", "#FACC15", "#EF4444"];

export const GraficoResumo = ({ diasPontuais, diasAtrasados, totalFaltas }) => {
  const data = [
    { name: "Pontual", value: diasPontuais },
    { name: "Atraso", value: diasAtrasados },
    { name: "Falta", value: totalFaltas },
  ];

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo de Frequência Mensal</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip formatter={(value) => [`${value} dia${value !== 1 ? "s" : ""}`]} />
          <Bar dataKey="value" barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda personalizada */}
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#22C55E]" />
          <span>Pontual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#FACC15]" />
          <span>Atraso</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#EF4444]" />
          <span>Falta</span>
        </div>
      </div>
    </div>
  );
};
