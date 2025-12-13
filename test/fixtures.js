import { all, common } from "@wooorm/starry-night";
import { h } from "hastscript";
import {
	titlePlugin,
	languageIndicatorPlugin,
	lineAnnotationPlugin
} from "../src/plugins.js";
import logGrammar from "./text.log.js";

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
		title: "codeblock with language highlighted by custom grammar",
		options: {
			grammars: [
				logGrammar,
				...common
			]
		},
		input: `
\`\`\`log
2025-05-18T23:08:48.269 INFO 10683 --- [main] com.zaxxer.hikari.HikariDataSource : H2HikariPool - Starting...
2025-05-18T23:08:48.338 INFO 10683 --- [main] com.zaxxer.hikari.pool.HikariPool  : H2HikariPool - Added connection conn0: url=jdbc:h2:mem:sa user=SA
2025-05-18T23:08:48.338 INFO 10683 --- [main] com.zaxxer.hikari.HikariDataSource : H2HikariPool - Start completed.
\`\`\`
`
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
		title: "codeblock with title",
		options: {
			plugins: [titlePlugin]
		},
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
		title: "codeblock with language indicator",
		options: {
			plugins: [languageIndicatorPlugin]
		},
		input: `
\`\`\`rust
fn main() {
    println!("Hello, world!");
}
\`\`\`
`,
	},
	{
		title: "codeblock with marked lines",
		options: {
			plugins: [lineAnnotationPlugin]
		},
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
		options: {
			plugins: [lineAnnotationPlugin]
		},
		input: `
\`\`\`sh ins{1,4}
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
		options: {
			plugins: [lineAnnotationPlugin]
		},
		input: `
\`\`\`java del{1..5,10}
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
	void main() throws IOException {
		var path = Path.of("example.txt");
		Files.readAllLines(path).forEach(IO::println);
	}
}
\`\`\`
`,
	},
	{
		title: "codeblock with prompts",
		options: {
			plugins: [lineAnnotationPlugin]
		},
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
		title: "codeblock with command and output",
		options: {
			plugins: [lineAnnotationPlugin]
		},
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
		title: "codeblock rendered using custom footer plugin",
		options: {
			plugins: [clipboardCopyBtnPlugin]
		},
		input: `
\`\`\`html
<mark>highlighted</mark>
\`\`\`
`,
	},
];
