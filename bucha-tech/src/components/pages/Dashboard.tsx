import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import StatsCards from "../dashboard/StatsCards";
import Charts from "../charts/Charts";
import { ActivityFeed } from "../dashboard/ActivityFeed";
import { UpcomingAppointments } from "../dashboard/UpcomingAppointments";

const Dashboard: React.FC<{ setActiveSection?: (section: string) => void }> = ({ setActiveSection }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <PageWrapper>
      <motion.div 
        className="p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        // ...existing header...

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
