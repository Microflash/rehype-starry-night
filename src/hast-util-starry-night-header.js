export default function starryNightHeader(headerOptions) {
	const children = []
	const extensions = headerOptions.extensions

	extensions.forEach(extension => extension(headerOptions, children))

	return {
		type: "element",
		tagName: "div",
		properties: { className: ["highlight-header"] },
		children
	}
}
