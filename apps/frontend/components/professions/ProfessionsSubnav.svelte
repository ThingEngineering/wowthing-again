<script lang="ts">
    import active from 'svelte-spa-router/active'

    import ParsedText from '@/components/common/ParsedText.svelte'
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

        font-size: 1.1rem;
    }
</style>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="professions-subnav">
        <a href={"#/professions/overview"} use:active={"/professions/overview/*"}>
            Overview
        </a>

        <a href={"#/professions/recipes"} use:active={"/professions/recipes/*"}>
            <ParsedText text="Recipes" />
        </a>

        <a href={"#/professions/dragonflight-knowledge"} use:active>
            <ParsedText text="[DF] Knowledge" />
        </a>
    </nav>
</div>
