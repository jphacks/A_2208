<script lang="ts">
    import Router from "svelte-spa-router"
    import Home from "./Home.svelte";
    import Edit from "./Edit.svelte";
    import MyPage from "./MyPage.svelte";

    const routes = {
        '/': Home,
        '/edit': Edit,
        '/mypage': MyPage,
        '*': Home
    }
</script>

<main>
    <Router routes={routes}></Router>
</main>

<style></style>