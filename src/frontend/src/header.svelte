<!-- htmlのheader要素にコピぺ -->
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

<style>
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
		width: 200px;
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
</style>