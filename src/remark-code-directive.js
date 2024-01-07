import { visit } from "unist-util-visit";
import { h } from "hastscript";

export default function remarkCodeDirective() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective"
			) {
				if (!node.attributes["syntax"]) {
					return false;
				}

				const { syntax, ...attribs } = node.attributes;
				const data = node.data || (node.data = {});

				const tagName = "code";
				data.hName = tagName;
				data.hProperties = h(tagName, { "data-code-lang": syntax, ...attribs }).properties;
			}
		});
	};
}
