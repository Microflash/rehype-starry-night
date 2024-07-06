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

const fenceparser = new FenceParser();
const prefix = "language-";
const search = /\r?\n|\r/g;
const defaults = {
	classNamePrefix: "hl"
};
export const defaultPluginPack = [
	headerLanguagePlugin,
	headerTitlePlugin,
	lineMarkPlugin,
	linePromptPlugin,
	lineInsPlugin,
	lineDelPlugin
];

export default function rehypeStarryNight(userOptions = {}) {
	const {
		aliases = {},
		grammars = all,
		plugins = defaultPluginPack,
		classNamePrefix
	} = defu(userOptions, defaults);
	const starryNightPromise = createStarryNight(grammars);

	return async function(tree) {
		const starryNight = await starryNightPromise;

		visit(tree, "element", (node, index, parent) => {
			if (!parent || index === null || node.tagName !== "pre") return;

			const [ head ] = node.children;

			if (!head || head.type !== "element" || head.tagName !== "code" || !head.properties) return;

			const classes = head.properties.className;

			let languageFragment;
			let languageId;
			if (classes) {
				const languageClass = classes.find(d => typeof d === "string" && d.startsWith(prefix));
				languageFragment = languageClass.slice(prefix.length);
				languageId = aliases[languageFragment] || languageFragment;
			} else {
				languageId = "txt";
			}

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

			// apply header plugins
			if (plugins) {
				const headerPlugins = plugins.filter(p => p.type === "header");
				if (headerPlugins) {
					const headerNodes = [];
					headerPlugins.forEach(p => p.plugin(globalOptions, headerNodes));
					if (headerNodes.length > 0) {
						const header = h(`div.${classNamePrefix}-header`, headerNodes);
						codeParent.children = [
							header,
							...codeParent.children || []
						];
					}
				}
			}

			// apply line plugins
			const lines = linesByLineNumber(children);
			const lineNumberGutterWidth = `${lines.size}`.length;
			if (plugins) {
				const linePlugins = plugins.filter(p => p.type === "line");
				if (linePlugins) {
					linePlugins.forEach(p => p.plugin(globalOptions, lines));
				}
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

			// prepare codeblock nodes
			const preChildren = [];
			for (const [lineNumber, line] of lines) {
				const { "data-line-number": dataLineNumber, ...lineProps } = line.properties;
				const lineNodes = dataLineNumber ?
					[
						h("span.line-number", { "aria-hidden": "true" }, `${lineNumber}`),
						...line.children
					] : line.children;
				preChildren.push(h("span.line", { ...lineProps }, lineNodes));
				if (line.eol) {
					preChildren.push(line.eol);
				}
			}

			codeParent.children.push(
				h(`pre#${globalOptions.id}`, preProps,
					h("code", { tabindex: 0 }, preChildren)
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
				lines.set(
					lineNumber,
					{
						children: line,
						properties: {
							"data-line-number": lineNumber
						},
						eol: {
							type: "text",
							value: match[0]
						}
					}
				);
				start = index + 1;
				textStart = match.index + match[0].length;
				match = search.exec(node.value);
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
