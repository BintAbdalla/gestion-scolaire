import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Kaayjang - Système de Gestion Scolaire',
    version: '1.0.0',
    description: 'API REST pour la gestion d\'un établissement scolaire avec Node.js, Express, Prisma et PostgreSQL',
    contact: {
      name: 'Équipe Kaayjang',
      email: 'admin@kaayjang.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Serveur de développement',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Message d\'erreur',
          },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Opération réussie',
          },
        },
      },
      Niveau: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clr123abc456',
          },
          libelle: {
            type: 'string',
            example: '6ème',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Filiere: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clr123abc456',
          },
          libelle: {
            type: 'string',
            example: 'Sciences',
          },
          niveauId: {
            type: 'string',
            example: 'clr123abc456',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Classe: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clr123abc456',
          },
          code: {
            type: 'string',
            example: '6A',
          },
          libelle: {
            type: 'string',
            example: '6ème A',
          },
          niveauId: {
            type: 'string',
            example: 'clr123abc456',
          },
          filiereId: {
            type: 'string',
            example: 'clr123abc456',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Etudiant: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clr123abc456',
          },
          matricule: {
            type: 'string',
            example: 'ETU001',
          },
          nom: {
            type: 'string',
            example: 'Diop',
          },
          prenom: {
            type: 'string',
            example: 'Amadou',
          },
          dateNaissance: {
            type: 'string',
            format: 'date-time',
          },
          telephone: {
            type: 'string',
            example: '77123456789',
          },
          adresse: {
            type: 'string',
            example: 'Dakar, Sénégal',
          },
          classeId: {
            type: 'string',
            example: 'clr123abc456',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {},
          },
          total: {
            type: 'number',
            example: 100,
          },
          page: {
            type: 'number',
            example: 1,
          },
          limit: {
            type: 'number',
            example: 10,
          },
          totalPages: {
            type: 'number',
            example: 10,
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options); 