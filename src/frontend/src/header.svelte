<!-- htmlのheader要素にコピぺ -->
<script lang="ts">
	import { push } from "svelte-spa-router";
	let isLogined: boolean = false;
	export { isLogined };
	function toCreateRecipe() {
		push("/edit");
	}
	function toMyPage() {
		push("/mypage");
	}
</script>

<header class="row1 col1">
	<img class="headerIcon" id="logo" src="./img/cookingitlogo.png" alt="" />
	<div />
	<div />
	<div />
	<div />
	<div />
	{#if isLogined}
		<div class="headerIcon" id="recipeCreateButtonPanel">
			<button class="headerButton" on:click={toCreateRecipe}>
				<img
					id="recipeCreateImage"
					src=".\img\recipecreate.png"
					alt=""
				/>
			</button>
		</div>
		<div class="headerIcon" id="noticeButtonPanel">
			<button class="headerButton" on:click={toMyPage}>
				<img id="noticeImage" src=".\img\mypage.png" alt="" />
			</button>
		</div>
	{:else}
		<div />
	{/if}
</header>

<style>
	/* cssのスタイル */
	/* #content */
	header {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: 1fr auto 1fr;
		padding: 6px;
		background-color: #d9d9d9;
	}
	#recipeCreateButtonPanel {
		display: grid;
		grid-row: 2;
		grid-column: 7;
	}
	#noticeButtonPanel {
		display: grid;
		grid-row: 2;
		grid-column: 8;
	}
	.headerIcon {
		grid-column: auto;
		grid-row: 2;
	}
	.headerButton {
		background: transparent;
		border: transparent;
	}

	#recipeCreateImage {
		width: 200px;
	}

	#noticeImage {
		width: 180px;
		height: 50px;
	}

	#logo {
		width: 500px;
	}

	.row1 {
		grid-row: 1;
	}
	.col1 {
		grid-column: 1;
	}
</style>
