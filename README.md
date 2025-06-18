# 🎓 Kaayjang - Système de Gestion Scolaire

Kaayjang est une API REST moderne pour la gestion d'établissements scolaires, développée avec Node.js, Express, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

- **Gestion des niveaux** : 6ème, 5ème, 4ème, 3ème, etc.
- **Gestion des filières** : Sciences, Lettres, etc.
- **Gestion des classes** : Organisation par niveau et filière
- **Gestion des étudiants** : Informations complètes et matricules
- **API REST complète** avec documentation Swagger
- **Sécurité** : Helmet, CORS, Rate limiting
- **Base de données** : PostgreSQL via NeonDB avec Prisma ORM
- **TypeScript** : Code typé et maintenable

## 🛠️ Technologies utilisées

- **Backend** : Node.js + Express.js
- **Base de données** : PostgreSQL (NeonDB)
- **ORM** : Prisma
- **Documentation** : Swagger/OpenAPI
- **Langage** : TypeScript
- **Sécurité** : Helmet, CORS, express-rate-limit
- **Tests** : Jest
- **Linting** : ESLint

## 📋 Prérequis

- Node.js >= 18
- npm ou yarn
- Compte NeonDB (ou PostgreSQL local)

## ⚙️ Installation

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd projet-node-express-ges-scolaire
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement** :
   ```bash
   cp .env.example .env
   ```
   
   Puis modifiez le fichier `.env` avec vos informations :
   ```env
   DATABASE_URL="postgresql://username:password@your-neon-hostname/database-name?sslmode=require"
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   PORT=3000
   CORS_ORIGIN=http://localhost:3000
   BCRYPT_ROUNDS=12
   ```

4. **Configuration de la base de données** :
   ```bash
   # Générer le client Prisma
   npm run db:generate
   
   # Pousser le schéma vers la base de données
   npm run db:push
   
   # Remplir la base avec des données de test
   npm run db:seed
   ```

## 🚀 Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
# Build du projet
npm run build

# Démarrage en production
npm start
```

## 📚 Documentation API

Une fois l'application démarrée, la documentation Swagger est accessible à :
- **Documentation interactive** : http://localhost:3000/api-docs
- **Spec JSON** : http://localhost:3000/api-docs.json
- **Health check** : http://localhost:3000/api/health

## 🔗 Endpoints principaux

### Niveaux
- `GET /api/niveaux` - Liste tous les niveaux (avec pagination)
- `GET /api/niveaux/:id` - Récupère un niveau par ID
- `POST /api/niveaux` - Crée un nouveau niveau
- `PUT /api/niveaux/:id` - Met à jour un niveau
- `DELETE /api/niveaux/:id` - Supprime un niveau

### Structure de réponse
```json
{
  "success": true,
  "data": {
    "id": "clr123abc456",
    "libelle": "6ème",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Niveau récupéré avec succès"
}
```

## 🗄️ Schéma de base de données

```sql
-- Niveaux (6ème, 5ème, etc.)
Niveau {
  id        String   @id @default(cuid())
  libelle   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

-- Filières (Sciences, Lettres, etc.)
Filiere {
  id        String   @id @default(cuid())
  libelle   String   @unique
  niveauId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

-- Classes (6A, 5B, etc.)
Classe {
  id        String   @id @default(cuid())
  code      String   @unique
  libelle   String
  niveauId  String
  filiereId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

-- Étudiants
Etudiant {
  id             String    @id @default(cuid())
  matricule      String    @unique
  nom            String
  prenom         String
  dateNaissance  DateTime
  telephone      String?
  adresse        String?
  classeId       String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm test -- --coverage
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Démarrage en développement avec hot-reload
npm run build        # Build du projet TypeScript
npm start            # Démarrage en production
npm run db:generate  # Génération du client Prisma
npm run db:push      # Push du schéma vers la base
npm run db:migrate   # Migration de la base de données
npm run db:studio    # Interface Prisma Studio
npm run db:seed      # Remplissage avec des données de test
npm test             # Lancement des tests
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction automatique ESLint
```

## 🏗️ Architecture du projet

```
src/
├── config/           # Configurations (DB, environnement, Swagger)
├── controllers/      # Contrôleurs Express
├── services/         # Logique métier
├── middlewares/      # Middlewares Express
├── routes/           # Définition des routes
├── types/            # Types TypeScript
├── app.ts           # Configuration Express
└── server.ts        # Point d'entrée

prisma/
├── schema.prisma    # Schéma de base de données
└── seed.ts          # Script de remplissage
```

## 📝 Principes de développement

- **SOLID** : Respect des principes de conception objet
- **DRY** : Éviter la duplication de code
- **TypeScript strict** : Aucun type `any` autorisé
- **API REST** : Conventions REST respectées
- **Documentation** : Code auto-documenté avec Swagger
- **Sécurité** : Middlewares de sécurité intégrés

## 🔒 Sécurité

- **Helmet** : Protection des en-têtes HTTP
- **CORS** : Configuration CORS sécurisée
- **Rate Limiting** : Limitation du nombre de requêtes
- **Validation** : Validation des données d'entrée
- **Gestion d'erreurs** : Pas d'exposition d'informations sensibles

## 🚀 Déploiement

Pour déployer en production :

1. Configurez les variables d'environnement
2. Buildez le projet : `npm run build`
3. Lancez les migrations : `npm run db:migrate`
4. Démarrez l'application : `npm start`

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : Équipe Kaayjang
- **Contact** : admin@kaayjang.com

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe à admin@kaayjang.com
- Consultez la documentation Swagger

---

**Fait avec ❤️ pour l'éducation** # gestion-scolaire
