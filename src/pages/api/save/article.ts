export const prerender = false;

import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { title, slug, markdown, publisher, publishDate } = data;

    if (
      !title ||
      !slug ||
      !publisher ||
      !publishDate ||
      !markdown
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const frontmatter = [
      "---",
      `title: "${title}"`,
      `slug: "${slug}"`,
      `publisher: "${publisher}"`,
      `publishDate: ${new Date(publishDate).toISOString()}`,
      "---",
      "",
    ].join("\n");

    const fullContent = `${frontmatter}${markdown}`;

    const filePath = path.resolve(
      "src/content/articles",
      `${slug}.md`
    );

    try {
      await fs.access(filePath);
      return new Response(
        JSON.stringify({ error: "File with this slug already exists." }),
        { status: 409 }
      );
    } catch {
    }

    await fs.writeFile(filePath, fullContent, "utf-8");

    return new Response(JSON.stringify({ success: true, path: filePath }), {
      status: 200,
    });

  } catch (err) {
    console.error("Error saving markdown:", err);
    return new Response(JSON.stringify({ error: "Failed to save markdown" }), {
      status: 500,
    });
  }
};
