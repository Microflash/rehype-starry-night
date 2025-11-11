import { h } from "hastscript";

function pluginOptions(globalOptions) {
	return {
		language: globalOptions?.language,
		classNamePrefix: globalOptions.classNamePrefix
	}
}

function plugin(globalOptions, nodes) {
	const {
		language,
		classNamePrefix
	} = pluginOptions(globalOptions);
	if (language) {
		nodes.push(
			h(`div.${classNamePrefix}-language`, [h("span", language)])
		);
	}
}

export default {
	type: "header",
	plugin
}
