export default function starryNightHeaderCaptionExtension({ metadata, classNamePrefix }, children) {
	const caption = metadata["caption"];
	if (caption) {
		children.push({
			type: "element",
			tagName: "div",
			properties: { className: [`${classNamePrefix}-caption`] },
			children: [
				{
					type: "text",
					value: caption
				}
			]
		});
	}
}
