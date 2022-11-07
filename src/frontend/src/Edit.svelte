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

<!--スクリーンサイズに固定する要素(モーダル・下付き要素の実装に使用する)-->
<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<header>
			<img id="logo" src="./img/cookingitlogo.png" alt="" />
		</header>
		<main>
			<div id="metadataRegisterPanel">
				<h2>レシピ名</h2>
				<textarea
					id="registerRecipeNameBox"
					placeholder="例）おうちで簡単に作れる！エンジニア向けのおいしいカレー"
				/>
			</div>

			<div id="ingredientsRegisterPanel">
				<h2>材料・分量</h2>
				<h3>人数登録</h3>
				<div>
					<span>"何人分？"</span>
					<input type="number" />
				</div>

				<h3>材料登録</h3>

				<table id="ingredientsTable">
					<thead>
						<tr>
							<td>材料・調味料</td>
							<td>分量</td>
						</tr>
					</thead>
					<tbody>
						{#each ingredientInfos as item}
							<tr class="addFoodAndQuantity">
								<td>
									<textarea
										class="registerFoodBox"
										placeholder={"例）" +
											item.placeholderFood}
										bind:value={item.food}
									/>
								</td>
								<td>
									<textarea
										class="registerQuantityBox"
										placeholder={"例）" +
											item.placeholderQuantity}
										bind:value={item.quantity}
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div id="addFoodAndQuantityTitle">
					<!--そもそも保存ボタンいらなくない？-->
					<button
						id="confirmFoodAndQuantity"
						on:click={saveFoodAndQuantity}
					>
						<img
							id="confirmFoodAndQuantitybutton"
							src="./img/confirm.png"
							alt=""
						/>
					</button>
				</div>

				<div id="addFoodAndQuantityList">
					<button on:click={addIngredientInfo}>ボックスを追加</button>
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
					<button
						class="nodeButton"
						on:click={enterGraphEdgeDeleteMode}
					>
						{#if nodeEditMode !== "deleteEdge"}
							<img src="./img/del.png" alt="" />
						{/if}
						{#if nodeEditMode === "deleteEdge"}
							<img src="./img/delPushed.png" alt="" />
						{/if}
					</button>

					<button
						class="nodeButton"
						on:click={enterGraphNodeEditMode}
					>
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
		overflow-x: scroll;
		overflow-y: hidden;
		display: grid;
		grid-template-rows: auto 1fr;
		grid-template-columns: 1fr;
	}

	#content * {
		font-family: "Stick";
	}

	header {
		grid-row: 1;
		grid-column: 1;

		background-color: #919386;
	}

	#logo {
		width: auto;
		height: 5rem;
	}

	main {
		grid-row: 2;
		grid-column: 1;
	}

	main * {
		width: 100%; /* 移行 */
	}

	#content h2 {
		padding: 5px 0px 5px 5px;
		background: #716664;
		font-size: 1.5rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
		border-left: solid 3px #838383;
		border-right: solid 3px #838383;
	}

	#content h3 {
		background: #716664;
		font-size: 1.3rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
		border-left: solid 3px #838383;
		border-right: solid 3px #838383;
	}

	#ingredientsRegisterPanel {
		background-color: #9c9c9c;
	}

	#ingredientsTable thead tr td {
		font-size: 1.3rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
		border-left: solid 3px #838383;
		border-right: solid 3px #838383;
	}

	#confirmFoodAndQuantity {
		background: #9c9c9c;
		border: none;
	}

	.registerFoodBox {
		background-color: #99584d; /*もう少し明るく */
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		color: #ffffff;
	}
	.registerFoodBox:focus {
		border-color: #ff6a4d;
		background-color: #ff9985;
	}
	.registerQuantityBox {
		background-color: #99584d;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		color: #ffffff;
	}
	.registerQuantityBox:focus {
		border-color: #ff6a4d;
		background-color: #ff9985;
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
