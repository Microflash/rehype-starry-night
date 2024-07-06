import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";
import * as cheerio from "cheerio";
import rehypeStarryNight from "../../src/rehype-starry-night/index.js";
import scenarios from "./fixtures.js";

const scenario = scenarios.map(s => s.title);

async function parse(markdown, options = {}) {
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStarryNight, options)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);
	return String(file);
}

const currentDirectory = process.cwd();
const testDirectory = "test";
const pluginDirectory = "rehype-starry-night";
const snapshotsDirectory = "snapshots";

it.each(scenario)(`Test: %s`, async (rule) => {
	const { input, options = {} } = scenarios.find(s => s.title === rule);
	const result = await parse(input, options);
	const $ = cheerio.load(result, null, false);
	$("pre").removeAttr("id");
	const snapshot = path.resolve(
		currentDirectory,
		testDirectory,
		pluginDirectory,
		snapshotsDirectory,
		`${rule.replaceAll(" ", "_")}.html`
	);
	await expect($.html()).toMatchFileSnapshot(snapshot);
});
