import defu from "defu";
import { createStarryNight, all } from "@wooorm/starry-night";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import FenceParser from "@microflash/fenceparser";
import { h } from "hastscript";
import headerLanguagePlugin from "./plugins/header-language-plugin.js";
import headerTitlePlugin from "./plugins/header-title-plugin.js";
import starryNightGutter, { search } from "./hast-util-starry-night-gutter.js";

const fenceparser = new FenceParser();
const prefix = "language-";
const plaintextClassName = [`${prefix}txt`];
const defaults = {
	classNamePrefix: "hl"
};

function extractMetadata(node) {
	let metadata;

	try {
		const { meta } = node.data || {};
		metadata = fenceparser.parse(meta);
	} catch (e) { }

	return metadata || {};
}

function globalOptions(node, language, classNamePrefix) {
	const metadata = extractMetadata(node);
	return {
		id: btoa(Math.random()).replace(/=/g, "").substring(0, 12),
		metadata,
		language,
		classNamePrefix
	}
}

export default function rehypeStarryNight(userOptions = {}) {
	const {
		aliases = {},
		grammars = all,
		plugins = [
			headerLanguagePlugin,
			headerTitlePlugin
		],
		classNamePrefix
	} = defu(userOptions, defaults);
	const starryNightPromise = createStarryNight(grammars);

	return async function (tree) {
		const starryNight = await starryNightPromise;

		visit(tree, "element", (node, index, parent) => {
			if (!parent || index === null || node.tagName !== "pre") return;

			const [ head ] = node.children;

			if (!head || head.type !== "element" || head.tagName !== "code" || !head.properties) return;

			const classes = head.properties.className || plaintextClassName;
			const languageClass = classes.find(d => typeof d === "string" && d.startsWith(prefix));
			const languageFragment = languageClass.slice(prefix.length);
			const languageId = aliases[languageFragment] || languageFragment;
			const code = toString(head);
			const scope = starryNight.flagToScope(languageId);

			let children;
			if (scope) {
				const fragment = starryNight.highlight(code, scope);
				children = fragment.children;
			} else {
				console.warn(`[rehype-starry-night]: Skipping syntax highlighting for code in unknown language '${languageId}'`);
				children = head.children;
			}

			const globalOptions = {
				id: btoa(Math.random()).replace(/=/g, "").substring(0, 12),
				metadata: extractMetadata(head),
				language: languageFragment,
				classNamePrefix
			}

			const codeParent = h(`div.${classNamePrefix}.${classNamePrefix}-${languageId}`);

			const headerPlugins = plugins.filter(plugin => plugin.type === "header");
			if (headerPlugins) {
				const headerNodes = [];
				headerPlugins.forEach(plugin => plugin.plugin(globalOptions, headerNodes));
				const header = h(`div.${classNamePrefix}-header`, headerNodes);
				codeParent.children = [
					header,
					...codeParent.children || []
				]
			}

			codeParent.children.push(
				h(`pre#${globalOptions.id}`,
					h("code", { tabindex: 0 }, 
						starryNightGutter(
							children, 
							code.match(search).length, 
							globalOptions.metadata
						)
					)
				)
			);

			parent.children.splice(index, 1, codeParent);
		});
	};
}
