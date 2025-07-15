import React, { useState } from 'react';
import { Users, Plus, Search, Eye, Edit, Trash, User, Mail, Phone, Map, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Notification } from "@/components/ui/notification";
import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import { useData } from '../../contexts/DataContext';

// Définition stricte du type Patient
interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  sexe: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  photoUrl?: string;
  dateConsultation?: string;
  derniereVisite?: string;
  
  // État Civil Étendu
  profession?: string;
  habitudesToxiques?: {
    tabac: boolean;
    alcool: boolean;
    autres?: string;
  };
  origine?: string;
  
  // Diabète
  diabete: string;
  
  // Diagnostic
  diagnostic?: {
    typeOperation: string;
    typeOperationPreciser?: string;
    laterality?: string;
    reprise?: string;
    dateOperation?: string;
    facteursRisque: {
      hta: boolean;
      htaDepuis?: string;
      htaTrt?: string;
      diabete: boolean;
      diabeteDepuis?: string;
      diabeteTrt?: string;
      dyslipidemie: boolean;
      obesite: boolean;
      tabac: boolean;
      tabacDepuis?: string;
      tabacTrt?: string;
      cancer: boolean;
      autres?: string;
      autresDepuis?: string;
    };
    maladieCardiovasculaire: string;
    maladieCardiovasculaireFE?: string;
    maladieCardiovasculaireAutre?: string;
    depuis?: string;
  };
  
  // Antécédents
  antecedents?: {
    medicaux?: string;
    medicauxDetails?: {
      angorEffort: boolean;
      sca: boolean;
      idm: boolean;
      aomi: boolean;
      avc: boolean;
    };
    chirurgicaux?: string;
    chirurgicauxDetails?: {
      amputationAnterieure: string;
      amputationAnterieureType?: string;
      amputationFamiliale: string;
    };
    familiaux: {
      hta: boolean;
      dt2: boolean;
      autres?: string;
    };
  };
  
  // Clinique
  clinique?: {
    tensionArterielle?: {
      systolique?: number;
      diastolique?: number;
    };
    frequenceCardiaque?: number;
    poids?: number;
    taille?: number;
    bmi?: number;
    examenNeurologique: {
      effectue: boolean;
      type?: string;
    };
  };
  
  // Consultation
  consultation?: {
    dateAdmission?: string;
    transfert: boolean;
    specialite: string;
    typeConsultation: string;
  };
  
  // Anesthésie
  anesthesie?: {
    ag: boolean;
    alr: {
      al: boolean;
      ra: boolean;
      peridural: boolean;
      perirachicombine: boolean;
      blocPeripherique: boolean;
    };
    asa?: string;
  };
  
  // Notes et Ordonnances
  notes?: string;
  ordonnances?: string[];

  // Documents
  documents?: Array<{
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
  }>;

  // Évolution
  evolution: {
    cicatrisation: { delai: string; unite: string };
    protheseDate: string;
    crp: { initial: string; unMois: string; deuxMois: string };
    hemoglobineGlyquee: { avant: string; unMois: string; troisMois: string };
    troponine: { avantOperation: string; apresOperation: string };
    cycle: string;
    autre: string;
  };

  // Statut
  statut?: 'nouveau' | 'sous_trt' | 'apres_trt' | 'decede';
}

// Ajouter en haut du fichier, après les imports
const API_URL = import.meta.env.VITE_API_URL || '';

