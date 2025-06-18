import { PrismaClient } from '@prisma/client';

class DatabaseConnection {
  private static instance: PrismaClient;

  private constructor() {
    // Le constructeur privé empêche l'instanciation directe
  }

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      });
    }

    return DatabaseConnection.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseConnection.getInstance();
export default DatabaseConnection; 