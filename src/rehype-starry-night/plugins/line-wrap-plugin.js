function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.wrap || [];
}

function plugin(globalOptions, lines) {
	const wrap = pluginOptions(globalOptions);
	if (wrap.length > 0) {
		wrap.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.properties["data-line-wrapped"] = "";
			}
		})
	}
}

export default {
	type: "line",
	plugin
}
