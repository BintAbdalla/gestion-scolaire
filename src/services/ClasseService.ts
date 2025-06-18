import { BaseService } from './BaseService';
import { ClasseType, CreateClasseDto, UpdateClasseDto } from '../types';

export class ClasseService extends BaseService<ClasseType, CreateClasseDto, UpdateClasseDto> {
  constructor() {
    super('classe');
  }

  async findByCode(code: string): Promise<ClasseType | null> {
    return await this.model.findUnique({
      where: { code },
      include: {
        niveau: true,
        filiere: true,
        etudiants: true,
      },
    });
  }

  async findWithRelations(id: string): Promise<ClasseType | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        niveau: true,
        filiere: true,
        etudiants: {
          orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
        },
      },
    });
  }

  async findByNiveau(niveauId: string): Promise<ClasseType[]> {
    return await this.model.findMany({
      where: { niveauId },
      include: {
        niveau: true,
        filiere: true,
        _count: {
          select: { etudiants: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findByFiliere(filiereId: string): Promise<ClasseType[]> {
    return await this.model.findMany({
      where: { filiereId },
      include: {
        niveau: true,
        filiere: true,
        _count: {
          select: { etudiants: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async validateUniqueness(code: string, excludeId?: string): Promise<boolean> {
    const existingClasse = await this.model.findUnique({
      where: { code },
    });

    if (!existingClasse) {
      return true;
    }

    if (excludeId && existingClasse.id === excludeId) {
      return true;
    }

    return false;
  }

  async validateRelations(niveauId: string, filiereId: string): Promise<boolean> {
    // Vérifier que la filière appartient au niveau
    const filiere = await this.prisma.filiere.findFirst({
      where: {
        id: filiereId,
        niveauId: niveauId,
      },
    });

    return !!filiere;
  }

  async create(data: CreateClasseDto): Promise<ClasseType> {
    const isUnique = await this.validateUniqueness(data.code);
    if (!isUnique) {
      throw new Error(`Une classe avec le code "${data.code}" existe déjà`);
    }

    const validRelation = await this.validateRelations(data.niveauId, data.filiereId);
    if (!validRelation) {
      throw new Error('La filière spécifiée n\'appartient pas au niveau sélectionné');
    }

    return await this.model.create({
      data,
      include: {
        niveau: true,
        filiere: true,
      },
    });
  }

  async update(id: string, data: UpdateClasseDto): Promise<ClasseType> {
    if (data.code) {
      const isUnique = await this.validateUniqueness(data.code, id);
      if (!isUnique) {
        throw new Error(`Une classe avec le code "${data.code}" existe déjà`);
      }
    }

    if (data.niveauId && data.filiereId) {
      const validRelation = await this.validateRelations(data.niveauId, data.filiereId);
      if (!validRelation) {
        throw new Error('La filière spécifiée n\'appartient pas au niveau sélectionné');
      }
    }

    return await this.model.update({
      where: { id },
      data,
      include: {
        niveau: true,
        filiere: true,
      },
    });
  }

  async getStatistics(): Promise<any> {
    const totalClasses = await this.model.count();
    const classesByNiveau = await this.prisma.niveau.findMany({
      include: {
        _count: {
          select: { classes: true },
        },
      },
    });

    const classesByFiliere = await this.prisma.filiere.findMany({
      include: {
        _count: {
          select: { classes: true },
        },
      },
    });

    return {
      totalClasses,
      classesByNiveau,
      classesByFiliere,
    };
  }
} 