import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";
import remarkInlineCodeLang from "../../src/remark-inline-code-lang/index.js";
import rehypeStarryNightInline from "../../src/rehype-starry-night-inline/index.js";

const scenarios = [
	{
		title: "no code element",
		input: "Divided we fall."
	},
	{
		title: "code element without annotation",
		input: "`System.out.println(\"Hello, world!\")`"
	},
	{
		title: "single annotated code element",
		input: "Here's an example of printing a warning: `js> console.warn('WARNING: cease or desist')`"
	},
	{
		title: "multiple annotated code elements",
		input: "Launch the container with `sh> docker compose up -d` and run `sh> curl https://localhost:8080`"
	},
	{
		title: "code element with custom class name prefix",
		input: "To prune a remote called origin, run `sh> git remote prune origin`",
		options: {
			classNamePrefix: "highlight"
		}
	}
];
const scenario = scenarios.map(s => s.title);

async function parse(markdown, options = {}) {
	const file = await unified()
		.use(remarkParse)
		.use(remarkInlineCodeLang)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStarryNightInline, options)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);
	return String(file);
}

const currentDirectory = process.cwd();
const testDirectory = "test";
const pluginDirectory = "rehype-starry-night-inline";
const snapshotsDirectory = "snapshots";

it.each(scenario)(`Test: %s`, async (rule) => {
	const { input, options = {} } = scenarios.find(s => s.title === rule);
	const result = await parse(input, options);
	const snapshot = path.resolve(
		currentDirectory,
		testDirectory,
		pluginDirectory,
		snapshotsDirectory,
		`${rule.replaceAll(" ", "_")}.html`
	);
	await expect(result).toMatchFileSnapshot(snapshot);
});
