<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { getCharacterProfessions, type ProfessionData } from '@/utils/get-character-professions'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { Character, MultiSlugParams } from '@/types'

    export let character: Character
    export let params: MultiSlugParams

    import SubnavLinks from './CharacterProfessionsSubnavLinks.svelte'
    import Options from './CharacterProfessionsOptions.svelte'
    import View from './CharacterProfessionsView.svelte'

    let primaryProfessions: ProfessionData[]
    let secondaryProfessions: ProfessionData[]
    $: {
        primaryProfessions = getCharacterProfessions(character, 0)
        secondaryProfessions = getCharacterProfessions(character, 1)
            .filter((prof) => prof[0].slug === 'cooking')
    }

    afterUpdate(() => {
        getSavedRoute(
            `characters/${params.slug1}/${params.slug2}/${params.slug3}`,
            params.slug4,
            null,
            null,
            'character-professions-subnav'
        )

        if (params.slug4) {
            getSavedRoute(
                `characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`,
                params.slug5,
                params.slug6,
                null,
                'character-professions-sidebar',
                true
            )
        }
    })
</script>

<style lang="scss">
    .subnav {
        background: transparent;
        margin-bottom: 1rem;
        margin-top: 1rem;
        width: calc(100%);
    }
    .profession-links {
        display: flex;

        + .profession-links {
            border-left: 1px solid $border-color;
            margin-left: 1rem;
        }
    }
</style>

<nav class="subnav" id="character-professions-subnav">
    {#if primaryProfessions.length > 0}
        <div class="profession-links">
            <SubnavLinks
                {character}
                {params}
                professions={primaryProfessions}
            />
        </div>
    {/if}

    {#if secondaryProfessions.length > 0}
        <div class="profession-links">
            <SubnavLinks
                {character}
                {params}
                professions={secondaryProfessions}
            />
        </div>
    {/if}

    <Options />
</nav>

{#if params.slug4 && (primaryProfessions.length > 0 || secondaryProfessions.length > 0)}
    <View
        {character}
        {params}
    />
{/if}
