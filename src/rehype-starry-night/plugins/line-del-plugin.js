function pluginOptions(globalOptions) {
	return globalOptions?.metadata?.del || [];
}

function plugin(globalOptions, lines) {
	const del = pluginOptions(globalOptions);
	if (del.length > 0) {
		del.forEach(lineNumber => {
			if (lines.has(lineNumber)) {
				const line = lines.get(lineNumber);
				line.properties["data-line-removed"] = "";
			}
		});
		globalOptions["lineMarkerGutterFactor"] = 1;
	}
}

export default {
	type: "line",
	plugin
}
