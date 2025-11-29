import defu from "defu";
import { createStarryNight, common } from "@wooorm/starry-night";
import { toString } from "hast-util-to-string";
import { SKIP, visit } from "unist-util-visit";
import { h } from "hastscript";
import parse from "@microflash/fenceparser";

const listFormatUnit = new Intl.ListFormat("en", { type: "unit" });
const newLineRegex = /\r?\n|\r/g;
const prefix = "language-";
const defaults = {
	namespace: "hl",
	aliases: {},
	plainText: [],
	plugins: []
};
const isLinePlugin = plugin => plugin.type === "line" && typeof plugin.apply === "function";
const isHeaderPlugin = plugin => plugin.type === "header" && typeof plugin.apply === "function";
const isFooterPlugin = plugin => plugin.type === "footer" && typeof plugin.apply === "function";

export default function rehypeStarryNight(options = {}) {
	const {
		namespace,
		grammars = common,
		aliases,
		plainText,
		plugins,
		allowMissingScopes
	} = defu(options, defaults);

	const starryNightPromise = createStarryNight(grammars);
	let checked = false;

	return async (tree, file) => {
		const starryNight = await starryNightPromise;

		if (!allowMissingScopes && !checked) {
			const missingScopes = starryNight.missingScopes();

			if (missingScopes.length > 0) {
				file.message(
					"Unexpected missing scope" +
					(missingScopes.length === 1 ? "" : "s") +
					" likely needed for highlighting to work: " +
					listFormatUnit.format(missingScopes.map(d => "`" + d + "`")),
					{
						ancestors: [tree],
						place: tree.position,
						ruleId: "missing-scopes",
						source: "@microflash/rehype-starry-night"
					}
				);
			}

			checked = true;
		}

		visit(tree, "element", (container, index, parent) => {
			if (!parent || index === null || container.tagName !== "pre") return;

			const [node] = container.children;

			if (!node || node.type !== "element" || node.tagName !== "code") return;

			const classes = node.properties.className;

			if (Array.isArray(classes)) {
				const languageClass = classes.find(d => typeof d === "string" && d.startsWith(prefix));

				if (languageClass) {
					const language = languageClass.slice(prefix.length);
					const resolvedLanguage = aliases[language] || language;
					const scope = starryNight.flagToScope(resolvedLanguage);

					if (plainText.includes(language)) {
						// Empty.
					} else if (scope) {
						const fragment = starryNight.highlight(toString(node), scope);
						const meta = parseMeta(node);

						const blockNodes = [];
						const id = btoa(Math.random()).replace(/=/g, "").substring(0, 12);
						const sectionOpts = { namespace, id, language };
						const addHeader = plugins && plugins.some(isHeaderPlugin);
						// Apply header
						if (addHeader) {
							const headerPlugins = plugins?.filter(isHeaderPlugin);
							const headerNodes = mapSection(headerPlugins, sectionOpts, meta);
							if (headerNodes?.length > 0) blockNodes.push(h(`div.${namespace}-header`, headerNodes));
						}

						node.properties = {
							id,
							tabindex: 0,
							...node.properties,
						};
						const decorateLines = plugins && plugins.some(isLinePlugin);
						// Apply line decorations
						if (decorateLines) {
							const linePlugins = plugins?.filter(isLinePlugin);
							const lineOpts = Object.assign(
								{}, ...linePlugins?.filter(plugin => !!plugin.opts).map(plugin => plugin.opts(meta))
							);
							const totalLines = mapLines(fragment, (children, lineNumber) => {
								const line = h("span", { dataLineNumber: lineNumber }, children);
								for (const plugin of linePlugins) {
									plugin?.apply(lineOpts, line);
								}
								return line;
							});
							const gutter = `${totalLines}`.length;
							node.properties["style"] = `--hl-line-gutter: ${gutter}`;
						}

						node.children = fragment.children;
						blockNodes.push(container);

						const addFooter = plugins && plugins.some(isFooterPlugin);
						// Apply footer
						if (addFooter) {
							const footerPlugins = plugins?.filter(isFooterPlugin);
							const footerNodes = mapSection(footerPlugins, sectionOpts, meta);
							if (footerNodes?.length > 0) blockNodes.push(h(`div.${namespace}-footer`, footerNodes));
						}

						const codeblock = h(`div.${namespace}`, blockNodes);
						parent.children.splice(index, 1, codeblock);
					} else {
						let reason =
							"Unexpected unknown language `" + language +
							"` defined with `" + prefix + "` class, expected a known name";

						file.message(reason, {
							ancestors: [parent, container, node],
							place: node.position,
							ruleId: "missing-language",
							source: "@microflash/rehype-starry-night"
						});
					}
				}
			}

			return SKIP;
		});

		return tree;
	};
}

function parseMeta(node) {
	try {
		const meta = node?.data?.meta;
		return meta ? parse(meta) : {};
	} catch (e) {
		return {};
	}
}

function mapSection(plugins, opts, meta) {
	const pluginOpts = Object.assign(
		{ ...opts },
		...plugins?.filter(plugin => !!plugin.opts).map(plugin => plugin.opts(meta))
	);
	const nodes = [];
	for (const plugin of plugins) {
		plugin?.apply(pluginOpts, nodes);
	}
	return nodes;
}

function mapLines(tree, createLine) {
	const replacement = [];
	let index = -1;
	let start = 0;
	let startTextRemainder = "";
	let lineNumber = 0;

	while (++index < tree.children.length) {
		const child = tree.children[index];

		if (child.type === "text") {
			let textStart = 0;
			let match = newLineRegex.exec(child.value);

			while (match) {
				// Nodes in this line.
				const line = tree.children.slice(start, index);

				// Prepend text from a partial matched earlier text.
				if (startTextRemainder) {
					line.unshift({ type: "text", value: startTextRemainder });
					startTextRemainder = "";
				}

				// Append text from this text.
				if (match.index > textStart) {
					line.push({
						type: "text",
						value: child.value.slice(textStart, match.index)
					});
				}

				// Add a line, and the eol.
				lineNumber += 1;
				replacement.push(createLine(line, lineNumber), {
					type: "text",
					value: match[0]
				});

				start = index + 1;
				textStart = match.index + match[0].length;
				match = newLineRegex.exec(child.value);
			}

			// If we matched, make sure to not drop the text after the last line ending.
			if (start === index + 1) {
				startTextRemainder = child.value.slice(textStart);
			}
		}
	}

	const line = tree.children.slice(start);
	// Prepend text from a partial matched earlier text.
	if (startTextRemainder) {
		line.unshift({ type: "text", value: startTextRemainder });
		startTextRemainder = "";
	}

	if (line.length > 0) {
		lineNumber += 1;
		replacement.push(createLine(line, lineNumber));
	}

	// Replace children with new array.
	tree.children = replacement;
	return lineNumber;
}
