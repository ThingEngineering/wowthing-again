<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Subnav from './Subnav.svelte';
    import View from './View.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => {
        getSavedRoute('collections', params.slug1, null, null, 'collections-subnav');
    });
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
</style>

<div class="wrapper-column">
    <Subnav />

    {#if params.slug1}
        <View {params} />
    {/if}
</div>
