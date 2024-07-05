function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.ins || [];
}

function plugin(globalOptions, lines) {
	const ins = pluginOptions(globalOptions);
	if (ins.length > 0) {
		ins.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.properties["data-line-added"] = "";
			}
		})
	}
}

export default {
	type: "line",
	plugin
}
