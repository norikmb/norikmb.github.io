import { defineCollection, z } from 'astro:content';

export const adventCalendarYears = ['2024', '2025'] as const;
export type AdventCalendarYear = (typeof adventCalendarYears)[number];

const blog = defineCollection({
	type: 'content',
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
