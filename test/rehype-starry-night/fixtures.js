import { common } from "@wooorm/starry-night";
import { h } from "hastscript";
import { defaultPluginPack } from "../../src/rehype-starry-night";

const headerClipboardCopyBtnPlugin = {
	type: "header",
	plugin: (globalOptions, nodes) => {
		nodes.push(
			h(`button.${globalOptions.classNamePrefix}-copy`, "Copy to clipboard")
		);
	}
};

export default [
	{
		title: "no codeblock",
		input: "Divided we fall.",
	},
	{
		title: "codeblock without language info",
		input: `
\`\`\`
echo "foo" > bar.txt
\`\`\`
`
	},
	{
		title: "codeblock with unknown language",
		input: `
\`\`\`nux
let-env NU_LIB_DIRS = [
	($nu.config-path | path dirname | path join 'scripts')
]
\`\`\`
`,
	},
	{
		title: "codeblock with aliased language",
		options: {
			aliases: {
				xjm: "toml"
			}
		},
		input: `
\`\`\`xjm
language = "en"
customization = false
features = [ "io", "graphics", "compute" ]
\`\`\`
`,
	},
	{
		title: "codeblock with single line",
		input: `
\`\`\`sh
docker ps -a
\`\`\`
`
	},
	{
		title: "codeblock with multiple lines",
		input: `
\`\`\`css
* {
  display: revert;
}
\`\`\`
`,
	},
	{
		title: "codeblock with title",
		input: `
\`\`\`zsh title="Switching off homebrew telemetry"
# turns off homebrew telemetry
export HOMEBREW_NO_ANALYTICS=1
# turns off homebrew auto-update
export HOMEBREW_NO_AUTO_UPDATE=1
\`\`\`
`,
	},
	{
		title: "codeblock with single prompt",
		input: `
\`\`\`sh prompt{1}
brew autoremove --dry-run
\`\`\`
`,
	},
	{
		title: "codeblock with multiple prompts",
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
		title: "codeblock with wrapped lines",
		input: `
\`\`\`sh wrap="true"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`
`
	},
	{
		title: "codeblock with highlighted lines",
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
		title: "codeblock rendered without plugins",
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
		title: "codeblock with language in common grammars",
		options: {
			grammars: common
		},
		input: `
\`\`\`js
console.warn('cease now!')
\`\`\`
`
	},
	{
		title: "codeblock with language not in common grammars",
		options: {
			grammars: common
		},
		input: `
\`\`\`d2
x -> y
\`\`\`
`
	},
	{
		title: "codeblock rendered with custom classname prefix",
		options: {
			classNamePrefix: "highlight"
		},
		input: `
\`\`\`java
System.out.println("Hello, world!");
\`\`\`
`,
	},
	{
		title: "codeblock rendered using custom header plugin",
		options: {
			plugins: [
				headerClipboardCopyBtnPlugin
			]
		},
		input: `
\`\`\`html
<mark>highlighted</mark>
\`\`\`
`,
	},
	{
		title: "codeblock rendered using default and custom plugins",
		options: {
			plugins: [
				...defaultPluginPack,
				headerClipboardCopyBtnPlugin
			]
		},
		input: `
\`\`\`zsh
defaults write com.apple.finder AppleShowAllFiles YES
\`\`\`
`,
	},
];
