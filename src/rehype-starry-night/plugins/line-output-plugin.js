function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.output || [];
}

function plugin(globalOptions, lines) {
	const output = pluginOptions(globalOptions);
	if (output.length > 0) {
		output.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.properties["data-line-output"] = "";
				line.properties["data-unselectable"] = "";
			}
		});
	}
}

export default {
	type: "line",
	plugin
}
