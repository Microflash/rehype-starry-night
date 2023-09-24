export default function starryNightHeaderCaptionExtension({ metadata }, children) {
	const caption = metadata["caption"]
	if (caption) {
		children.push({
			type: "element",
			tagName: "div",
			properties: { className: ["highlight-caption"] },
			children: [
				{
					type: "text",
					value: caption
				}
			]
		})
	}
}
