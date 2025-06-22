import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    publisher: z.string(),
    publishDate: z.date(),
  }),
});

export const collections = {
  articles,
};
