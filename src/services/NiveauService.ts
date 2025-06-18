import { BaseService } from './BaseService';
import { NiveauType, CreateNiveauDto, UpdateNiveauDto } from '../types';

export class NiveauService extends BaseService<NiveauType, CreateNiveauDto, UpdateNiveauDto> {
  constructor() {
    super('niveau');
  }

  async findByLibelle(libelle: string): Promise<NiveauType | null> {
    return await this.model.findUnique({
      where: { libelle },
    });
  }

  async findWithClasses(id: string): Promise<NiveauType | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            filiere: true,
          },
        },
        filieres: true,
      },
    });
  }

  async validateUniqueness(libelle: string, excludeId?: string): Promise<boolean> {
    const existingNiveau = await this.model.findUnique({
      where: { libelle },
    });

    if (!existingNiveau) {
      return true;
    }

    if (excludeId && existingNiveau.id === excludeId) {
      return true;
    }

    return false;
  }

  async create(data: CreateNiveauDto): Promise<NiveauType> {
    const isUnique = await this.validateUniqueness(data.libelle);
    if (!isUnique) {
      throw new Error(`Un niveau avec le libellé "${data.libelle}" existe déjà`);
    }

    return await super.create(data);
  }

  async update(id: string, data: UpdateNiveauDto): Promise<NiveauType> {
    if (data.libelle) {
      const isUnique = await this.validateUniqueness(data.libelle, id);
      if (!isUnique) {
        throw new Error(`Un niveau avec le libellé "${data.libelle}" existe déjà`);
      }
    }

    return await super.update(id, data);
  }
} 