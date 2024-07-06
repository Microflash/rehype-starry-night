import { common } from "@wooorm/starry-night";
import { h } from "hastscript";

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
];
