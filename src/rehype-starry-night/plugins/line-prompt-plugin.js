import { h } from "hastscript";

function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.prompt || [];
}

function plugin(globalOptions, lines) {
	const prompt = pluginOptions(globalOptions);
	if (prompt.length > 0) {
		prompt.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.children = [
					h("span.line-prompt", { "aria-hidden": true }),
					...line.children
				];
			}
		})
	}
}

export default {
	type: "line",
	plugin
}
