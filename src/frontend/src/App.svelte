<script lang="ts">
	import { onMount } from "svelte";
	import mermaid from "mermaid";

	globalThis["click_alpha"] = () => {
		alert("料理を開始しましょう！");
	};

	onMount(() => {
		document.getElementById("preview").innerHTML = `flowchart TB
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
		mermaid.initialize({ startOnLoad: true, securityLevel: "loose" });
	});

	// export let name: string;
</script>

<main>
	<div id="makingNode">
		<p>料理工程の作成</p>
		<textarea>料理の工程を書き込んでください</textarea>
		<button>登録する</button>
	</div>
	<div id="makingEdge">
		
	</div>

	<div id="preview" class="mermaid" />
</main>

<style>
	main * {
		width: 100%;
	}

	main {
		text-align: center;
		padding: 1em;
		width: 80vh;
		margin: 0 auto;
	}
</style>
