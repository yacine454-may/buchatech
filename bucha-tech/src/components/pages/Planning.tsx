import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useData } from '../../contexts/DataContext';

const Planning: React.FC = () => {
  const { toast } = useToast();
  const { rendezVous, medecins, addRendezVous, loading } = useData();
  const [currentView, setCurrentView] = useState('semaine');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    medecin: '',
    type: '',
    date: '',
    heure: '',
    notes: ''
  });

  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newAppointment.patient.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le nom du patient",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.medecin) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un médecin",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner le type de consultation",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.date) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.heure) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une heure",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si un rendez-vous existe déjà à cette date et heure pour ce médecin
    const existingAppointment = rendezVous.find(rdv => 
      rdv.heure === newAppointment.heure && 
      rdv.medecin === newAppointment.medecin &&
      rdv.date === newAppointment.date
    );

    if (existingAppointment) {
      toast({
        title: "Conflit d'horaire",
        description: "Ce médecin a déjà un rendez-vous prévu à cette heure",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ajouter le rendez-vous via le contexte
      await addRendezVous({
      heure: newAppointment.heure,
      patient: newAppointment.patient,
      medecin: newAppointment.medecin,
        type: newAppointment.type,
        date: newAppointment.date,
        notes: newAppointment.notes
    });

    toast({
      title: "Rendez-vous créé",
      description: "Le rendez-vous a été ajouté avec succès",
      variant: "default"
    });

    setIsModalOpen(false);
    setNewAppointment({
      patient: '',
      medecin: '',
      type: '',
      date: '',
      heure: '',
      notes: ''
    });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du rendez-vous",
        variant: "destructive"
      });
    }
  };

  const typeConsultations = [
    'Consultation',
    'Contrôle',
    'Urgence',
    'Suivi traitement',
    'Consultation initiale'
  ];

  // Helper to filter RDVs based on view and search
  const getFilteredRendezVous = () => {
    let filtered = rendezVous;

    // Filter by search patient name
    if (searchPatient.trim()) {
      filtered = filtered.filter(rdv => 
        rdv.patient.toLowerCase().includes(searchPatient.toLowerCase())
      );
    }

    // Filter by view (jour, semaine, mois)
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    
    if (currentView === 'jour') {
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.date);
        return rdvDate.toDateString() === today.toDateString();
      });
    } else if (currentView === 'semaine') {
      // Get start and end of week (Monday to Sunday)
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() + 1); // Monday
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // Sunday
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.date);
        return rdvDate >= start && rdvDate <= end;
      });
    } else if (currentView === 'mois') {
      const month = today.getMonth();
      const year = today.getFullYear();
      filtered = filtered.filter(rdv => {
        const rdvDate = new Date(rdv.date);
        return rdvDate.getMonth() === month && rdvDate.getFullYear() === year;
      });
    }

    return filtered;
  };

  const filteredRendezVous = getFilteredRendezVous();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="planning-page fade-in">
      <div className="pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Planning Médical</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Gestion des rendez-vous et consultations</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['jour', 'semaine', 'mois'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === view
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="pl-10"
            />
                      </div>
                    </div>

        {/* Vue du planning dynamique */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">
              Rendez-vous ({currentView.charAt(0).toUpperCase() + currentView.slice(1)}) 
              {searchPatient && ` - Recherche: "${searchPatient}"`}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredRendezVous.length} rendez-vous trouvé(s)
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Médecin</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Heure</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredRendezVous.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {searchPatient ? `Aucun rendez-vous trouvé pour "${searchPatient}"` : 'Aucun rendez-vous'}
                    </td>
                  </tr>
                ) : (
                  filteredRendezVous.map((rdv, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm">{rdv.patient}</td>
                      <td className="px-4 py-3 text-sm">{rdv.medecin}</td>
                      <td className="px-4 py-3 text-sm">{new Date(rdv.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3 text-sm">{rdv.heure}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rdv.type === 'Urgence' ? 'bg-red-100 text-red-800' :
                          rdv.type === 'Consultation' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                        {rdv.type}
                      </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{rdv.statut || 'En attente'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rdv.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
                    </div>
                  </div>
                </div>

      {/* Modal d'ajout de rendez-vous */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau Rendez-vous</DialogTitle>
            <DialogDescription>
              Créez un nouveau rendez-vous médical
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient *</Label>
                  <Input
                    id="patient"
                    name="patient"
                    value={newAppointment.patient}
                    onChange={handleInputChange}
                placeholder="Nom du patient"
                required
                  />
                </div>
            
            <div>
              <Label htmlFor="medecin">Médecin *</Label>
              <Select value={newAppointment.medecin} onValueChange={(value) => handleSelectChange('medecin', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                    <SelectContent>
                      {medecins.map((medecin) => (
                    <SelectItem key={medecin.id} value={`${medecin.nom} ${medecin.prenom}`}>
                      {medecin.nom} {medecin.prenom} - {medecin.specialite}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

            <div>
              <Label htmlFor="type">Type de consultation *</Label>
              <Select value={newAppointment.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                  {typeConsultations.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={handleInputChange}
                  required
                  />
              </div>
              <div>
                <Label htmlFor="heure">Heure *</Label>
                  <Input
                    id="heure"
                    name="heure"
                    type="time"
                    value={newAppointment.heure}
                    onChange={handleInputChange}
                  required
                  />
                </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                placeholder="Notes additionnelles..."
                  />
          </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
              <Button type="submit">Créer le RDV</Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planning;