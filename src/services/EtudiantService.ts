import { BaseService } from './BaseService';
import { EtudiantType, CreateEtudiantDto, UpdateEtudiantDto, SearchParams } from '../types';

export class EtudiantService extends BaseService<EtudiantType, CreateEtudiantDto, UpdateEtudiantDto> {
  constructor() {
    super('etudiant');
  }

  async findByMatricule(matricule: string): Promise<EtudiantType | null> {
    return await this.model.findUnique({
      where: { matricule },
      include: {
        classe: {
          include: {
            niveau: true,
            filiere: true,
          },
        },
      },
    });
  }

  async findWithClasse(id: string): Promise<EtudiantType | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        classe: {
          include: {
            niveau: true,
            filiere: true,
          },
        },
      },
    });
  }

  async searchEtudiants(params: SearchParams): Promise<any> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    const search = params.search || '';

    const whereClause = search
      ? {
          OR: [
            { nom: { contains: search, mode: 'insensitive' as const } },
            { prenom: { contains: search, mode: 'insensitive' as const } },
            { matricule: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          classe: {
            include: {
              niveau: true,
              filiere: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.model.count({ where: whereClause }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByClasse(classeId: string): Promise<EtudiantType[]> {
    return await this.model.findMany({
      where: { classeId },
      include: {
        classe: {
          include: {
            niveau: true,
            filiere: true,
          },
        },
      },
      orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
    });
  }

  async validateUniqueness(matricule: string, excludeId?: string): Promise<boolean> {
    const existingEtudiant = await this.model.findUnique({
      where: { matricule },
    });

    if (!existingEtudiant) {
      return true;
    }

    if (excludeId && existingEtudiant.id === excludeId) {
      return true;
    }

    return false;
  }

  async create(data: CreateEtudiantDto): Promise<EtudiantType> {
    const isUnique = await this.validateUniqueness(data.matricule);
    if (!isUnique) {
      throw new Error(`Un étudiant avec le matricule "${data.matricule}" existe déjà`);
    }

    const etudiantData = {
      ...data,
      dateNaissance: new Date(data.dateNaissance),
    };

    return await this.model.create({
      data: etudiantData,
      include: {
        classe: {
          include: {
            niveau: true,
            filiere: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateEtudiantDto): Promise<EtudiantType> {
    if (data.matricule) {
      const isUnique = await this.validateUniqueness(data.matricule, id);
      if (!isUnique) {
        throw new Error(`Un étudiant avec le matricule "${data.matricule}" existe déjà`);
      }
    }

    const updateData = {
      ...data,
      ...(data.dateNaissance && { dateNaissance: new Date(data.dateNaissance) }),
    };

    return await this.model.update({
      where: { id },
      data: updateData,
      include: {
        classe: {
          include: {
            niveau: true,
            filiere: true,
          },
        },
      },
    });
  }
} 