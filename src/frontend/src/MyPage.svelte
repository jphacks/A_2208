<script lang="ts">
</script>

<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<header class="row1 col1">
			<img id="logo" src="./img/cookingitlogo.png" alt="" />
			<div id="buttonsMargin">
				<button class="headerButton">
					<img id="recipeCreateImage" src=".\img\recipecreate.png" alt="">
				</button>
				<button class="headerButton">
					<img id="noticeImage" src=".\img\notice.png" alt="">
				</button>
			</div>
		</header>
		<main class="row2 col1">
			<div id="searchMyRecipe">
				<button>投稿済みレシピ一覧</button>
				<form id="searchBox" method="get">
					<input id="searcher" placeholder="レシピ名を検索" />
					<button id="searchButton"><img id="searchIcon" src=".\img\searchIcon.png" alt=""></button>
				</form>
			</div>
			<div id="calenderWindow">
				カレンダーもしくは草

			</div>
			<div id="myRecipeListWindow">
				<!-- このウィンドウが作成したレシピ分だけ出てくる。ach文？ -->
				<div class="recipeContainer">
					<div class="date">日付</div>
					<div class="recipeName">レシピ名</div>
					<div class="requiredTime">所要時間の目安</div>
					<div class="photo">写真</div>
					<div class="detail">詳細説明</div>
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

	#content header {
		display: flex;
		padding: 6px;
		background-color: #D9D9D9;
	}
	#buttonsMargin{
		margin-top: 15px;
		text-align: right;
		margin-left: auto;
	}
	.headerButton{

		background: transparent;
		border: transparent;
	}
	#recipeCreateImage{
		width: 200px;
	}
	#noticeImage{
		width: 200px;
		height: 50px;
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
		display: flex;
		width: 20px;
	}
	#searchButton{

		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		display: block;
		background: #919386;
		border: transparent;
	}
	#searchIcon{
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
    color: #6091d3;/*文字色*/
    background: #D9D9D9;
    border-radius: 10px;/*角の丸み*/

	
	}
	#myRecipeListWindow{
	/* 仮のかたち */
	padding-bottom: 20px;
	width: 85%;
	height: 200px;
	margin-top: 20px;
	margin-left: auto;
	margin-right: auto;
    margin-bottom: 20px;
    font-weight: bold;
    color: #6091d3;/*文字色*/
    background: #D9D9D9;
    border-radius: 10px;/*角の丸み*/
	}
	.recipeContainer{
			/* 画面配置と中身の配置 */
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: repeat(3,1fr);
	width: 85%;
	margin-left: auto;
	margin-right: auto;
	}
	.date{
		grid-column: 1;
		grid-row: 1;
	}
	.recipeName{
		grid-column: 1;
		grid-row: 2;
	}
	.requiredTime{
		grid-column: 1;
		grid-row: 3;
	}
	.photo{
		grid-column: 2;
		grid-row: auto;
	}
	.detail{
		grid-column: 3;
		grid-row: auto;
	}

	
</style>
