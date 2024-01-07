import test from "ava";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import * as cheerio from "cheerio";
import remarkCodeDirective from "../src/remark-code-directive.js";
import rehypeStarryNight from "../src/index.js";
import rehypeStarryNightInline from "../src/rehype-starry-night-inline.js";
import fixtures from "./fixtures.js";

async function process(markdown, options = {}, inline = false) {
	const plugins = [remarkParse];

	if (inline) {
		plugins.push(remarkDirective);
		plugins.push(remarkCodeDirective);
	}

	plugins.push([remarkRehype, { allowDangerousHtml: true }]);
	plugins.push([rehypeStarryNight, options]);
	plugins.push([rehypeStarryNightInline, options]);
	plugins.push([rehypeStringify, { allowDangerousHtml: true }]);

	const file = await unified().use(plugins).process(markdown);
	return String(file);
}

for (const fixture of fixtures) {
	const { title, input, output, options = {}, inline = false } = fixture;
	test(`test '${title}'`, async t => {
		const result = await process(input, options, inline);
		const $ = cheerio.load(result, null, false);
		$("pre").removeAttr("id");
		t.is(output, $.html());
	});
}
