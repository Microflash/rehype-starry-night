import { all } from "@wooorm/starry-night";
import { h } from "hastscript";
import { defaultPlugins } from "../src/index.js";

const clipboardCopyBtnPlugin = {
	type: "footer",
	apply: (opts, node) => {
		if (opts.id) node.push(h(`button.${opts.namespace}-copy`, "Copy to clipboard"));
	}
};

export default [
	{
		title: "no codeblock",
		input: "Maybe AI is a creative solution if you aren't a creative person.",
	},
	{
		title: "codeblock without language",
		input: `
\`\`\`
author "Alex Monad" email=alex@example.com active=#true
\`\`\`
`
	},
	{
		title: "codeblock with known language",
		input: `
\`\`\`css
* {
  all: unset;
}
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
		title: "codeblock with prompts",
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
		title: "codeblock with marked lines",
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
		title: "codeblock with inserted lines",
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
		title: "codeblock with deleted lines",
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
Apache Maven 3.9.11 (3e54c93a704957b63ee3494413a2b544fd3d825b)
Maven home: /opt/homebrew/Cellar/maven/3.9.11/libexec
Java version: 25.0.1, vendor: Azul Systems, Inc., runtime: /Library/Java/JavaVirtualMachines/zulu-25.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "15.7.2", arch: "aarch64", family: "mac"
\`\`\`
`,
	},
	{
		title: "codeblock with language in all grammars",
		options: {
			grammars: all
		},
		input: `
\`\`\`ballerina
import ballerina/io;

public function main() {
  io:println("Hello, World!");
}
\`\`\`
`
	},
	{
		title: "codeblock with language not in common grammars",
		input: `
\`\`\`d2
x -> y
\`\`\`
`
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
		title: "codeblock rendered with custom namespace",
		options: {
			namespace: "highlight"
		},
		input: `
\`\`\`java
IO.println("Hello, world!");
\`\`\`
`,
	},
	{
		title: "codeblock rendered using custom footer plugin",
		options: {
			plugins: [
				clipboardCopyBtnPlugin
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
				...defaultPlugins,
				clipboardCopyBtnPlugin
			]
		},
		input: `
\`\`\`zsh
defaults write com.apple.finder AppleShowAllFiles YES
\`\`\`
`,
	},
];
