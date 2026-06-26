import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      description: z.string(),
      author: z.string(),
      heroImage: image().optional(),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string(),
    eyebrow: z.string(),
    problemStatement: z.string(),
    challengeHeading: z.string(),
    frictionPoints: z.array(z.string()),
    solutionHeading: z.string(),
    featuresList: z.array(z.string()),
    proofHeading: z.string(),
    proofItems: z.array(
      z.object({
        title: z.string(),
        metric: z.string(),
        description: z.string(),
      }),
    ),
    processHeading: z.string(),
    processItems: z.array(
      z.object({
        step: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
    faqItems: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
    ctaHeading: z.string(),
    ctaText: z.string(),
  }),
});

export const collections = { blog, services };
