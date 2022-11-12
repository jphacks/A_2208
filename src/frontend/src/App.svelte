<script lang="ts">
    import Router from "svelte-spa-router"
    import Home from "./Home.svelte";
    import Edit from "./Edit.svelte";
    import MyPage from "./MyPage.svelte";
    import Show from "./Show.svelte";

    const routes = {
        '/': Home,
        '/edit': Edit,
        '/mypage': MyPage,
        '/show' : Show,
        '*': Home
    }
</script>

<main>
    <Router routes={routes}></Router>
</main>

<style></style>