const Patients: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    nom: '',
    prenom: '',
    age: '',
    diabete: '',
    telephone: '',
    email: '',
    adresse: '',
    notes: '',
    photo: '',
    ordonnance: '',
    dateConsultation: '',
    sexe: 'Homme',
    // État Civil Étendu
    profession: '',
    habitudesToxiques: {
      tabac: false,
      alcool: false,
      autres: ''
    },
    origine: '',
    // Diagnostic
    diagnostic: {
      typeOperation: 'Non spécifié',
      typeOperationPreciser: '',
      laterality: 'Non spécifié',
      reprise: 'Non spécifié',
      dateOperation: '',
      facteursRisque: {
        hta: false,
        htaDepuis: '',
        htaTrt: '',
        diabete: false,
        diabeteDepuis: '',
        diabeteTrt: '',
        dyslipidemie: false,
        obesite: false,
        tabac: false,
        tabacDepuis: '',
        tabacTrt: '',
        cancer: false,
        autres: '',
        autresDepuis: ''
      },
      maladieCardiovasculaire: 'Aucune',
      maladieCardiovasculaireFE: '',
      maladieCardiovasculaireAutre: '',
      depuis: ''
    },
    // Antécédents
    antecedents: {
      medicaux: '',
      medicauxDetails: {
        angorEffort: false,
        sca: false,
        idm: false,
        aomi: false,
        avc: false
      },
      chirurgicaux: '',
      chirurgicauxDetails: {
        amputationAnterieure: 'Non spécifié',
        amputationAnterieureType: '',
        amputationFamiliale: 'Non spécifié'
      },
      familiaux: {
        hta: false,
        dt2: false,
        autres: ''
      }
    },
    // Clinique
    clinique: {
      tensionArterielle: {
        systolique: '',
        diastolique: ''
      },
      frequenceCardiaque: '',
      poids: '',
      taille: '',
      bmi: '',
      examenNeurologique: {
        effectue: false,
        type: ''
      }
    },
    // Consultation
    consultation: {
      dateAdmission: '',
      transfert: false,
      specialite: 'Médecine',
      typeConsultation: 'Externe'
    },
    // Anesthésie
    anesthesie: {
      ag: false,
      alr: {
        al: false,
        ra: false,
        peridural: false,
        perirachicombine: false,
        blocPeripherique: false
      },
      asa: ''
    },
    documents: [] as File[],
    evolution: {
      cicatrisation: { delai: '', unite: 'jour' },
      protheseDate: '',
      crp: { initial: '', unMois: '', deuxMois: '' },
      hemoglobineGlyquee: { avant: '', unMois: '', troisMois: '' },
      troponine: { avantOperation: '', apresOperation: '' },
      cycle: '',
      autre: ''
    },
    statut: 'nouveau'
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning" | "info">("success");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPatient(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrdonnanceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPatient(prev => ({ ...prev, ordonnance: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient(prev => ({ ...prev, dateConsultation: e.target.value }));
  };

  // Handlers for nested medical fields
  const handleNestedChange = (section: string, field: string, value: any) => {
    setNewPatient(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDeepNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setNewPatient(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...((prev[section] && prev[section][subsection]) || {}),
          [field]: value
        }
      }
    }));
  };

  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    setNewPatient(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
      }
    }));
  };

  const handleDeepCheckboxChange = (section: string, subsection: string, field: string, checked: boolean) => {
    setNewPatient(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...((prev[section] && prev[section][subsection]) || {}),
          [field]: checked
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.nom || !newPatient.prenom || !newPatient.age || !newPatient.sexe) {
      setNotificationMessage("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Âge, Sexe)");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }
    try {
      const patientData = {
        nom: newPatient.nom,
        prenom: newPatient.prenom,
        age: parseInt(newPatient.age),
        diabete: newPatient.diabete,
        sexe: newPatient.sexe,
        telephone: newPatient.telephone,
        email: newPatient.email,
        adresse: newPatient.adresse,
        notes: newPatient.notes,
        photoUrl: newPatient.photo,
        ordonnance: newPatient.ordonnance,
        dateConsultation: newPatient.dateConsultation,
        // État Civil Étendu
        profession: newPatient.profession,
        habitudesToxiques: newPatient.habitudesToxiques,
        origine: newPatient.origine,
        // Diagnostic
        diagnostic: {
          typeOperation: newPatient.diagnostic.typeOperation,
          typeOperationPreciser: newPatient.diagnostic.typeOperationPreciser,
          laterality: newPatient.diagnostic.laterality,
          reprise: newPatient.diagnostic.reprise,
          dateOperation: newPatient.diagnostic.dateOperation || undefined,
          facteursRisque: newPatient.diagnostic.facteursRisque,
          maladieCardiovasculaire: newPatient.diagnostic.maladieCardiovasculaire,
          maladieCardiovasculaireFE: newPatient.diagnostic.maladieCardiovasculaireFE,
          maladieCardiovasculaireAutre: newPatient.diagnostic.maladieCardiovasculaireAutre,
          depuis: newPatient.diagnostic.depuis
        },
        // Antécédents
        antecedents: {
          medicaux: newPatient.antecedents.medicaux,
          medicauxDetails: newPatient.antecedents.medicauxDetails,
          chirurgicaux: newPatient.antecedents.chirurgicaux,
          chirurgicauxDetails: newPatient.antecedents.chirurgicauxDetails,
          familiaux: newPatient.antecedents.familiaux
        },
        // Clinique
        clinique: {
          tensionArterielle: {
            systolique: newPatient.clinique.tensionArterielle.systolique ? parseInt(newPatient.clinique.tensionArterielle.systolique) : undefined,
            diastolique: newPatient.clinique.tensionArterielle.diastolique ? parseInt(newPatient.clinique.tensionArterielle.diastolique) : undefined
          },
          frequenceCardiaque: newPatient.clinique.frequenceCardiaque ? parseInt(newPatient.clinique.frequenceCardiaque) : undefined,
          poids: newPatient.clinique.poids ? parseFloat(newPatient.clinique.poids) : undefined,
          taille: newPatient.clinique.taille ? parseInt(newPatient.clinique.taille) : undefined,
          bmi: newPatient.clinique.bmi,
          examenNeurologique: newPatient.clinique.examenNeurologique
        },
        // Consultation
        consultation: {
          dateAdmission: newPatient.consultation.dateAdmission || undefined,
          transfert: newPatient.consultation.transfert,
          specialite: newPatient.consultation.specialite,
          typeConsultation: newPatient.consultation.typeConsultation
        },
        // Anesthésie
        anesthesie: newPatient.anesthesie,
        evolution: {
          cicatrisation: newPatient.evolution.cicatrisation,
          protheseDate: newPatient.evolution.protheseDate,
          crp: newPatient.evolution.crp,
          hemoglobineGlyquee: newPatient.evolution.hemoglobineGlyquee,
          troponine: newPatient.evolution.troponine,
          cycle: newPatient.evolution.cycle,
          autre: newPatient.evolution.autre
        }
      };
      
      await addPatient(patientData);
      
      if (newPatient.documents && newPatient.documents.length > 0) {
        const formData = new FormData();
        newPatient.documents.forEach(file => formData.append('files', file));
        // Use the returned patient id (assume addPatient returns the new patient or refetch)
        const createdPatient = patients.find(p => p.nom === newPatient.nom && p.prenom === newPatient.prenom);
        if (createdPatient) {
          await fetch(`${API_URL}/patients/${createdPatient.id}/upload`, {
        method: 'POST',
            body: formData
          });
        }
      }
      
      setNotificationMessage("Patient ajouté avec succès");
      setNotificationType("success");
      setShowNotification(true);
      setShowNewPatientModal(false);
      setNewPatient({
        nom: '', prenom: '', age: '', diabete: '', telephone: '', email: '', adresse: '', notes: '', photo: '', ordonnance: '', dateConsultation: '', sexe: 'Homme',
        profession: '',
        habitudesToxiques: {
          tabac: false,
          alcool: false,
          autres: ''
        },
        origine: '',
        diagnostic: {
          typeOperation: 'Non spécifié',
          typeOperationPreciser: '',
          laterality: 'Non spécifié',
          reprise: 'Non spécifié',
          dateOperation: '',
          facteursRisque: {
            hta: false,
            htaDepuis: '',
            htaTrt: '',
            diabete: false,
            diabeteDepuis: '',
            diabeteTrt: '',
            dyslipidemie: false,
            obesite: false,
            tabac: false,
            tabacDepuis: '',
            tabacTrt: '',
            cancer: false,
            autres: '',
            autresDepuis: ''
          },
          maladieCardiovasculaire: 'Aucune',
          maladieCardiovasculaireFE: '',
          maladieCardiovasculaireAutre: '',
          depuis: ''
        },
        antecedents: {
          medicaux: '',
          medicauxDetails: {
            angorEffort: false,
            sca: false,
            idm: false,
            aomi: false,
            avc: false
          },
          chirurgicaux: '',
          chirurgicauxDetails: {
            amputationAnterieure: 'Non spécifié',
            amputationAnterieureType: '',
            amputationFamiliale: 'Non spécifié'
          },
          familiaux: {
            hta: false,
            dt2: false,
            autres: ''
          }
        },
        clinique: {
          tensionArterielle: {
            systolique: '',
            diastolique: ''
          },
          frequenceCardiaque: '',
          poids: '',
          taille: '',
          bmi: '',
          examenNeurologique: {
            effectue: false,
            type: ''
          }
        },
        consultation: {
          dateAdmission: '',
          transfert: false,
          specialite: 'Médecine',
          typeConsultation: 'Externe'
        },
        documents: [],
        evolution: {
          cicatrisation: { delai: '', unite: 'jour' },
          protheseDate: '',
          crp: { initial: '', unMois: '', deuxMois: '' },
          hemoglobineGlyquee: { avant: '', unMois: '', troisMois: '' },
          troponine: { avantOperation: '', apresOperation: '' },
          cycle: '',
          autre: ''
        },
        statut: 'nouveau'
      });
    } catch (error) {
      setNotificationMessage('Erreur lors de l\'ajout du patient');
      setNotificationType('error');
      setShowNotification(true);
      console.error('Erreur ajout patient:', error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    try {
      const updatedPatient = {
        ...selectedPatient,
        photoUrl: selectedPatient.photoUrl || '',
        ordonnances: selectedPatient.ordonnances || [],
        evolution: selectedPatient.evolution || {
          cicatrisation: { delai: '', unite: 'jour' },
          protheseDate: '',
          crp: { initial: '', unMois: '', deuxMois: '' },
          hemoglobineGlyquee: { avant: '', unMois: '', troisMois: '' },
          troponine: { avantOperation: '', apresOperation: '' },
          cycle: '',
          autre: ''
        },
      };
      
      await updatePatient(selectedPatient.id, updatedPatient);
      
      setShowEditModal(false);
      setNotificationMessage("Patient modifié avec succès");
      setNotificationType("success");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage('Erreur lors de la modification');
      setNotificationType('error');
      setShowNotification(true);
      console.error('Erreur modification patient:', error);
    }
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatient(id);
      setNotificationMessage("Patient supprimé avec succès");
      setNotificationType("success");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage('Erreur lors de la suppression');
      setNotificationType('error');
      setShowNotification(true);
      console.error('Erreur suppression patient:', error);
    }
  };

  // Filtrer les patients selon le terme de recherche
  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telephone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des patients...</p>
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
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestion des Patients</h1>
            <p className="text-muted-foreground text-sm md:text-base">Gérez votre base de données patients</p>
          </div>
          <Button onClick={() => setShowNewPatientModal(true)} className="flex items-center gap-2 w-full md:w-auto">
            <Plus size={16} />
            Nouveau Patient
          </Button>
        </div>

        {/* Barre de recherche */}
            <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
            placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
              />
            </div>

        {/* Liste des patients */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
          </div> 
                  <div>
                    <h3 className="font-semibold">{patient.nom} {patient.prenom}</h3>
                    <p className="text-sm text-muted-foreground">{patient.age} ans • {patient.sexe}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(patient)}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(patient)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(patient.id)}
                  >
                    <Trash size={14} />
          </Button>
                </div>
        </div>

              <div className="space-y-2">
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-muted-foreground" />
                    <span>{patient.telephone}</span>
                  </div>
                )}
                {patient.adresse && (
                  <div className="flex items-center gap-2 text-sm">
                    <Map size={14} className="text-muted-foreground" />
                    <span className="truncate">{patient.adresse}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    patient.diabete === 'Type 1' ? 'bg-blue-100 text-blue-800' :
                    patient.diabete === 'Type 2' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.diabete}
                  </span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${patient.statut === 'nouveau' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${patient.statut === 'sous_trt' ? 'bg-blue-200 text-blue-800' : ''}
                    ${patient.statut === 'apres_trt' ? 'bg-green-200 text-green-800' : ''}
                    ${patient.statut === 'decede' ? 'bg-red-200 text-red-800' : ''}
                  `}
                >
                  {patient.statut === 'nouveau' && 'Nouveau patient'}
                  {patient.statut === 'sous_trt' && 'Sous trt'}
                  {patient.statut === 'apres_trt' && 'Après trt'}
                  {patient.statut === 'decede' && 'Décédé'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal d'ajout de patient */}
        <Dialog open={showNewPatientModal} onOpenChange={setShowNewPatientModal}>
          <DialogContent className="sm:max-w-[98vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-2 sm:p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Nouveau Patient</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouveau patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* === ÉTAT CIVIL DE BASE === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">État Civil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={newPatient.nom}
                    onChange={handleInputChange}
                      placeholder="Nom du patient"
                    required
                  />
                </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={newPatient.prenom}
                    onChange={handleInputChange}
                      placeholder="Prénom du patient"
                    required
                  />
                </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Âge *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={newPatient.age}
                    onChange={handleInputChange}
                      placeholder="Âge"
                    required
                  />
                </div>
                  <div>
                    <Label htmlFor="sexe">Sexe *</Label>
                    <Select value={newPatient.sexe} onValueChange={(value) => handleSelectChange('sexe', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Homme">Homme</SelectItem>
                        <SelectItem value="Femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newPatient.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={newPatient.telephone}
                      onChange={handleInputChange}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={newPatient.adresse}
                    onChange={handleInputChange}
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              {/* === ÉTAT CIVIL ÉTENDU === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">État Civil Étendu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={newPatient.profession}
                      onChange={handleInputChange}
                      placeholder="Profession"
                    />
                  </div>
                  <div>
                    <Label htmlFor="origine">Origine</Label>
                    <Input
                      id="origine"
                      name="origine"
                      value={newPatient.origine}
                      onChange={handleInputChange}
                      placeholder="Origine"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Habitudes toxiques</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="tabac" 
                        checked={newPatient.habitudesToxiques.tabac}
                        onCheckedChange={(checked) => handleCheckboxChange('habitudesToxiques', 'tabac', checked as boolean)}
                      />
                      <Label htmlFor="tabac">Tabac</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="alcool" 
                        checked={newPatient.habitudesToxiques.alcool}
                        onCheckedChange={(checked) => handleCheckboxChange('habitudesToxiques', 'alcool', checked as boolean)}
                      />
                      <Label htmlFor="alcool">Alcool</Label>
                    </div>
                  </div>
                  <Input
                    name="habitudesToxiquesAutres"
                    value={newPatient.habitudesToxiques.autres}
                    onChange={(e) => handleNestedChange('habitudesToxiques', 'autres', e.target.value)}
                    placeholder="Autres habitudes..."
                    className="mt-2"
                  />
                </div>
              </div>

              {/* === DIABÈTE === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Diabète</h3>
                <div>
                  <Label htmlFor="diabete">Type de diabète</Label>
                  <Select value={newPatient.diabete} onValueChange={(value) => handleSelectChange('diabete', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Type 1">Type 1</SelectItem>
                      <SelectItem value="Type 2">Type 2</SelectItem>
                      <SelectItem value="Gestationnel">Gestationnel</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                      <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* === DIAGNOSTIC === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Diagnostic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typeOperation">Type d'opération</Label>
                    <Select value={newPatient.diagnostic.typeOperation} onValueChange={(value) => handleNestedChange('diagnostic', 'typeOperation', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chopart">Chopart</SelectItem>
                        <SelectItem value="Lisfranc">Lisfranc</SelectItem>
                        <SelectItem value="Trans tibial">Trans tibial</SelectItem>
                        <SelectItem value="Trans fémoral">Trans fémoral</SelectItem>
                        <SelectItem value="Désarticulation hanche">Désarticulation hanche</SelectItem>
                        <SelectItem value="Désarticulation orteil">Désarticulation orteil</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                        <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Free text for préciser */}
                  <Input
                      className="mt-2"
                      placeholder="Préciser..."
                      value={newPatient.diagnostic.typeOperationPreciser}
                      onChange={e => handleNestedChange('diagnostic', 'typeOperationPreciser', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOperation">Date de l'opération</Label>
                    <Input
                      id="dateOperation"
                    type="date"
                      value={newPatient.diagnostic.dateOperation}
                      onChange={(e) => handleNestedChange('diagnostic', 'dateOperation', e.target.value)}
                  />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Latéralité</Label>
                    <Select value={newPatient.diagnostic.laterality} onValueChange={value => handleNestedChange('diagnostic', 'laterality', value)}>
                      <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Unilatéral">Unilatéral</SelectItem>
                        <SelectItem value="Bilatéral">Bilatéral</SelectItem>
                        <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <div>
                    <Label>Reprise</Label>
                    <Select value={newPatient.diagnostic.reprise} onValueChange={value => handleNestedChange('diagnostic', 'reprise', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                        <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Depuis (global)</Label>
                  <Input
                      placeholder="Depuis..."
                      value={newPatient.diagnostic.depuis}
                      onChange={e => handleNestedChange('diagnostic', 'depuis', e.target.value)}
                  />
                </div>
                </div>
                {/* Facteurs de risque */}
                <div>
                  <Label className="text-sm font-medium">Facteurs de risque</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {/* HTA */}
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hta" 
                          checked={newPatient.diagnostic.facteursRisque.hta}
                          onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'hta', checked as boolean)}
                        />
                        <Label htmlFor="hta">HTA</Label>
                      </div>
                      {newPatient.diagnostic.facteursRisque.hta && (
                        <div className="flex gap-2 mt-1">
                  <Input
                            placeholder="Depuis..."
                            value={newPatient.diagnostic.facteursRisque.htaDepuis}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'htaDepuis', e.target.value)}
                          />
                          <Input
                            placeholder="Trt..."
                            value={newPatient.diagnostic.facteursRisque.htaTrt}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'htaTrt', e.target.value)}
                  />
                </div>
                      )}
                    </div>
                    {/* Diabète */}
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="diabeteRisque" 
                          checked={newPatient.diagnostic.facteursRisque.diabete}
                          onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'diabete', checked as boolean)}
                        />
                        <Label htmlFor="diabeteRisque">Diabète</Label>
                      </div>
                      {newPatient.diagnostic.facteursRisque.diabete && (
                        <div className="flex gap-2 mt-1">
                  <Input
                            placeholder="Depuis..."
                            value={newPatient.diagnostic.facteursRisque.diabeteDepuis}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'diabeteDepuis', e.target.value)}
                          />
                          <Input
                            placeholder="Trt..."
                            value={newPatient.diagnostic.facteursRisque.diabeteTrt}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'diabeteTrt', e.target.value)}
                  />
                </div>
                      )}
                    </div>
                    {/* Tabac */}
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tabacRisque" 
                          checked={newPatient.diagnostic.facteursRisque.tabac}
                          onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'tabac', checked as boolean)}
                        />
                        <Label htmlFor="tabacRisque">Tabac</Label>
                      </div>
                      {newPatient.diagnostic.facteursRisque.tabac && (
                        <div className="flex gap-2 mt-1">
                          <Input
                            placeholder="Depuis..."
                            value={newPatient.diagnostic.facteursRisque.tabacDepuis}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'tabacDepuis', e.target.value)}
                          />
                          <Input
                            placeholder="Trt..."
                            value={newPatient.diagnostic.facteursRisque.tabacTrt}
                            onChange={e => handleDeepNestedChange('diagnostic', 'facteursRisque', 'tabacTrt', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    {/* Dyslipidémie */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dyslipidemie" 
                        checked={newPatient.diagnostic.facteursRisque.dyslipidemie}
                        onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'dyslipidemie', checked as boolean)}
                      />
                      <Label htmlFor="dyslipidemie">Dyslipidémie</Label>
                    </div>
                    {/* Obésité */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="obesite" 
                        checked={newPatient.diagnostic.facteursRisque.obesite}
                        onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'obesite', checked as boolean)}
                      />
                      <Label htmlFor="obesite">Obésité</Label>
                    </div>
                    {/* Cancer */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cancer" 
                        checked={newPatient.diagnostic.facteursRisque.cancer}
                        onCheckedChange={(checked) => handleDeepCheckboxChange('diagnostic', 'facteursRisque', 'cancer', checked as boolean)}
                      />
                      <Label htmlFor="cancer">Cancer</Label>
                    </div>
                  </div>
                  {/* Autre facteur de risque */}
                  <div className="mt-2">
                    <Input
                      name="facteursRisqueAutres"
                      value={newPatient.diagnostic.facteursRisque.autres}
                      onChange={(e) => handleDeepNestedChange('diagnostic', 'facteursRisque', 'autres', e.target.value)}
                      placeholder="Autre facteur de risque..."
                    />
                  </div>
                </div>
                {/* Maladie cardiovasculaire */}
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <div>
                    <Label htmlFor="maladieCardio">Maladie cardiovasculaire</Label>
                    <Select value={newPatient.diagnostic.maladieCardiovasculaire} onValueChange={(value) => handleNestedChange('diagnostic', 'maladieCardiovasculaire', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVC">AVC</SelectItem>
                        <SelectItem value="Ischémique">Ischémique</SelectItem>
                        <SelectItem value="Coronarien">Coronarien</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                        <SelectItem value="Aucune">Aucune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maladieCardioFE">FE %</Label>
                    <Input
                      id="maladieCardioFE"
                      type="number"
                      min="0"
                      max="100"
                      value={newPatient.diagnostic.maladieCardiovasculaireFE}
                      onChange={e => handleNestedChange('diagnostic', 'maladieCardiovasculaireFE', e.target.value)}
                      placeholder="Fraction d'éjection (%)"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    name="maladieCardiovasculaireAutre"
                    value={newPatient.diagnostic.maladieCardiovasculaireAutre}
                    onChange={e => handleNestedChange('diagnostic', 'maladieCardiovasculaireAutre', e.target.value)}
                    placeholder="Autre maladie cardiovasculaire..."
                  />
                </div>
              </div>

              {/* === ANTÉCÉDENTS === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Antécédents</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="antecedentsMedicaux">Antécédents médicaux</Label>
                  <Textarea
                      id="antecedentsMedicaux"
                      value={newPatient.antecedents.medicaux}
                      onChange={(e) => handleNestedChange('antecedents', 'medicaux', e.target.value)}
                      placeholder="Antécédents médicaux..."
                      rows={3}
                    />
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="angorEffort"
                          checked={newPatient.antecedents.medicauxDetails.angorEffort}
                          onCheckedChange={checked => handleDeepCheckboxChange('antecedents', 'medicauxDetails', 'angorEffort', checked as boolean)}
                        />
                        <Label htmlFor="angorEffort">Angor d'effort</Label>
                </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sca"
                          checked={newPatient.antecedents.medicauxDetails.sca}
                          onCheckedChange={checked => handleDeepCheckboxChange('antecedents', 'medicauxDetails', 'sca', checked as boolean)}
                        />
                        <Label htmlFor="sca">SCA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="idm"
                          checked={newPatient.antecedents.medicauxDetails.idm}
                          onCheckedChange={checked => handleDeepCheckboxChange('antecedents', 'medicauxDetails', 'idm', checked as boolean)}
                        />
                        <Label htmlFor="idm">IDM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aomi"
                          checked={newPatient.antecedents.medicauxDetails.aomi}
                          onCheckedChange={checked => handleDeepCheckboxChange('antecedents', 'medicauxDetails', 'aomi', checked as boolean)}
                        />
                        <Label htmlFor="aomi">AOMI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="avc"
                          checked={newPatient.antecedents.medicauxDetails.avc}
                          onCheckedChange={checked => handleDeepCheckboxChange('antecedents', 'medicauxDetails', 'avc', checked as boolean)}
                        />
                        <Label htmlFor="avc">AVC</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="antecedentsChirurgicaux">Antécédents chirurgicaux</Label>
                    <Textarea
                      id="antecedentsChirurgicaux"
                      value={newPatient.antecedents.chirurgicaux}
                      onChange={(e) => handleNestedChange('antecedents', 'chirurgicaux', e.target.value)}
                      placeholder="Antécédents chirurgicaux..."
                      rows={3}
                    />
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Label>Amputation antérieure</Label>
                        <Select value={newPatient.antecedents.chirurgicauxDetails.amputationAnterieure} onValueChange={value => handleDeepNestedChange('antecedents', 'chirurgicauxDetails', 'amputationAnterieure', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                            <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                          </SelectContent>
                        </Select>
                        {newPatient.antecedents.chirurgicauxDetails.amputationAnterieure === 'Oui' && (
                  <Input
                            className="ml-2"
                            placeholder="Type..."
                            value={newPatient.antecedents.chirurgicauxDetails.amputationAnterieureType}
                            onChange={e => handleDeepNestedChange('antecedents', 'chirurgicauxDetails', 'amputationAnterieureType', e.target.value)}
                          />
                  )}
                </div>
                      <div className="flex items-center space-x-2">
                        <Label>Amputation familiale</Label>
                        <Select value={newPatient.antecedents.chirurgicauxDetails.amputationFamiliale} onValueChange={value => handleDeepNestedChange('antecedents', 'chirurgicauxDetails', 'amputationFamiliale', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                            <SelectItem value="Non spécifié">Non spécifié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Antécédents familiaux</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="htaFamilial" 
                        checked={newPatient.antecedents.familiaux.hta}
                        onCheckedChange={(checked) => handleDeepCheckboxChange('antecedents', 'familiaux', 'hta', checked as boolean)}
                      />
                      <Label htmlFor="htaFamilial">HTA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dt2Familial" 
                        checked={newPatient.antecedents.familiaux.dt2}
                        onCheckedChange={(checked) => handleDeepCheckboxChange('antecedents', 'familiaux', 'dt2', checked as boolean)}
                      />
                      <Label htmlFor="dt2Familial">DT2</Label>
                    </div>
                  </div>
                  <Input
                    name="antecedentsFamiliauxAutres"
                    value={newPatient.antecedents.familiaux.autres}
                    onChange={(e) => handleDeepNestedChange('antecedents', 'familiaux', 'autres', e.target.value)}
                    placeholder="Autres antécédents familiaux..."
                    className="mt-2"
                  />
                </div>
              </div>

              {/* === CLINIQUE === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Clinique</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="tensionSystolique">Tension artérielle (systolique)</Label>
                    <Input
                      id="tensionSystolique"
                      type="number"
                      value={newPatient.clinique.tensionArterielle.systolique}
                      onChange={(e) => handleDeepNestedChange('clinique', 'tensionArterielle', 'systolique', e.target.value)}
                      placeholder="mmHg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tensionDiastolique">Tension artérielle (diastolique)</Label>
                    <Input
                      id="tensionDiastolique"
                      type="number"
                      value={newPatient.clinique.tensionArterielle.diastolique}
                      onChange={(e) => handleDeepNestedChange('clinique', 'tensionArterielle', 'diastolique', e.target.value)}
                      placeholder="mmHg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="frequenceCardiaque">Fréquence cardiaque</Label>
                    <Input
                      id="frequenceCardiaque"
                      type="number"
                      value={newPatient.clinique.frequenceCardiaque}
                      onChange={(e) => handleNestedChange('clinique', 'frequenceCardiaque', e.target.value)}
                      placeholder="bpm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="poids">Poids (kg)</Label>
                    <Input
                      id="poids"
                      type="number"
                      step="0.1"
                      value={newPatient.clinique.poids}
                      onChange={(e) => handleNestedChange('clinique', 'poids', e.target.value)}
                      placeholder="kg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="taille">Taille (cm)</Label>
                  <Input
                    id="taille"
                    type="number"
                    value={newPatient.clinique.taille}
                    onChange={(e) => handleNestedChange('clinique', 'taille', e.target.value)}
                    placeholder="cm"
                  />
                </div>
              </div>

              {/* === CONSULTATION === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Consultation</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="dateAdmission">Date d'admission</Label>
                    <Input
                      id="dateAdmission"
                      type="date"
                      value={newPatient.consultation.dateAdmission}
                      onChange={(e) => handleNestedChange('consultation', 'dateAdmission', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialite">Spécialité en charge</Label>
                    <Select value={newPatient.consultation.specialite} onValueChange={(value) => handleNestedChange('consultation', 'specialite', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Médecine">Médecine</SelectItem>
                        <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                        <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                        <SelectItem value="Endocrinologie">Endocrinologie</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="typeConsultation">Type de consultation</Label>
                    <Select value={newPatient.consultation.typeConsultation} onValueChange={(value) => handleNestedChange('consultation', 'typeConsultation', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Publique">Publique</SelectItem>
                        <SelectItem value="Privée">Privée</SelectItem>
                        <SelectItem value="Externe">Externe</SelectItem>
                        <SelectItem value="Urgence">Urgence</SelectItem>
                        <SelectItem value="Hospitalisation">Hospitalisation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="transfert" 
                      checked={newPatient.consultation.transfert}
                      onCheckedChange={(checked) => handleNestedChange('consultation', 'transfert', checked as boolean)}
                    />
                    <Label htmlFor="transfert">Transfert d'un autre établissement</Label>
                  </div>
                </div>
              </div>

              {/* === ANESTHÉSIE === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Anesthésie</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ag" 
                      checked={newPatient.anesthesie.ag}
                      onCheckedChange={(checked) => handleNestedChange('anesthesie', 'ag', checked as boolean)}
                    />
                    <Label htmlFor="ag">AG</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">ALR</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="al" 
                          checked={newPatient.anesthesie.alr.al}
                          onCheckedChange={(checked) => handleDeepNestedChange('anesthesie', 'alr', 'al', checked as boolean)}
                        />
                        <Label htmlFor="al">A.L</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="ra" 
                          checked={newPatient.anesthesie.alr.ra}
                          onCheckedChange={(checked) => handleDeepNestedChange('anesthesie', 'alr', 'ra', checked as boolean)}
                        />
                        <Label htmlFor="ra">R.A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="peridural" 
                          checked={newPatient.anesthesie.alr.peridural}
                          onCheckedChange={(checked) => handleDeepNestedChange('anesthesie', 'alr', 'peridural', checked as boolean)}
                        />
                        <Label htmlFor="peridural">Péridural</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perirachicombine" 
                          checked={newPatient.anesthesie.alr.perirachicombine}
                          onCheckedChange={(checked) => handleDeepNestedChange('anesthesie', 'alr', 'perirachicombine', checked as boolean)}
                        />
                        <Label htmlFor="perirachicombine">Périrachi-combiné</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="blocPeripherique" 
                          checked={newPatient.anesthesie.alr.blocPeripherique}
                          onCheckedChange={(checked) => handleDeepNestedChange('anesthesie', 'alr', 'blocPeripherique', checked as boolean)}
                        />
                        <Label htmlFor="blocPeripherique">Bloc périphérique</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="asa">Classification ASA</Label>
                    <Select value={newPatient.anesthesie.asa} onValueChange={(value) => handleNestedChange('anesthesie', 'asa', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une classification ASA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASA I">ASA I</SelectItem>
                        <SelectItem value="ASA II">ASA II</SelectItem>
                        <SelectItem value="ASA III">ASA III</SelectItem>
                        <SelectItem value="ASA IV">ASA IV</SelectItem>
                        <SelectItem value="ASA V">ASA V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* === NOTES ET ORDONNANCES === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Notes et Ordonnances</h3>
                <div>
                  <Label htmlFor="ordonnance">Ordonnance</Label>
                  <Textarea
                    id="ordonnance"
                    value={newPatient.ordonnance}
                    onChange={handleOrdonnanceChange}
                    placeholder="Détails de l'ordonnance..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newPatient.notes}
                    onChange={handleInputChange}
                    placeholder="Notes additionnelles..."
                    rows={3}
                  />
              </div>
              </div>

              {/* === DOCUMENTS === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Documents</h3>
                <input
                  type="file"
                  name="documents"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  onChange={e => setNewPatient(prev => ({ ...prev, documents: e.target.files ? Array.from(e.target.files) : [] }))}
                  className="mb-2"
                />
                {newPatient.documents && newPatient.documents.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {newPatient.documents.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} Ko)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* === ÉVOLUTION === */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">Évolution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Délai de cicatrisation</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={newPatient.evolution.cicatrisation.delai}
                        onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, cicatrisation: { ...prev.evolution.cicatrisation, delai: e.target.value } } }))}
                        placeholder="Nombre"
                      />
                      <select
                        value={newPatient.evolution.cicatrisation.unite}
                        onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, cicatrisation: { ...prev.evolution.cicatrisation, unite: e.target.value } } }))}
                        className="border rounded px-2 py-1"
                      >
                        <option value="jour">jour</option>
                        <option value="mois">mois</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Date de prothèse</Label>
                    <Input
                      type="date"
                      value={newPatient.evolution.protheseDate}
                      onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, protheseDate: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <Label>CRP (mg/L)</Label>
                    <div className="flex gap-2">
                      <Input type="number" step="any" placeholder="Initial" value={newPatient.evolution.crp.initial} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, crp: { ...prev.evolution.crp, initial: e.target.value } } }))} />
                      <Input type="number" step="any" placeholder="1 mois" value={newPatient.evolution.crp.unMois} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, crp: { ...prev.evolution.crp, unMois: e.target.value } } }))} />
                      <Input type="number" step="any" placeholder="2 mois" value={newPatient.evolution.crp.deuxMois} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, crp: { ...prev.evolution.crp, deuxMois: e.target.value } } }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Hémoglobine glyquée (%)</Label>
                    <div className="flex gap-2">
                      <Input type="number" step="any" placeholder="Avant" value={newPatient.evolution.hemoglobineGlyquee.avant} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, hemoglobineGlyquee: { ...prev.evolution.hemoglobineGlyquee, avant: e.target.value } } }))} />
                      <Input type="number" step="any" placeholder="1 mois" value={newPatient.evolution.hemoglobineGlyquee.unMois} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, hemoglobineGlyquee: { ...prev.evolution.hemoglobineGlyquee, unMois: e.target.value } } }))} />
                      <Input type="number" step="any" placeholder="3 mois" value={newPatient.evolution.hemoglobineGlyquee.troisMois} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, hemoglobineGlyquee: { ...prev.evolution.hemoglobineGlyquee, troisMois: e.target.value } } }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Troponine (ng/L)</Label>
                    <div className="flex gap-2">
                      <Input type="number" step="any" placeholder="Avant op" value={newPatient.evolution.troponine.avantOperation} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, troponine: { ...prev.evolution.troponine, avantOperation: e.target.value } } }))} />
                      <Input type="number" step="any" placeholder="Après op" value={newPatient.evolution.troponine.apresOperation} onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, troponine: { ...prev.evolution.troponine, apresOperation: e.target.value } } }))} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Cycle</Label>
                    <Textarea
                      value={newPatient.evolution.cycle}
                      onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, cycle: e.target.value } }))}
                      placeholder="Cycle, remarques, etc."
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Autre</Label>
                    <Textarea
                      value={newPatient.evolution.autre}
                      onChange={e => setNewPatient(prev => ({ ...prev, evolution: { ...prev.evolution, autre: e.target.value } }))}
                      placeholder="Autres informations sur l'évolution..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="statut">Statut du patient</Label>
                <select
                  id="statut"
                  value={newPatient.statut}
                  onChange={e => setNewPatient(prev => ({ ...prev, statut: e.target.value }))}
                  className="border rounded px-2 py-1"
                >
                  <option value="nouveau">Nouveau patient</option>
                  <option value="sous_trt">Sous trt</option>
                  <option value="apres_trt">Après trt</option>
                  <option value="decede">Décédé</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowNewPatientModal(false)}>
                  Annuler
                      </Button>
                <Button type="submit">Ajouter le Patient</Button>
                    </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de visualisation */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du Patient</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedPatient.nom} {selectedPatient.prenom}</h3>
                  <p className="text-muted-foreground">{selectedPatient.age} ans • {selectedPatient.sexe}</p>
                </div>
              <div className="space-y-2">
                  {selectedPatient.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>{selectedPatient.email}</span>
                    </div>
                  )}
                  {selectedPatient.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <span>{selectedPatient.telephone}</span>
                    </div>
                  )}
                  {selectedPatient.adresse && (
                    <div className="flex items-center gap-2">
                      <Map size={16} className="text-muted-foreground" />
                      <span>{selectedPatient.adresse}</span>
                    </div>
                  )}
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPatient.diabete === 'Type 1' ? 'bg-blue-100 text-blue-800' :
                      selectedPatient.diabete === 'Type 2' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPatient.diabete}
                    </span>
                  </div>
                  {selectedPatient.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes:</h4>
                      <p className="text-sm text-muted-foreground">{selectedPatient.notes}</p>
                    </div>
                  )}
                  {selectedPatient.ordonnances && selectedPatient.ordonnances.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Ordonnances:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedPatient.ordonnances.map((ordonnance, index) => (
                          <li key={index}>• {ordonnance}</li>
                    ))}
                  </ul>
                </div>
                  )}
                </div>

                <section className="mt-6">
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem('documents') as HTMLInputElement;
                        if (!input.files || input.files.length === 0) return;
                        const formData = new FormData();
                        for (const file of Array.from(input.files)) {
                          formData.append('files', file);
                        }
                        const res = await fetch(`${API_URL}/patients/${selectedPatient.id}/upload`, {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setSelectedPatient({ ...selectedPatient, documents: data.documents });
                          toast.success('Fichiers ajoutés avec succès');
                        } else {
                          toast.error('Erreur lors de l\'upload');
                        }
                      }}
                    >
                      <input
                        type="file"
                        name="documents"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                        className="mb-2"
                      />
                      <Button type="submit" size="sm">Ajouter des fichiers</Button>
                    </form>
                    <ul className="mt-2 space-y-2">
                      {selectedPatient.documents && selectedPatient.documents.length > 0 ? (
                        selectedPatient.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            {doc.mimetype.startsWith('image') ? (
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <img src={doc.url} alt={doc.originalname} className="w-12 h-12 object-cover rounded border" />
                              </a>
                            ) : (
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                                {doc.originalname}
                              </a>
                            )}
                            <span className="text-xs text-muted-foreground">({(doc.size / 1024).toFixed(1)} Ko)</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground text-sm">Aucun document</li>
                      )}
                    </ul>
                  </div>
                </section>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de modification */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[98vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-2 sm:p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Modifier le Patient</DialogTitle>
              <DialogDescription>
                Modifiez les informations du patient
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input
                    id="edit-nom"
                      name="nom"
                    value={selectedPatient.nom}
                      onChange={(e) => setSelectedPatient({...selectedPatient, nom: e.target.value})}
                  />
                </div>
                  <div>
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input
                    id="edit-prenom"
                      name="prenom"
                    value={selectedPatient.prenom}
                      onChange={(e) => setSelectedPatient({...selectedPatient, prenom: e.target.value})}
                  />
                </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                  <Label htmlFor="edit-age">Âge</Label>
                  <Input
                    id="edit-age"
                      name="age"
                    type="number"
                    value={selectedPatient.age}
                      onChange={(e) => setSelectedPatient({...selectedPatient, age: parseInt(e.target.value)})}
                  />
                </div>
                  <div>
                    <Label htmlFor="edit-sexe">Sexe</Label>
                    <Select value={selectedPatient.sexe || 'Homme'} onValueChange={(value) => setSelectedPatient({...selectedPatient, sexe: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Homme">Homme</SelectItem>
                        <SelectItem value="Femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-diabete">Type de diabète</Label>
                  <Select value={selectedPatient.diabete} onValueChange={(value) => setSelectedPatient({...selectedPatient, diabete: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Type 1">Type 1</SelectItem>
                      <SelectItem value="Type 2">Type 2</SelectItem>
                      <SelectItem value="Gestationnel">Gestationnel</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedPatient.email || ''}
                      onChange={(e) => setSelectedPatient({...selectedPatient, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-telephone">Téléphone</Label>
                    <Input
                      id="edit-telephone"
                      name="telephone"
                      value={selectedPatient.telephone || ''}
                      onChange={(e) => setSelectedPatient({...selectedPatient, telephone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-adresse">Adresse</Label>
                  <Input
                    id="edit-adresse"
                    name="adresse"
                    value={selectedPatient.adresse || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, adresse: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    name="notes"
                    value={selectedPatient.notes || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Notification */}
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationType}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default Patients;