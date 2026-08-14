<script lang="ts">
    import Options from './Options.svelte';
    import Results from './Results.svelte';
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        gap: 1rem;
    }
</style>

<div class="wrapper">
    <Options />
    <Results />
</div>
