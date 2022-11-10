<script lang="ts">
</script>
<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<header class="row1 col1">
			<img class="headerIcon" id="logo" src="./img/cookingitlogo.png" alt="" />
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div class="headerIcon" id="recipeCreateButtonPanel">
				<button class="headerButton">
					<img id="recipeCreateImage" src=".\img\recipecreate.png" alt="">
				</button>
			</div>
			<div class="headerIcon" id="noticeButtonPanel">
				<button class="headerButton">
					<img id="noticeImage" src=".\img\notice.png" alt="">
				</button>
			</div>
		</header>
		<main class="row2 col1">
			<div id="welcomArea">
				<div id="signButtons">
					<button class="signButton"
						><img
							id="signUpButton"
							class="signButtonImg"
							src="./img/signup.png"
							alt=""
						/></button
					>
					<button class="signButton"
						><img
							id="signInButton"
							class="signButtonImg"
							src="./img/signin.png"
							alt=""
						/></button
					>
				</div>
				<img src="./img/toplogo.png" alt="" id="toplogo" />
			</div>
			<div id="searchWindow">
				<link
					href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
					rel="stylesheet"
				/>
				<form method="get" action="#" class="search_container">
					<input
						type="text"
						size="25"
						placeholder="　キーワード検索"
					/>
					<input type="submit" value="&#xf002" />
				</form>
			</div>
			<div id="timelineWindow">
				<!-- データベースから取得したレシピ情報を表示 -->
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

/* cssのスタイル */
	/* #content */header { 
		display: grid;
		grid-template-columns: repeat(8,1fr);
		grid-template-rows: 1fr auto 1fr;
		padding: 6px;
		background-color: #D9D9D9;
	}
	#recipeCreateButtonPanel{
		display: grid;
		grid-row: 2;
		grid-column: 7;

	}
	#noticeButtonPanel{
		display: grid;
		grid-row: 2;
		grid-column: 8;
	}
	.headerIcon{
		grid-column: auto;
		grid-row: 2;
	}
	.headerButton{
		background: transparent;
		border: transparent;
	}


	#recipeCreateImage{
		width: 200px;
	}
	#noticeImage{
		width: 180px;
		height: 50px;
	}
	#logo {
		width: 500px;
	}

	.row1{
		grid-row: 1;
	}
	.col1{
		grid-column: 1;
	}

	#signButtons {
		text-align: right;
		margin-left: auto;
		padding: 15px;
	}

	.signButton {
		width: 100px;
		background: transparent;
		border: none;
	}

	.signButtonImg {
		width: 100px;
	}

	#toplogo {
		width: 70%;
	}

	#recipeButton {
		height: 50px;
		background: transparent;
	}

	#noticeButton {
		height: 50px;
		background: transparent;
	}

	.search_container {
		position: relative;
		box-sizing: border-box;
		display: block;
		padding: 3px 10px;
		border-radius: 20px;
		height: 2.2em;
		width: 250px;
		overflow: hidden;
		background: #3879d9;
	}
	.search_container input[type="text"] {
		border: none;
		height: 2em;
		background: #3879d9;
	}
	.search_container input[type="text"]:focus {
		outline: 0;
	}
	.search_container input[type="submit"] {
		cursor: pointer;
		font-family: FontAwesome;
		font-size: 1.3em;
		border: none;
		background: none;
		color: #fff;
		position: absolute;
		height: 2.5em;
		right: 8px;
		top: -10px;
		outline: none;
	}
	.search_container ::-webkit-input-placeholder {
		color: #fff;
	}
</style>
