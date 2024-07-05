function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.highlight || [];
}

function plugin(globalOptions, lines) {
	const mark = pluginOptions(globalOptions);
	if (mark.length > 0) {
		mark.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.properties["data-line-marked"] = "";
			}
		})
	}
}

export default {
	type: "line",
	plugin
}
