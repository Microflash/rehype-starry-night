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
		input: "Time moves slowly, but passes quickly.",
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
\`\`\`vale
import stdlib.*;

exported func main() {
	println("Hello world!");
}
\`\`\`
`,
	},
	{
		title: "codeblock with aliased language",
		options: {
			aliases: {
				psql: "sql"
			}
		},
		input: `
\`\`\`psql
select *
from books
where (published_year, available) = (2024, TRUE);
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
  all: unset;
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
corepack prepare pnpm@latest --activate
Preparing pnpm@latest for immediate activation...
pnpm -v
9.6.0
\`\`\`
`,
	},
	{
		title: "codeblock with wrapped lines",
		input: `
\`\`\`rust wrap{4..8}
use std::fs::read_to_string;

fn read_lines(filename: &str) -> Vec<String> {
    read_to_string(filename) 
        .unwrap()  // panic on possible file-reading errors
        .lines()  // split the string into an iterator of string slices
        .map(String::from)  // make each slice into a string
        .collect()  // gather them together into a vector
}
\`\`\`
`
	},
	{
		title: "codeblock with highlighted lines",
		input: `
\`\`\`sh {4..7} prompt{1}
aws s3api list-buckets
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
		title: "codeblock with added lines",
		input: `
\`\`\`nu ins{1,4}
$env.PNPM_HOME = "~/Library/pnpm"
let paths = [
	"/opt/homebrew/bin",
	$env.PNPM_HOME
]
\`\`\`
`,
	},
	{
		title: "codeblock with removed lines",
		input: `
\`\`\`sql del{1}
drop table users;
# ERROR:  cannot drop table users because other objects depend on it
# DETAIL:  constraint orders_user_id_fkey on table orders depends on table users
# HINT:  Use DROP ... CASCADE to drop the dependent objects too.
\`\`\`
`,
	},
	{
		title: "codeblock with command and output",
		input: `
\`\`\`sql prompt{1} output{2..6}
mvn -version
Apache Maven 3.9.8
Maven home: ~/maven/3.9.8/libexec
Java version: 22.0.1, vendor: Azul Systems, Inc., runtime: ~/zulu-22.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "14.5", arch: "aarch64", family: "mac"
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
