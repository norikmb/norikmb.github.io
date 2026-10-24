import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

export const adventCalendarYears = ['2024', '2025'] as const;
export type AdventCalendarYear = (typeof adventCalendarYears)[number];

const blog = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
	}),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().default('/blog/no_image_logo.png'),
		adventCalendarYear: z.enum(adventCalendarYears).optional(),
	}),
});

export const collections = { blog };
