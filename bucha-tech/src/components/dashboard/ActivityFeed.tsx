import React, { useCallback, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { listAnimation, listItemAnimation } from "../animations/dashboard";
import { Calendar, User, AlertTriangle, CheckCircle, Clock, Info, AlertCircle } from "lucide-react";
import { useData } from '../../contexts/DataContext';

interface Notification {
  id: string;
  type: 'appointment' | 'urgent' | 'reminder' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedId?: string;
  actionUrl?: string;
}

export const ActivityFeed = () => {
  const { patients, medecins, rendezVous, consultations } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on database data
  const generateNotifications = useCallback(() => {
    const newNotifications: Notification[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Recent appointments (last 24 hours)
    const recentAppointments = rendezVous.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return rdvDate >= yesterday;
    });

    recentAppointments.forEach(rdv => {
      const rdvDate = new Date(rdv.date);
      const isToday = rdvDate.toDateString() === today.toDateString();
      const hoursAgo = Math.floor((now.getTime() - rdvDate.getTime()) / (1000 * 60 * 60));

      if (isToday) {
        newNotifications.push({
          id: `appointment-today-${rdv.id}`,
          type: 'appointment',
          title: 'Rendez-vous aujourd\'hui',
          message: `${rdv.patient} - ${rdv.heure} (${rdv.type})`,
          time: `${hoursAgo > 0 ? `Il y a ${hoursAgo}h` : 'Récemment'}`,
          read: false,
          priority: 'medium',
          relatedId: rdv.id,
          actionUrl: '/planning'
        });
      }
    });

    // 2. Urgent appointments
    const urgentAppointments = rendezVous.filter(rdv => 
      rdv.type === 'Urgence' && new Date(rdv.date) >= today
    );

    urgentAppointments.forEach(rdv => {
      newNotifications.push({
        id: `urgent-${rdv.id}`,
        type: 'urgent',
        title: 'URGENCE',
        message: `${rdv.patient} - ${rdv.heure} - ${rdv.medecin}`,
        time: 'Maintenant',
        read: false,
        priority: 'high',
        relatedId: rdv.id,
        actionUrl: '/planning'
      });
    });

    // 3. New patients (last 24 hours)
    const recentPatients = patients.filter(patient => {
      const patientDate = new Date(patient.derniereVisite || patient.dateConsultation || '');
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return patientDate >= yesterday;
    });

    if (recentPatients.length > 0) {
      newNotifications.push({
        id: 'new-patients',
        type: 'success',
        title: 'Nouveaux patients',
        message: `${recentPatients.length} nouveau(x) patient(s) ajouté(s)`,
        time: 'Récemment',
        read: false,
        priority: 'low',
        actionUrl: '/patients'
      });
    }

    // 4. Doctors on leave
    const doctorsOnLeave = medecins.filter(medecin => medecin.status === 'En congé');
    if (doctorsOnLeave.length > 0) {
      newNotifications.push({
        id: 'doctors-leave',
        type: 'warning',
        title: 'Médecins en congé',
        message: `${doctorsOnLeave.length} médecin(s) actuellement en congé`,
        time: 'Maintenant',
        read: false,
        priority: 'medium',
        actionUrl: '/medecins'
      });
    }

    // 5. Recent consultations
    const recentConsultations = consultations.filter(consultation => {
      const consultDate = new Date(consultation.date);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return consultDate >= yesterday;
    });

    if (recentConsultations.length > 0) {
      newNotifications.push({
        id: 'recent-consultations',
        type: 'info',
        title: 'Consultations récentes',
        message: `${recentConsultations.length} consultation(s) effectuée(s) récemment`,
        time: 'Récemment',
        read: false,
        priority: 'low',
        actionUrl: '/statistiques'
      });
    }

    return newNotifications
      .sort((a, b) => {
        // Sort by priority first, then by time
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return 0;
      })
      .slice(0, 10); // Show only top 10 notifications
  }, [patients, medecins, rendezVous, consultations]);

  // Update notifications when data changes
  useEffect(() => {
    const newNotifications = generateNotifications();
    setNotifications(newNotifications);
  }, [generateNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'urgent': return AlertCircle;
      case 'reminder': return Clock;
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      default: return User;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'urgent': return '#ef4444';
        case 'reminder': return '#f59e0b';
        default: return '#3b82f6';
      }
    }
    
    switch (type) {
      case 'appointment': return '#3b82f6';
      case 'urgent': return '#ef4444';
      case 'reminder': return '#f59e0b';
      case 'info': return '#06b6d4';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activités récentes</h3>
        <span className="text-sm text-muted-foreground">
          {notifications.length} notification(s)
        </span>
      </div>
      
      <motion.div
        variants={listAnimation}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {notifications.length === 0 ? (
          <motion.div
            variants={listItemAnimation}
            className="text-center py-8 text-muted-foreground"
          >
            Aucune activité récente
          </motion.div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type, notification.priority);

            return (
              <motion.div
                key={notification.id}
                variants={listItemAnimation}
                className="activity-item hover-lift cursor-pointer"
                style={{ borderLeftColor: color }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="activity-item-content">
                  <div className="activity-item-info">
                    <div className="activity-item-icon" style={{ background: `${color}15` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div className="activity-item-details">
                      <div className="activity-item-patient">{notification.title}</div>
                      <div className="activity-item-action">{notification.message}</div>
                      <div className="activity-item-medecin">{notification.time}</div>
                    </div>
                  </div>
                  <div className="activity-item-time" style={{ background: color }}>
                    {notification.priority === 'high' ? '!' : '•'}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </>
  );
};
