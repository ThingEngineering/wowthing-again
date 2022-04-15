<script lang="ts">
    import { replace } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { Constants } from '@/data/constants'
    import { covenantMap, covenantOrder, covenantSlugMap } from '@/data/covenant'
    import { garrisonTrees } from '@/data/garrison'
    import getPercentClass from '@/utils/get-percent-class'
    import leftPad from '@/utils/left-pad'
    import type { Character, MultiSlugParams } from '@/types'

    import Covenant from './CharactersShadowlandsCovenant.svelte'
    import GarrisonTree from '../garrison-tree/CharactersGarrisonTree.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

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
    nav {
        --image-margin-top: -2px;

        background: $highlight-background;
        border-radius: 0;
        display: flex;
        margin-bottom: 1rem;
        margin-left: calc(-1rem + -1px);
        margin-top: -0.5rem;
        padding: 0;
        width: calc(100% + 2rem + 2px);

        a {
            border-right: 1px solid $border-color;
            display: block;
            padding: 0.25rem 1rem 0.25rem 0.25rem;

            &.pad-left {
                padding-left: 0.5rem;
            }

            &:global(.active) {
                background: $active-background;
                color: #fff;
            }

            pre {
                display: inline;
                margin-left: 0.25rem;
            }
        }
    }
</style>

<nav class="border">
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
