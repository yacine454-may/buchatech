import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Phone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useData } from '../../contexts/DataContext';

interface IMedecin {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  status: 'En service' | 'En congé' | 'En formation';
}

const Medecins: React.FC = () => {
  const { toast } = useToast();
  const { medecins, addMedecin, updateMedecin, deleteMedecin, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedecin, setSelectedMedecin] = useState<IMedecin | null>(null);
  const [editMedecin, setEditMedecin] = useState<IMedecin | null>(null);
  const [newMedecin, setNewMedecin] = useState<Omit<IMedecin, 'id'>>({
    nom: '',
    prenom: '',
    specialite: '',
    email: '',
    telephone: '',
    status: 'En service'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedecin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewMedecin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newMedecin.nom.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le nom du médecin",
        variant: "destructive"
      });
      return;
    }

    if (!newMedecin.specialite) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une spécialité",
        variant: "destructive"
      });
      return;
    }

    if (!newMedecin.email) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer l'email du médecin",
        variant: "destructive"
      });
      return;
    }

    if (!newMedecin.telephone) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ajouter le médecin via le contexte
      await addMedecin({
      nom: 'Dr.',
      prenom: newMedecin.nom.replace('Dr. ', ''),
      specialite: newMedecin.specialite,
      email: newMedecin.email,
      telephone: newMedecin.telephone,
      status: newMedecin.status
      });

    toast({
      title: "Succès",
      description: "Le médecin a été ajouté avec succès",
      variant: "default"
    });

    setShowModal(false);
    setNewMedecin({
      nom: '',
        prenom: '',
      specialite: '',
      email: '',
      telephone: '',
      status: 'En service'
    });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du médecin",
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = (medecin: IMedecin) => {
    setSelectedMedecin(medecin);
    setShowViewModal(true);
  };

  const handleEditProfile = (medecin: IMedecin) => {
    setEditMedecin(medecin);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMedecin) return;

    try {
      await updateMedecin(editMedecin.id, editMedecin);
      
      toast({
        title: "Succès",
        description: "Le médecin a été mis à jour avec succès",
        variant: "default"
      });

    setShowEditModal(false);
      setEditMedecin(null);
    } catch (error) {
    toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du médecin",
        variant: "destructive"
    });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditMedecin(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditMedecin(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleDeleteMedecin = async (id: string) => {
    try {
      await deleteMedecin(id);
      toast({
        title: "Succès",
        description: "Le médecin a été supprimé avec succès",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du médecin",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des médecins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Médecins</h1>
          <p className="text-muted-foreground">Gérez votre équipe médicale</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Ajouter un médecin
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medecins.map((medecin) => (
          <div key={medecin.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{medecin.nom} {medecin.prenom}</h3>
                  <p className="text-sm text-muted-foreground">{medecin.specialite}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(medecin)}
                >
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProfile(medecin)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMedecin(medecin.id)}
                >
                  <X size={14} />
                </Button>
            </div>
          </div>
          
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-muted-foreground" />
                <span>{medecin.email}</span>
        </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-muted-foreground" />
                <span>{medecin.telephone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  medecin.status === 'En service' ? 'bg-green-100 text-green-800' :
                  medecin.status === 'En congé' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {medecin.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un médecin</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau médecin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={newMedecin.nom}
                    onChange={handleInputChange}
                placeholder="Nom du médecin"
                  />
                </div>
            <div>
              <Label htmlFor="specialite">Spécialité</Label>
              <Select value={newMedecin.specialite} onValueChange={(value) => handleSelectChange('specialite', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une spécialité" />
                </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diabétologue">Diabétologue</SelectItem>
                      <SelectItem value="Endocrinologue">Endocrinologue</SelectItem>
                      <SelectItem value="Podologue">Podologue</SelectItem>
                  <SelectItem value="Cardiologue">Cardiologue</SelectItem>
                  <SelectItem value="Néphrologue">Néphrologue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            <div>
              <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newMedecin.email}
                    onChange={handleInputChange}
                placeholder="email@example.com"
                  />
                </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={newMedecin.telephone}
                    onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                  />
                </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={newMedecin.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En service">En service</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                      <SelectItem value="En formation">En formation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil du médecin</DialogTitle>
          </DialogHeader>
          {selectedMedecin && (
            <div className="space-y-4">
                  <div>
                <h3 className="font-semibold">{selectedMedecin.nom} {selectedMedecin.prenom}</h3>
                <p className="text-muted-foreground">{selectedMedecin.specialite}</p>
                  </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{selectedMedecin.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{selectedMedecin.telephone}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMedecin.status === 'En service' ? 'bg-green-100 text-green-800' :
                    selectedMedecin.status === 'En congé' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                  {selectedMedecin.status}
                </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le médecin</DialogTitle>
            <DialogDescription>
              Modifiez les informations du médecin
                </DialogDescription>
          </DialogHeader>
          {editMedecin && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input
                    id="edit-nom"
                    name="nom"
                    value={editMedecin.nom}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input
                    id="edit-prenom"
                    name="prenom"
                    value={editMedecin.prenom}
                    onChange={handleEditInputChange}
                  />
              </div>
              <div>
                <Label htmlFor="edit-specialite">Spécialité</Label>
                <Select value={editMedecin.specialite} onValueChange={(value) => handleEditSelectChange('specialite', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diabétologue">Diabétologue</SelectItem>
                    <SelectItem value="Endocrinologue">Endocrinologue</SelectItem>
                    <SelectItem value="Podologue">Podologue</SelectItem>
                    <SelectItem value="Cardiologue">Cardiologue</SelectItem>
                    <SelectItem value="Néphrologue">Néphrologue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editMedecin.email}
                  onChange={handleEditInputChange}
                />
              </div>
                <div>
                  <Label htmlFor="edit-telephone">Téléphone</Label>
                  <Input
                    id="edit-telephone"
                    name="telephone"
                    value={editMedecin.telephone}
                    onChange={handleEditInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={editMedecin.status} onValueChange={(value) => handleEditSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En service">En service</SelectItem>
                    <SelectItem value="En congé">En congé</SelectItem>
                    <SelectItem value="En formation">En formation</SelectItem>
                  </SelectContent>
                </Select>
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
    </div>
  );
};

export default Medecins;
