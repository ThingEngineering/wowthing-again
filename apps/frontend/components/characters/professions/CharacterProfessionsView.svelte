<script lang="ts">
    import find from 'lodash/find'
    import { tick } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import { staticStore } from '@/shared/stores/static'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataProfession } from '@/shared/stores/static/types'

    import Collectibles from './CharacterProfessionsCollectibles.svelte'
    import Equipment from '@/components/professions/ProfessionsEquipment.svelte'
    import Profession from './CharacterProfessionsProfession.svelte'
    import Sidebar from './CharacterProfessionsSidebar.svelte'
    import Traits from './CharacterProfessionsTraits.svelte'

    export let character: Character
    export let params: MultiSlugParams

    let knownRecipes: Set<number>
    let staticProfession: StaticDataProfession

    $: {
        knownRecipes = new Set<number>()

        staticProfession = find($staticStore.professions, (prof) => prof.slug === params.slug4)
        const charProfession = character.professions[staticProfession?.id]
        if (!staticProfession || !charProfession) {
            // Profession doesn't exist or character doesn't have it, redirect to the first one
            setTimeout(async () => {
                await tick();
                const link = document.getElementById('character-professions-subnav')
                    .querySelector('a:first-child')
                if (link) {
                    replace(link.getAttribute('href').replace('#', ''))
                }
            }, 1)
            break $
        }

        staticProfession.subProfessions.forEach((subProfession) => {
            charProfession[subProfession.id]
                ?.knownRecipes
                ?.forEach((value) => knownRecipes.add(value))
        })
    }
</script>

<style lang="scss">
    .professions {
        align-items: flex-start;
        display: flex;
        padding-bottom: 1rem;
        padding-right: 1rem;
    }
    .sidebar-after {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1.0rem 0;
    }
</style>

<div class="professions">
    <div class="professions-sidebar">
        <Sidebar
            {character}
            {params}
            {staticProfession}
        >
            <svelt:fragment slot="after">
                {#if staticProfession}
                    <div class="sidebar-after">
                        <Equipment
                            profession={staticProfession}
                            {character}
                        />

                        {#if params.slug5}
                            <Collectibles
                                expansionSlug={params.slug5}
                                staticProfession={staticProfession}
                                {character}
                            />
                        {/if}
                    </div>
                {/if}
            </svelt:fragment>
        </Sidebar>
    </div>

    {#if staticProfession}
        {#if params.slug6 === 'traits'}
            <Traits
                {character}
                {params}
                {staticProfession}
            />
        {:else if params.slug5}
            <Profession
                {character}
                {params}
                {staticProfession}
            />
        {/if}
    {/if}
</div>
