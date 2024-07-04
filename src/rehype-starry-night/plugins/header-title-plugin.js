import { h } from "hastscript";

function pluginOptions(globalOptions) {
	return {
		title: globalOptions?.metadata?.title,
		classNamePrefix: globalOptions.classNamePrefix
	}
}

function plugin(globalOptions, nodes) {
	const {
		title,
		classNamePrefix
	} = pluginOptions(globalOptions);
	if (title) {
		nodes.push(
			h(`div.${classNamePrefix}-title`, title)
		);
	}
}

export default {
	type: "header",
	plugin
}
