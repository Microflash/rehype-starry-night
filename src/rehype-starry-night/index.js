import defu from "defu";
import { createStarryNight, all } from "@wooorm/starry-night";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import FenceParser from "@microflash/fenceparser";
import { h } from "hastscript";
import headerLanguagePlugin from "./plugins/header-language-plugin.js";
import headerTitlePlugin from "./plugins/header-title-plugin.js";
import lineMarkPlugin from "./plugins/line-mark-plugin.js";
import linePromptPlugin from "./plugins/line-prompt-plugin.js";
import lineInsPlugin from "./plugins/line-ins-plugin.js";
import lineDelPlugin from "./plugins/line-del-plugin.js";
import starryNightGutter, { search } from "./hast-util-starry-night-gutter.js";

const fenceparser = new FenceParser();
const prefix = "language-";
const plaintextClassName = [`${prefix}txt`];
const defaults = {
	classNamePrefix: "hl"
};

export default function rehypeStarryNight(userOptions = {}) {
	const {
		aliases = {},
		grammars = all,
		plugins = [
			headerLanguagePlugin,
			headerTitlePlugin,
			lineMarkPlugin,
			linePromptPlugin,
			lineInsPlugin,
			lineDelPlugin
		],
		classNamePrefix
	} = defu(userOptions, defaults);
	const starryNightPromise = createStarryNight(grammars);

	return async function(tree) {
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
			};

			const codeParent = h(`div.${classNamePrefix}.${classNamePrefix}-${languageId}`);

			const headerPlugins = plugins.filter(plugin => plugin.type === "header");
			if (headerPlugins) {
				const headerNodes = [];
				headerPlugins.forEach(plugin => plugin.plugin(globalOptions, headerNodes));
				const header = h(`div.${classNamePrefix}-header`, headerNodes);
				codeParent.children = [
					header,
					...codeParent.children || []
				];
			}

			const lines = linesByLineNumber(children);
			const lineNumberGutterWidth = `${lines.size}`.length;
			const linePlugins = plugins.filter(plugin => plugin.type === "line");
			if (linePlugins) {
				linePlugins.forEach(plugin => plugin.plugin(globalOptions, lines));
			}

			const preProps = {};

			// add line number gutter width for codeblock with multiple lines
			if (lines.size > 1) {
				preProps["style"] = `--hl-line-number-gutter-width: ${lineNumberGutterWidth}`;
			}

			// add `data-pre-wrap` property to indicate if the codeblock should be wrapped
			const { wrap = "" } = globalOptions?.metadata;
			if (wrap.trim() === "true") {
				preProps["data-pre-wrap"] = "";
			}
			codeParent.children.push(
				h(`pre#${globalOptions.id}`, preProps,
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

function extractMetadata(node) {
	let metadata;

	try {
		const { meta } = node.data || {};
		metadata = fenceparser.parse(meta);
	} catch (e) { }

	return metadata || {};
}

function linesByLineNumber(nodes) {
	let index = -1;
	let start = 0;
	let lineNumber = 0;
	let startTextRemainder = "";

	const lines = new Map();

	while (++index < nodes.length) {
		const node = nodes[index];

		if (node.type === "text") {
			let textStart = 0;
			let match = search.exec(node.value);

			while (match) {
				// nodes in this line
				const line = nodes.slice(start, index);

				// prepend text from a partial matched earlier text
				if (startTextRemainder) {
					line.unshift({ type: "text", value: startTextRemainder });
					startTextRemainder = "";
				}

				// append text from this text
				if (match.index > textStart) {
					line.push({
						type: "text",
						value: node.value.slice(textStart, match.index)
					});
				}

				// add a line, and the eol
				lineNumber += 1;
				start = index + 1;
				textStart = match.index + match[0].length;
				match = search.exec(node.value);
				lines.set(
					lineNumber,
					{
						children: line,
						properties: {
							"data-line-number": lineNumber
						}
					}
				);
			}

			// if we matched, make sure to not drop the text after the last line ending
			if (start === index + 1) {
				startTextRemainder = node.value.slice(textStart);
			}
		}
	}

	const line = nodes.slice(start);
	// prepend text from a partial matched earlier text
	if (startTextRemainder) {
		line.unshift({ type: "text", value: startTextRemainder });
		startTextRemainder = "";
	}

	if (line.length > 0) {
		lineNumber += 1;
		lines.set(
			lineNumber,
			{
				children: line,
				properties: {
					"data-line-number": lineNumber
				}
			}
		);
	}

	if (lines.size === 1) {
		delete lines.get(1).properties["data-line-number"];
	}

	return lines;
}
