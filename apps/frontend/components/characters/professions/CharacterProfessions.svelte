<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { getCharacterProfessions, type ProfessionData } from '@/utils/get-character-professions'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { Character, MultiSlugParams } from '@/types'

    export let character: Character
    export let params: MultiSlugParams

    import Profession from './CharacterProfessionsProfession.svelte'
    import Sidebar from './CharacterProfessionsSidebar.svelte'
    import SubnavLinks from './CharacterProfessionsSubnavLinks.svelte'

    let primaryProfessions: ProfessionData[]
    let secondaryProfessions: ProfessionData[]
    $: {
        primaryProfessions = getCharacterProfessions(character, 0)
        secondaryProfessions = getCharacterProfessions(character, 1)
            .filter((prof) => prof[0].slug !== 'archaeology')
    }

    afterUpdate(() => {
        getSavedRoute(
            `characters/${params.slug1}/${params.slug2}/${params.slug3}`,
            params.slug4,
            null,
            'character-professions-subnav'
        )

        if (params.slug4) {
            getSavedRoute(
                `characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`,
                params.slug5,
                null,
                'character-professions-sidebar',
                true
            )
        }
    })
</script>

<style lang="scss">
    nav {
        border: 1px solid $border-color;
    }
    .profession-links {
        display: flex;

        + .profession-links {
            border-left: 1px solid $border-color;
            margin-left: 1rem;
        }
    }
    .professions {
        align-items: start;
        display: flex;
        margin-left: calc(-1rem - 1px);
    }
</style>

<nav class="characters-subnav" id="character-professions-subnav">
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
</nav>

{#if params.slug4}
    {#key `${params.slug1}--${params.slug2}--${params.slug3}--${params.slug4}`}
        <div class="professions">
            <Sidebar
                {params}
            />

            {#if params.slug5}
                <Profession
                    {character}
                    {params}
                />
            {/if}
        </div>
    {/key}
{/if}
