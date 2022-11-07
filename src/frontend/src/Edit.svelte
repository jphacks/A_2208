<script lang="ts">
	import { onMount } from "svelte";
	import { GraphHandler, Node } from "./GraphHandler";
	import mermaid from "mermaid";
	import { sample, defaultIngredientInfos } from "./Constants";
	import type { IngredientInfo } from "./Constants";
	import { downloadData } from "./Utilities";

	let ingredientInfos = defaultIngredientInfos;

	function addIngredientInfo() {
		let value: IngredientInfo = {
			food: undefined,
			quantity: undefined,
			placeholderFood: "水",
			placeholderQuantity: "200cc",
		};
		ingredientInfos.push(value);
		ingredientInfos = ingredientInfos;
	}

	function saveFoodAndQuantity() {
		ingredientInfos.forEach((element) => {
			if (element.food === undefined && element.quantity === undefined) {
				// continue
			} else if (
				element.food === undefined ||
				element.quantity === undefined
			) {
				alert("食材と分量を入力してください");
				// break;
				return;
			} else {
				// 食材と分量を保存する処理
			}
		});
	}

	let recipeContent: string;
	type NodeTypes = "[" | "[/" | "{";
	let nodeType: NodeTypes = "[";

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

	type GraphEditingMode = "editNode" | "addEdge" | "deleteEdge" | undefined;
	let nodeEditMode: GraphEditingMode = undefined;

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
		<textarea id="registerPeopleBox" placeholder="何人分" />
		<!-- 横並びにしたい displayflex -->
		<!-- 追加ボタンでボックスが追加されるようにする -->
		<!-- 登録ボタン実装 or JSで文字列として保持 -->
		<div id="addFoodAndQuantityTitle">
			<div id="foodName"><h3>材料・調味料</h3></div>
			<div id="quantity"><h3>分量</h3></div>
		</div>
		<div id="addFoodAndQuantityList">
			<button on:click={addIngredientInfo}>ボックスを追加</button>
			{#each ingredientInfos as placeholder}
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
					<img src="./img/add.png" alt="" />
				{/if}
				{#if nodeEditMode === "addEdge"}
					<img src="./img/addPushed.png" alt="" />
				{/if}
			</button>
			<button class="nodeButton" on:click={enterGraphEdgeDeleteMode}>
				{#if nodeEditMode !== "deleteEdge"}
					<img src="./img/del.png" alt="" />
				{/if}
				{#if nodeEditMode === "deleteEdge"}
					<img src="./img/delPushed.png" alt="" />
				{/if}
			</button>

			<button class="nodeButton" on:click={enterGraphNodeEditMode}>
				{#if nodeEditMode !== "editNode"}
					<img src="./img/edit.png" alt="" />
				{/if}
				{#if nodeEditMode === "editNode"}
					<img src="./img/editPushed.png" alt="" />
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
		<h3>ファイル入出力</h3>
		<button on:click={handleDownload}>レシピを保存する</button>
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

	#makeNode {
		background-color: #838383;
		/*width: 50%;*/
	}

	#makeNodeTitle {
		width: 95%;
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
</style>
