import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { describe, it } from "node:test";
import * as cheerio from "cheerio";
import rehypeStarryNight from "../../src/rehype-starry-night/index.js";
import scenarios from "./fixtures.js";

async function parse(markdown, options = {}) {
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStarryNight, options)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);
	return String(file);
}

function snapshotPath(t) {
	return path.resolve(process.cwd(), "test", "rehype-starry-night", "snapshots", `${t.replaceAll(" ", "_")}.snap.html`);
}

describe("<rehype-starry-night>", () => {
	for (const rule of scenarios) {
		const { title, input, options = {} } = rule;
		it(`Test: ${title}`, async (t) => {
			const result = await parse(input, options);
			const $ = cheerio.load(result, null, false);
			$("pre").removeAttr("id");
			t.assert.fileSnapshot($.html(), snapshotPath(title));
		});
	}
});
