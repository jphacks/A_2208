<script lang="ts">
</script>

<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<header class="row1 col1">
			<img id="logo" src="./img/cookingitlogo.png" alt="" />
			<button>レシピ作成</button>
			<button>通知</button>
		</header>
		<main class="row2 col1">
			<div id="welcomArea">
				<div id="signinAndSignup">
					<button>sign up</button>
					<button>sign in</button>
				</div>
				<img src="./img/toplogo.png" alt="" id="toplogo">
			</div>
			<div id="searchWindow">
				<form id="searchBox" method="get">
					<input placeholder="料理を検索" />
					<input type="submit" value="検索" />
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

	#content header {
		padding: 6px;
		background-color: #919386;
	}

	#logo {
		width: auto;
		height: 5rem;
	}

	#toplogo {
		width: 70%;
	}

</style>
