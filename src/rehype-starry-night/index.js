import defu from "defu";
import { createStarryNight, all } from "@wooorm/starry-night";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import FenceParser from "@microflash/fenceparser";
import starryNightHeader from "./hast-util-starry-night-header.js";
import starryNightHeaderLanguageExtension from "./hast-util-starry-night-header-language-extension.js";
import starryNightHeaderCaptionExtension from "./hast-util-starry-night-header-caption-extension.js";
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

export default function rehypeStarryNight(userOptions = {}) {
	const {
		aliases = {},
		grammars = all,
		headerExtensions = [
			starryNightHeaderLanguageExtension,
			starryNightHeaderCaptionExtension
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

			const metadata = extractMetadata(head);
			const headerOptions = {
				id: btoa(Math.random()).replace(/=/g, "").substring(0, 12),
				language: languageFragment,
				metadata: metadata,
				extensions: headerExtensions,
				classNamePrefix
			};

			parent.children.splice(index, 1, {
				type: "element",
				tagName: "div",
				properties: {
					className: [classNamePrefix, `${classNamePrefix}-${languageId}`]
				},
				children: [
					starryNightHeader(headerOptions),
					{
						type: "element",
						tagName: "pre",
						properties: {
							id: headerOptions.id
						},
						children: [
							{
								type: "element",
								tagName: "code",
								properties: { tabindex: 0 },
								children: starryNightGutter(children, code.match(search).length, metadata)
							}
						]
					}
				]
			});
		});
	};
}
