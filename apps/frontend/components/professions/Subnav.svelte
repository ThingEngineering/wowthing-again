<script lang="ts">
    import active from 'svelte-spa-router/active'
</script>

<style lang="scss">
    .subnav-wrapper {
        background: $body-background;
        padding-bottom: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .subnav {
        --image-margin-top: -0.2rem;
    }
</style>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="professions-subnav">
        <a href={"#/professions/overview"} use:active={"/professions/overview/*"}>
            Overview
        </a>

        <a href={"#/professions/equipment"} use:active={"/professions/equipment/*"}>
            Equipment
        </a>

        <a href={"#/professions/patron-orders"} use:active={"/professions/patron-orders/*"}>
            Patron Orders
        </a>

        <a href={"#/professions/recipes"} use:active={"/professions/recipes/*"}>
            Recipes
        </a>

        <a href={"#/professions/dragonflight-knowledge"} use:active>
            [DF] Knowledge
        </a>

        <a href={"#/professions/war-within-knowledge"} use:active>
            [TWW] Knowledge
        </a>
    </nav>
</div>
