import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { chartColors } from './chartColors';

const data = [
  { age: "0-18", patients: 8 },
  { age: "19-35", patients: 32 },
  { age: "36-50", patients: 54 },
  { age: "51-65", patients: 41 },
  { age: "66+", patients: 22 },
];

const AgeDistributionChart: React.FC = () => (
  <div className="chart-card stagger-item">
    <div className="chart-header">
      <h3 className="chart-title">Répartition par tranche d'âge</h3>
    </div>
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Bar dataKey="patients" fill={chartColors[2]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AgeDistributionChart;
