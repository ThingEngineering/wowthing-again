<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Subnav from './ProfessionsSubnav.svelte'
    import View from './ProfessionsView.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => {
        getSavedRoute('professions', params.slug1, null, null, 'professions-subnav')
    })
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
</style>

<div
    class="wrapper-column"
    style:--sticky-top={'3.1rem'}
>
    <Subnav />

    {#if params.slug1}
        <View {params} />
    {/if}
</div>
