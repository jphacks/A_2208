<script lang="ts">
	import { onMount } from "svelte";
	import mermaid from "mermaid";

	globalThis["click_alpha"] = () => {
		alert("料理を開始しましょう！");
	};

	const sample = `flowchart TB
		alpha{"料理開始"} --> A
		alpha --> B
		A["<じゃがいも>・<にんじん>を洗う"] --> C
		B["<たまねぎ>を皮をむいて洗う"] --> E
		C["ピーラーで<じゃがいも>・<にんじん>を皮をむく"] --> D
		D["<にんじん>を1cm幅の<<いちょう切り>>にする"] --> G
		E["<たまねぎ>を薄切りにする"] --> G
		F["厚手の鍋にサラダ油を入れて熱する"] --> G
		G["豚コマ肉・じゃがいも・にんじん・たまねぎをいれ、焦がさないように炒める。"] --> H
		
		click alpha call click_alpha()
		`;

	function Render(graph: string) {
		mermaid.mermaidAPI.render("graph1", graph, (svg) => {
			document.getElementById("preview").innerHTML = svg;
		});
	}

	onMount(() => {
		mermaid.mermaidAPI.initialize({
			startOnLoad: false,
			securityLevel: "antiscript",
			flowchart: {
				useMaxWidth: false,
			},
		});

		Render(sample);
	});
</script>

<main>
	<div id="makingNode">
		<p>料理工程の作成</p>
		<textarea>料理の工程を書き込んでください</textarea>
		<button>登録する</button>
	</div>
	<div id="makingEdge" />

	<div id="preview">
		<p>hoge</p>
	</div>
</main>

<style>
	main * {
		width: 100%;
	}

	main {
		text-align: center;
		padding: 1em;
		width: 80vw;
		margin: 0 auto;
	}
</style>
