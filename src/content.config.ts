import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    excerpt: z.string(),
    category: z.enum(['vorsorge', 'steuern', 'coverd']),
    date: z.coerce.date(),
    image: z.string(),
    lang: z.enum(['de', 'en']),
    translationKey: z.string(),
  }),
});

export const collections = { blog };
