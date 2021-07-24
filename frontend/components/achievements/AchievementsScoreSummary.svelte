<script lang="ts">
    import {data} from '@/stores/achievements'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
</script>

<style lang="scss">
    div {
        border: 1px solid $border-color;
        padding: 1rem;
        width: 100%;
    }
</style>

<div class="thing-container">
    <h2>Score Summary</h2>
    {#each $data.categories as category}
        <ProgressBar title={category.name} />
    {/each}
</div>
