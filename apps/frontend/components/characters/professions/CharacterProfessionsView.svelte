<script lang="ts">
    import find from 'lodash/find'

    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { staticStore } from '@/stores'
    import { UserCount } from '@/types'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataProfession, StaticDataProfessionCategory } from '@/types/data/static'

    import Equipment from '@/components/professions/ProfessionsEquipment.svelte'
    import Profession from './CharacterProfessionsProfession.svelte'
    import Sidebar from './CharacterProfessionsSidebar.svelte'

    export let character: Character
    export let params: MultiSlugParams

    let knownRecipes: Set<number>
    let staticProfession: StaticDataProfession
    let stats: Record<number, UserCount>

    $: {
        knownRecipes = new Set<number>()
        stats = {}

        staticProfession = find($staticStore.data.professions, (prof) => prof.slug === params.slug4)
        if (!staticProfession) {
            break $
        }

        const charProfession = character.professions[staticProfession.id]

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
        align-items: start;
        display: flex;
        margin-left: calc(-1rem - 1px);
    }
</style>

<div class="professions">
    <div class="professions-sidebar">
        <Sidebar
            {params}
            {stats}
        />

        {#if staticProfession}
            <Equipment
                profession={staticProfession}
                {character}
            />
        {/if}
    </div>

    {#if params.slug5 && staticProfession}
        <Profession
            {character}
            {params}
            {staticProfession}
        />
    {/if}
</div>
