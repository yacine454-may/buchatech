import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';

import { listAnimation, listItemAnimation } from '../animations/dashboard';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { useData } from '../../contexts/DataContext';

interface UpcomingAppointmentsProps {
	onShowPlanning?: () => void;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ onShowPlanning }) => {
	const { rendezVous } = useData();

	// Get upcoming appointments (today and future dates)
	const getUpcomingAppointments = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return rendezVous
			.filter(rdv => {
				const rdvDate = new Date(rdv.date);
				return rdvDate >= today;
			})
			.sort((a, b) => {
				const dateA = new Date(a.date + ' ' + a.heure);
				const dateB = new Date(b.date + ' ' + b.heure);
				return dateA.getTime() - dateB.getTime();
			})
			.slice(0, 8); // Show only the next 8 appointments
	};

	const upcomingAppointments = getUpcomingAppointments();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Aujourd\'hui';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Demain';
		} else {
			return date.toLocaleDateString('fr-FR', { 
				day: 'numeric', 
				month: 'short' 
			});
		}
	};

	const getStatusColor = (type: string) => {
		switch (type) {
			case 'Urgence':
				return 'destructive';
			case 'Consultation':
				return 'secondary';
			case 'Contrôle':
				return 'default';
			default:
				return 'outline';
		}
	};

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Rendez-vous à venir</h3>
				{onShowPlanning && (
					<button
						onClick={onShowPlanning}
						className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
					>
						Calendrier complet
					</button>
				)}
			</div>
			<ScrollArea className="h-[300px]">
				<motion.div
					variants={listAnimation}
					initial="hidden"
					animate="show"
					className="space-y-4"
				>
					{upcomingAppointments.length === 0 ? (
						<motion.div
							variants={listItemAnimation}
							className="p-4 rounded-lg border bg-card/50 text-center text-muted-foreground"
						>
							Aucun rendez-vous à venir
						</motion.div>
					) : (
						upcomingAppointments.map((appointment) => (
							<motion.div
								key={appointment.id}
								variants={listItemAnimation}
								whileHover={{ x: 4 }}
								className="p-4 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="p-2 rounded-full bg-primary/10">
											<User className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="font-medium">{appointment.patient}</p>
											<div className="flex items-center space-x-2 text-sm text-muted-foreground">
												<Calendar className="h-3 w-3" />
												<span>{formatDate(appointment.date)}</span>
												<Clock className="h-3 w-3" />
												<span>{appointment.heure}</span>
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												Dr. {appointment.medecin}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end space-y-1">
										<Badge variant={getStatusColor(appointment.type)}>
											{appointment.type}
										</Badge>
										{appointment.statut && (
											<span className={`text-xs px-2 py-1 rounded ${
												appointment.statut === 'Confirmé' 
													? 'bg-green-100 text-green-800' 
													: appointment.statut === 'En attente'
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-gray-100 text-gray-800'
											}`}>
												{appointment.statut}
											</span>
										)}
									</div>
								</div>
							</motion.div>
						))
					)}
				</motion.div>
			</ScrollArea>
		</>
	);
};