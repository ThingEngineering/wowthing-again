<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Subnav from './Subnav.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => {
        getSavedRoute(
            'collections',
            params.slug1,
            null,
            null,
            'collections-subnav'
        )
    })
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
