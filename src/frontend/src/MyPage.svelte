<script lang="ts">
	import Header from "./Header.svelte";
	import { sampleRecipeInfos, IngredientInfo, RecipeInfo } from "./Constants";
	let index: number;

	function callAPI(token: string) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8000/get_recipe_repo_list")
		xhr.setRequestHeader("x_github", token)
		
	}
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

			{#each sampleRecipeInfos as Recipe}
				<div id="myRecipeListWindow">
					<table border={2}>
						{#each Recipe.IngredientInfos as Food}
							{#if Food.placeholderFood === Recipe.IngredientInfos[0].placeholderFood}
								<tr>
									<td rowspan={Recipe.IngredientInfoLength}
										><h>{Recipe.Name}</h></td
									>
									<td class="row1 col1">
										<div class="item">
											<h>{Food.placeholderFood}</h>
										</div>
									</td>
									<td class="row1 col2">
										<div class="item">
											<h>{Food.placeholderQuantity}</h>
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
											<h>{Food.placeholderQuantity}</h>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</table>
				</div>
			{/each}
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
	#myRecipeListWindow table{
		border-collapse: collapse;
		border-color: #c5bdbd;
		width: 100%;
		height: auto;
		width: auto;
		grid-row: 2;
		grid-column: 2;
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
		display: grid;
		grid-template-columns: 0.05fr 5fr 0.05fr;
		grid-template-rows: 0.05fr 5fr 0.05fr;
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