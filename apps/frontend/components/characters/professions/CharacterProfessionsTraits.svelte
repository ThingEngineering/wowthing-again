<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion'
    import type { Character, Expansion, MultiSlugParams } from '@/types'
    import type { StaticDataProfession, StaticDataSubProfession, StaticDataSubProfessionTraitNode } from '@/stores/static/types'

    import Node from './CharacterProfessionsTraitsNode.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let character: Character
    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession

    let charTraits: Record<number, number>
    let expansion: Expansion
    let subProfession: StaticDataSubProfession
    let totalHave: number
    let totalPoints: number
    $: {
        expansion = expansionSlugMap[params.slug5]
        const charProfession = character.professions[staticProfession.id]
        subProfession = staticProfession.subProfessions[expansion.id]
        if (!expansion || !charProfession || !subProfession.traitTrees) {
            break $
        }

        charTraits = character.professionTraits?.[subProfession.id] || {}

        totalHave = 0
        totalPoints = 0
        for (const traitTree of subProfession.traitTrees) {
            recurse(traitTree.firstNode)
        }
    }

    const recurse = (node: StaticDataSubProfessionTraitNode) => {
        totalHave += ((charTraits[node.nodeId] || 1) - 1)
        totalPoints += node.rankMax
        
        for (const child of (node.children || [])) {
            recurse(child)
        }
    }
</script>

<style lang="scss">
    .tree-wrapper {
        columns: 2;
        gap: 1rem;
    }
    table {
        break-inside: avoid;
        margin-bottom: 1rem;
        overflow: hidden; /* Firefox fix */
        width: 25rem;
    }
</style>

{#if subProfession}
    <div class="wrapper-column">
        <ProgressBar
            title="Total Knowledge"
            have={totalHave}
            total={totalPoints}
        />

        <div class="tree-wrapper">
            {#each subProfession.traitTrees as traitTree}
                    <table class="table-striped border">
                        <tbody>
                            <Node
                                indent={0}
                                node={traitTree.firstNode}
                                traits={charTraits}
                            />
                        </tbody>
                    </table>
            {/each}
        </div>
    </div>
{/if}
