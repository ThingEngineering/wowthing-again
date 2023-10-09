<script lang="ts">
    import { replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { Constants } from '@/data/constants'
    import { covenantMap, covenantOrder, covenantSlugMap } from '@/data/covenant'
    import { garrisonTrees } from '@/data/garrison'
    import getPercentClass from '@/utils/get-percent-class'
    import { leftPad } from '@/utils/formatting'
    import type { Character, MultiSlugParams } from '@/types'

    import Covenant from './CharactersShadowlandsCovenant.svelte'
    import GarrisonTree from '../garrison-tree/CharactersGarrisonTree.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let params: MultiSlugParams

    let baseUrl: string
    $: {
        baseUrl = `/characters/${params.slug1}/${params.slug2}/shadowlands`

        if (
            covenantSlugMap[params.slug4] === undefined &&
            params.slug4 !== 'cypher-research'
        ) {
            replace(`${baseUrl}/${covenantMap[character.shadowlands?.covenantId ?? covenantOrder[0]].slug}`)
        }
    }
</script>

<style lang="scss">
    .subnav {
        margin: 1rem 0 1rem 0;
        width: 100%;
    }
    .end {
        border-bottom: 1px solid $border-color;
        border-top: 1px solid $border-color;
        flex-grow: 1;
     }
</style>

<nav class="subnav">
    {#each covenantOrder as covenantId}
        {@const renown = character.shadowlands?.covenants?.[covenantId]?.renown ?? 0}
        <a
            href="#/characters/{params.slug1}/{params.slug2}/{params.slug3}/{covenantMap[covenantId].slug}"
            use:active
        >
            <WowthingImage
                name={covenantMap[covenantId].icon}
                size={20}
                border={0}
            />
            {covenantMap[covenantId].name}
            <pre
                class="{getPercentClass((renown) / Constants.maxRenown * 100)}"
            >{@html leftPad(renown, 2)}</pre>
        </a>
    {/each}

    <a
        class="pad-left"
        href="#/characters/{params.slug1}/{params.slug2}/{params.slug3}/cypher-research"
        use:active
    >
        <WowthingImage
            name="currency/1979"
            size={20}
            border={0}
        />
        Cypher Research
    </a>

    <div class="end"></div>
</nav>

{#if params.slug4}
    {#if params.slug4 === 'cypher-research'}
        <GarrisonTree
            tree={garrisonTrees.cypherResearch}
            {character}
        />
    {:else}
        <Covenant
            covenantId={covenantSlugMap[params.slug4].id}
            {character}
        />
    {/if}
{/if}
