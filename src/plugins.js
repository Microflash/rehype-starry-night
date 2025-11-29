import { h } from "hastscript";

const promptNode = h("span", { "class": "prompt", ariaHidden: "true" });
const emptyDiffNode = h("span.diff", "\t");
const insDiffNode = h("span.diff", "+\t");
const delDiffNode = h("span.diff", "-\t");
export const titlePlugin = {
	type: "header",
	opts: meta => ({ title: meta?.title }),
	apply: (opts, node) => {
		if (opts.title) node.push(h(`div.${opts.namespace}-title`, opts.title));
	}
};
export const languageIndicatorPlugin = {
	type: "footer",
	apply: (opts, node) => {
		if (opts.language) node.push(h(`div.${opts.namespace}-language`, opts.language));
	}
};
export const lineAnnotationPlugin = {
	type: "line",
	opts: meta => {
		const marked = new Set(meta["*"]);
		const inserted = new Set(meta["ins"]);
		const deleted = new Set(meta["del"]);
		const output = new Set(meta["output"]);
		const prompt = new Set(meta["prompt"]);

		return {
			marked,
			inserted,
			deleted,
			output,
			prompt,
			diff: inserted.size > 0 || deleted.size > 0
		}
	},
	apply: (opts, node) => {
		const lineNumber = node.properties.dataLineNumber;
		if (opts.output.has(lineNumber)) node.properties["dataLineOutput"] = true;
		if (opts.prompt.has(lineNumber)) node.children = [promptNode, ...node.children];
		if (opts.marked.has(lineNumber)) node.properties["dataLineMarked"] = true;
		let diffMarked = false;
		if (opts.inserted.has(lineNumber)) {
			node.properties["dataLineInserted"] = true;
			node.children = [insDiffNode, ...node.children];
			diffMarked = true;
		}
		if (opts.deleted.has(lineNumber)) {
			node.properties["dataLineDeleted"] = true;
			node.children = [delDiffNode, ...node.children];
			diffMarked = true;
		}
		if (opts.diff && !diffMarked) {
			node.children = [emptyDiffNode, ...node.children];
		}
	}
};
