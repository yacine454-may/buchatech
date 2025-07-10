import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import Medecin from '../models/Medecin.js';
import RendezVous from '../models/RendezVous.js';
import Consultation from '../models/Consultation.js';

// Sample patients data
const patientsData = [
  {
    nom: 'Mohammed',
    prenom: 'Khenouna',
    age: 55,
    diabete: 'Type 2',
    derniereVisite: new Date('2024-01-15'),
    sexe: 'Homme',
    telephone: '0551234567',
    email: 'mohammed.khenouna@example.com',
    adresse: '123 Rue des Oliviers, Alger',
    notes: 'Patient stable, contrôle trimestriel',
    photoUrl: '',
    ordonnances: ['Metformine 500mg 2x/jour']
  },
  {
    nom: 'Sayah',
    prenom: 'Ouadi',
    age: 38,
    diabete: 'Type 1',
    derniereVisite: new Date('2024-01-14'),
    sexe: 'Homme',
    telephone: '0667890123',
    email: 'sayah.ouadi@example.com',
    adresse: '456 Avenue des Palmiers, Oran',
    notes: 'Insulinothérapie en cours',
    photoUrl: '',
    ordonnances: ['Insuline rapide 3x/jour']
  },
  {
    nom: 'Larassi',
    prenom: 'Amine',
    age: 32,
    diabete: 'Type 2',
    derniereVisite: new Date('2024-01-13'),
    sexe: 'Femme',
    telephone: '0774567890',
    email: 'amine.larassi@example.com',
    adresse: '789 Boulevard des Roses, Constantine',
    notes: 'Régime alimentaire strict',
    photoUrl: '',
    ordonnances: ['Gliclazide 60mg 1x/jour']
  },
  {
    nom: 'Tlemcani',
    prenom: 'Imane',
    age: 45,
    diabete: 'Type 2',
    derniereVisite: new Date('2024-01-12'),
    sexe: 'Femme',
    telephone: '0789012345',
    email: 'imane.tlemcani@example.com',
    adresse: '321 Rue de la Paix, Annaba',
    notes: 'Suivi podologique nécessaire',
    photoUrl: '',
    ordonnances: ['Metformine 1000mg 2x/jour']
  },
  {
    nom: 'Bouzidi',
    prenom: 'Zahra',
    age: 28,
    diabete: 'Type 1',
    derniereVisite: new Date('2024-01-11'),
    sexe: 'Femme',
    telephone: '0798765432',
    email: 'zahra.bouzidi@example.com',
    adresse: '654 Avenue de la Liberté, Tlemcen',
    notes: 'Nouvelle patiente, insulinothérapie',
    photoUrl: '',
    ordonnances: ['Insuline basale 1x/jour', 'Insuline rapide 3x/jour']
  },
  {
    nom: 'Complet',
    prenom: 'Test',
    age: 47,
    sexe: 'Homme',
    telephone: '0612345678',
    email: 'complet.test@example.com',
    adresse: '1 Rue Complète, Alger',
    photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    dateConsultation: new Date('2024-01-10'),
    derniereVisite: new Date('2024-07-01'),
    profession: 'Ingénieur',
    habitudesToxiques: {
      tabac: true,
      alcool: true,
      autres: 'Chicha'
    },
    origine: 'Kabylie',
    diabete: 'Type 1',
    diagnostic: {
      typeOperation: 'Chopart',
      typeOperationPreciser: 'Chopart partiel',
      laterality: 'Unilatéral',
      reprise: 'Oui',
      dateOperation: new Date('2024-03-15'),
      facteursRisque: {
        hta: true,
        htaDepuis: '2015',
        htaTrt: 'Amlor',
        diabete: true,
        diabeteDepuis: '2010',
        diabeteTrt: 'Insuline',
        dyslipidemie: true,
        obesite: true,
        tabac: true,
        tabacDepuis: '2005',
        tabacTrt: 'Patch',
        cancer: false,
        autres: 'Hyperuricémie',
        autresDepuis: '2018'
      },
      maladieCardiovasculaire: 'Ischémique',
      maladieCardiovasculaireFE: '45',
      maladieCardiovasculaireAutre: 'Pontage',
      depuis: '2012'
    },
    antecedents: {
      medicaux: 'HTA, diabète, dyslipidémie',
      medicauxDetails: {
        angorEffort: true,
        sca: true,
        idm: false,
        aomi: true,
        avc: false
      },
      chirurgicaux: 'Appendicectomie, amputation orteil',
      chirurgicauxDetails: {
        amputationAnterieure: 'Oui',
        amputationAnterieureType: 'Orteil droit',
        amputationFamiliale: 'Non'
      },
      familiaux: {
        hta: true,
        dt2: true,
        autres: 'Père IDM'
      }
    },
    clinique: {
      tensionArterielle: {
        systolique: 140,
        diastolique: 85
      },
      frequenceCardiaque: 78,
      poids: 82,
      taille: 175,
      bmi: 26.8,
      examenNeurologique: {
        effectue: true,
        type: 'EMG'
      }
    },
    consultation: {
      dateAdmission: new Date('2024-01-10'),
      transfert: false,
      specialite: 'Chirurgie',
      typeConsultation: 'Hospitalisation'
    },
    anesthesie: {
      ag: true,
      alr: {
        al: true,
        ra: true,
        peridural: true,
        perirachicombine: false,
        blocPeripherique: true
      },
      asa: 'ASA III'
    },
    documents: [
      {
        filename: 'radio1.pdf',
        originalname: 'radio1.pdf',
        mimetype: 'application/pdf',
        size: 123456,
        url: 'https://example.com/docs/radio1.pdf'
      },
      {
        filename: 'analyse1.jpg',
        originalname: 'analyse1.jpg',
        mimetype: 'image/jpeg',
        size: 23456,
        url: 'https://example.com/docs/analyse1.jpg'
      }
    ],
    notes: 'Patient très suivi, dossier complet.',
    ordonnances: ['Metformine 500mg', 'Amlor 10mg', 'Insuline rapide'],
    evolution: {
      cicatrisation: {
        delai: 30,
        unite: 'jour'
      },
      protheseDate: new Date('2024-04-10'),
      crp: {
        initial: 12.5,
        unMois: 8.2,
        deuxMois: 5.1
      },
      hemoglobineGlyquee: {
        avant: 9.2,
        unMois: 8.1,
        troisMois: 7.5
      },
      troponine: {
        avantOperation: 0.12,
        apresOperation: 0.09
      },
      cycle: 'Régulier',
      autre: 'RAS'
    },
    statut: 'sous_trt',
    statutHistory: [
      { statut: 'nouveau', date: new Date('2024-01-10') },
      { statut: 'sous_trt', date: new Date('2024-02-01') },
      { statut: 'apres_trt', date: new Date('2024-05-01') },
      { statut: 'sous_trt', date: new Date('2024-06-01') }
    ]
  }
];

// Sample medecins data
const medecinsData = [
  {
    nom: 'Dr.',
    prenom: 'Boudinni',
    specialite: 'Diabétologue',
    email: 'boudinni@yahoo.com',
    telephone: '0723456789',
    status: 'En service',
    notes: 'Spécialiste en diabétologie avec 15 ans d\'expérience'
  },
  {
    nom: 'Dr.',
    prenom: 'Fethi Zoubir',
    specialite: 'Podologue',
    email: 'hichem.hachemi@gmail.com',
    telephone: '0523456790',
    status: 'En congé',
    notes: 'Spécialiste en podologie diabétique'
  },
  {
    nom: 'Dr.',
    prenom: 'Mourad Khellaf',
    specialite: 'Endocrinologue',
    email: 'aidwikamel@gmail.com',
    telephone: '0723456791',
    status: 'En service',
    notes: 'Endocrinologue spécialisé en diabète'
  },
  {
    nom: 'Dr.',
    prenom: 'Samir Maouchi',
    specialite: 'Endocrinologue',
    email: 'samir.maouchi@clinique.dz',
    telephone: '0723456792',
    status: 'En service',
    notes: 'Spécialiste en endocrinologie'
  },
  {
    nom: 'Dr.',
    prenom: 'Amina Benali',
    specialite: 'Diabétologue',
    email: 'amina.benali@clinique.dz',
    telephone: '0667890123',
    status: 'En service',
    notes: 'Diabétologue avec expertise en pédiatrie'
  }
];

// Seed function
export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Patient.deleteMany({});
    await Medecin.deleteMany({});
    await RendezVous.deleteMany({});
    await Consultation.deleteMany({});
    
    console.log('🗑️ Existing data cleared');
    
    // Insert patients
    const patients = await Patient.insertMany(patientsData);
    console.log(`✅ ${patients.length} patients inserted`);
    
    // Insert medecins
    const medecins = await Medecin.insertMany(medecinsData);
    console.log(`✅ ${medecins.length} medecins inserted`);
    
    // Create sample rendez-vous
    const rendezVousData = [
      {
        heure: '09:30',
        patient: 'Imane Tlemcani',
        medecin: 'Dr. Fethi Zoubir',
        type: 'Consultation',
        date: new Date('2024-01-15'),
        notes: 'Contrôle trimestriel',
        statut: 'Confirmé',
        patientId: patients[3]._id,
        medecinId: medecins[1]._id
      },
      {
        heure: '10:30',
        patient: 'Zahra Bouzidi',
        medecin: 'Dr. Mohamed Bensaïd',
        type: 'Contrôle',
        date: new Date('2024-01-15'),
        notes: 'Suivi podologique',
        statut: 'Confirmé',
        patientId: patients[4]._id,
        medecinId: medecins[0]._id
      },
      {
        heure: '14:00',
        patient: 'Mohammed Khenouna',
        medecin: 'Dr. Boudinni',
        type: 'Consultation',
        date: new Date('2024-01-16'),
        notes: 'Contrôle glycémique',
        statut: 'En attente',
        patientId: patients[0]._id,
        medecinId: medecins[0]._id
      }
    ];
    
    const rendezVous = await RendezVous.insertMany(rendezVousData);
    console.log(`✅ ${rendezVous.length} rendez-vous inserted`);
    
    // Create sample consultations
    const consultationsData = [
      {
        date: new Date('2024-01-15'),
        type: 'Consultation',
        patientId: patients[0]._id,
        medecinId: medecins[0]._id,
        diagnostic: 'Diabète Type 2 stable',
        traitement: 'Metformine 500mg 2x/jour',
        notes: 'Patient stable, glycémie bien contrôlée',
        duree: 30,
        statut: 'Terminé',
        montant: 5000,
        paiement: 'Payé'
      },
      {
        date: new Date('2024-01-14'),
        type: 'Urgence',
        patientId: patients[1]._id,
        medecinId: medecins[1]._id,
        diagnostic: 'Hypoglycémie',
        traitement: 'Glucose IV',
        notes: 'Urgence traitée avec succès',
        duree: 45,
        statut: 'Terminé',
        montant: 8000,
        paiement: 'Payé'
      },
      {
        date: new Date('2024-01-13'),
        type: 'Consultation',
        patientId: patients[2]._id,
        medecinId: medecins[2]._id,
        diagnostic: 'Diabète Type 2',
        traitement: 'Gliclazide 60mg 1x/jour',
        notes: 'Nouveau diagnostic',
        duree: 40,
        statut: 'Terminé',
        montant: 6000,
        paiement: 'Payé'
      }
    ];
    
    const consultations = await Consultation.insertMany(consultationsData);
    console.log(`✅ ${consultations.length} consultations inserted`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Medecins: ${medecins.length}`);
    console.log(`   - Rendez-vous: ${rendezVous.length}`);
    console.log(`   - Consultations: ${consultations.length}`);
    
    return {
      patients,
      medecins,
      rendezVous,
      consultations
    };
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Check if database is empty
export const isDatabaseEmpty = async () => {
  const patientCount = await Patient.countDocuments();
  const medecinCount = await Medecin.countDocuments();
  const rendezVousCount = await RendezVous.countDocuments();
  const consultationCount = await Consultation.countDocuments();
  
  return patientCount === 0 && medecinCount === 0 && 
         rendezVousCount === 0 && consultationCount === 0;
};

// Auto-seed if database is empty
export const autoSeedIfEmpty = async () => {
  const isEmpty = await isDatabaseEmpty();
  if (isEmpty) {
    console.log('📭 Database is empty, auto-seeding...');
    await seedDatabase();
  } else {
    console.log('📊 Database already contains data, skipping seeding');
  }
};

// Utility to generate random patients
export async function seedRandomPatients(count = 20) {
  const sexes = ['Homme', 'Femme'];
  const diabeteTypes = ['Type 1', 'Type 2', 'Gestationnel', 'Autre', 'Non spécifié'];
  const operations = ['Chopart', 'Lisfranc', 'Trans tibial', 'Trans fémoral', 'Désarticulation hanche', 'Désarticulation orteil', 'Autre', 'Non spécifié'];
  const specialites = ['Médecine', 'Chirurgie', 'Cardiologie', 'Endocrinologie', 'Autre'];
  const randomBool = () => Math.random() < 0.5;
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const patients = Array.from({ length: count }).map((_, i) => ({
    nom: `TestNom${i}`,
    prenom: `TestPrenom${i}`,
    age: randomInt(18, 90),
    sexe: sexes[randomInt(0, 1)],
    telephone: `06${randomInt(10000000, 99999999)}`,
    email: `test${i}@example.com`,
    adresse: `Adresse ${i}`,
    diabete: diabeteTypes[randomInt(0, diabeteTypes.length - 1)],
    diagnostic: {
      typeOperation: operations[randomInt(0, operations.length - 1)],
      laterality: randomBool() ? 'Unilatéral' : 'Bilatéral',
      reprise: randomBool() ? 'Oui' : 'Non',
      facteursRisque: {
        hta: randomBool(),
        htaDepuis: '201' + randomInt(0, 9),
        diabete: randomBool(),
        diabeteDepuis: '201' + randomInt(0, 9),
        tabac: randomBool(),
        tabacDepuis: '201' + randomInt(0, 9),
        cancer: randomBool(),
        dyslipidemie: randomBool(),
        obesite: randomBool(),
        autres: '',
        autresDepuis: ''
      },
      maladieCardiovasculaire: randomBool() ? 'AVC' : 'Aucune',
      maladieCardiovasculaireFE: randomInt(30, 70).toString(),
      maladieCardiovasculaireAutre: '',
      depuis: ''
    },
    antecedents: {
      medicaux: '',
      medicauxDetails: {
        angorEffort: randomBool(),
        sca: randomBool(),
        idm: randomBool(),
        aomi: randomBool(),
        avc: randomBool()
      },
      chirurgicaux: '',
      chirurgicauxDetails: {
        amputationAnterieure: randomBool() ? 'Oui' : 'Non',
        amputationAnterieureType: '',
        amputationFamiliale: randomBool() ? 'Oui' : 'Non'
      },
      familiaux: {
        hta: randomBool(),
        dt2: randomBool(),
        autres: ''
      }
    },
    clinique: {
      tensionArterielle: {
        systolique: randomInt(100, 180),
        diastolique: randomInt(60, 100)
      },
      frequenceCardiaque: randomInt(60, 100),
      poids: randomInt(50, 120),
      taille: randomInt(150, 200),
      bmi: randomInt(18, 35),
      examenNeurologique: {
        effectue: randomBool(),
        type: ''
      }
    },
    consultation: {
      dateAdmission: new Date(),
      transfert: randomBool(),
      specialite: specialites[randomInt(0, specialites.length - 1)],
      typeConsultation: randomBool() ? 'Publique' : 'Privée'
    },
    notes: '',
    ordonnances: []
  }));
  await Patient.insertMany(patients);
  console.log(`${count} patients de test ajoutés !`);
}

const statuts = ['nouveau', 'sous_trt', 'apres_trt', 'decede'];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function seedPatientsEvolution() {
  await mongoose.connect('mongodb://localhost:27017/buchatech', { useNewUrlParser: true, useUnifiedTopology: true });
  const now = new Date();
  const patients = [];
  for (let i = 0; i < 20; i++) {
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 80));
    let statutHistory = [];
    let statut = statuts[Math.floor(Math.random() * statuts.length)];
    let date = new Date(createdAt);
    // Générer 1 à 4 changements de statut sur 12 semaines
    const nbChanges = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < nbChanges; j++) {
      statut = statuts[Math.floor(Math.random() * statuts.length)];
      date = new Date(createdAt);
      date.setDate(date.getDate() + Math.floor(Math.random() * 80));
      if (date > now) break;
      statutHistory.push({ statut, date });
    }
    // Garder le dernier statut cohérent
    statutHistory.sort((a, b) => a.date - b.date);
    const last = statutHistory[statutHistory.length - 1];
    const patient = new Patient({
      nom: `Patient${i + 1}`,
      prenom: `Test${i + 1}`,
      age: 30 + Math.floor(Math.random() * 40),
      sexe: Math.random() > 0.5 ? 'Homme' : 'Femme',
      diabete: 'Type 2',
      statut: last ? last.statut : statut,
      statutHistory,
      createdAt
    });
    patients.push(patient);
  }
  await Patient.insertMany(patients);
  console.log('20 patients avec historique de statuts insérés');
  await mongoose.disconnect();
}

seedPatientsEvolution();

function randomDateBetween(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedFullPatients(count = 20) {
  await mongoose.connect('mongodb://localhost:27017/buchatech', { useNewUrlParser: true, useUnifiedTopology: true });
  const baseDate = new Date('2024-01-01');
  const now = new Date();
  const patients = [];
  for (let i = 1; i <= count; i++) {
    const created = randomDateBetween(baseDate, now);
    const nom = `Complet${i}`;
    const prenom = `Test${i}`;
    const email = `complet${i}.test@example.com`;
    const statutHistory = [
      { statut: 'nouveau', date: new Date(created) },
      { statut: 'sous_trt', date: new Date(created.getTime() + 1000 * 60 * 60 * 24 * 10) },
      { statut: 'apres_trt', date: new Date(created.getTime() + 1000 * 60 * 60 * 24 * 60) },
      { statut: 'sous_trt', date: new Date(created.getTime() + 1000 * 60 * 60 * 24 * 90) }
    ];
    patients.push({
      nom,
      prenom,
      age: 30 + Math.floor(Math.random() * 40),
      sexe: Math.random() > 0.5 ? 'Homme' : 'Femme',
      telephone: `06${Math.floor(10000000 + Math.random() * 89999999)}`,
      email,
      adresse: `${i} Rue Complète, Alger`,
      photoUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${i}.jpg`,
      dateConsultation: randomDateBetween(baseDate, now),
      derniereVisite: randomDateBetween(baseDate, now),
      profession: 'Ingénieur',
      habitudesToxiques: {
        tabac: true,
        alcool: true,
        autres: 'Chicha'
      },
      origine: 'Kabylie',
      diabete: 'Type 1',
      diagnostic: {
        typeOperation: 'Chopart',
        typeOperationPreciser: 'Chopart partiel',
        laterality: 'Unilatéral',
        reprise: 'Oui',
        dateOperation: randomDateBetween(baseDate, now),
        facteursRisque: {
          hta: true,
          htaDepuis: '2015',
          htaTrt: 'Amlor',
          diabete: true,
          diabeteDepuis: '2010',
          diabeteTrt: 'Insuline',
          dyslipidemie: true,
          obesite: true,
          tabac: true,
          tabacDepuis: '2005',
          tabacTrt: 'Patch',
          cancer: false,
          autres: 'Hyperuricémie',
          autresDepuis: '2018'
        },
        maladieCardiovasculaire: 'Ischémique',
        maladieCardiovasculaireFE: '45',
        maladieCardiovasculaireAutre: 'Pontage',
        depuis: '2012'
      },
      antecedents: {
        medicaux: 'HTA, diabète, dyslipidémie',
        medicauxDetails: {
          angorEffort: true,
          sca: true,
          idm: false,
          aomi: true,
          avc: false
        },
        chirurgicaux: 'Appendicectomie, amputation orteil',
        chirurgicauxDetails: {
          amputationAnterieure: 'Oui',
          amputationAnterieureType: 'Orteil droit',
          amputationFamiliale: 'Non'
        },
        familiaux: {
          hta: true,
          dt2: true,
          autres: 'Père IDM'
        }
      },
      clinique: {
        tensionArterielle: {
          systolique: 120 + Math.floor(Math.random() * 30),
          diastolique: 70 + Math.floor(Math.random() * 20)
        },
        frequenceCardiaque: 60 + Math.floor(Math.random() * 40),
        poids: 60 + Math.floor(Math.random() * 40),
        taille: 160 + Math.floor(Math.random() * 20),
        bmi: 22 + Math.random() * 8,
        examenNeurologique: {
          effectue: true,
          type: 'EMG'
        }
      },
      consultation: {
        dateAdmission: randomDateBetween(baseDate, now),
        transfert: false,
        specialite: 'Chirurgie',
        typeConsultation: 'Hospitalisation'
      },
      anesthesie: {
        ag: true,
        alr: {
          al: true,
          ra: true,
          peridural: true,
          perirachicombine: false,
          blocPeripherique: true
        },
        asa: 'ASA III'
      },
      documents: [
        {
          filename: `radio${i}.pdf`,
          originalname: `radio${i}.pdf`,
          mimetype: 'application/pdf',
          size: 123456,
          url: `https://example.com/docs/radio${i}.pdf`
        },
        {
          filename: `analyse${i}.jpg`,
          originalname: `analyse${i}.jpg`,
          mimetype: 'image/jpeg',
          size: 23456,
          url: `https://example.com/docs/analyse${i}.jpg`
        }
      ],
      notes: 'Patient très suivi, dossier complet.',
      ordonnances: ['Metformine 500mg', 'Amlor 10mg', 'Insuline rapide'],
      evolution: {
        cicatrisation: {
          delai: 30,
          unite: 'jour'
        },
        protheseDate: randomDateBetween(baseDate, now),
        crp: {
          initial: 12.5,
          unMois: 8.2,
          deuxMois: 5.1
        },
        hemoglobineGlyquee: {
          avant: 9.2,
          unMois: 8.1,
          troisMois: 7.5
        },
        troponine: {
          avantOperation: 0.12,
          apresOperation: 0.09
        },
        cycle: 'Régulier',
        autre: 'RAS'
      },
      statut: 'sous_trt',
      statutHistory
    });
  }
  await Patient.insertMany(patients);
  console.log(`${count} patients complets ajoutés !`);
  await mongoose.disconnect();
}

// CLI usage: node seeders/initialData.js random 30
if (process.argv[2] === 'random') {
  const count = parseInt(process.argv[3], 10) || 20;
  import('../config/database.js').then(({ connectDB }) => {
    connectDB().then(() => seedRandomPatients(count).then(() => process.exit(0)));
  });
} 

// Exécution directe
if (process.argv[2] === 'full') {
  const count = parseInt(process.argv[3], 10) || 20;
  seedFullPatients(count).then(() => process.exit(0));
} 

async function seedRendezVousForFullPatients() {
  await mongoose.connect('mongodb://localhost:27017/buchatech', { useNewUrlParser: true, useUnifiedTopology: true });
  const patients = await Patient.find({ nom: /Complet/ });
  const medecins = await Medecin.find();
  const types = ['Consultation', 'Urgence', 'Contrôle'];
  const statuts = ['Confirmé', 'En attente', 'Terminé'];
  const now = new Date();
  const weeks = 12;
  const rdvs = [];
  patients.forEach((patient, i) => {
    for (let w = 0; w < weeks; w++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7) + Math.floor(Math.random() * 7));
      date.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0);
      const medecin = medecins[(i + w) % medecins.length];
      rdvs.push({
        heure: `${date.getHours().toString().padStart(2, '0')}:00`,
        patient: `${patient.nom} ${patient.prenom}`,
        medecin: `${medecin.nom} ${medecin.prenom}`,
        type: types[Math.floor(Math.random() * types.length)],
        date,
        notes: 'RDV auto-généré pour test',
        statut: statuts[Math.floor(Math.random() * statuts.length)],
        duree: 30 + Math.floor(Math.random() * 30),
        patientId: patient._id,
        medecinId: medecin._id
      });
    }
  });
  await RendezVous.insertMany(rdvs);
  console.log(`${rdvs.length} rendez-vous générés pour les patients complets.`);
  await mongoose.disconnect();
}

if (process.argv[2] === 'rdv') {
  seedRendezVousForFullPatients().then(() => process.exit(0));
} 

async function checkStats() {
  await mongoose.connect('mongodb://localhost:27017/buchatech', { useNewUrlParser: true, useUnifiedTopology: true });
  const Patient = (await import('../models/Patient.js')).default;
  const Medecin = (await import('../models/Medecin.js')).default;
  const RendezVous = (await import('../models/RendezVous.js')).default;

  const patients = await Patient.find();
  const medecins = await Medecin.find();
  const rdvs = await RendezVous.find();

  console.log(`Patients: ${patients.length}`);
  const patientsWithHistory = patients.filter(p => p.statutHistory && p.statutHistory.length > 0);
  console.log(`Patients avec statutHistory: ${patientsWithHistory.length}`);
  console.log('--- StatutHistory par patient Complet* ---');
  patients.filter(p => p.nom.startsWith('Complet')).forEach(p => {
    console.log(`  ${p.nom} ${p.prenom}: ${p.statutHistory ? p.statutHistory.length : 0} statuts`);
  });

  console.log(`Médecins: ${medecins.length}`);
  const enService = medecins.filter(m => m.status === 'En service').length;
  console.log(`Médecins en service: ${enService}`);
  medecins.forEach(m => {
    console.log(`  ${m.nom} ${m.prenom}: ${m.status}`);
  });

  console.log(`Rendez-vous: ${rdvs.length}`);
  const rdvConfTerm = rdvs.filter(r => ['Confirmé', 'Terminé'].includes(r.statut)).length;
  console.log(`Rendez-vous Confirmé/Terminé: ${rdvConfTerm}`);
  const rdvConsult = rdvs.filter(r => r.type === 'Consultation').length;
  const rdvUrgence = rdvs.filter(r => r.type === 'Urgence').length;
  console.log(`Consultations: ${rdvConsult}, Urgences: ${rdvUrgence}`);

  // Par semaine (12 dernières)
  const weeks = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    weeks.push({ start, end });
  }
  console.log('--- Stat hebdo (12 dernières semaines) ---');
  for (const { start, end } of weeks) {
    const weekLabel = `${start.getDate()}/${start.getMonth() + 1}`;
    const rdvsWeek = rdvs.filter(r => r.date >= start && r.date <= end && ['Confirmé', 'Terminé'].includes(r.statut));
    const consults = rdvsWeek.filter(r => r.type === 'Consultation').length;
    const urgences = rdvsWeek.filter(r => r.type === 'Urgence').length;
    const enServiceWeek = medecins.filter(m => m.status === 'En service').length; // pas d'historique
    console.log(`Semaine ${weekLabel}: Consultations=${consults}, Urgences=${urgences}, Médecins en service=${enServiceWeek}`);
  }
  await mongoose.disconnect();
}

if (process.argv[2] === 'check-stats') {
  checkStats().then(() => process.exit(0));
} 