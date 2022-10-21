<script lang="ts">
	import { onMount } from "svelte";
	import { GraphHandler } from "./GraphHandler";
	import mermaid from "mermaid";

	globalThis["click_alpha"] = () => {
		alert("料理を開始しましょう！");
	};

	const sample = `flowchart TB
		alpha{"料理開始"}
		A["じゃがいもを洗う"]
		B["にんじんの上端、下端を切り落とす"]
		C["玉ねぎの上端、下端を切り落とす"]
		D["にんじんを洗う"]
		E["玉ねぎの皮をむく"]
		F["ピーラーで皮をむく"]
		G["豚肩肉を一口大に切る"]
		H["にんじんを半月切りにする"]
		I["じゃがいもを乱切りをする"]
		J["玉ねぎをくし切りにする"]
		K["厚手の鍋にサラダ油を入れて熱する"]
		L["焦がさないように中火で炒める"]
		M["鍋に水を入れて沸騰させる"]
		N[/"アクが出る"/]
		O["取り除く"]
		P["弱火or中火で20分煮込む"]
		Q["火を止める"]
		R["ルーを入れて溶かす"]
		S["再度火をつけ弱火で5分煮込む"]

		alpha --> A
		alpha --> B
		alpha --> C
		B --> D
		A --> F
		D --> F
		C --> E
		F --> H
		F --> I
		E --> J
		G --> L
		H --> L
		I --> L
		J --> L
		K --> L
		L --> M
		M --> N
		N --はい--> O
		N --いいえ--> P
		O --> P
		P --> Q
		Q --> R
		R --> S

		click alpha call click_alpha()`;

	function Render(graph: string) {
		mermaid.mermaidAPI.render("graph1", graph, (svg, bf) => {
			const elem = document.getElementById("preview");
			elem.innerHTML = svg;
			bf(elem);
		});
		const handler = new GraphHandler();
		handler.parse(graph);
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

<main>
	<div id="makingNode">
		<p>料理工程の作成</p>
		<textarea>料理の工程を書き込んでください</textarea>
		<button>登録する</button>
	</div>
	<div id="makingEdge" />

	<div id="preview" />
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
