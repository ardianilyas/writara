import { prisma } from '../src/lib/prisma.js';
import { env } from '../src/lib/env.js';

async function seedModels() {
  console.log('🌱 Seeding AI Models into database...');

  const models = [
    {
      slug: 'nemotron-30b',
      name: 'Nemotron 30B (Free Tier)',
      description: 'Fast, lightweight model ideal for basic presentations up to 5 chapters.',
      provider: 'NVIDIA',
      modelKey: env.OPENROUTER_FREE_MODEL,
      creditCost: 1,
      maxChapters: 5,
      isFreeTier: true,
      isActive: true,
    },
    {
      slug: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash (Pro)',
      description: 'High-performance AI model for comprehensive 10 to 20 chapter decks with rich slide layouts & speaker notes.',
      provider: 'DeepSeek',
      modelKey: env.OPENROUTER_PAID_MODEL,
      creditCost: 5,
      maxChapters: 20,
      isFreeTier: false,
      isActive: true,
    },
  ];

  for (const m of models) {
    const seeded = await prisma.aIModel.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        description: m.description,
        provider: m.provider,
        modelKey: m.modelKey,
        creditCost: m.creditCost,
        maxChapters: m.maxChapters,
        isFreeTier: m.isFreeTier,
        isActive: m.isActive,
      },
      create: m,
    });
    console.log(`  ✅ Seeded model: ${seeded.name} (slug: ${seeded.slug}, cost: ${seeded.creditCost} credits)`);
  }

  console.log('✨ AI Models seeding completed.');
}

seedModels()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
