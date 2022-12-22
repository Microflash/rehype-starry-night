/**
 * @typedef {import("hast").RootContent} RootContent
 * @typedef {import("hast").ElementContent} ElementContent
 * @typedef {import("hast").Element} Element
 * @typedef {Object} GutterOptions
 * @property {Array<Number>} [highlight]
 * @property {Array<Number>} [prompt]
 */

/**
 * @param {Array<RootContent>} children
 * @param {GutterOptions} gutterOptions
 * @returns {Array<RootContent>}
 */
export default function starryNightGutter(children, { highlight = [], prompt = [] }) {
	/** @type {Array<RootContent>} */
	const replacement = []
	const search = /\r?\n|\r/g
	let index = -1
	let start = 0
	let startTextRemainder = ""
	let lineNumber = 0
	const numOfChildren = children.length
	const oneline = numOfChildren === 1

	while (++index < numOfChildren) {
		const child = children[index]

		if (child.type === "text") {
			let textStart = 0
			let match = search.exec(child.value)

			while (match) {
				// Nodes in this line.
				const line = /** @type {Array<ElementContent>} */ (children.slice(start, index))

				// Prepend text from a partial matched earlier text.
				if (startTextRemainder) {
					line.unshift({ type: "text", value: startTextRemainder })
					startTextRemainder = ""
				}

				// Append text from this text.
				if (match.index > textStart) {
					line.push({
						type: "text",
						value: child.value.slice(textStart, match.index)
					})
				}

				// Add a line, and the eol.
				lineNumber += 1

				replacement.push(createLine(line, highlight.includes(lineNumber), prompt.includes(lineNumber), oneline ? null : lineNumber), {
					type: "text",
					value: match[0]
				})

				start = index + 1
				textStart = match.index + match[0].length
				match = search.exec(child.value)
			}

			// If we matched, make sure to not drop the text after the last line ending.
			if (start === index + 1) {
				startTextRemainder = child.value.slice(textStart)
			}
		}
	}

	const line = /** @type {Array<ElementContent>} */ (children.slice(start))
	// Prepend text from a partial matched earlier text.
	if (startTextRemainder) {
		line.unshift({ type: "text", value: startTextRemainder })
		startTextRemainder = ""
	}

	if (line.length > 0) {
		lineNumber += 1
		replacement.push(createLine(line, lineNumber))
	}

	return replacement
}

/**
 * @param {Array<ElementContent>} children
 * @param {Number} line
 * @param {Boolean} dataHighlighted
 * @param {Boolean} dataPrompt
 * @returns {Element}
 */
function createLine(children, dataHighlighted, dataPrompt, line) {
	let properties = {
		className: "line",
		dataHighlighted,
		dataPrompt
	}

	if (line) {
		properties["dataLineNumber"] = line
	}

	return {
		type: "element",
		tagName: "span",
		properties,
		children
	}
}
