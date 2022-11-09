<script lang="ts">
</script>

<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<header class="row1 col1">
			<img id="logo" src="./img/cookingitlogo.png" alt="" />
			<button>
				<img src="" alt="">
			</button>
			<button>通知</button>
		</header>
		<main class="row2 col1">
			<div id="searchMyRecipe">
				<button>投稿済みレシピ一覧</button>
				<form id="searchBox" method="get">
					<input id="searcher" placeholder="レシピ名を検索" />
					<button id="searchButton"><img id="searchbutton" src=".\img\searchIcon.png" alt=""></button>
				</form>
			</div>
			<div id="calenderWindow">

			</div>
			<div id="myRecipeListWindow">

			</div>
			<div class="box">
				カレンダーもしくは草
			</div>
			<div class="box2">
				レシピ
				<p>作った数に応じて増やしたい</p>
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

	#content header {
		padding: 6px;
		background-color: #919386;
	}

	#logo {
		width: auto;
		height: 5rem;
	}

	#searchMyRecipe{
		font-family: "Stick";
	}
	#searcher{
		border-radius: 10px;
	}
	#searchBox{
		width: 20px;
	}
	#searchButton{
		background: transparent;
		border: transparent;
	}
	#searchbutton{
		width: 20px;
	}
	.box {
    padding-bottom: 20px;
    margin-bottom: 20px;
    font-weight: bold;
    color: #6091d3;/*文字色*/
    background: #D9D9D9;
    border-radius: 10px;/*角の丸み*/
	width: 500px;
	height: 200px;
	}
	.box2 {
	padding: 0.5em 1em;
	margin: 1rem 1rem 1rem 1rem;
    font-weight: bold;
    color: #6091d3;/*文字色*/
    background: #D9D9D9;
    border-radius: 10px;/*角の丸み*/
	width: 500px;
	height: 300px;

	}
</style>
