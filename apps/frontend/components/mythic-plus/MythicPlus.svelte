<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import MythicPlusSidebar from './MythicPlusSidebar.svelte';
    import MythicPlusStats from './MythicPlusStats.svelte';
    import MythicPlusTable from './MythicPlusTable.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('mythic-plus', params.slug1));
</script>

<style lang="scss">
    .sub-wrapper {
        flex-direction: column;
    }
</style>

<div class="view">
    <MythicPlusSidebar />
    <div class="view sub-wrapper">
        {#if params.slug1}
            <MythicPlusTable slug={params.slug1} />

            {#if params.slug1 !== 'this-week'}
                <MythicPlusStats slug={params.slug1} />
            {/if}
        {/if}
    </div>
</div>
