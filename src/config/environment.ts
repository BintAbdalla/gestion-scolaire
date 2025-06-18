import dotenv from 'dotenv';

dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  BCRYPT_ROUNDS: number;
}

class EnvironmentConfig {
  private config: Environment;

  constructor() {
    this.config = this.validateEnvironment();
  }

  private validateEnvironment(): Environment {
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Variable d'environnement manquante: ${envVar}`);
      }
    }

    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: parseInt(process.env.PORT || '3000', 10),
      DATABASE_URL: process.env.DATABASE_URL!,
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
      BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    };
  }

  public get(): Environment {
    return this.config;
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }
}

export const env = new EnvironmentConfig().get();
export default EnvironmentConfig; 