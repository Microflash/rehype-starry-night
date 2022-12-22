/**
 * @typedef {import("hast").ElementContent} ElementContent
 * @typedef {import("hast").Element} Element
 */

/**
 * @param {String} language
 * @param {String} caption
 * @returns {Element}
 */
export default function starryNightHeader(language, caption) {
	/** @type {Array<ElementContent>} */
	const children = []

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

	return {
		type: "element",
		tagName: "div",
		properties: { className: ["highlight-header"] },
		children
	}
}
