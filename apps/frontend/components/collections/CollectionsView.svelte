<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Appearances from '@/components/appearances/Appearances.svelte'
    import Dragonriding from './dragonriding/Dragonriding.svelte'
    import DruidForms from '@/user-home/components/druid-forms/DruidForms.svelte'
    import Heirlooms from '@/components/heirlooms/Heirlooms.svelte'
    import Illusions from '@/components/illusions/Illusions.svelte'
    import Mounts from '@/components/collectible/Mounts.svelte'
    import Pets from '@/components/collectible/Pets.svelte'
    import Toys from '@/components/collectible/Toys.svelte'

    export let params: MultiSlugParams

    let shiftedParams: MultiSlugParams
    $: shiftedParams = {
        slug1: params.slug2,
        slug2: params.slug3,
        slug3: params.slug4,
        slug4: params.slug5,
    }
</script>

<div>
    {#if params.slug1 === 'appearances'}
        <Appearances
            basePath={'collections'}
            params={shiftedParams}
        />

    {:else if params.slug1 === 'dragonriding'}
        <Dragonriding />
    
    {:else if params.slug1 === 'druid-forms'}
        <DruidForms />

    {:else if params.slug1 === 'heirlooms'}
        <Heirlooms />

    {:else if params.slug1 === 'illusions'}
        <Illusions />

    {:else if params.slug1 === 'mounts'}
        <Mounts
            basePath={'collections'}
            params={shiftedParams}
        />

    {:else if params.slug1 === 'pets'}
        <Pets
            basePath={'collections'}
            params={shiftedParams}
        />

    {:else if params.slug1 === 'toys'}
        <Toys
            basePath={'collections'}
            params={shiftedParams}
        />

    {/if}
</div>
