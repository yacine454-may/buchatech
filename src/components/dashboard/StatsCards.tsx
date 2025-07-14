import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

import { Card } from '../ui/card';
import { listAnimation, listItemAnimation } from '../animations/dashboard';

const StatsCards: React.FC = () => {
	const { dashboardStats, loading } = useData();

	if (loading || !dashboardStats) {
		return (
			<motion.div
				variants={listAnimation}
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
			>
				{[1, 2, 3, 4].map((i) => (
					<motion.div
						key={i}
						variants={listItemAnimation}
						className="h-24 bg-muted animate-pulse rounded-lg"
					/>
				))}
			</motion.div>
		);
	}

	const stats = [
		{
			title: 'Patients Actifs',
			value: dashboardStats.totalPatients.toString(),
			change: '+12.5%',
			icon: Users,
			trend: 'up',
		},
		{
			title: 'Rendez-vous',
			value: dashboardStats.totalRendezVous.toString(),
			change: '+4.3%',
			icon: Calendar,
			trend: 'up',
		},
		{
			title: 'Consultations',
			value: dashboardStats.totalConsultations.toString(),
			change: '+2.7%',
			icon: Activity,
			trend: 'up',
		},
		{
			title: 'Taux de suivi',
			value: dashboardStats.tauxSuivi,
			change: '+5.2%',
			icon: TrendingUp,
			trend: 'up',
		},
	];

	return (
		<motion.div
			variants={listAnimation}
			className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
		>
			{stats.map((stat) => (
				<motion.div
					key={stat.title}
					variants={listItemAnimation}
					whileHover={{
						y: -4,
						transition: { type: 'spring', stiffness: 300 },
					}}
				>
					<Card className="stat-card group">
						<div className="flex items-center justify-between space-x-4">
							<div className="flex-1 space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</p>
								<div className="flex items-center space-x-2">
									<h3 className="text-2xl font-bold tracking-tight">
										{stat.value}
									</h3>
									<motion.span
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className={`text-sm font-medium ${
											stat.trend === 'up'
												? 'text-green-500'
												: 'text-red-500'
										}`}
									>
										{stat.change}
									</motion.span>
								</div>
							</div>
							<motion.div
								whileHover={{ rotate: 15 }}
								className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
							>
								<stat.icon className="h-5 w-5" />
							</motion.div>
						</div>
					</Card>
				</motion.div>
			))}
		</motion.div>
	);
};

export default StatsCards;
