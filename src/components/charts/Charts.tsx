import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Activity, Heart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './Charts.css';
import { chartColors } from './chartColors';

const Charts: React.FC = () => {
  const { chartData, loading } = useData();

  // Style commun pour les tooltips
  const tooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: '12px 16px',
    color: 'var(--color-text)'
  };

  if (loading || !chartData) {
    return (
      <div className="charts-section">
        <div className="charts-header fade-in">
          <h2 className="charts-title">Analyses et Statistiques</h2>
          <p className="charts-subtitle">Chargement des données...</p>
        </div>
        <div className="charts-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="chart-card stagger-item">
              <div className="h-64 bg-muted animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { consultationsData, pathologiesData, patientsEvolutionData, medecinsServiceData } = chartData;

  // === NOUVEAUX GRAPHIQUES ===
  // 1. Nouveaux patients par semaine
  const { patients = [], rendezVous = [], medecins = [] } = useData();
  // Générer les semaines (12 dernières)
  const weeks = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    weeks.push({ start, end });
  }
  // Nouveaux patients par semaine
  const newPatientsData = weeks.map(({ start, end }) => {
    const count = patients.filter(p => new Date(p.createdAt) >= start && new Date(p.createdAt) <= end).length;
    return { week: `${start.getDate()}/${start.getMonth() + 1}`, count };
  });
  // Répartition des rendez-vous par statut
  const rdvStatusCount = rendezVous.reduce((acc, r) => {
    acc[r.statut] = (acc[r.statut] || 0) + 1;
    return acc;
  }, {});
  const rdvStatusData = Object.entries(rdvStatusCount).map(([statut, value]) => ({ name: statut, value }));
  // Taux d’occupation des médecins par semaine
  const occupationData = weeks.map(({ start, end }) => {
    const rdvsWeek = rendezVous.filter(r => new Date(r.date) >= start && new Date(r.date) <= end && ['Confirmé', 'Terminé'].includes(r.statut));
    const medecinCount = medecins.length || 1;
    const taux = Math.round((rdvsWeek.length / medecinCount) * 100) / 100;
    return { week: `${start.getDate()}/${start.getMonth() + 1}`, taux };
  });

  return (
    <div className="charts-section">
      <div className="charts-header fade-in">
        <h2 className="charts-title">Analyses et Statistiques</h2>
        <p className="charts-subtitle">Vue dynamique sur l'activité médicale</p>
      </div>
      <div className="charts-grid">
        {/* Nouveaux patients par semaine */}
        <div className="chart-card stagger-item">
          <div className="chart-header">
            <h3 className="chart-title">Nouveaux Patients (par semaine)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={newPatientsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={chartColors[0]} radius={[8, 8, 0, 0]} animationDuration={800} name="Nouveaux patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Répartition des rendez-vous par statut */}
        <div className="chart-card stagger-item">
          <div className="chart-header">
            <h3 className="chart-title">Répartition des Rendez-vous par Statut</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={rdvStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {rdvStatusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Taux d’occupation des médecins par semaine */}
        <div className="chart-card stagger-item">
          <div className="chart-header">
            <h3 className="chart-title">Taux d’Occupation des Médecins (par semaine)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="taux" stroke={chartColors[1]} strokeWidth={3} dot={{ r: 5, fill: chartColors[1] }} activeDot={{ r: 8 }} name="Taux d’occupation" animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
