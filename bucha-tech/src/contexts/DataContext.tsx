import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  diabete: string;
  derniereVisite: string;
  sexe: string;
  telephone: string;
  email: string;
  adresse: string;
  notes: string;
  photoUrl: string;
  ordonnances: string[];
  nomComplet?: string; // Virtual field from backend
  dateConsultation?: string;
  createdAt?: string; // Ajouté pour compatibilité avec le backend
}

interface Medecin {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone: string;
  status: 'En service' | 'En congé' | 'En formation';
}

interface RendezVous {
  id: string;
  heure: string;
  patient: string;
  medecin: string;
  type: string;
  date: string;
  notes: string;
  statut?: string;
}

interface Consultation {
  id: string;
  patientId: string | { nomComplet: string };
  medecinId: string | { nomComplet: string };
  date: string;
  type: string;
  diagnostic: string;
  montant: number;
  paiement: string;
}

interface DashboardStats {
  totalPatients: number;
  totalRendezVous: number;
  totalConsultations: number;
  totalMedecins: number;
  tauxSuivi: string;
}

interface ChartData {
  consultationsData: Array<{
    week: string;
    consultations: number;
    urgences: number;
  }>;
  pathologiesData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  medecinsServiceData: Array<{
    week: string;
    enService: number;
  }>;
  patientsEvolutionData: Array<{
    week: string;
    nouveau: number;
    sous_trt: number;
    apres_trt: number;
    decede: number;
  }>;
  sexeStats: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ageStats: Array<{
    name: string;
    value: number;
  }>;
  operationTypes: Array<string>;
  operationLaterality: Array<string>;
  operationReprise: Array<string>;
  riskFactors: Record<string, number>;
  antecedentsMedicaux: Record<string, number>;
  amputationAnterieure: Array<string>;
  amputationFamiliale: Array<string>;
  maladieCardioTypes: Array<string>;
  maladieCardioFE: Array<string>;
}

interface DataContextType {
  patients: Patient[];
  medecins: Medecin[];
  rendezVous: RendezVous[];
  consultations: Consultation[];
  dashboardStats: DashboardStats | null;
  chartData: ChartData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addMedecin: (medecin: Omit<Medecin, 'id'>) => Promise<void>;
  updateMedecin: (id: string, medecin: Partial<Medecin>) => Promise<void>;
  deleteMedecin: (id: string) => Promise<void>;
  addRendezVous: (rendezVous: Omit<RendezVous, 'id'>) => Promise<void>;
  updateRendezVous: (id: string, rendezVous: Partial<RendezVous>) => Promise<void>;
  deleteRendezVous: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = (import.meta as any).env.VITE_API_URL || '';
  console.log('DATA API_URL:', API_URL);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      console.log('FETCH DASHBOARD URL:', `${API_URL}/stats/dashboard`);
      const [patientsRes, medecinsRes, rendezVousRes, consultationsRes, dashboardRes] = await Promise.all([
        axios.get<Patient[]>(`${API_URL}/patients`),
        axios.get<Medecin[]>(`${API_URL}/medecins`),
        axios.get<RendezVous[]>(`${API_URL}/rendez-vous`),
        axios.get<Consultation[]>(`${API_URL}/consultations`),
        axios.get<{
          overview: {
            totalPatients: number;
            totalMedecins: number;
            totalRendezVous: number;
            totalConsultations: number;
            totalRevenue: number;
          };
          thisMonth: {
            newPatients: number;
            rendezVous: number;
            consultations: number;
            revenue: number;
          };
          today: {
            rendezVous: number;
          };
          trends: {
            monthly: Array<{ _id: { month: number; year: number }; consultations: number }>;
          };
          breakdowns: {
            patientsByDiabetesType: Array<{ _id: string; count: number }>;
            sexDistribution: Array<{ _id: string; count: number }>;
            ageDistribution: Array<{ _id: string; count: number }>;
            operationTypes: Array<string>;
            operationLaterality: Array<string>;
            operationReprise: Array<string>;
            riskFactors: Record<string, number>;
            antecedentsMedicaux: Record<string, number>;
            amputationAnterieure: Array<string>;
            amputationFamiliale: Array<string>;
            maladieCardioTypes: Array<string>;
            maladieCardioFE: Array<string>;
          };
          patientsEvolutionData: Array<{
            week: string;
            nouveau: number;
            sous_trt: number;
            apres_trt: number;
            decede: number;
          }>;
          consultationsUrgencesData: Array<{
            week: string;
            consultations: number;
            urgences: number;
          }>;
          medecinsServiceData: Array<{
            week: string;
            enService: number;
          }>;
        }>(`${API_URL}/stats/dashboard`)
      ]);

      setPatients(patientsRes.data);
      setMedecins(medecinsRes.data);
      setRendezVous(rendezVousRes.data);
      setConsultations(consultationsRes.data);
      
      const dashboardData = dashboardRes.data;
      setDashboardStats({
        totalPatients: dashboardData.overview.totalPatients,
        totalMedecins: dashboardData.overview.totalMedecins,
        totalRendezVous: dashboardData.overview.totalRendezVous,
        totalConsultations: dashboardData.overview.totalConsultations,
        tauxSuivi: `${((dashboardData.overview.totalConsultations / dashboardData.overview.totalPatients) * 100).toFixed(1)}%`
      });
      
