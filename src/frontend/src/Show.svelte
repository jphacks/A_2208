<script lang="ts">
	import { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Header from "./Header.svelte";
	import { GraphHandler } from "./GraphHandler";
	import mermaid from "mermaid";
	import { sample } from "./Constants";
	import { downloadData } from "./Utilities";
	export


	const handler = new GraphHandler();

	function Render(graph: string) {
		handler.parse(graph);

		mermaid.mermaidAPI.render(
			"graph1",
			handler.toInternalMermaidString(),
			(svg, bindFunc) => {
				const elem = document.getElementById("preview");
				elem.innerHTML = svg;
				bindFunc(elem);
			}
		);

		console.log(handler.toMermaidString());
		console.log(handler.toInternalMermaidString());
	}

	onMount(() => {
		mermaid.mermaidAPI.initialize({
			startOnLoad: false,
			securityLevel: "loose",
			logLevel: "error",
			flowchart: {
				useMaxWidth: false,
			},
		});

		Render(sample);
	});
</script>


<!--スクリーンサイズに固定する要素(モーダル・下付き要素の実装に使用する)-->
<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<Header isLogined={false}></Header>
		<main class="row2 col1">

			<div id="flowChartPreviewPanel" class="row3 col1">
				<h2>レシピのフローチャート</h2>

				<div id="mermaidPreviewPanel">
					<!--外部ライブラリが以下の要素を置換する-->
					<div id="preview" class="row1 col2" />
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	#screen {
		min-width: 100vw;
		width: 100vw;
		min-height: 100vh;
		height: 100vh;
		margin: 0px;
		padding: 0px;
	}

	#screen * {
		margin: 0px;
		padding: 0px;
	}

	#content {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		display: grid;
		grid-template-rows: auto 1fr;
		grid-template-columns: 1fr;
	}

	#content * {
		width: 100%;
		font-family: "Stick";
	}

	::placeholder{
		font-family: "Stick";
	}

	#content main {
		display: grid;
		grid-template-rows: repeat(5, auto);
		grid-template-columns: 1fr;
	}

	#content h2 {
		background: #716664;
		font-size: 1.5rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
	}


	#flowChartPreviewPanel {
		background-color: #577699;
	}

	#mermaidPreviewPanel {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 1fr auto 1fr;
	}

	/*shorthands*/

	.row1 {
		grid-row: 1;
	}

	.row2 {
		grid-row: 2;
	}

	.row3 {
		grid-row: 3;
	}
	.col1 {
		grid-column: 1;
	}

	.col2 {
		grid-column: 2;
	}
</style>
