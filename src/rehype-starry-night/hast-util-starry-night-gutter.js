export const search = /\r?\n|\r/g

export default function starryNightGutter(children, lines, metadata) {
	const linePadding = lines > 9 ? `${lines}`.length : 1
	return createLines(children, lines > 1 ? createLine : createOneLine, linePadding, metadata)
}

function createLines(children, createLine, linePadding, { highlight = [], prompt = [] }) {
	const replacement = []
	let index = -1
	let start = 0
	let startTextRemainder = ""
	let lineNumber = 0

	while (++index < children.length) {
		const child = children[index]

		if (child.type === "text") {
			let textStart = 0
			let match = search.exec(child.value)

			while (match) {
				// Nodes in this line.
				const line = (children.slice(start, index))

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
				replacement.push(createLine(line, highlight.includes(lineNumber), prompt.includes(lineNumber), lineNumber, linePadding), {
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

	const line = (children.slice(start))
	// Prepend text from a partial matched earlier text.
	if (startTextRemainder) {
		line.unshift({ type: "text", value: startTextRemainder })
		startTextRemainder = ""
	}

	if (line.length > 0) {
		lineNumber += 1
		replacement.push(createLine(line, highlight.includes(lineNumber), prompt.includes(lineNumber), lineNumber, linePadding))
	}

	return replacement
}

function createLine(children, dataHighlighted, dataPrompt, lineNumber, linePadding) {
	const elements = [
		{
			type: "element",
			tagName: "span",
			properties: {
				className: "line-number",
				ariaHidden: "true"
			},
			children: [
				{
					type: "text",
					value: `${lineNumber}`.padStart(linePadding)
				}
			]
		}
	]

	if (dataPrompt) {
		elements.push({
			type: "element",
			tagName: "span",
			properties: {
				className: "line-prompt",
				ariaHidden: "true"
			}
		})
	}

	return {
		type: "element",
		tagName: "span",
		properties: { className: "line", dataHighlighted },
		children: [
			...elements,
			...children
		]
	}
}

export function createOneLine(children, dataHighlighted, dataPrompt) {
	const elements = []

	if (dataPrompt) {
		elements.push({
			type: "element",
			tagName: "span",
			properties: {
				className: "line-prompt",
				ariaHidden: "true"
			}
		})
	}

	return {
		type: "element",
		tagName: "span",
		properties: { className: "line", dataHighlighted },
		children: [
			...elements,
			...children
		]
	}
}