      // Set chart data with default values for now
      console.log('Dashboard data received:', dashboardData);
      setChartData({
        consultationsData: (dashboardData.consultationsUrgencesData || []).map((item: any) => ({
          week: item.week,
          consultations: item.consultations,
          urgences: item.urgences
        })),
        pathologiesData: dashboardData.breakdowns.patientsByDiabetesType?.map((item: any) => ({
          name: item._id,
          value: item.count,
          color: item._id === 'Type 1' ? '#3B82F6' : '#10B981'
        })) || [],
        sexeStats: dashboardData.breakdowns.sexDistribution?.map((item: any) => ({
          name: item._id,
          value: item.count,
          color: item._id === 'Homme' ? '#6366f1' : '#f472b6'
        })) || [],
        ageStats: dashboardData.breakdowns.ageDistribution?.map((item: any) => ({
          name: item._id,
          value: item.count
        })) || [],
        operationTypes: dashboardData.breakdowns.operationTypes || [],
        operationLaterality: dashboardData.breakdowns.operationLaterality || [],
        operationReprise: dashboardData.breakdowns.operationReprise || [],
        riskFactors: dashboardData.breakdowns.riskFactors || {},
        antecedentsMedicaux: dashboardData.breakdowns.antecedentsMedicaux || {},
        amputationAnterieure: dashboardData.breakdowns.amputationAnterieure || [],
        amputationFamiliale: dashboardData.breakdowns.amputationFamiliale || [],
        maladieCardioTypes: dashboardData.breakdowns.maladieCardioTypes || [],
        maladieCardioFE: dashboardData.breakdowns.maladieCardioFE || [],
        medecinsServiceData: (dashboardData.medecinsServiceData || []).map((item: any) => ({
          week: item.week,
          enService: item.enService
        })),
        patientsEvolutionData: (dashboardData.patientsEvolutionData || []).map((item: any) => ({
          week: item.week,
          nouveau: item.nouveau || 0,
          sous_trt: item.sous_trt || 0,
          apres_trt: item.apres_trt || 0,
          decede: item.decede || 0
        }))
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Patient operations
  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    try {
      const response = await axios.post<Patient>(`${API_URL}/patients`, patient);
      setPatients(prev => [...prev, response.data]);
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error adding patient:', err);
      throw err;
    }
  };

  const updatePatient = async (id: string, patient: Partial<Patient>) => {
    try {
      const response = await axios.put<Patient>(`${API_URL}/patients/${id}`, patient);
      setPatients(prev => prev.map(p => p.id === id ? response.data : p));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error updating patient:', err);
      throw err;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/patients/${id}`);
      setPatients(prev => prev.filter(p => p.id !== id));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error deleting patient:', err);
      throw err;
    }
  };

  // Medecin operations
  const addMedecin = async (medecin: Omit<Medecin, 'id'>) => {
    try {
      const response = await axios.post<Medecin>(`${API_URL}/medecins`, medecin);
      setMedecins(prev => [...prev, response.data]);
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error adding medecin:', err);
      throw err;
    }
  };

  const updateMedecin = async (id: string, medecin: Partial<Medecin>) => {
    try {
      const response = await axios.put<Medecin>(`${API_URL}/medecins/${id}`, medecin);
      setMedecins(prev => prev.map(m => m.id === id ? response.data : m));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error updating medecin:', err);
      throw err;
    }
  };

  const deleteMedecin = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/medecins/${id}`);
      setMedecins(prev => prev.filter(m => m.id !== id));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error deleting medecin:', err);
      throw err;
    }
  };

  // RendezVous operations
  const addRendezVous = async (rendezVous: Omit<RendezVous, 'id'>) => {
    try {
      const response = await axios.post<RendezVous>(`${API_URL}/rendez-vous`, rendezVous);
      setRendezVous(prev => [...prev, response.data]);
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error adding rendez-vous:', err);
      throw err;
    }
  };

  const updateRendezVous = async (id: string, rendezVous: Partial<RendezVous>) => {
    try {
      const response = await axios.put<RendezVous>(`${API_URL}/rendez-vous/${id}`, rendezVous);
      setRendezVous(prev => prev.map(r => r.id === id ? response.data : r));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error updating rendez-vous:', err);
      throw err;
    }
  };

  const deleteRendezVous = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/rendez-vous/${id}`);
      setRendezVous(prev => prev.filter(r => r.id !== id));
      await refreshData(); // Refresh dashboard stats
    } catch (err) {
      console.error('Error deleting rendez-vous:', err);
      throw err;
    }
  };

  const value: DataContextType = {
    patients,
    medecins,
    rendezVous,
    consultations,
    dashboardStats,
    chartData,
    loading,
    error,
    refreshData,
    addPatient,
    updatePatient,
    deletePatient,
    addMedecin,
    updateMedecin,
    deleteMedecin,
    addRendezVous,
    updateRendezVous,
    deleteRendezVous
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
