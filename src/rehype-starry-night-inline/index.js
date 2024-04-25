import defu from "defu";
import { createStarryNight, all } from "@wooorm/starry-night";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

const defaults = {
	classNamePrefix: "hl"
};

export default function rehypeStarryNightInline(userOptions = {}) {
	const { aliases = {}, grammars = all, classNamePrefix } = defu(userOptions, defaults);
	const starryNightPromise = createStarryNight(grammars);

	return async function (tree) {
		const starryNight = await starryNightPromise;

		visit(tree, "element", (node, index, parent) => {
			const annotatedInlineCode = node.tagName === "code" && ("lang" in node.properties);

			if (!parent || index === null || node.tagName !== "code" || !annotatedInlineCode) {
				return;
			}

			const { lang, ...props } = node.properties;
			const languageId = aliases[lang] || lang;
			const scope = starryNight.flagToScope(languageId);

			if (scope) {
				const fragment = starryNight.highlight(toString(node), scope);
				node.children = fragment.children;
				node.properties = {
					className: [`${classNamePrefix}-inline`, `${classNamePrefix}-${languageId}`],
					...props
				};
			} else {
				node.properties = props;
			}
		});
	};
}
