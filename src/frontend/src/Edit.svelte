<script lang="ts">
	import { onMount } from "svelte";
	import { GraphHandler, Node } from "./GraphHandler";
	import mermaid from "mermaid";

	let food = ["たまねぎ", "にんじん"];
	let foodEscape: string = undefined;

	function foodAdd() {
		if (foodEscape === undefined) {
			alert("食材名を書いてください！");
			return;
		}

		food.push(foodEscape);
		food = food;
		foodEscape = undefined;
	}

	let recipeContent: string;
	function addNode() {
		if (recipeContent === undefined) {
			alert("登録する工程内容を書いてください！");
			return;
		}

		handler.addNode(recipeContent, "[");
		Render(handler.toInternalMermaidString());
	}

	let addImageResourceURL: string = "./img/add.png";
	let addPushedImageResourceURL: string = "./img/addPushed.png"
	let editPushedImageResourceURL: string = "./img/editPushed.png";
	let editImageResourceURL: string = "./img/edit.png";
	let delPushedImageResourceURL: string = "./img/delPushed.png";
	let delImageResourceURL: string = "./img/del.png";
	let registerImageResourceURL: string = "./img/register.png";
	let confirmImageResourceURL: string = "./img/confirm.png";
	let startImageResourceURL: string = "./img/start.png";
	let operateImageResourceURL: string = "./img/operate.png";
	let decideImageResourceURL: string = "./img/decide.png";

	const handler = new GraphHandler();
	let prevNode: Node | undefined = undefined;

	globalThis["__handle_click"] = (nodeId) => {
		console.log(nodeId);
		const node = handler.getNodeById(nodeId);

		if (prevNode !== undefined && prevNode.id === node.id) {
			// 2回クリックしたら選択解除する
			prevNode = undefined;
		} else {
			switch (mode) {
				case "addEdge":
					if (prevNode === undefined) {
						prevNode = node;
						break;
					} else {
						const targets = prevNode.outgoingEdges.filter(
							(x) => x.toNode === node
						);
						if (targets.length > 0) {
							console.info("既に存在するエッジ : 追加をスキップ");
							prevNode = undefined;
							break;
						}

						handler.addEdge(3, undefined, prevNode, node);
						prevNode = undefined;
						Render(handler.toInternalMermaidString());
						break;
					}
				case "deleteEdge":
					if (prevNode === undefined) {
						prevNode = node;
						break;
					} else {
						const targets = prevNode.outgoingEdges.filter(
							(x) => x.toNode === node
						);
						if (targets.length !== 1) {
							console.info("削除するエッジがありません");
							alert("削除できる手順の関係がありません");
							prevNode = undefined;
							break;
						}

						handler.deleteEdge(targets[0]);
						prevNode = undefined;
						Render(handler.toInternalMermaidString());
						break;
					}
				case "editNode":
				// edit node here!

				case undefined:
			}
		}
	};

	type editingMode = "editNode" | "addEdge" | "deleteEdge" | undefined;
	let mode: editingMode = undefined;

	function enterGraphNodeEditMode() {
		mode = "editNode";
		prevNode = undefined;
	}

	function enterGraphEdgeAddMode() {
		mode = "addEdge";
		prevNode = undefined;
	}

	function enterGraphEdgeDeleteMode() {
		mode = "deleteEdge";
		prevNode = undefined;
	}

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
	<div id="makeFlowChart">
		<h2 id="makeFlowChartTitle">フローチャートの作成</h2>
		<div id="preview" />
		<div class="nodeButtonArea">
			<!-- ボタンを縦並びにする -->
			<button class="nodeButton" on:click={enterGraphEdgeAddMode}
				>

				{#if mode !== "addEdge"}
					<img src={addImageResourceURL} alt="" />
				{/if}
				{#if mode  === "addEdge"}
					<img src={addPushedImageResourceURL} alt="" />
				{/if}
				
				</button
			>
			<button class="nodeButton" on:click={enterGraphEdgeDeleteMode}
				>
				{#if mode !== "deleteEdge"}
					<img src={delImageResourceURL} alt="" />
				{/if}
				{#if mode  === "deleteEdge"}
					<img src={delPushedImageResourceURL} alt="" />
				{/if}
				</button
			>

			<button class="nodeButton" on:click={enterGraphNodeEditMode}
				>
				{#if mode !== "editNode"}
					<img src={editImageResourceURL} alt="" />
				{/if}
				{#if mode  === "editNode"}
					<img src={editPushedImageResourceURL} alt="" />
				{/if}
				</button
			>
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
					<textarea
						id="makeFoodBox"
						placeholder="使う材料を書き込んで追加してください"
						bind:value={foodEscape}
					/>
					<div class="confirmButtonDiv">
						<button id="confirmButton" on:click={foodAdd}
							><img
								src={confirmImageResourceURL}
								alt=""
							/></button
						>
					</div>
				</div>
			</div>
		</div>
		<div id="makeNode">
			<h2 id="makeNodeTitle">料理工程の追加</h2>
			<textarea
				id="makeNodeBox"
				placeholder="料理の工程を書き込んで、下からオブジェクトの形を選んでください"
				bind:value={recipeContent}
			/>
			<div class="registerAndSelect">
				<div id="selectObjectArea">
					<button class="nodeButton" on:click={enterGraphEdgeAddMode}
						><img src={startImageResourceURL} alt="" /></button
					>
					<button class="nodeButton" on:click={enterGraphNodeEditMode}
						><img src={operateImageResourceURL} alt="" /></button
					>
					<button
						class="nodeButton"
						on:click={enterGraphEdgeDeleteMode}
						><img src={decideImageResourceURL} alt="" /></button
					>
				</div>
				<div class="registerButtonDiv">
					<button id="registerButton" on:click={addNode}
						><img src={registerImageResourceURL} alt="" /></button
					>
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
		z-index: 3;
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
