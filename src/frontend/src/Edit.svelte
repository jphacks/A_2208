<script lang="ts">

	import { onMount } from "svelte";
	import mermaid from "mermaid";

	let add = '/img/add.png'
	let edit = '/img/edit.png'
	let del = '/img/del.png'
	let register = '/img/register.png'

	globalThis["click_alpha"] = () => {
		alert("料理を開始しましょう！")
	};

	function editing() {
		alert("編集します")
	}

	function adding() {
		alert("追加します")
	}

	function deleting() {
		alert("削除します")
	}

	// globalThis["editing"] = () => {
	// 	alert("編集します");
	// }

	// globalThis["adding"] = () => {
	// 	alert("追加します");
	// }

	// globalThis["deleting"] = () => {
	// 	alert("削除します");
	// }

	onMount(() => {
		document.getElementById("preview").innerHTML = `flowchart TB
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
		N --はい --> O
		N --いいえ --> P
		O --> P
		P --> Q
		Q --> R
		R --> S
		`;
		mermaid.initialize({ startOnLoad: true, securityLevel: "loose" });
	});

	export {add, edit, del, register}
	// export {editing, adding, deleting}
</script>

<main>
	<div id="makeFlowChart">
		<h2>フローチャートの作成</h2>
		<div id="preview" class="mermaid" />
		<div class="nodeButtonArea">
			<!-- ボタンを縦並びにする -->
			<!-- ボタン用のいい感じの画像を作成する -->
			<!-- ↑うまく乗せられない、なんで？？？？？？？ -->
			<button class="nodeButton" on:click={adding}><img src={add} alt=""></button>
			<button class="nodeButton" on:click={editing}><img src={edit} alt=""></button>
			<button class="nodeButton" on:click={deleting}><img src={del} alt=""></button>
		</div>
	</div>
	<div id="makeNode">
		<h2>料理の工程を書き込んでください</h2>
		<textarea placeholder="料理の工程を書き込んでください"></textarea>
		<button id="registerButton"><img src={register} alt=""></button>
	</div>
</main>

<style>
	main * {
		width: 100%;
	}

	#preview {
		text-align: center;
	}

	#makeFlowChart {
		background-color: #5670a0;
	}

	.nodeButtonArea {
		text-align: right;
	}
	.nodeButton {
		width: 100px;
		display: inline-flex;
		flex-direction: column;
	}

	#makeNode {
		background-color: #6B6766;
	}

	#registerButton {
		width: 100px;
		text-align: center;
	}

	/* main {
		text-align: center;
		padding: 1em;
		width: 80vh;
		margin: 0 auto;
	} */

	
</style>
