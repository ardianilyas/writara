import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../errors/index.js';

export class ModelsService {
  /**
   * Retrieves list of active AI models available for selection.
   */
  async getActiveModels() {
    return prisma.aIModel.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        provider: true,
        creditCost: true,
        maxChapters: true,
        isFreeTier: true,
      },
      orderBy: { creditCost: 'asc' },
    });
  }

  /**
   * Retrieves a single AI model by ID or Slug.
   */
  async getModelByIdOrSlug(idOrSlug: string) {
    const model = await prisma.aIModel.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isActive: true,
      },
    });

    if (!model) {
      throw new NotFoundError(`AI Model '${idOrSlug}' not found or is currently inactive.`);
    }

    return model;
  }
}

export const modelsService = new ModelsService();
