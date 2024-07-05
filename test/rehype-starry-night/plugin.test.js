import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";
import * as cheerio from "cheerio";
import { common } from "@wooorm/starry-night";
import { h } from "hastscript";
import rehypeStarryNight from "../../src/rehype-starry-night/index.js";

const scenarios = [
	{
		title: "no code element",
		input: "Divided we fall.",
	},
	{
		title: "codeblock without language",
		input: `
\`\`\`
echo "foo" > bar.txt
\`\`\`
`,
	},
	{
		title: "single line codeblock",
		input: `
\`\`\`sh
docker ps -a
\`\`\`
`,
	},
	{
		title: "line numbers for multiline codeblock",
		input: `
\`\`\`css
* {
  display: revert;
}
\`\`\`
`,
	},
	{
		title: "prompts",
		input: `
\`\`\`sh prompt{1,3}
curl localhost:8080/actuator/health
{"status":"UP"}
curl localhost:8080/greeter?name=Anya
Hello, Anya!
\`\`\`
`,
	},
	{
		title: "highlight lines",
		input: `
\`\`\`sh {4..7} prompt{1}
aws --endpoint-url http://localhost:4566 s3api list-buckets
{
	"Buckets": [
		{
			"Name": "my-bucket",
			"CreationDate": "2022-07-12T13:44:44+00:00"
		}
	],
	"Owner": {
		"DisplayName": "webfile",
		"ID": "bcaf1ffd86f41161ca5fb16fd081034f"
	}
}
\`\`\`
`,
	},
	{
		title: "codefence with a title",
		input: `
\`\`\`sh title='Configuring the AWS account' prompt{1}
aws configure
AWS Access Key ID [None]: gwen
AWS Secret Access Key [None]: stacy
Default region name [None]: us-east-1
Default output format [None]: json
\`\`\`
`,
	},
	{
		title: "aliases",
		options: { aliases: { xjm: "toml" } },
		input: `
\`\`\`xjm
language = "en"
customization = false
features = [ "io", "graphics", "compute" ]
\`\`\`
`,
	},
	{
		title: "unknown language",
		input: `
\`\`\`nux
let-env NU_LIB_DIRS = [
	($nu.config-path | path dirname | path join 'scripts')
]
\`\`\`
`,
	},
	{
		title: "custom header plugin",
		options: {
			plugins: [
				{
					type: "header",
					plugin: (globalOptions, nodes) => {
						nodes.push(
							h(`button.${globalOptions.classNamePrefix}-copy`, "Copy to clipboard")
						);
					}
				}
			]
		},
		input: `
\`\`\`html
<mark>highlighted</mark>
\`\`\`
`,
	},
	{
		title: "codeblock with no plugin",
		options: {
			plugins: false
		},
		input: `
\`\`\`sh
zip function.zip index.mjs
\`\`\`
`,
	},
	{
		title: "custom classname prefix",
		options: { classNamePrefix: "highlight" },
		input: `
\`\`\`java
System.out.println("Hello, world!");
\`\`\`
`,
	},
	{
		title: "language not in common grammars",
		options: { grammars: common, },
		input: `
\`\`\`d2
x -> y
\`\`\`
`
	},
	{
		title: "language in common grammars",
		options: { grammars: common, },
		input: `
\`\`\`js
console.warn('cease now!')
\`\`\`
`
	},
	{
		title: "wrapped codeblock",
		input: `
\`\`\`sh wrap="true"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`
`
	},
];
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
