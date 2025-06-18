import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';

export abstract class BaseService<TEntity, TCreateDto, TUpdateDto> {
  protected readonly prisma: PrismaClient;
  protected readonly modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  protected get model(): any {
    return this.prisma[this.modelName as keyof PrismaClient] as any;
  }

  async findAll(params?: PaginationParams): Promise<PaginatedResponse<TEntity>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.model.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<TEntity | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async create(data: TCreateDto): Promise<TEntity> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: TUpdateDto): Promise<TEntity> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TEntity> {
    return await this.model.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: { id },
    });
    return count > 0;
  }
} 