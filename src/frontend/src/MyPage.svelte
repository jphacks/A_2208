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
					<input id="searcher" placeholder="レシピ名で検索" />
					<button id="searchButton"><img id="searchIcon" src=".\img\searchIcon.png" alt=""></button>
				</form>
			</div>
			<div class="row3 col2" id="calenderWindow">
				カレンダーもしくは草

			</div>
			<div  id="myRecipeListWindow">
				<!-- このウィンドウが作成したレシピ分だけ出てくる。each文？ -->
				<div class="recipeContainer">
					<div class="date">
						日付
						<!-- 投稿日時と連携 -->

					</div>
					<div class="recipeName">
						レシピ名
						<!-- 編集画面のレシピ名を取得 -->
					
					</div>
					<div class="requiredTime">
						所要時間の目安
						<!-- いらないというか出来ない気がする -->
					
					</div>
					<div class="photo">
						写真
						<!-- 入るか入らないかわからない -->

					</div>
					<div class="detail">
						詳細説明
						
					
					</div>
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

	#content{
		font-family: "Stick";
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

	.row2.col1{
		background: #9c9c9c;
	}


	#recipeCreateImage{
		width: 200px;
	}
	#noticeImage{
		width: 200px;
		height: 50px;
	}
	#logo {
		width: 500px;
	}

	#searchMyRecipe{
		font-family: "Stick";
		display: flex;
	}
	#searcher{
		border-radius: 10px;
		margin-left: 20px;
	}
	#searchBox{
		display: flex;
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
    text-align: center;	/* 見やすさ調整 */
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

	/* グリッドテンプレ */
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
