<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./Home.svelte";
    import Edit from "./Edit.svelte";

    const routes = {
        '/': Home,
        '/edit': Edit,
        '*': Home
    }
</script>

<main>
    <Router routes={routes}></Router>
</main>

<style></style>