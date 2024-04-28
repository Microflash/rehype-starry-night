export default function starryNightHeaderLanguageExtension({ language, classNamePrefix }, children) {
	if (language) {
		children.push({
			type: "element",
			tagName: "div",
			properties: { className: [`${classNamePrefix}-language`] },
			children: [
				{
					type: "text",
					value: language
				}
			]
		});
	}
}
