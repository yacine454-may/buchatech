import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { chartColors } from './chartColors';

const data = [
  { month: "Jan", urgences: 12 },
  { month: "Fév", urgences: 8 },
  { month: "Mar", urgences: 15 },
  { month: "Avr", urgences: 10 },
  { month: "Mai", urgences: 8 },
  { month: "Juin", urgences: 24 },
];

const UrgenceEvolutionChart: React.FC = () => (
  <div className="chart-card stagger-item">
    <div className="chart-header">
      <h3 className="chart-title">Évolution des urgences par mois</h3>
    </div>
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="urgences" stroke={chartColors[3]} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default UrgenceEvolutionChart;
