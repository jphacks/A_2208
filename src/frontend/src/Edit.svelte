<script lang="ts">
	import { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Header from "./Header.svelte";
	import { GraphHandler, Node } from "./GraphHandler";
	import mermaid from "mermaid";
	import { sample, defaultIngredientInfos } from "./Constants";
	import type { IngredientInfo } from "./Constants";
	import { downloadData } from "./Utilities";

	let recipeTitle: string;
	let ingredientInfos = defaultIngredientInfos;

	function addIngredientInfo() {
		let value: IngredientInfo = {
			name: undefined,
			quantity: undefined,
			placeholderFood: "水",
			placeholderQuantity: "200cc",
		};
		ingredientInfos.push(value);
		ingredientInfos = ingredientInfos;
	}

	function saveIngredientInfo() {
		ingredientInfos.forEach((element) => {
			if (element.name === undefined && element.quantity === undefined) {
				// continue
			} else if (
				element.name === undefined ||
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

	function deleteIngredientInfo(target: IngredientInfo) {
		ingredientInfos = ingredientInfos.filter((item) => item !== target);
	}

	// end 食材と分量関係

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
		const document = handler.toMarmaidDocument(
			recipeTitle,
			ingredientInfos
		);
		if (document === null) {
			alert("レシピが完成されていません");
			return;
		}
		downloadData(document, "recipe.md", "text/plain");
		pop();
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

		console.log(handler.toMarmaidDocument(recipeTitle, ingredientInfos));
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
		<Header isLogined={false} />
		<main class="row2 col1">
			<div id="metadataRegisterPanel" class="row1 col1">
				<h2>レシピ名</h2>
				<textarea
					placeholder="例）おうちで簡単に作れる！エンジニア向けのおいしいカレー"
					bind:value={recipeTitle}
				/>
			</div>

			<div id="ingredientsRegisterPanel" class="row2 col1">
				<h2>材料・分量</h2>
				<h3>何人分？</h3>
				<div>
					<input type="number" />
				</div>

				<table id="ingredientsTable">
					<thead>
						<tr>
							<td class="col1">材料・調味料</td>
							<td class="col2">分量</td>
						</tr>
					</thead>
					<tbody>
						{#each ingredientInfos as item}
							<tr>
								<td class="row1 col1">
									<textarea
										class="ingredientInput"
										placeholder={"例）" +
											item.placeholderFood}
										bind:value={item.name}
									/>
								</td>
								<td class="row1 col2">
									<textarea
										class="ingredientInput"
										placeholder={"例）" +
											item.placeholderQuantity}
										bind:value={item.quantity}
									/>
								</td>
								<td>
									<button
										on:click={() =>
											deleteIngredientInfo(item)}
									>
										削除する
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div id="addIngredientInfoList">
					<button on:click={addIngredientInfo}>ボックスを追加</button>
					<!-- <button on:click={saveIngredientInfo}>保存する</button> -->
				</div>
			</div>

			<div id="flowChartPreviewPanel" class="row3 col1">
				<h2>フローチャートの作成</h2>

				<div id="mermaidPreviewPanel">
					<!--外部ライブラリが以下の要素を置換する-->
					<div id="preview" class="row1 col2" />
				</div>

				<div id="nodeButtonArea">
					<div class="row1 col2">
						<button
							class="nodeButton"
							on:click={enterGraphEdgeAddMode}
						>
							{#if nodeEditMode !== "addEdge"}
								<img src="./img/add.png" alt="" />
							{/if}
							{#if nodeEditMode === "addEdge"}
								<img src="./img/addPushed.png" alt="" />
							{/if}
						</button>
					</div>

					<div class="row1 col3">
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
					</div>

					<div class="row1 col4">
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
			</div>

			<div id="flowChartDetailPanel" class="row4 col1">
				<h2>料理工程の追加</h2>
				<textarea
					placeholder="料理の工程を書き込んで、下からオブジェクトの形を選んでください"
					bind:value={recipeContent}
				/>
				<div id="nodeEditButtonArea">
					<div id="nodeTypeButtonPanel" class="row1 col2">
						<div class="nodeTypeButton row1 col1">
							<button on:click={enterAddNodeStartMode}>
								<img src="./img/start.png" alt="" />
							</button>
						</div>

						<div class="nodeTypeButton row1 col2">
							<button on:click={enterAddNodeProcedureMode}>
								<img src="./img/procudure.png" alt="" />
							</button>
						</div>

						<div class="nodeTypeButton row1 col3">
							<button on:click={enterAddNodeDecisionMode}>
								<img src="./img/decision.png" alt="" />
							</button>
						</div>
					</div>

					<div id="nodeEditRegisterButtonPanel" class="row1 col4">
						<button class="row2 col1" on:click={addNode}>
							<img src="./img/register.png" alt="" />
						</button>
					</div>
				</div>
			</div>
			<div id="ioPanel" class="row5 col1">
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

	#content textarea {
		resize: none;
		font-family: sans-serif;
	}
	::placeholder {
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

	#content h3 {
		background: #716664;
		font-size: 1.3rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
	}

	#ingredientsRegisterPanel {
		background-color: #9c9c9c;
	}

	#ingredientsTable thead tr td {
		background: #716664;
		font-size: 1.3rem;
		color: #ffffff;
		border-top: solid 3px #9c9c9c;
		border-bottom: solid 3px rgb(14, 13, 11);
	}

	#ingredientsTable tr {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: repeat(2, 1fr);
	}

	#ingredientsTable .ingredientInput {
		background-color: #123442; /*最悪白でもいい；白の場合は文字色を黒に */
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		color: #ffffff;
	}
	#ingredientsTable .ingredientInput:focus {
		border-color: #ff6a4d;
		background-color: #ff9985;
	}

	#flowChartPreviewPanel {
		background-color: #577699;
	}

	#mermaidPreviewPanel {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 1fr auto 1fr;
	}

	#nodeButtonArea {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 1fr repeat(3, auto);
		text-align: right;
	}

	#nodeButtonArea div {
		width: 100px;
		padding-right: 20px;
	}

	#nodeButtonArea button.nodeButton {
		background: transparent;
		border: none;
	}

	#flowChartDetailPanel {
		background-color: #838383;
	}

	#flowChartDetailPanel button {
		background: transparent;
		border: none;
	}

	#nodeEditButtonArea {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 100px auto 1fr auto;
	}

	#nodeTypeButtonPanel {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: repeat(3, auto);
	}

	#nodeEditButtonArea div.nodeTypeButton {
		width: 100px;
		padding-right: 20px;
	}

	#nodeEditRegisterButtonPanel {
		width: 120px;
		padding-right: 20px;

		display: grid;
		grid-template-rows: 1fr auto 1fr;
		grid-template-columns: auto;
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

	.row4 {
		grid-row: 4;
	}

	.row5 {
		grid-row: 5;
	}

	.col1 {
		grid-column: 1;
	}

	.col2 {
		grid-column: 2;
	}

	.col3 {
		grid-column: 3;
	}

	.col4 {
		grid-column: 4;
	}
</style>
