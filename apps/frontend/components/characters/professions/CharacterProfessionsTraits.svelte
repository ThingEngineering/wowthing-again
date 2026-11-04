<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import getPercentClass from '@/utils/get-percent-class';
    import type {
        StaticDataProfession,
        StaticDataSubProfession,
    } from '@/shared/stores/static/types';
    import type { CharacterProps, ParamsSlugsProps } from '@/types/props';

    import Node from './CharacterProfessionsTraitsNode.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';

    type Props = CharacterProps &
        ParamsSlugsProps & {
            staticProfession: StaticDataProfession;
        };
    let { character, params, staticProfession }: Props = $props();

    let expansion = $derived(expansionSlugMap[params.slug5]);

    let [charTraits, subProfession]: [Record<number, number>, StaticDataSubProfession] =
        $derived.by(() => {
            const charProfession = character.professions[staticProfession.id];
            const retSubProfession = staticProfession.expansionSubProfession[expansion.id];
            if (!expansion || !charProfession || !subProfession.traitTrees) {
                return [undefined, undefined];
            } else {
                return [
                    charProfession.subProfessions?.[subProfession.id]?.traits,
                    retSubProfession,
                ];
            }
        });
</script>

<style lang="scss">
    .tree-wrapper {
        columns: 2;
        gap: 1rem;
    }
    table {
        border-bottom-width: 0;
        break-inside: avoid;
        margin-bottom: 1rem;
        overflow: hidden; /* Firefox fix */
        width: 100%;
    }
</style>

{#if subProfession}
    {@const stats =
        character.professions[staticProfession.id]?.subProfessionTraitStats[subProfession.id]}
    <div class="wrapper-column">
        <ProgressBar
            cls={`${getPercentClass(stats?.percent || 0)}-border`}
            title="Total Knowledge"
            have={stats?.have || 0}
            total={stats?.total || 0}
        />

        <div class="tree-wrapper">
            {#each subProfession.traitTrees as traitTree (traitTree.id)}
                <table class="table-striped border">
                    <tbody>
                        <Node indent={0} node={traitTree.firstNode} traits={charTraits} />
                    </tbody>
                </table>
            {/each}
        </div>
    </div>
{/if}
