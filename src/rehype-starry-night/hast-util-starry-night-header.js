export default function starryNightHeader(headerOptions) {
	const children = [];
	const { extensions, classNamePrefix } = headerOptions;

	extensions.forEach(extension => extension(headerOptions, children));

	return {
		type: "element",
		tagName: "div",
		properties: { className: [`${classNamePrefix}-header`] },
		children
	};
}
