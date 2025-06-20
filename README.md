# rehype-starry-night

[![npm](https://img.shields.io/npm/v/@microflash/rehype-starry-night)](https://www.npmjs.com/package/@microflash/rehype-starry-night)
[![regression](https://github.com/Microflash/rehype-starry-night/actions/workflows/regression.yml/badge.svg)](https://github.com/Microflash/rehype-starry-night/actions/workflows/regression.yml)
[![license](https://img.shields.io/npm/l/@microflash/rehype-starry-night)](./LICENSE.md)

[rehype](https://github.com/rehypejs/rehype) plugin to highlight code with [Starry Night](https://github.com/wooorm/starry-night)

- [What’s this?](#whats-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
	- [Support for inline `code` elements](#support-for-inline-code-elements)
- [API](#api)
	- [Plugin API for `rehype-starry-night`](#plugin-api-for-rehype-starry-night)
	- [API for `rehype-starry-night-inline`](#api-for-rehype-starry-night-inline)
	- [API for `remark-inline-code-lang`](#api-for-remark-inline-code-lang)
- [Theming](#theming)
	- [Supporting Light and Dark themes](#supporting-light-and-dark-themes)
- [Examples](#examples)
	- [Example: Codeblock with single line](#example-codeblock-with-single-line)
	- [Example: Codeblock with multiple lines](#example-codeblock-with-multiple-lines)
	- [Example: Codeblock with title](#example-codeblock-with-title)
	- [Example: Codeblock with prompts](#example-codeblock-with-prompts)
	- [Example: Codeblock with command and its output](#example-codeblock-with-command-and-its-output)
	- [Example: Codeblock with highlighted lines](#example-codeblock-with-highlighted-lines)
	- [Example: Codeblock with added and removed lines](#example-codeblock-with-added-and-removed-lines)
	- [Example: Codeblock with unknown language](#example-codeblock-with-unknown-language)
	- [Example: Codeblock with aliased language](#example-codeblock-with-aliased-language)
	- [Example: Codeblock rendered using custom plugin](#example-codeblock-rendered-using-custom-plugin)
	- [Example: Codeblock rendered using default and custom plugins](#example-codeblock-rendered-using-default-and-custom-plugins)
	- [Example: Codeblock rendered without plugins](#example-codeblock-rendered-without-plugins)
	- [Example: Using custom classname prefix](#example-using-custom-classname-prefix)
	- [Example: Using custom marker for inline code](#example-using-custom-marker-for-inline-code)
	- [Example: Code without language info](#example-code-without-language-info)
- [Related](#related)
- [License](#license)

## What’s this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin to highlight code with [Starry Night](https://github.com/wooorm/starry-night) in a markdown document. It mimics GitHub's syntax highlighting.

## When should I use this?

This project is useful if you want to use the syntax highlighting powered by VS Code's syntax highlighter engine, and themes similar to GitHub. It is also useful if you want to build your own syntax highlighting themes based on [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

The following additional features are also available out of box:

- line numbers
- line highlights
- annotations for added and removed lines
- prompt character
- title and language information
- highlighting inline `code` elements

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

main();

async function main() {
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
<div class="hl hl-css">
  <div class="hl-header">
    <div class="hl-language"><span>css</span></div>
  </div>
<pre id="MC4wNTYxMTQ4" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-ent">html</span> {</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>  <span class="pl-c1">box-sizing</span>: <span class="pl-c1">border-box</span>;</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>  <span class="pl-c1">text-size-adjust</span>: <span class="pl-c1">100</span><span class="pl-k">%</span>;</span>
<span class="line"><span class="line-number" aria-hidden="true">4</span>  <span class="pl-c">/* allow percentage based heights for the children */</span></span>
<span class="line"><span class="line-number" aria-hidden="true">5</span>  <span class="pl-c1">height</span>: <span class="pl-c1">100</span><span class="pl-k">%</span>;</span>
<span class="line"><span class="line-number" aria-hidden="true">6</span>}</span>
</code></pre>
</div>
```

![Syntax highlighting with Rehype Starry Night](./samples/general-usage.png)

### Support for inline `code` elements

To highlight inline `code` elements, import [`rehype-starry-night-inline`](./src/rehype-starry-night-inline/index.js) plugin. This plugin relies on the language information injected by the [`remark-inline-code-lang`](./src/remark-inline-code-lang/index.js) plugin.

Say we have the following file `example.md`:

```md
To print a greeting, use `js> console.log("Hello, world!");`. This code prints `Hello, world!` on the console window.
```

And our module `example.js` looks as follows:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkInlineCodeLang from "@microflash/rehype-starry-night/remark-inline-code-lang";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNightInline from "@microflash/rehype-starry-night/rehype-starry-night-inline";

main();

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkInlineCodeLang)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNightInline)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<p>To print a greeting, use <code class="hl-inline hl-js"><span class="pl-en">console</span>.<span class="pl-c1">log</span>(<span class="pl-s"><span class="pl-pds">"</span>Hello, world!<span class="pl-pds">"</span></span>);</code>. This code prints <code>Hello, world!</code> on the console window.</p>
```

![Highlighting inline code element](./samples/inline-code.png)

## API

The default export is `rehypeStarryNight`. The following options are available. All of them are optional.

- `aliases` (type: `Object`) - used to alias languages to force syntax highlighting. By default, unknown languages are highlighted as plain text.
- `grammars` (type: `Array<Grammar>`) - array of [Starry Night](https://github.com/wooorm/starry-night) compatible grammar definitions. By default, all grammars provided by Starry Night are used.
- `classNamePrefix` (type: `string`, default: `hl`) - prefix of the classNames for different elements of HTML generated by the plugin.
- `plugins` (type: `Array<Plugin>`, default: [`defaultPluginPack`](./src/rehype-starry-night/index.js#L20)) - a list of plugins to customize the header and lines.

### Plugin API for `rehype-starry-night`

`rehype-starry-night` supports two types of plugins: _header plugins_ that modify the header items, and _line plugins_ that modify the lines of code.

```js
// structure of a plugin
export default {
  type: "header", // or "line"
  plugin: function (globalOptions, nodes) {
    // do something with `globalOptions` and `nodes`
  }
}
```

- `type` (type: `string`) - declares whether the plugin is a header or line plugin using `header` or `line` value.
- `globalOptions` (type: `Object`) - contains the configuration available to a plugin, such as
  - `id` (type: `string`) - unique id attached to the `pre` element
  - `metadata` (type: `Object`) - configuration specified on the codeblock, parsed with [`fenceparser`](https://github.com/Microflash/fenceparser)
  - `language` (type: `string`) - language specified on the codeblock after backticks
  - `classNamePrefix` (type: `string`, default: `hl`) - prefix of the classNames for different elements of HTML generated by the plugin
- `nodes` (type: `Array<Node>`) - array of [hast](https://github.com/syntax-tree/hastscript) nodes. For header plugins, it is the array of children of the header. For line plugins, it is the array of the lines of code in the codeblock.

`rehype-starry-night` ships with the following plugins out of box.

- [`headerLanguagePlugin`](./src/rehype-starry-night/plugins/header-language-plugin.js) - attaches the language in the header
- [`headerTitlePlugin`](./src/rehype-starry-night/plugins/header-title-plugin.js) - attaches a title in the header if specified on the codeblock
- [`linePromptPlugin`](./src/rehype-starry-night/plugins/line-prompt-plugin.js) - used to add a prompt symbol before the start of a line
- [`lineOutputPlugin`](./src/rehype-starry-night/plugins/line-output-plugin.js) - used to mark a line as command-line output
- [`lineMarkPlugin`](./src/rehype-starry-night/plugins/line-mark-plugin.js) - used to highlight a line
- [`lineInsPlugin`](./src/rehype-starry-night/plugins/line-ins-plugin.js) - used to annotate an added line
- [`lineDelPlugin`](./src/rehype-starry-night/plugins/line-del-plugin.js) - used to annotate a removed line

You can import these plugins individually.

```js
import headerLanguagePlugin from "@microflash/rehype-starry-night/plugins/header-language-plugin";
import headerTitlePlugin from "@microflash/rehype-starry-night/plugins/header-title-plugin";
import linePromptPlugin from "@microflash/rehype-starry-night/plugins/line-prompt-plugin";
import lineOutputPlugin from "@microflash/rehype-starry-night/plugins/line-output-plugin";
import lineMarkPlugin from "@microflash/rehype-starry-night/plugins/line-mark-plugin";
import lineInsPlugin from "@microflash/rehype-starry-night/plugins/line-ins-plugin";
import lineDelPlugin from "@microflash/rehype-starry-night/plugins/line-del-plugin";
```

Alternatively, you can import them all at once.

```js
import { defaultPluginPack } from "@microflash/rehype-starry-night";
```

### API for `rehype-starry-night-inline`

The following options are available for the `rehype-starry-night-inline` plugin. All of them are optional.

- `aliases` (type: `Object`) - used to alias languages to force syntax highlighting. By default, unknown languages are highlighted as plain text.
- `grammars` (type: `Array<Grammar>`): array of [Starry Night](https://github.com/wooorm/starry-night) compatible grammar definitions. By default, all grammars provided by Starry Night are used.
- `classNamePrefix` (type: `string`, default: `hl`): prefix of the classNames for different elements of HTML generated by the plugin.

### API for `remark-inline-code-lang`

The following options are available for the `remark-inline-code-lang` plugin. All of them are optional.

- `marker` (type: `string`, default: `> `) - the marker for inline `code` element before which the language information is specified.

## Theming

Import [`props.css`](./src/props.css) and [`index.css`](./src/index.css) files in your project, or use them as a base for your own custom theme. For different color schemes for syntax highlighting, check the [available themes on Starry Night repository](https://github.com/wooorm/starry-night#css).

### Supporting Light and Dark themes

Here's one way to support light and dark themes; the appropriate theme will get activated based on system preferences.

```css
:root {
  /* light theme variables specific to rehype-starry-night plugin */
  --hl-background-color: hsl(220, 23%, 97%);
  --hl-background-color-inline: var(--hl-background-color);
  --hl-border-color: hsl(215, 15%, 85%);
  --hl-outline-color: hsl(215, 15%, 70%, 0.5);
  --hl-line-highlight-background-color: hsl(220, 23%, 92%);
  --hl-line-added-background-color: hsla(103, 96%, 73%, 0.5);
  --hl-line-removed-background-color: hsla(4, 75%, 83%, 0.5);
  --hl-line-active-background-color: hsl(220, 23%, 89%);
  --hl-line-number-added-color: hsl(106, 59%, 27%);
  --hl-line-number-removed-color: hsl(355, 67%, 41%);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* dark theme variables specific to rehype-starry-night plugin */
    --hl-background-color: hsl(216, 18%, 11%);
    --hl-border-color: hsl(215, 11%, 22%);
    --hl-outline-color: hsl(215, 11%, 37%, 0.5);
    --hl-line-highlight-background-color: hsl(218, 14%, 17%);
    --hl-line-added-background-color: hsla(105, 62%, 20%, 0.5);
    --hl-line-removed-background-color: hsla(356, 69%, 31%, 0.5);
    --hl-line-active-background-color: hsl(218, 14%, 20%);
    --hl-line-number-added-color: hsl(105, 51%, 51%);
    --hl-line-number-removed-color: hsl(3, 77%, 74%);
  }
}

/* import a Starry Night theme that supports both dark and light themes */
@import "https://raw.githubusercontent.com/wooorm/starry-night/main/style/both.css";

/* import CSS specific to rehype-starry-night plugin */
@import "https://raw.githubusercontent.com/Microflash/rehype-starry-night/main/src/index.css";
```

> [!WARNING]
> URL imports for external styles is not recommended. You should either self-host them, bundle them, or copy-paste the entire CSS in one single file.

## Examples

### Example: Codeblock with single line

	```sh
	docker ps -a
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-sh">
  <div class="hl-header">
    <div class="hl-language"><span>sh</span></div>
  </div>
<pre id="MC4wNjE2ODk0"><code tabindex="0"><span class="line">docker ps -a</span>
</code></pre>
</div>
```

![Syntax Highlighting codeblock with single line](./samples/codeblock-with-single-line.png)

The plugin does not add line numbers when the codeblock contains a single line.

### Example: Codeblock with multiple lines

	```css
	* {
	  display: revert;
	}
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-css">
  <div class="hl-header">
    <div class="hl-language"><span>css</span></div>
  </div>
<pre id="MC4xNzU3MDU0" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-ent">*</span> {</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>  <span class="pl-c1">display</span>: <span class="pl-c1">revert</span>;</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>}</span>
</code></pre>
</div>
```

![Syntax Highlighting codeblock with multiple lines](./samples/codeblock-with-multiple-lines.png)

The plugin attaches `--hl-line-number-gutter-factor` CSS property on the `pre` element when the codeblock contains multiple lines. You can use this property to pad the line numbers and align them. See [`index.css`](./src/index.css#L73).

### Example: Codeblock with title

	```zsh title="Switching off homebrew telemetry"
	# turns off homebrew telemetry
	export HOMEBREW_NO_ANALYTICS=1
	# turns off homebrew auto-update
	export HOMEBREW_NO_AUTO_UPDATE=1
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-zsh">
  <div class="hl-header">
    <div class="hl-language"><span>zsh</span></div>
    <div class="hl-title">Switching off homebrew telemetry</div>
  </div>
<pre id="MC4xOTE1OTM1" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-c"># turns off homebrew telemetry</span></span>
<span class="line"><span class="line-number" aria-hidden="true">2</span><span class="pl-k">export</span> HOMEBREW_NO_ANALYTICS=1</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span><span class="pl-c"># turns off homebrew auto-update</span></span>
<span class="line"><span class="line-number" aria-hidden="true">4</span><span class="pl-k">export</span> HOMEBREW_NO_AUTO_UPDATE=1</span>
</code></pre>
</div>
```

![Codeblock with title](./samples/codeblock-with-title.png)

### Example: Codeblock with prompts

Sometimes you may want to show a prompt character while displaying a command-line instruction. `rehype-starry-night` supports this out of box.

	```sh prompt{1,3}
	curl localhost:8080/actuator/health
	{"status":"UP"}
	curl localhost:8080/greeter?name=Anya
	Hello, Anya!
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-sh">
  <div class="hl-header">
    <div class="hl-language"><span>sh</span></div>
  </div>
<pre id="MC43MTQzMTQx" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="line-prompt" aria-hidden="true"></span>curl localhost:8080/actuator/health</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>{<span class="pl-s"><span class="pl-pds">"</span>status<span class="pl-pds">"</span></span>:<span class="pl-s"><span class="pl-pds">"</span>UP<span class="pl-pds">"</span></span>}</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span><span class="line-prompt" aria-hidden="true"></span>curl localhost:8080/greeter<span class="pl-k">?</span>name=Anya</span>
<span class="line"><span class="line-number" aria-hidden="true">4</span>Hello, Anya<span class="pl-k">!</span></span>
</code></pre>
</div>
```

![Codeblock with prompts](./samples/codeblock-with-prompts.png)

You should disable the selection of prompt character so that when people copy the command, the prompt is not copied. See [`index.css`](./src/index.css#L170).

### Example: Codeblock with command and its output

Sometime you may want to display a command and its output, but you want people to just copy the command and not the output. You can mark unselectable lines with `output` property.

	```sh prompt{1} output{2..6}
	mvn -version
	Apache Maven 3.9.8
	Maven home: ~/maven/3.9.8/libexec
	Java version: 22.0.1, vendor: Azul Systems, Inc., runtime: ~/zulu-22.jdk/Contents/Home
	Default locale: en_US, platform encoding: UTF-8
	OS name: "mac os x", version: "14.5", arch: "aarch64", family: "mac"
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-sh">
  <div class="hl-header">
    <div class="hl-language"><span>sh</span></div>
  </div>
<pre id="MC45NTIyNzEx" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="line-prompt" aria-hidden="true"></span>mvn -version</span>
<span class="line" data-line-output="" data-unselectable=""><span class="line-number" aria-hidden="true">2</span>Apache Maven 3.9.8</span>
<span class="line" data-line-output="" data-unselectable=""><span class="line-number" aria-hidden="true">3</span>Maven home: <span class="pl-k">~</span>/maven/3.9.8/libexec</span>
<span class="line" data-line-output="" data-unselectable=""><span class="line-number" aria-hidden="true">4</span>Java version: 22.0.1, vendor: Azul Systems, Inc., runtime: <span class="pl-k">~</span>/zulu-22.jdk/Contents/Home</span>
<span class="line" data-line-output="" data-unselectable=""><span class="line-number" aria-hidden="true">5</span>Default locale: en_US, platform encoding: UTF-8</span>
<span class="line" data-line-output="" data-unselectable=""><span class="line-number" aria-hidden="true">6</span>OS name: <span class="pl-s"><span class="pl-pds">"</span>mac os x<span class="pl-pds">"</span></span>, version: <span class="pl-s"><span class="pl-pds">"</span>14.5<span class="pl-pds">"</span></span>, arch: <span class="pl-s"><span class="pl-pds">"</span>aarch64<span class="pl-pds">"</span></span>, family: <span class="pl-s"><span class="pl-pds">"</span>mac<span class="pl-pds">"</span></span></span>
</code></pre>
</div>
```

The plugin marks the output lines with `[data-unselectable]` attribute. You can set `user-select: none` for such elements using CSS. See [`index.css`](./src/index.css#L139).

### Example: Codeblock with highlighted lines

You can highlight lines by specifying the line numbers (or even, range of line numbers) between curly braces in the codeblock metadata.

	```sh {4..7} prompt{1}
	aws --endpoint-url http://localhost:4566 s3api list-buckets
	{
	  "Buckets": [
	    {
	      "Name": "my-bucket",
	      "CreationDate": "2022-07-12T13:44:44+00:00"
	    }
	  ],
	  "Owner": {
	    "DisplayName": "webfile",
	    "ID": "bcaf1ffd86f41161ca5fb16fd081034f"
	  }
	}
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-sh">
  <div class="hl-header">
    <div class="hl-language"><span>sh</span></div>
  </div>
<pre id="MC4wNTg1MTA5" style="--hl-line-number-gutter-factor: 2"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="line-prompt" aria-hidden="true"></span>aws --endpoint-url http://localhost:4566 s3api list-buckets</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>{</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>	<span class="pl-s"><span class="pl-pds">"</span>Buckets<span class="pl-pds">"</span></span>: [</span>
<span class="line" data-highlighted=""><span class="line-number" aria-hidden="true">4</span>		{</span>
<span class="line" data-highlighted=""><span class="line-number" aria-hidden="true">5</span>			<span class="pl-s"><span class="pl-pds">"</span>Name<span class="pl-pds">"</span></span>: <span class="pl-s"><span class="pl-pds">"</span>my-bucket<span class="pl-pds">"</span></span>,</span>
<span class="line" data-highlighted=""><span class="line-number" aria-hidden="true">6</span>			<span class="pl-s"><span class="pl-pds">"</span>CreationDate<span class="pl-pds">"</span></span>: <span class="pl-s"><span class="pl-pds">"</span>2022-07-12T13:44:44+00:00<span class="pl-pds">"</span></span></span>
<span class="line" data-highlighted=""><span class="line-number" aria-hidden="true">7</span>		}</span>
<span class="line"><span class="line-number" aria-hidden="true">8</span>	],</span>
<span class="line"><span class="line-number" aria-hidden="true">9</span>	<span class="pl-s"><span class="pl-pds">"</span>Owner<span class="pl-pds">"</span></span>: {</span>
<span class="line"><span class="line-number" aria-hidden="true">10</span>		<span class="pl-s"><span class="pl-pds">"</span>DisplayName<span class="pl-pds">"</span></span>: <span class="pl-s"><span class="pl-pds">"</span>webfile<span class="pl-pds">"</span></span>,</span>
<span class="line"><span class="line-number" aria-hidden="true">11</span>		<span class="pl-s"><span class="pl-pds">"</span>ID<span class="pl-pds">"</span></span>: <span class="pl-s"><span class="pl-pds">"</span>bcaf1ffd86f41161ca5fb16fd081034f<span class="pl-pds">"</span></span></span>
<span class="line"><span class="line-number" aria-hidden="true">12</span>	}</span>
<span class="line"><span class="line-number" aria-hidden="true">13</span>}</span>
</code></pre>
</div>
```

![Codeblock with highlighted lines](./samples/codeblock-with-highlighted-lines.png)

See the documentation of [`fenceparser`](https://github.com/Microflash/fenceparser) to learn about the ways in which you can specify the line range for highlighted lines.

### Example: Codeblock with added and removed lines

You can render code diffs using `ins` and `del` properties on the codeblock followed by a range of line numbers.

	```js title="Pool options in Vitest 2.0" del{4..6} ins{7..9}
	export default defineConfig({
	  test: {
	    poolOptions: {
	      threads: {
	        singleThread: true,
	      },
	      forks: {
	        singleFork: true,
	      },
	    }
	  }
	});
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-js">
  <div class="hl-header">
    <div class="hl-language"><span>js</span></div>
    <div class="hl-title">Pool options in Vitest 2.0</div>
  </div>
<pre id="MC45ODE0NDE0" style="--hl-line-number-gutter-factor: 2; --hl-line-marker-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-k">export</span> <span class="pl-c1">default</span> <span class="pl-smi">defineConfig</span>({</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>	test<span class="pl-k">:</span> {</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>		poolOptions<span class="pl-k">:</span> {</span>
<span class="line" data-line-removed=""><span class="line-number" aria-hidden="true">4</span>			threads<span class="pl-k">:</span> {</span>
<span class="line" data-line-removed=""><span class="line-number" aria-hidden="true">5</span>				singleThread<span class="pl-k">:</span> <span class="pl-c1">true</span>,</span>
<span class="line" data-line-removed=""><span class="line-number" aria-hidden="true">6</span>			},</span>
<span class="line" data-line-added=""><span class="line-number" aria-hidden="true">7</span>			forks<span class="pl-k">:</span> {</span>
<span class="line" data-line-added=""><span class="line-number" aria-hidden="true">8</span>				singleFork<span class="pl-k">:</span> <span class="pl-c1">true</span>,</span>
<span class="line" data-line-added=""><span class="line-number" aria-hidden="true">9</span>			},</span>
<span class="line"><span class="line-number" aria-hidden="true">10</span>		}</span>
<span class="line"><span class="line-number" aria-hidden="true">11</span>	}</span>
<span class="line"><span class="line-number" aria-hidden="true">12</span>});</span>
</code></pre>
</div>
```

![Codeblock with added and removed lines](./samples/codeblock-with-diffed-lines.png)

The plugin attaches `--hl-line-marker-gutter-factor` CSS property on the `pre` element when you specify the codeblock line addition or removal annotations. You can use this property to pad the line numbers and align the icons. See [`index.css#L94`](./src/index.css#L94) and [`index.css#L120`](./src/index.css#L120).

See the documentation of [`fenceparser`](https://github.com/Microflash/fenceparser) to learn about the ways in which you can specify the line range for `ins` and `del` properties.

### Example: Codeblock with unknown language

If a language is not [supported](https://github.com/wooorm/starry-night?tab=readme-ov-file#languages) by Starry Night, it will be rendered as plain text.

	```nux
	let-env NU_LIB_DIRS = [
	  ($nu.config-path | path dirname | path join 'scripts')
	]
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-nux">
  <div class="hl-header">
    <div class="hl-language"><span>nux</span></div>
  </div>
<pre id="MC42MzYyNTcw" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span>let-env NU_LIB_DIRS = [</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>	($nu.config-path | path dirname | path join 'scripts')</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>]</span>
</code></pre>
</div>
```

![Codeblock with unknown language](./samples/codeblock-with-unknown-language.png)

### Example: Codeblock with aliased language

To prevent a codeblock with an unsupported language to be rendered as plain text, you can force the syntax highlighting with aliases.

Say we have the following file `example.md`:

	```xjm
	language = "en"
	customization = false
	features = [ "io", "graphics", "compute" ]
	```

You can alias `xjm` to `toml` as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "https://esm.sh/@microflash/rehype-starry-night";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight, {
      aliases: {
        xjm: "toml"
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="hl hl-toml">
  <div class="hl-header">
    <div class="hl-language"><span>xjm</span></div>
  </div>
<pre id="MC40NDMwMTAw" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-smi">language</span> = <span class="pl-s"><span class="pl-pds">"</span>en<span class="pl-pds">"</span></span></span>
<span class="line"><span class="line-number" aria-hidden="true">2</span><span class="pl-smi">customization</span> = <span class="pl-c1">false</span></span>
<span class="line"><span class="line-number" aria-hidden="true">3</span><span class="pl-smi">features</span> = [ <span class="pl-s"><span class="pl-pds">"</span>io<span class="pl-pds">"</span></span>, <span class="pl-s"><span class="pl-pds">"</span>graphics<span class="pl-pds">"</span></span>, <span class="pl-s"><span class="pl-pds">"</span>compute<span class="pl-pds">"</span></span> ]</span>
</code></pre>
</div>
```

![Codeblock with aliased language](./samples/codeblock-with-aliased-language.png)

### Example: Codeblock rendered using custom plugin

Suppose you want to add a copy to clipboard button in the header. You can do so by adding a custom header plugin.

Say we have the following file `example.md`:

	```html
	<mark>highlighted</mark>
	```

You can pass a custom header plugin as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "@microflash/rehype-starry-night";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight, {
      plugins: [
        {
          type: "header",
          plugin: (globalOptions, nodes) => {
            nodes.push({
              type: "element",
              tagName: "button",
              properties: {
                className: [`${globalOptions.classNamePrefix}-copy`],
                style: "margin-left: auto"
              },
              children: [
                { type: "text", value: "Copy to clipboard" }
              ]
            });
          }
        }
      ]
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="hl hl-html">
  <div class="hl-header">
    <button class="hl-copy" style="margin-left: auto">Copy to clipboard</button>
  </div>
<pre id="MC44MjkyNjY4"><code tabindex="0"><span class="line">&lt;<span class="pl-ent">mark</span>&gt;highlighted&lt;/<span class="pl-ent">mark</span>&gt;</span>
</code></pre>
</div>
```

![Codeblock rendered using custom header plugin](./samples/codeblock-rendered-using-custom-plugin.png)

### Example: Codeblock rendered using default and custom plugins

You can also use the default plugins alongside your custom plugins.

Say we have the following file `example.md`:

	```rust title="hello.rs"
	fn main() {
	  println!("Hello, world!");
	}
	```

You can pass a custom plugin alongwith default plugins as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight, { defaultPluginPack } from "@microflash/rehype-starry-night";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight, {
      plugins: [
        ...defaultPluginPack,
        {
          type: "header",
          plugin: (globalOptions, nodes) => {
            nodes.push({
              type: "element",
              tagName: "button",
              properties: {
                className: [`${globalOptions.classNamePrefix}-copy`],
                style: "margin-left: auto"
              },
              children: [
                { type: "text", value: "Copy to clipboard" }
              ]
            });
          }
        }
      ]
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="hl hl-rust">
  <div class="hl-header">
    <div class="hl-language"><span>rust</span></div>
    <div class="hl-title">hello.rs</div>
    <button class="hl-copy" style="margin-left: auto">Copy to clipboard</button>
  </div>
<pre id="MC41ODEyMDY2" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span><span class="pl-k">fn</span> <span class="pl-en">main</span>() {</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>	<span class="pl-en">println!</span>(<span class="pl-s"><span class="pl-pds">"</span>Hello, world!<span class="pl-pds">"</span></span>);</span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>}</span>
</code></pre>
</div>
```

![Codeblock rendered using default and custom plugins](./samples/codeblock-rendered-using-default-and-custom-plugins.png)

### Example: Codeblock rendered without plugins

If you want to disable all plugins, you can do so by setting `plugins: false` while configuring `rehype-starry-night`.

Say we have the following file `example.md`:

	```yml
	- name: Job summary
	  run: |
	    echo "# Deployment result" >> $GITHUB_STEP_SUMMARY
	    echo "**Preview URL** = $PREVIEW_URL" >> $GITHUB_STEP_SUMMARY
	```

You can disable the plugins as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "@microflash/rehype-starry-night";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight, {
      plugins: false
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="hl hl-yml">
<pre id="MC40MTIxNzg1" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span>- <span class="pl-ent">name</span>: <span class="pl-s">Job summary</span></span>
<span class="line"><span class="line-number" aria-hidden="true">2</span>  <span class="pl-ent">run</span>: <span class="pl-s">|</span></span>
<span class="line"><span class="line-number" aria-hidden="true">3</span><span class="pl-s">    echo "# Deployment result" &gt;&gt; $GITHUB_STEP_SUMMARY</span></span>
<span class="line"><span class="line-number" aria-hidden="true">4</span><span class="pl-s">    echo "**Preview URL** = $PREVIEW_URL" &gt;&gt; $GITHUB_STEP_SUMMARY</span></span>
</code></pre>
</div>
```

![Codeblock rendered without plugins](./samples/codeblock-rendered-without-plugins.png)

### Example: Using custom classname prefix

You can attach your own prefix on the classes of HTML elements generated by the `rehype-starry-night` and `rehype-starry-night-inline` plugins.

Say we have the following file `example.md`:

	```java
	System.out.println("Hello, world!");
	```

You can customize the className prefix as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNight from "@microflash/rehype-starry-night";

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight, {
      classNamePrefix: "highlight"
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<div class="highlight highlight-java">
  <div class="highlight-header">
    <div class="highlight-language">java</div>
  </div>
<pre id="MC42NjM4OTE0"><code tabindex="0"><span class="line"><span class="pl-smi">System</span><span class="pl-k">.</span>out<span class="pl-k">.</span>println(<span class="pl-s"><span class="pl-pds">"</span>Hello, world!<span class="pl-pds">"</span></span>);</span>
</code></pre>
</div>
```

Similarly for inline `code` element, say we have the following file `example.md`:

```md
To remove the whitespace around a string, try `java> str.strip()`.
```

You can customize the className prefix as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkInlineCodeLang from "@microflash/rehype-starry-night/remark-inline-code-lang";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNightInline from "@microflash/rehype-starry-night/rehype-starry-night-inline";

main();

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkInlineCodeLang)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNightInline, {
      classNamePrefix: "highlight"
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<p>To remove the whitespace around a string, try <code class="highlight-inline highlight-java">str<span class="pl-k">.</span>strip()</code>.</p>
```

### Example: Using custom marker for inline code

You can configure a custom marker for inline `code` element to inject the language information. For example, say you want to annotate your inline `code` element with `: ` instead of the default `> ` marker, as shown in the following file `example.md`:

```md
To specify the language direction, use `html: <span dir="rtl">مرحبا</span>`.
```

You can customize the marker as follows with `example.js`:

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkInlineCodeLang from "@microflash/rehype-starry-night/remark-inline-code-lang";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeStarryNightInline from "@microflash/rehype-starry-night/rehype-starry-night-inline";

main();

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkInlineCodeLang, {
      marker: ": "
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNightInline)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  console.log(String(file));
}
```

Running that with `node example.js` yields:

```html
<p>To specify the language direction, use <code class="hl-inline hl-html">&lt;<span class="pl-ent">span</span> <span class="pl-e">dir</span>=<span class="pl-s"><span class="pl-pds">"</span>rtl<span class="pl-pds">"</span></span>&gt;مرحبا&lt;/<span class="pl-ent">span</span>&gt;</code>.</p>
```

### Example: Code without language info

If you don't provide the language info in the codeblock, `rehype-starry-night` will render it as plain text without header.

	```
	import gleam/io

	pub fn main() {
	  io.println("hello, friend!")
	}
	```

The above codeblock gets rendered as:

```html
<div class="hl hl-txt">
<pre id="MC44MzU2OTkz" style="--hl-line-number-gutter-factor: 1"><code tabindex="0"><span class="line"><span class="line-number" aria-hidden="true">1</span>import gleam/io</span>
<span class="line"><span class="line-number" aria-hidden="true">2</span></span>
<span class="line"><span class="line-number" aria-hidden="true">3</span>pub fn main() {</span>
<span class="line"><span class="line-number" aria-hidden="true">4</span>  io.println("hello, friend!")</span>
<span class="line"><span class="line-number" aria-hidden="true">5</span>}</span>
</code></pre>
</div>
```

![Codeblock without language info](./samples/codeblock-without-language-info.png)

Similarly for inline `code` element without language information:

```md
`gleam new` command will generate a new Gleam project.
```

It gets rendered as:

```html
<p><code>gleam new</code> command will generate a new Gleam project.</p>
```

![Inline code without language info](./samples/inline-code-without-language-info.png)

## Related

- [`rehype-starry-night`](https://github.com/rehypejs/rehype-starry-night) &mdash; alternative plugin to apply syntax highlighting to code with `starry-night`
- [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight) &mdash; highlight code with [highlight.js](https://github.com/isagalaev/highlight.js) (through [lowlight](https://github.com/wooorm/lowlight))
- [`rehype-prism-plus`](https://github.com/timlrx/rehype-prism-plus) &mdash; highlight code with [Prism](http://prismjs.com) (via [refractor](https://github.com/wooorm/refractor)) with additional line highlighting and line numbers functionalities
- [`@shikijs/rehype`](https://github.com/shikijs/shiki/tree/main/packages/rehype) &mdash; highlight code with [shiki](https://shiki.style)

## License

[MIT](./LICENSE.md)
