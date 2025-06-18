import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { NiveauService } from '../services/NiveauService';
import { CreateNiveauDto, UpdateNiveauDto } from '../types';

/**
 * @swagger
 * tags:
 *   name: Niveaux
 *   description: Gestion des niveaux scolaires
 */
export class NiveauController extends BaseController {
  private niveauService: NiveauService;

  constructor() {
    super();
    this.niveauService = new NiveauService();
  }

  /**
   * @swagger
   * /api/niveaux:
   *   get:
   *     summary: Récupérer tous les niveaux
   *     tags: [Niveaux]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Numéro de page
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Nombre d'éléments par page
   *     responses:
   *       200:
   *         description: Liste des niveaux récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Success'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/PaginatedResponse'
   */
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const params = this.extractPaginationParams(req);
      const result = await this.niveauService.findAll(params);
      
      return this.sendSuccess(res, result, 'Niveaux récupérés avec succès');
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /**
   * @swagger
   * /api/niveaux/{id}:
   *   get:
   *     summary: Récupérer un niveau par ID
   *     tags: [Niveaux]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du niveau
   *     responses:
   *       200:
   *         description: Niveau récupéré avec succès
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Success'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Niveau'
   *       404:
   *         description: Niveau non trouvé
   */
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!this.validateId(id)) {
        return this.sendValidationError(res, 'ID invalide');
      }

      const niveau = await this.niveauService.findById(id);
      
      if (!niveau) {
        return this.sendNotFound(res, 'Niveau');
      }
      
      return this.sendSuccess(res, niveau, 'Niveau récupéré avec succès');
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /**
   * @swagger
   * /api/niveaux:
   *   post:
   *     summary: Créer un nouveau niveau
   *     tags: [Niveaux]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - libelle
   *             properties:
   *               libelle:
   *                 type: string
   *                 example: "6ème"
   *     responses:
   *       201:
   *         description: Niveau créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Success'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Niveau'
   *       400:
   *         description: Données invalides
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateNiveauDto = req.body;
      
      if (!data.libelle || data.libelle.trim() === '') {
        return this.sendValidationError(res, 'Le libellé est requis');
      }

      const niveau = await this.niveauService.create(data);
      
      return this.sendSuccess(res, niveau, 'Niveau créé avec succès', 201);
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /**
   * @swagger
   * /api/niveaux/{id}:
   *   put:
   *     summary: Mettre à jour un niveau
   *     tags: [Niveaux]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du niveau
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               libelle:
   *                 type: string
   *                 example: "5ème"
   *     responses:
   *       200:
   *         description: Niveau mis à jour avec succès
   *       404:
   *         description: Niveau non trouvé
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateNiveauDto = req.body;
      
      if (!this.validateId(id)) {
        return this.sendValidationError(res, 'ID invalide');
      }

      const exists = await this.niveauService.exists(id);
      if (!exists) {
        return this.sendNotFound(res, 'Niveau');
      }

      const niveau = await this.niveauService.update(id, data);
      
      return this.sendSuccess(res, niveau, 'Niveau mis à jour avec succès');
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }

  /**
   * @swagger
   * /api/niveaux/{id}:
   *   delete:
   *     summary: Supprimer un niveau
   *     tags: [Niveaux]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du niveau
   *     responses:
   *       200:
   *         description: Niveau supprimé avec succès
   *       404:
   *         description: Niveau non trouvé
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!this.validateId(id)) {
        return this.sendValidationError(res, 'ID invalide');
      }

      const exists = await this.niveauService.exists(id);
      if (!exists) {
        return this.sendNotFound(res, 'Niveau');
      }

      await this.niveauService.delete(id);
      
      return this.sendSuccess(res, null, 'Niveau supprimé avec succès');
    } catch (error) {
      return this.handleServiceError(res, error);
    }
  }
} 