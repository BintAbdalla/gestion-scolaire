import { BaseService } from './BaseService';
import { FiliereType, CreateFiliereDto, UpdateFiliereDto } from '../types';

export class FiliereService extends BaseService<FiliereType, CreateFiliereDto, UpdateFiliereDto> {
  constructor() {
    super('filiere');
  }

  async findByLibelle(libelle: string): Promise<FiliereType | null> {
    return await this.model.findUnique({
      where: { libelle },
      include: {
        niveau: true,
        classes: true,
      },
    });
  }

  async findWithRelations(id: string): Promise<FiliereType | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        niveau: true,
        classes: {
          include: {
            _count: {
              select: { etudiants: true },
            },
          },
        },
      },
    });
  }

  async findByNiveau(niveauId: string): Promise<FiliereType[]> {
    return await this.model.findMany({
      where: { niveauId },
      include: {
        niveau: true,
        _count: {
          select: { classes: true },
        },
      },
      orderBy: { libelle: 'asc' },
    });
  }

  async validateUniqueness(libelle: string, excludeId?: string): Promise<boolean> {
    const existingFiliere = await this.model.findUnique({
      where: { libelle },
    });

    if (!existingFiliere) {
      return true;
    }

    if (excludeId && existingFiliere.id === excludeId) {
      return true;
    }

    return false;
  }

  async validateNiveauExists(niveauId: string): Promise<boolean> {
    const niveau = await this.prisma.niveau.findUnique({
      where: { id: niveauId },
    });

    return !!niveau;
  }

  async create(data: CreateFiliereDto): Promise<FiliereType> {
    const isUnique = await this.validateUniqueness(data.libelle);
    if (!isUnique) {
      throw new Error(`Une filière avec le libellé "${data.libelle}" existe déjà`);
    }

    const niveauExists = await this.validateNiveauExists(data.niveauId);
    if (!niveauExists) {
      throw new Error('Le niveau spécifié n\'existe pas');
    }

    return await this.model.create({
      data,
      include: {
        niveau: true,
      },
    });
  }

  async update(id: string, data: UpdateFiliereDto): Promise<FiliereType> {
    if (data.libelle) {
      const isUnique = await this.validateUniqueness(data.libelle, id);
      if (!isUnique) {
        throw new Error(`Une filière avec le libellé "${data.libelle}" existe déjà`);
      }
    }

    if (data.niveauId) {
      const niveauExists = await this.validateNiveauExists(data.niveauId);
      if (!niveauExists) {
        throw new Error('Le niveau spécifié n\'existe pas');
      }
    }

    return await this.model.update({
      where: { id },
      data,
      include: {
        niveau: true,
      },
    });
  }
} 