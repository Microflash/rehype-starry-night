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
];
