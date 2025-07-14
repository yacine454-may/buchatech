import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, User, Calendar, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '../../contexts/DataContext';
import './NotificationCenter.css';

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

const NotificationCenter: React.FC = () => {
  const { toast } = useToast();
  const { patients, medecins, rendezVous, consultations } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastCheck, setLastCheck] = useState(new Date());

  // Generate notifications based on database data
  const generateNotifications = useCallback(() => {
    const newNotifications: Notification[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Upcoming appointments (next 24 hours)
    const upcomingAppointments = rendezVous.filter(rdv => {
      const rdvDate = new Date(rdv.date);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return rdvDate >= today && rdvDate <= tomorrow;
    });

    upcomingAppointments.forEach(rdv => {
      const rdvDate = new Date(rdv.date);
      const isToday = rdvDate.toDateString() === today.toDateString();
      const hoursUntil = Math.floor((rdvDate.getTime() - now.getTime()) / (1000 * 60 * 60));

      if (hoursUntil <= 2 && hoursUntil > 0) {
        newNotifications.push({
          id: `appointment-${rdv.id}`,
          type: 'reminder',
          title: 'Rendez-vous dans 2h',
          message: `${rdv.patient} - ${rdv.heure} avec Dr. ${rdv.medecin}`,
          time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          read: false,
          priority: 'high',
          relatedId: rdv.id,
          actionUrl: '/planning'
        });
      } else if (isToday) {
        newNotifications.push({
          id: `appointment-today-${rdv.id}`,
          type: 'appointment',
          title: 'Rendez-vous aujourd\'hui',
          message: `${rdv.patient} - ${rdv.heure} (${rdv.type})`,
          time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
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
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
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
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
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
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
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
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        priority: 'low',
        actionUrl: '/statistiques'
      });
    }

    return newNotifications;
  }, [patients, medecins, rendezVous, consultations]);

  // Check for new notifications every minute
  useEffect(() => {
    const checkNotifications = () => {
      const newNotifications = generateNotifications();
      
      // Only add notifications that don't already exist
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
        
        if (uniqueNewNotifications.length > 0) {
          // Show toast for high priority notifications
          uniqueNewNotifications.forEach(notif => {
            if (notif.priority === 'high') {
      toast({
                title: notif.title,
                description: notif.message,
                variant: notif.type === 'urgent' ? 'destructive' : 'default'
              });
            }
          });
        }
        
        return [...uniqueNewNotifications, ...prev].slice(0, 20); // Keep last 20 notifications
      });
      
      setLastCheck(new Date());
    };

    // Initial check
    checkNotifications();

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [generateNotifications, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      // Navigate to the relevant page
      window.location.href = notification.actionUrl;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar size={18} />;
      case 'urgent': return <AlertCircle size={18} />;
      case 'reminder': return <Clock size={18} />;
      case 'info': return <Info size={18} />;
      case 'success': return <CheckCircle size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getNotificationClass = (type: string, priority: string) => {
    const baseClass = `notification-${type}`;
    const priorityClass = `priority-${priority}`;
    return `${baseClass} ${priorityClass}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-button"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <span className="notification-time">
                Dernière mise à jour: {lastCheck.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-ghost"
                onClick={markAllAsRead}
              >
                Tout marquer lu
              </button>
            )}
            </div>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                Aucune notification
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${getNotificationClass(notification.type, notification.priority)} ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    borderLeft: `3px solid ${getPriorityColor(notification.priority)}`
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  <button 
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
