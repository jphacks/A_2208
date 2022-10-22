<script lang="ts">

	import { onMount } from "svelte";
	import mermaid from "mermaid";

	let food = ["たまねぎ", "にんじん"]
	let foodEscape: string = undefined;

	function foodAdd() {
		if (foodEscape === undefined) {
			alert("食材名を書いてください！")
			return
		}

		food.push(foodEscape);
		food = food
		foodEscape = undefined
	}

	let add: string = '/img/add.png'
	let edit: string = '/img/edit.png'
	let del: string = '/img/del.png'
	let register: string = '/img/register.png'
	let confirmb: string = 'img/confirm.png'

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
		<h2 id="makeFlowChartTitle">フローチャートの作成</h2>
		<div id="preview" class="mermaid" />
		<div class="nodeButtonArea">
			<!-- ボタンを縦並びにする -->
			<button class="nodeButton" on:click={adding}><img src={add} alt=""></button>
			<button class="nodeButton" on:click={editing}><img src={edit} alt=""></button>
			<button class="nodeButton" on:click={deleting}><img src={del} alt=""></button>
		</div>
	</div>

	<div id="makeFoodNode">
		<div id="registerFood">
			<h2 id="registerFoodTitle">材料の登録</h2>
			<div class="registerFoodTwo">
				<div class="foodLists">
					{#each food as item}
						<div class="foodList">
							<h3>
								{item}
							</h3>
						</div>
					{/each}
				</div>

				<div class="foodTextareaAndButton">
					<textarea id="makeFoodBox" placeholder="使う材料を書き込んで追加してください" bind:value={foodEscape}></textarea>
					<div class="confirmButtonDiv">
						<button id="confirmButton" on:click={foodAdd}><img src={confirmb} alt=""></button>
					</div>
				</div>
			</div>
		</div>
		<div id="makeNode">
			<h2 id="makeNodeTitle">料理工程の追加</h2>
			<textarea id="makeNodeBox" placeholder="料理の工程を書き込んで、下からオブジェクトの形を選んでください"></textarea>
			<div class="registerAndSelect">
				<div id="selectObjectArea">
					<button class="nodeButton" on:click={adding}><img src={add} alt=""></button>
					<button class="nodeButton" on:click={editing}><img src={edit} alt=""></button>
					<button class="nodeButton" on:click={deleting}><img src={del} alt=""></button>
				</div>
				<div class="registerButtonDiv">
					<button id="registerButton"><img src={register} alt=""></button>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	main * {
		width: 100%;
	}

	h2 {
		position: relative;
		padding: 5px 26px 5px 42px;
		background: #4b4945;
		font-size: 20px;
		color: #ffffff;
		margin-left: -33px;
		line-height: 1.3;
		border-bottom: solid 3px rgb(14, 13, 11);
		z-index:3;
	}

	#preview {
		text-align: center;
	}

	#makeFlowChart {
		background-color: #577699;
	}

	.nodeButtonArea {
		text-align: right;
	}

	.nodeButton {
		width: 100px;
		background: transparent;
		border: none;
	}

	#makeFoodNode {
		display: flex;
		height: 300px;
	}

	.registerFoodTwo {
		display: flex;
	}

	.foodLists {
    	overflow-y: scroll;
		height: 185px;
		width: 50%;
		margin-left: 5%;
		margin-right: auto;
	}

	.foodList {
		/* border: solid 2px #07c61a; */
		background-color: rgb(124, 0, 0);
		color: azure;
		height: 30px;
		width: 100%;
		margin-right: 10px;
		margin-bottom: 10px;
		padding-top: 10px;
		padding-bottom: 30px;
		border-radius: 15px;
		text-align: center;
	}

	#makeFoodBox {
		width: 80%;
		height: 60%;
		margin-left: 10%;
		margin-right: 10%;
	}

	.confirmButtonDiv {
		text-align: right;
	}

	#confirmButton {
		width: 120px;
		background: transparent;
		border: none;
		margin-right: 10%;
	}

	#makeNode {
		background-color: #838383;
		width: 50%;
	}

	
	#makeNodeTitle {
		width: 95%;
	}
	
	#makeNodeBox {
		width: 80%;
		height: 50%;
		margin-left: 10%;
		margin-right: 10%;
	}

	/* ボタンを右寄せしたいとき→divで囲む→class指定→textalign right　なんで？？？ */
	.registerAndSelect {
		display: flex;
	}
	
	.registerButtonDiv {
		text-align: right;
	}

	#selectObjectArea {
		margin-left: 10%;
	}

	#registerButton {
		width: 120px;
		background: transparent;
		border: none;
	}

	#registerFood {
		background-color: #838383;
		width: 50%;
	}
	
</style>
