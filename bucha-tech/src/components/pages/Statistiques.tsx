import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useData } from "../../contexts/DataContext";
import { chartColors } from '../charts/chartColors';

// Composants de graphiques
const SexeDistributionChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => (
  <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '1.25rem', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }} className="chart-card flex flex-col items-center transition-all duration-300 hover:scale-[1.02]">
    <div className="chart-header mb-2">
      <h3 className="chart-title text-xl font-bold text-center tracking-tight text-zinc-700">Répartition par sexe</h3>
    </div>
    <div className="chart-container w-full">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-sexe-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const VisitesParJourChart: React.FC<{ data: { day: string; visites: number }[] }> = ({ data }) => (
  <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '1.25rem', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }} className="chart-card flex flex-col items-center transition-all duration-300 hover:scale-[1.02]">
    <div className="chart-header mb-2">
      <h3 className="chart-title text-xl font-bold text-center tracking-tight text-zinc-700">Visites par jour de la semaine</h3>
    </div>
    <div className="chart-container w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
          <Bar dataKey="visites" fill={chartColors[0]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AgeDistributionChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => (
  <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '1.25rem', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }} className="chart-card flex flex-col items-center transition-all duration-300 hover:scale-[1.02]">
    <div className="chart-header mb-2">
      <h3 className="chart-title text-xl font-bold text-center tracking-tight text-zinc-700">Répartition par âge</h3>
    </div>
    <div className="chart-container w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
          <Bar dataKey="value" fill={chartColors[1]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ConsultationsEvolutionChart: React.FC<{ data: { month: string; consultations: number; urgences: number }[] }> = ({ data }) => (
  <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '1.25rem', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }} className="chart-card flex flex-col items-center transition-all duration-300 hover:scale-[1.02]">
    <div className="chart-header mb-2">
      <h3 className="chart-title text-xl font-bold text-center tracking-tight text-zinc-700">Évolution des consultations</h3>
    </div>
    <div className="chart-container w-full">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
          <Line type="monotone" dataKey="consultations" stroke={chartColors[2]} strokeWidth={2} />
          <Line type="monotone" dataKey="urgences" stroke={chartColors[3]} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#10B981', '#f472b6', '#F59E42', '#EF4444', '#3B82F6', '#A21CAF', '#FBBF24', '#14B8A6', '#F43F5E'];

const StatistiquesCharts: React.FC<{ chartData: any }> = ({ chartData }) => {
  // Helper function to safely map data
  const safeMap = (data: any[], defaultValue: any[] = []) => {
    if (!Array.isArray(data)) return defaultValue;
    return data.map((item: any) => ({ name: item._id || 'Non spécifié', value: item.count || 0 }));
  };

  // Helper function to safely get object entries
  const safeObjectEntries = (obj: any, defaultValue: any[] = []) => {
    if (!obj || typeof obj !== 'object') return defaultValue;
    return Object.entries(obj).map(([k, v]) => ({ name: k, value: v }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {/* Operation Types */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Types d'opération</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.operationTypes)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.operationTypes).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Operation Laterality */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Latéralité</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.operationLaterality)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.operationLaterality).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Operation Reprise */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Reprise</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.operationReprise)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.operationReprise).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Risk Factors */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Facteurs de risque</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeObjectEntries(chartData.riskFactors)}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={chartColors[4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Antécédents médicaux */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Antécédents médicaux</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeObjectEntries(chartData.antecedentsMedicaux)}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={chartColors[5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Amputation antérieure */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Amputation antérieure</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.amputationAnterieure)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.amputationAnterieure).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Amputation familiale */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Amputation familiale</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.amputationFamiliale)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.amputationFamiliale).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Maladie cardiovasculaire types */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Maladie cardiovasculaire</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.maladieCardioTypes)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.maladieCardioTypes).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Maladie cardio FE% */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">FE% (Fraction d'éjection)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeMap(chartData.maladieCardioFE)}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#F59E42" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Sexe */}
      <div className="chart-card">
        <h4 className="font-semibold mb-2">Sexe</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie 
              data={safeMap(chartData.sexeStats)} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {safeMap(chartData.sexeStats).map((_: any, i: number) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Statistiques: React.FC = () => {
  const { patients, medecins, rendezVous, chartData, loading, error } = useData();
  const [processedData, setProcessedData] = useState({
    sexeStats: [],
    ageStats: [],
    visitesParJour: [],
    consultationsData: []
  });

  console.log('Statistiques component - chartData:', chartData);
  console.log('Statistiques component - loading:', loading);
  console.log('Statistiques component - error:', error);

  useEffect(() => {
    if (patients.length > 0) {
      // Calculate gender distribution
      const sexeCount = patients.reduce((acc, patient) => {
        const sexe = patient.sexe || 'Non spécifié';
        acc[sexe] = (acc[sexe] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sexeStats = [
        { name: "Hommes", value: sexeCount['Homme'] || 0 },
        { name: "Femmes", value: sexeCount['Femme'] || 0 }
      ];

      // Calculate age distribution
      const ageGroups = patients.reduce((acc, patient) => {
        const age = patient.age || 0;
        let group = '';
        if (age < 30) group = '18-29';
        else if (age < 50) group = '30-49';
        else if (age < 70) group = '50-69';
        else group = '70+';
        
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const ageStats = [
        { name: '18-29', value: ageGroups['18-29'] || 0 },
        { name: '30-49', value: ageGroups['30-49'] || 0 },
        { name: '50-69', value: ageGroups['50-69'] || 0 },
        { name: '70+', value: ageGroups['70+'] || 0 }
      ];

      // Calculate visits per day of week
      const dayCount = rendezVous.reduce((acc, rdv) => {
        const date = new Date(rdv.date);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const visitesParJour = [
        { day: "Lun", visites: dayCount['lun'] || 0 },
        { day: "Mar", visites: dayCount['mar'] || 0 },
        { day: "Mer", visites: dayCount['mer'] || 0 },
        { day: "Jeu", visites: dayCount['jeu'] || 0 },
        { day: "Ven", visites: dayCount['ven'] || 0 },
        { day: "Sam", visites: dayCount['sam'] || 0 },
        { day: "Dim", visites: dayCount['dim'] || 0 }
      ];

      setProcessedData({
        sexeStats,
        ageStats,
        visitesParJour,
        consultationsData: chartData?.consultationsData || []
      });
    }
  }, [patients, rendezVous, chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Statistiques</h1>
        <p className="text-gray-600">Vue d'ensemble des données de votre clinique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-2">
          <ConsultationsEvolutionChart data={processedData.consultationsData} />
        </div>
        <div>
          <AgeDistributionChart data={processedData.ageStats} />
        </div>
        <div>
          <SexeDistributionChart data={processedData.sexeStats} />
        </div>
        <div className="col-span-2">
          <VisitesParJourChart data={processedData.visitesParJour} />
        </div>
      </div>

      {/* New medical analytics charts */}
      {chartData && <StatistiquesCharts chartData={chartData} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="text-2xl font-bold">{patients.length}</div>
          <div className="text-sm opacity-90">Total Patients</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="text-2xl font-bold">{medecins.length}</div>
          <div className="text-sm opacity-90">Total Médecins</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="text-2xl font-bold">{rendezVous.length}</div>
          <div className="text-sm opacity-90">Total Rendez-vous</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="text-2xl font-bold">{Math.round((patients.filter(p => p.sexe === 'Homme').length / patients.length) * 100)}%</div>
          <div className="text-sm opacity-90">Patients Hommes</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistiques;