import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Début du seeding...');

  // Création d'un utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kaayjang.com' },
    update: {},
    create: {
      email: 'admin@kaayjang.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Utilisateur admin créé:', admin.email);

  // Création des niveaux
  const sixieme = await prisma.niveau.upsert({
    where: { libelle: '6ème' },
    update: {},
    create: { libelle: '6ème' },
  });

  const cinquieme = await prisma.niveau.upsert({
    where: { libelle: '5ème' },
    update: {},
    create: { libelle: '5ème' },
  });

  const quatrieme = await prisma.niveau.upsert({
    where: { libelle: '4ème' },
    update: {},
    create: { libelle: '4ème' },
  });

  const troisieme = await prisma.niveau.upsert({
    where: { libelle: '3ème' },
    update: {},
    create: { libelle: '3ème' },
  });

  console.log('✅ Niveaux créés');

  // Création des filières
  const lettres = await prisma.filiere.upsert({
    where: { libelle: 'Lettres' },
    update: {},
    create: {
      libelle: 'Lettres',
      niveauId: quatrieme.id,
    },
  });

  const sciences = await prisma.filiere.upsert({
    where: { libelle: 'Sciences' },
    update: {},
    create: {
      libelle: 'Sciences',
      niveauId: quatrieme.id,
    },
  });

  console.log('✅ Filières créées');

  // Création des classes
  const classe6A = await prisma.classe.upsert({
    where: { code: '6A' },
    update: {},
    create: {
      code: '6A',
      libelle: '6ème A',
      niveauId: sixieme.id,
      filiereId: lettres.id,
    },
  });

  const classe5B = await prisma.classe.upsert({
    where: { code: '5B' },
    update: {},
    create: {
      code: '5B',
      libelle: '5ème B',
      niveauId: cinquieme.id,
      filiereId: sciences.id,
    },
  });

  console.log('✅ Classes créées');

  // Création d'étudiants exemples
  const etudiant1 = await prisma.etudiant.upsert({
    where: { matricule: 'ETU001' },
    update: {},
    create: {
      matricule: 'ETU001',
      nom: 'Diop',
      prenom: 'Amadou',
      dateNaissance: new Date('2008-03-15'),
      telephone: '77123456789',
      adresse: 'Dakar, Sénégal',
      classeId: classe6A.id,
    },
  });

  const etudiant2 = await prisma.etudiant.upsert({
    where: { matricule: 'ETU002' },
    update: {},
    create: {
      matricule: 'ETU002',
      nom: 'Fall',
      prenom: 'Fatou',
      dateNaissance: new Date('2007-07-22'),
      telephone: '76987654321',
      adresse: 'Thiès, Sénégal',
      classeId: classe5B.id,
    },
  });

  console.log('✅ Étudiants créés');
  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 