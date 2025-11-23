import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { describe, it } from "node:test";
import * as cheerio from "cheerio";
import rehypeStarryNight from "../src/index.js";
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
	return path.resolve(process.cwd(), "test", "snapshots", `${t.replaceAll(" ", "_")}.snap.html`);
}

describe("<@microflash/rehype-starry-night>", () => {
	for (const rule of scenarios) {
		const { title, input, options = {} } = rule;
		it(`Test: ${title}`, async (t) => {
			const result = await parse(input, options);
			const $ = cheerio.load(result, null, false);
			$("code").removeAttr("id");
			t.assert.fileSnapshot($.html(), snapshotPath(title));
		});
	}
});
