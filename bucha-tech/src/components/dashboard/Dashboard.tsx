import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import StatsCards from '../dashboard/StatsCards';
import Charts from '../charts/Charts';
import { ActivityFeed } from '../dashboard/ActivityFeed';
import { UpcomingAppointments } from '../dashboard/UpcomingAppointments';
import { useData } from '../../contexts/DataContext';

interface DashboardProps {
  setActiveSection?: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveSection }) => {
  const { loading, error, dashboardStats, chartData } = useData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Erreur: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Réessayer
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div
        className="p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace de gestion</p>
          {dashboardStats && (
            <p className="text-sm text-green-600">
              Données mises à jour en temps réel • {dashboardStats.totalPatients} patients • {dashboardStats.totalMedecins} médecins
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-lg border bg-background shadow-sm p-6">
          <Charts />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg border bg-background p-6">
            <ActivityFeed />
          </div>
          <div className="rounded-lg border bg-background p-6">
            <UpcomingAppointments onShowPlanning={() => setActiveSection && setActiveSection('planning')} />
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;