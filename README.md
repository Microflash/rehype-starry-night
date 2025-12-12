# rehype-starry-night

<!-- [![npm](https://img.shields.io/npm/v/@microflash/rehype-starry-night)](https://www.npmjs.com/package/@microflash/rehype-starry-night)
[![regression](https://github.com/Microflash/rehype-starry-night/actions/workflows/regression.yml/badge.svg)](https://github.com/Microflash/rehype-starry-night/actions/workflows/regression.yml)
[![license](https://img.shields.io/npm/l/@microflash/rehype-starry-night)](./LICENSE.md) -->

[rehype](https://github.com/rehypejs/rehype) plugin to highlight code with [Starry Night](https://github.com/wooorm/starry-night)

- [What’s this?](#whats-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Plugin API](#plugin-api)
- [Theming](#theming)
	- [Supporting Light and Dark themes](#supporting-light-and-dark-themes)
- [Examples](#examples)
- [Related](#related)
- [License](#license)

## What’s this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin to highlight code with [Starry Night](https://github.com/wooorm/starry-night) in a markdown document. It mimics GitHub's syntax highlighting.

## When should I use this?

This project is useful if you want to use the syntax highlighting powered by VS Code's syntax highlighter engine, and themes similar to GitHub. It is also useful if you want to build your own syntax highlighting themes based on [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). You can enable additional features through plugins using [Plugin API](#plugin-api); they are all opt-in based on your specific need.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/rehype-starry-night
```

In Deno, with [esm.sh](https://esm.sh/):

```js
import rehypeStarryNight from "https://esm.sh/@microflash/rehype-starry-night";
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import rehypeStarryNight from "https://esm.sh/@microflash/rehype-starry-night?bundle";
</script>
```

## Use

Say we have the following file `example.md`:

	```css
	html {
		box-sizing: border-box;
		text-size-adjust: 100%;
		/* allow percentage based heights for the children */
		height: 100%;
	}
	```

And our module `example.js` looks as follows:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "@microflash/rehype-starry-night";
import { readFileSync } from "node:fs";

main();

async function main() {
	const markdown = readFileSync("./index.md", "utf8");
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStarryNight)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(markdown);

	console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="hl"><pre><code id="MC40OTU2MDAx" tabindex="0" class="language-css"><span class="pl-ent">html</span> {
	<span class="pl-c1">box-sizing</span>: <span class="pl-c1">border-box</span>;
	<span class="pl-c1">text-size-adjust</span>: <span class="pl-c1">100</span><span class="pl-k">%</span>;
	<span class="pl-c">/* allow percentage based heights for the children */</span>
	<span class="pl-c1">height</span>: <span class="pl-c1">100</span><span class="pl-k">%</span>;
}
</code></pre></div>
```

![Syntax highlighting with Rehype Starry Night](./etc/general-usage.png)

## API

The default export is `rehypeStarryNight`. The following options are available. All of them are optional.

- `namespace` (type: `string`, default: `hl`): class name of the highlighted codeblock
- `grammars` (type: `Array<Grammar>`, default: `common`) - [Starry Night](https://github.com/wooorm/starry-night) compatible grammar definitions. By default, common grammars provided by Starry Night are used.
- `aliases` (type: `Record<string, string>`, default: `{}`): aliases to force syntax highlighting. By default, unknown languages are not highlighted.
- `plainText` (type: `Array<string>`, default: `[]`): array of languages not to highlight
- `plugins` (type: `Array<Plugin>`, default: `[]`) - array of plugins to customize the  highlighted codeblock, using [Plugin API](#plugin-api)
- `allowMissingScopes` (type: `boolean`, default: `false`) - whether to warn for missing scope or not

### Plugin API

You can customize the highlighted codeblock with a plugin. A plugin looks like this:

```js
export const myPlugin = {
	type: "header",
	opts: meta => {
		// parse codeblock metadata
		return {
			// plugin specific options
		}
	},
	apply: (opts, node) => {
		// do something with plugin specific options and codeblock node
	}
};
```

- `type` (type: `string`, possible values: `header`, `line` or `footer`) - controls whether the customization applies to the header, line or footer of the codeblock element
- `opts` (type: `function`, arguments: `meta`, return: `Object`) - optional option processing function. You can use this to read the metadata associated with a codeblock (parsed by [`fenceparser`](https://github.com/Microflash/fenceparser)) and return plugin specific options derived from them. By default, the metadata contains the language associated with the codeblock.
- `apply` (type: `function`, arguments: `opts` and `nodes`) - required function that applies customizations on the codeblock nodes (an array of [hast](https://github.com/syntax-tree/hastscript) nodes) based on plugin options (supplied by `opts` function)

`rehype-starry-night` ships a few plugins out of box, with which you can

- [add title to your codeblock header]
- [add language of the codeblock in the footer]
- customize lines to show [highlights], [inserted lines], and [deleted lines]
- [show a prompt character before a line] to indicate a command line prompt
- [mark lines as command output] (so they are not copied alongwith command)

These plugins are opt-in and you'll have to manually import them.

```js
import {
	titlePlugin,
	languageIndicatorPlugin,
	lineAnnotationPlugin
} from "@microflash/rehype-starry-night/plugins";

const processor = await unified()
	.use(remarkParse)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeStarryNight, {
		plugins: [
			titlePlugin,
			languageIndicatorPlugin,
			lineAnnotationPlugin
		]
	})
	.use(rehypeStringify, { allowDangerousHtml: true });
```

## Theming

Import [`props.css`](./src/props.css) and [`index.css`](./src/index.css) files in your project, or use them as a base for your own custom theme. For different color schemes for syntax highlighting, check the [available themes on Starry Night repository](https://github.com/wooorm/starry-night#css).

### Supporting Light and Dark themes

Here's one way to support light and dark themes; the appropriate theme will get activated based on system preferences.

```css
:root {
	/* light theme variables specific to rehype-starry-night plugin */
	--hl-bg-color: hsl(220, 23%, 97%);
	--hl-border-color: hsl(215, 15%, 85%);
	--hl-outline-color: hsl(215, 15%, 70%, 0.5);
}

@media (prefers-color-scheme: dark) {
	:root {
		/* dark theme variables specific to rehype-starry-night plugin */
		--hl-bg-color: hsl(216, 18%, 11%);
		--hl-border-color: hsl(215, 11%, 22%);
		--hl-outline-color: hsl(215, 11%, 37%, 0.5);
	}
}

/* import a Starry Night theme that supports both dark and light themes */
@import "https://raw.githubusercontent.com/wooorm/starry-night/main/style/both.css";

/* import CSS specific to rehype-starry-night plugin */
@import "https://raw.githubusercontent.com/Microflash/rehype-starry-night/main/src/index.css";
```

> [!WARNING]
> URL imports for external styles is not recommended. You should either self-host them or bundle them.

## Examples

## Related

- [`rehype-starry-night`](https://github.com/rehypejs/rehype-starry-night) &mdash; alternative plugin to apply syntax highlighting to code with `starry-night`
- [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight) &mdash; highlight code with [highlight.js](https://github.com/isagalaev/highlight.js) (through [lowlight](https://github.com/wooorm/lowlight))
- [`rehype-prism-plus`](https://github.com/timlrx/rehype-prism-plus) &mdash; highlight code with [Prism](http://prismjs.com) (via [refractor](https://github.com/wooorm/refractor)) with additional line highlighting and line numbers functionalities
- [`@shikijs/rehype`](https://github.com/shikijs/shiki/tree/main/packages/rehype) &mdash; highlight code with [shiki](https://shiki.style)

## License

[MIT](./LICENSE.md)
