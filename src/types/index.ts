import { UserRole } from '@prisma/client';

// Types de base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les entités
export interface NiveauType extends BaseEntity {
  libelle: string;
}

export interface FiliereType extends BaseEntity {
  libelle: string;
  niveauId: string;
  niveau?: NiveauType;
}

export interface ClasseType extends BaseEntity {
  code: string;
  libelle: string;
  niveauId: string;
  filiereId: string;
  niveau?: NiveauType;
  filiere?: FiliereType;
}

export interface EtudiantType extends BaseEntity {
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone?: string;
  adresse?: string;
  classeId: string;
  classe?: ClasseType;
}

export interface UserType extends BaseEntity {
  email: string;
  password: string;
  role: UserRole;
}

// DTOs pour les requêtes
export interface CreateNiveauDto {
  libelle: string;
}

export interface UpdateNiveauDto {
  libelle?: string;
}

export interface CreateFiliereDto {
  libelle: string;
  niveauId: string;
}

export interface UpdateFiliereDto {
  libelle?: string;
  niveauId?: string;
}

export interface CreateClasseDto {
  code: string;
  libelle: string;
  niveauId: string;
  filiereId: string;
}

export interface UpdateClasseDto {
  code?: string;
  libelle?: string;
  niveauId?: string;
  filiereId?: string;
}

export interface CreateEtudiantDto {
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone?: string;
  adresse?: string;
  classeId: string;
}

export interface UpdateEtudiantDto {
  matricule?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  telephone?: string;
  adresse?: string;
  classeId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role?: UserRole;
}

// Types pour les réponses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: Omit<UserType, 'password'>;
}

// Types pour les paramètres de requête
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

// Types pour les middlewares
export interface AuthenticatedRequest extends Express.Request {
  user?: Omit<UserType, 'password'>;
}

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserType, 'password'>;
    }
  }
} 