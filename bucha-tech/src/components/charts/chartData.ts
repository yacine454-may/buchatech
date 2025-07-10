
/* =============================================================================
   DONNÉES DES GRAPHIQUES - Configuration centralisée des données
   ============================================================================= */

export const chartData = {
  // Données pour le graphique des consultations par mois
  consultationsData: [
    { month: 'Jan', consultations: 280, urgences: 12 },
    { month: 'Fév', consultations: 110, urgences: 8 },
    { month: 'Mar', consultations: 250, urgences: 15 },
    { month: 'Avr', consultations: 20, urgences: 10 },
    { month: 'Mai', consultations: 125, urgences: 8 },
    { month: 'Jun', consultations: 340, urgences: 24 }
  ],

  // Données pour la répartition des pathologies avec couleurs claires
  pathologiesData: [
    { name: 'Diabète Type 1', value: 35, color: 'var(--primary-300)' },
    { name: 'Diabète Type 2', value: 45, color: 'var(--secondary-300)' },
    { name: 'Ulcères', value: 15, color: 'var(--accent-300)' },
    { name: 'Autres', value: 5, color: 'var(--danger-300)' }
  ],

  // Données pour l'évolution des patients
  patientsEvolutionData: [
    { week: 'S1', nouveaux: 12, gueris: 2, enTraitement: 40 },
     
    { week: 'S2', nouveaux: 20, gueris: 10, enTraitement: 60 },
    { week: 'S3', nouveaux: 5, gueris: 12, enTraitement: 6 },
    { week: 'S4', nouveaux: 28, gueris: 15, enTraitement: 59 }
  ],
  // Données pour le nombre de médecins en service
  medecinsServiceData: [
    { mois: '1 Jan', total: 15, disponible: 12 },
      { mois: '15  Jan', total: 15, disponible: 8 },
    { mois: '1 Fév', total: 19, disponible: 12 },
        { mois: '15 Fév', total: 15, disponible: 14 },
    { mois: '1 Mar', total: 21, disponible: 11 },
        { mois: '15 Mar', total: 18, disponible: 15 },
    { mois: '1 Avr', total: 18, disponible: 12 },
        { mois: '15 Avr', total: 18, disponible: 17 },
    { mois: '1 Mai', total: 5, disponible: 3 },
     { mois: '15 Mai', total: 10, disponible: 7 },
    { mois: '1 Jan', total: 10, disponible: 2 },
     { mois: '15 Jan', total: 5, disponible: 1 },
    
    { mois: 'Jun', total: 22, disponible: 19 }
  ]
};