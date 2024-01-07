import { createStarryNight, all } from "@wooorm/starry-night";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

export default function rehypeStarryNightInline(userOptions = {}) {
	const { aliases = {}, grammars = all } = userOptions;
	const starryNightPromise = createStarryNight(grammars);

	return async function (tree) {
		const starryNight = await starryNightPromise;

		visit(tree, "element", (node, index, parent) => {
			const annotatedInlineCode = node.tagName === "code" && ("dataCodeLang" in node.properties);

			if (!parent || index === null || node.tagName !== "code" || !annotatedInlineCode) {
				return;
			}

			const language = node.properties["dataCodeLang"];
			const languageId = aliases[language] || language;
			const scope = starryNight.flagToScope(languageId);

			if (scope) {
				const fragment = starryNight.highlight(toString(node), scope);
				node.children = fragment.children;
			}
		});
	};
}
