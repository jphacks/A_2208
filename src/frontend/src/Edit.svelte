<script lang="ts">
	import { onMount } from "svelte";
	import { GraphHandler, Node } from "./GraphHandler";
	import mermaid from "mermaid";

	/**
	 * @param  content ダウンロードさせるデータ
	 * @param  filename ファイル名。省略可
	 * @param  mimetype データのMIME Type。省略可
	 * @see http://furudate.hatenablog.com/entry/2014/06/02/172923
	 */
	function downloadData(
		content: ArrayBuffer | ArrayBufferView | Blob | string,
		filename: string | undefined,
		mimetype: string | undefined
	) {
		if (arguments.length < 3) {
			mimetype = "application/octet-stream";
		}

		var url = (window.URL || window.webkitURL).createObjectURL(
			new Blob([content], { type: mimetype })
		);
		var a = document.createElement("a");

		a.target = "_blank";
		a.download = filename || "";
		a.href = url;

		a.click();
	}

	let addImageResourceURL: string = "./img/add.png";
	let addPushedImageResourceURL: string = "./img/addPushed.png";
	let editPushedImageResourceURL: string = "./img/editPushed.png";
	let editImageResourceURL: string = "./img/edit.png";
	let delPushedImageResourceURL: string = "./img/delPushed.png";
	let delImageResourceURL: string = "./img/del.png";
	let registerImageResourceURL: string = "./img/register.png";
	let confirmImageResourceURL: string = "./img/confirm.png";
	let startImageResourceURL: string = "./img/start.png";
	let operateImageResourceURL: string = "./img/operate.png";
	let decideImageResourceURL: string = "./img/dicide.png";


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
		R --> S`;

	type FoodAndQuantity = {
		food: string;
		quantity: string;
		placeholderFood: string;
		placeholderQuantity: string;
	};

	let placeholder1: FoodAndQuantity = {
		placeholderFood: "豚肉",
		placeholderQuantity: "350g",
		food: undefined,
		quantity: undefined,
	};

	let placeholder2: FoodAndQuantity = {
		placeholderFood: "にんじん",
		placeholderQuantity: "1本",
		food: undefined,
		quantity: undefined,
	};

	let placeholder3: FoodAndQuantity = {
		placeholderFood: "大根",
		placeholderQuantity: "1/2本",
		food: undefined,
		quantity: undefined,
	};

	let foodAndQuantityPairList = [placeholder1, placeholder2, placeholder3];

	function addAddFoodAndQuantity() {
		let add: FoodAndQuantity = {
			food: undefined,
			quantity: undefined,
			placeholderFood: "水",
			placeholderQuantity: "200cc",
		};
		foodAndQuantityPairList.push(add);
		foodAndQuantityPairList = foodAndQuantityPairList;
	}

	function saveFoodAndQuantity() {
		foodAndQuantityPairList.forEach((element) => {
			if (element.food === undefined && element.quantity === undefined) {
				// continue
			}
			if (element.food === undefined || element.quantity === undefined) {
				alert("食材と分量を入力してください");
				// break;
				return;
			}

			// 食材と分量を保存する処理
		});
	}

	let recipeContent: string;
	type nodeTypes = "[" | "[/" | "{";
	let nodeType: nodeTypes = "[";

	function addNode() {
		if (recipeContent === undefined) {
			alert("登録する工程内容を書いてください！");
			return;
		}

		handler.addNode(recipeContent, nodeType);
		Render(handler.toInternalMermaidString());
	}

	function enterAddNodeProcedureMode() {
		nodeType = "[";
	}

	function enterAddNodeDecisionMode() {
		nodeType = "[/";
	}

	function enterAddNodeStartMode() {
		nodeType = "{";
	}

	const handler = new GraphHandler();
	let previousNode: Node | undefined = undefined;

	type editingMode = "editNode" | "addEdge" | "deleteEdge" | undefined;
	let nodeEditMode: editingMode = undefined;

	function enterGraphNodeEditMode() {
		nodeEditMode = "editNode";
		previousNode = undefined;
	}

	function enterGraphEdgeAddMode() {
		nodeEditMode = "addEdge";
		previousNode = undefined;
	}

	function enterGraphEdgeDeleteMode() {
		nodeEditMode = "deleteEdge";
		previousNode = undefined;
	}

	function handleDownload() {
		downloadData(handler.toMermaidString(), "recipe.md", "text/plain");
	}

	globalThis["__handle_click"] = (nodeId) => {
		console.log(nodeId);
		const node = handler.getNodeById(nodeId);

		if (previousNode !== undefined && previousNode.id === node.id) {
			// 2回クリックしたら選択解除する
			previousNode = undefined;
		} else {
			switch (nodeEditMode) {
				case "addEdge":
					if (previousNode === undefined) {
						previousNode = node;
						break;
					} else {
						const targets = previousNode.outgoingEdges.filter(
							(x) => x.toNode === node
						);
						if (targets.length > 0) {
							console.info("既に存在するエッジ : 追加をスキップ");
							previousNode = undefined;
							break;
						}

						handler.addEdge(3, undefined, previousNode, node);
						previousNode = undefined;
						Render(handler.toInternalMermaidString());
						break;
					}
				case "deleteEdge":
					if (previousNode === undefined) {
						previousNode = node;
						break;
					} else {
						const targets = previousNode.outgoingEdges.filter(
							(x) => x.toNode === node
						);
						if (targets.length !== 1) {
							console.info("削除するエッジがありません");
							alert("削除できる手順の関係がありません");
							previousNode = undefined;
							break;
						}

						handler.deleteEdge(targets[0]);
						previousNode = undefined;
						Render(handler.toInternalMermaidString());
						break;
					}
				case "editNode":
				// edit node here!

				case undefined:
			}
		}
	};


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

<main>
	<!-- メタデータ -->
	<div id="metaData">
		<h2>レシピ名</h2>
		<textarea
			id="registerRecipeNameBox"
			placeholder="例）おうちで簡単に作れる！エンジニア向けのおいしいカレー"
		/>
	</div>
	<!-- 食材追加 -->
	<!-- 必要事項
		N人分
		材料×文量 
	-->
	<div id="registerFoodAndQuantity">
		<h2>材料・分量</h2>
		<textarea
			id="registerPeopleBox"
			placeholder="何人分"
		/>
		<!-- 横並びにしたい displayflex -->
		<!-- 追加ボタンでボックスが追加されるようにする -->
		<!-- 登録ボタン実装 or JSで文字列として保持 -->
		<div id="addFoodAndQuantityTitle">
			<div id="foodName"><h3>材料・調味料</h3></div>
			<div id="quantity"><h3>分量</h3></div>
		</div>
		<div id="addFoodAndQuantityList">
			<button on:click={addAddFoodAndQuantity}>ボックスを追加</button>
			{#each foodAndQuantityPairList as placeholder}
				<div class="addFoodAndQuantity">
					<textarea
						class="registerFoodBox"
						placeholder={"例）" + placeholder.placeholderFood}
						bind:value={placeholder.food}
					/>
					<textarea
						class="registerQuantityBox"
						placeholder={"例）" + placeholder.placeholderQuantity}
						bind:value={placeholder.quantity}
					/>
				</div>
			{/each}
			<button on:click={saveFoodAndQuantity}>保存する</button>
		</div>
	</div>

	<!-- フローチャート作成 -->
	<div id="makeFlowChart">
		<h2 id="makeFlowChartTitle">フローチャートの作成</h2>
		<div id="preview" />
		<div class="nodeButtonArea">
			<button class="nodeButton" on:click={enterGraphEdgeAddMode}>
				{#if nodeEditMode !== "addEdge"}
					<img src={addImageResourceURL} alt="" />
				{/if}
				{#if nodeEditMode === "addEdge"}
					<img src={addPushedImageResourceURL} alt="" />
				{/if}
			</button>
			<button class="nodeButton" on:click={enterGraphEdgeDeleteMode}>
				{#if nodeEditMode !== "deleteEdge"}
					<img src={delImageResourceURL} alt="" />
				{/if}
				{#if nodeEditMode === "deleteEdge"}
					<img src={delPushedImageResourceURL} alt="" />
				{/if}
			</button>

			<button class="nodeButton" on:click={enterGraphNodeEditMode}>
				{#if nodeEditMode !== "editNode"}
					<img src={editImageResourceURL} alt="" />
				{/if}
				{#if nodeEditMode === "editNode"}
					<img src={editPushedImageResourceURL} alt="" />
				{/if}
			</button>
		</div>
	</div>



	<!-- 料理工程の追加 -->
	<div id="makeNode">
		<h2 id="makeNodeTitle">料理工程の追加</h2>
		<textarea
			id="nodeContentInput"
			placeholder="料理の工程を書き込んで、下からオブジェクトの形を選んでください"
			bind:value={recipeContent}
		/>
		<div class="registerAndSelect">
			<div id="selectObjectArea">
				<button
					class="shapeButton"
					id="startButton"
					on:click={enterAddNodeStartMode}
				>
					<img src="./img/start.png" alt="" />
				</button>
				<button
					class="shapeButton"
					id="procedureButton"
					on:click={enterAddNodeProcedureMode}
				>
					<img src="./img/procudure.png" alt="" />
				</button>
				<button
					class="shapeButton"
					id="decideButton"
					on:click={enterAddNodeDecisionMode}
					><img src="./img/decision.png" alt="" /></button
				>
			</div>
			<div class="registerButtonDiv">
				<button id="registerButton" on:click={addNode}>
					<img src="./img/register.png" alt="" />
				</button>
			</div>
		</div>
	</div>
	<div id="ioPanel">
		<h2>ファイル入出力</h2>
		<button on:click={handleDownload}>レシピを保存する</button>
	</div>
</main>

<style>
	main * {
		width: 100%;
		background: #9c9c9c;
		margin: 0%;
	}

	h2 {
		position: relative;
		padding: 5px 26px 5px 42px;
		background: #716664;
		font-size: 20px;
		color: #ffffff;
		margin-left: -40px;
		line-height: 1.3;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(58, 52, 38);
		z-index: 3;
	}
	h3{
		background-color: #716664;
		border-bottom: solid 3px ;
	}
	textarea{
		background-color: aliceblue;
	}
	#metaData{
		background-color: 3px rgb(58, 52, 38);
	}
	#registerRecipeNameBox{
		background-color: aliceblue;

	}

	#preview {
		text-align: center;
	}

	#addFoodAndQuantityTitle {
		display: flex;
	}

	.addFoodAndQuantity {
		display: flex;
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
		height: 80%;
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
		/*width: 50%;*/
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
		text-align: left;
		margin-top: 0;
		margin-left: 10%;
		padding: 0;
		height: 65px;
		position: relative;
	}


	.shapeButton {
		width: 65px;
		margin: 0;
		padding: 0;
		background: transparent;
		border: none;
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
	#ioPanel{
		margin-top: 0%;
	}
</style>
