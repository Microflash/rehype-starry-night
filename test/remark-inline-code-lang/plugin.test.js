import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { describe, it } from "node:test";
import remarkInlineCodeLang from "../../src/remark-inline-code-lang/index.js";

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
		title: "code element with custom marker",
		input: "To prune a remote called origin, run `git$ git remote prune origin`",
		options: {
			marker: "$ "
		}
	}
];

async function parse(markdown, options = {}) {
	const file = await unified()
		.use(remarkParse)
		.use(remarkInlineCodeLang, options)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);
	return String(file);
}

function snapshotPath(t) {
	return path.resolve(process.cwd(), "test", "remark-inline-code-lang", "snapshots", `${t.replaceAll(" ", "_")}.snap.html`);
}

describe("<remark-inline-code-lang>", () => {
	for (const rule of scenarios) {
		const { title, input, options = {} } = rule;
		it(`Test: ${title}`, async (t) => {
			const result = await parse(input, options);
			t.assert.fileSnapshot(result, snapshotPath(title));
		});
	}
});
