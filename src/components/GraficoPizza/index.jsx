import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#22C55E", "#FACC15", "#EF4444"]; // Pontual, Atraso, Falta

export const GraficoResumo = ({ diasPontuais, diasAtrasados, totalFaltas }) => {
  const data = [
    { name: "Pontual", value: diasPontuais },
    { name: "Atraso", value: diasAtrasados },
    { name: "Falta", value: totalFaltas },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 h-full border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Resumo de Frequência Mensal
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis
            type="number"
            tick={{ fill: '#4B5563' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: '#4B5563' }} 
            axisLine={{ stroke: '#E2E8F0' }}
          />

          <Tooltip
  content={({ payload }) => {
    if (!payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white space-y-1">
        {payload.map((item, index) => (
          <div key={index} className="flex justify-between gap-2">
            <span>{item.payload.name}:</span>
            <span>{item.value} dia{item.value !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
    );
  }}
  cursor={{ fill: 'rgba(100,116,139,0.05)' }}
/>




          <Bar dataKey="value" barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-4 mt-4 text-sm text-gray-700 dark:text-gray-200">
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
