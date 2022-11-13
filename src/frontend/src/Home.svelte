<script lang="ts">
	// Import the functions you need from the SDKs you need
	import Header from "./Header.svelte";
	import { initializeApp } from "firebase/app";
	import { getAnalytics, setUserId } from "firebase/analytics";
	import {
		getAuth,
		signInWithPopup,
		getRedirectResult,
		signOut,
		GithubAuthProvider,
		signInWithRedirect,
	} from "firebase/auth";

	import {userToken} from "./Store"

	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: "AIzaSyBJfWSAq6qXpzlNZwj4kuH_D160oGxg_8A",
		authDomain: "shimesaba-project.firebaseapp.com",
		projectId: "shimesaba-project",
		storageBucket: "shimesaba-project.appspot.com",
		messagingSenderId: "655635703052",
		appId: "1:655635703052:web:b1dfac187d4f7afa105529",
		measurementId: "G-41TW8J27DH",
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	let isLogined: boolean = false;

	const provider = new GithubAuthProvider();
	provider.addScope("repo");
	provider.setCustomParameters({
		allow_signup: "false",
	});
	const auth = getAuth();
	auth.onAuthStateChanged((user) => {
		if (user) {
			isLogined = true;
		} else {
			isLogined = false;
		}
	});

	function login() {
		signInWithPopup(auth, provider)
			.then((result) => {
				isLogined = true;
				const credential =
					GithubAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				userToken.set(token);

				const user = result.user;
			})
			.catch((error) => {
				isLogined = false;
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.customData.email;
				const credential =
					GithubAuthProvider.credentialFromError(error);
			});
	}

	function logout() {
		signOut(auth)
			.then(() => {
				console.log("logout!!");
				isLogined = false;
			})
			.catch((error) => {
				console.log("error");
			});
	}
</script>

<div id="screen">
	<!--縦にスクロールするコンテンツ要素(可変長)-->
	<div id="content">
		<Header isLogined={isLogined}/>
		<main class="row2 col1">
			{#if !isLogined}
				<div id="welcomArea">
					<div id="signButtons">
						<button class="signButton" type="button">
							<a href="https://github.com" target="_brank"
								><img
									id="signUpButton"
									class="signButtonImg"
									src="./img/signup.png"
									alt=""
								/></a
							>
						</button>
						<button class="signButton" on:click={login}
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
			{:else}
				<div id="signButtons">
					<button class="signButton" on:click={logout}>
						<img
							id="signOutButton"
							class="signButtonImg"
							src="./img/signout.png"
							alt=""
						/></button
					>
				</div>
			{/if}
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
