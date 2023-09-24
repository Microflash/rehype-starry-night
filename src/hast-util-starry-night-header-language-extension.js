export default function starryNightHeaderLanguageExtension({ language }, children) {
	if (language) {
		children.push({
			type: "element",
			tagName: "div",
			properties: { className: ["highlight-language"] },
			children: [
				{
					type: "text",
					value: language
				}
			]
		})
	}
}
