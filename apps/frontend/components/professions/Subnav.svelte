<script lang="ts">
    import active from 'svelte-spa-router/active';
</script>

<style lang="scss">
    .subnav-wrapper {
        background: var(--color-body-background);
        padding-bottom: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .subnav {
        --image-margin-top: -0.2rem;
    }
    .spacer {
        border-right: 1px solid var(--border-color);
        width: 1rem;

        + .active {
            margin-left: -1px !important;
        }
    }
</style>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="professions-subnav">
        <a href="#/professions/overview" use:active={'/professions/overview/*'}> Overview </a>

        <a href="#/professions/equipment" use:active={'/professions/equipment/*'}> Equipment </a>

        <a href="#/professions/patron-orders" use:active={'/professions/patron-orders/*'}>
            Patron Orders
        </a>

        <a href="#/professions/recipes" use:active={'/professions/recipes/*'}> Recipes </a>

        <div class="spacer"></div>

        <a class="no-negative" href="#/professions/midnight-knowledge" use:active>
            [Mid] Knowledge
        </a>
        <a href="#/professions/war-within-knowledge" use:active> [TWW] Knowledge </a>
        <a href="#/professions/dragonflight-knowledge" use:active> [DF] Knowledge </a>
    </nav>
</div>
