<script lang="ts">
    import find from 'lodash/find'
    import { tick } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import { staticStore } from '@/stores'
    import { UserCount } from '@/types'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataProfession, StaticDataProfessionCategory } from '@/types/data/static'

    import Collectibles from './CharacterProfessionsCollectibles.svelte'
    import Equipment from '@/components/professions/ProfessionsEquipment.svelte'
    import Profession from './CharacterProfessionsProfession.svelte'
    import Sidebar from './CharacterProfessionsSidebar.svelte'
    import Traits from './CharacterProfessionsTraits.svelte'

    export let character: Character
    export let params: MultiSlugParams

    let knownRecipes: Set<number>
    let staticProfession: StaticDataProfession
    let stats: Record<number, UserCount>

    $: {
        knownRecipes = new Set<number>()
        stats = {}

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

        staticProfession.categories?.forEach((category, index) => {
            stats[index] = new UserCount()
            recurse(stats[index], category)
        })
    }

    const recurse = function(stats: UserCount, category: StaticDataProfessionCategory) {
        for (const ability of (category.abilities || [])) {
            if (ability.extraRanks) {
                stats.total += (ability.extraRanks.length + 1)

                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        stats.have += (rankIndex + 2)
                        break
                    }
                }
                if (knownRecipes.has(ability.id)) {
                    stats.have++
                }
            }
            else {
                stats.total++
                if (knownRecipes.has(ability.id)) {
                    stats.have++
                }
            }
        }

        for (const child of (category.children || [])) {
            recurse(stats, child)
        }
    }
</script>

<style lang="scss">
    .professions {
        align-items: flex-start;
        display: flex;
        margin-left: calc(-1rem - 1px);
    }
</style>

<div class="professions">
    <div class="professions-sidebar">
        <Sidebar
            {params}
            {staticProfession}
            {stats}
        >
            <svelt:fragment slot="after">
                {#if staticProfession}
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
                {/if}
            </svelt:fragment>
        </Sidebar>
    </div>

    {#if staticProfession}
        {#if params.slug6}
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
