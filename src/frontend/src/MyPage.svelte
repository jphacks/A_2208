<script lang="ts">
	import Header from "./Header.svelte";
	import { sampleRecipeInfos, IngredientInfo, RecipeInfo } from "./Constants";
	let index: number;
</script>

<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<Header isLogined={false} />
		<main class="row2 col1">
			<div id="searchMyRecipe">
				<button id="toRecipesButton">
					<img id="toRecipesImg" src="./img/toRecipes.png" alt="" />
				</button>
				<form id="searchBox" method="get">
					<input id="searcher" placeholder="レシピ名で検索" />
					<button id="searchButton"
						><img
							id="searchIcon"
							src=".\img\searchIcon.png"
							alt=""
						/></button
					>
				</form>
			</div>
			<div id="myRecipeListWindow">
				<div>
					<table>
						<tr>
							<th>レシピ名</th>
							<th>材料</th>
							<th>分量</th>
						</tr>
						{#each sampleRecipeInfos as Recipe}
							{#each Recipe.IngredientInfos as Food}
								{#if Food.placeholderFood === Recipe.IngredientInfos[0].placeholderFood}
									<tr>
										<td rowspan={Recipe.IngredientInfoLength}><h>{Recipe.Name}</h></td>
										<td class="row1 col1">
											<div class="item">
												<h>{Food.placeholderFood}</h>
											</div>
										</td>
										<td class="row1 col2">
											<div class="item">
												<h>{Food.placeholderQuantity}</h
												>
											</div>
										</td>
									</tr>
								{/if}
								{#if Food.placeholderFood !== Recipe.IngredientInfos[0].placeholderFood}
								<tr>
									<td class="row1 col1">
										<div class="item">
											<h>{Food.placeholderFood}</h>
										</div>
									</td>
									<td class="row1 col2">
										<div class="item">
											<h>{Food.placeholderQuantity}</h
											>
										</div>
									</td>
								</tr>
								{/if}
							{/each}
						{/each}
					</table>
				</div>
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
		background: #9c9c9c;
	}

	#screen * {
		margin: 0px;
		padding: 0px;
	}

	#content {
		font-family: "Stick";
	}

	.row2.col1 {
		background: #9c9c9c;
	}

	#toRecipesButton {
		border: none;
		background: transparent;
	}

	#toRecipesImg {
		width: 200px;
	}

	#searchMyRecipe {
		font-family: "Stick";
		display: flex;
		padding: 10px 10px;
	}
	#searcher {
		border-radius: 10px;
		margin-left: 20px;
	}
	#searchBox {
		display: flex;
	}
	#searchButton {
		padding: 10px 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		display: block;
		background: #919386;
		border: transparent;
	}
	#searchIcon {
		display: block;
		width: 20px;
	}
	#calenderWindow {
		display: block;
		padding-bottom: 20px;
		width: 85%;
		height: 200px;
		margin-top: 20px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
		font-weight: bold;
		color: #6091d3; /*文字色*/
		background: #d9d9d9;
		border-radius: 10px; /*角の丸み*/
	}
	#myRecipeListWindow {
		/* 仮のかたち */
		text-align: center; /* 見やすさ調整 */
		padding-bottom: 20px;
		width: 85%;
		height: 200px;
		margin-top: 20px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
		font-weight: bold;
		color: #6091d3; /*文字色*/
		background: #d9d9d9;
		border-radius: 10px; /*角の丸み*/
	}

	.row2 {
		grid-row: 2;
	}

	.row3 {
		grid-row: 3;
	}

	.col1 {
		grid-column: 1;
	}

	.col2 {
		grid-column: 2;
	}
</style>
