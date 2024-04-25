import defu from "defu";
import { visit, SKIP } from "unist-util-visit";

const defaults = {
	marker: "> "
};

export default function remarkInlineCodeLang(userOptions = {}) {
	const { marker } = defu(userOptions, defaults);
	const markerLength = marker.length;
	return async function (tree) {
		visit(tree, "inlineCode", (node, index, parent) => {
			const [lang, value] = node.value.split(marker);
			const annotatedInlineCode = lang && value && node.value.startsWith(`${lang}${marker}`);

			if (!annotatedInlineCode) {
				return;
			}

			const columnStart = node.position.start.column - lang.length - markerLength;
			const columnEnd = columnStart + value.length;
			const newNode = {
				type: node.type,
				value: value,
				data: {
					hProperties: { lang }
				},
				position: {
					start: {
						line: node.position.start.line,
						column: columnStart,
						offset: columnStart - 1
					},
					end: {
						line: node.position.end.line,
						column: columnEnd,
						offset: columnEnd - 1
					}
				}
			};
			parent.children.splice(index, 1, newNode);

			return [SKIP, index];
		});
	};
}
