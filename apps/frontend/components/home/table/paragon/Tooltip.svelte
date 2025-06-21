<script lang="ts">
    import groupBy from 'lodash/groupBy';
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import { expansionMap } from '@/data/expansion';

    let { paragonQuests }: { paragonQuests: Record<number, number[]> } = $props();

    // [ expansion, [reputationId, characterIds][] ][]
    let grouped = $derived(
        sortBy(
            getNumberKeyedEntries(
                groupBy(
                    getNumberKeyedEntries(paragonQuests),
                    ([repId]) => wowthingData.static.reputationById.get(repId)?.expansion || 0
                )
            ).map(([expansion, reputations]) => [
                expansion,
                sortBy(
                    reputations,
                    ([repId]) => wowthingData.static.reputationById.get(repId)?.name || 'ZZZ'
                ),
            ]),
            ([expansion]) => expansion
        )
    );
</script>

<style lang="scss">
    h4:not(:first-child) {
        border-top: solid 1px var(--border-color);
    }
    td {
        text-align: left;
    }
    .reputation {
        --width: 6rem;
    }
    .characters {
        --width: 8rem;

        span + span {
            margin-left: 0.25rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    {#each grouped as [expansion, reputations] (expansion)}
        <h4>{expansion > 0 ? expansionMap[expansion].name : '???'}</h4>
        <table class="table table-striped">
            <tbody>
                {#each reputations as [reputationId, characterIds] (reputationId)}
                    {@const reputation = wowthingData.static.reputationById.get(reputationId)}
                    {@const characters = sortBy(
                        characterIds
                            .map((id) => userState.general.characterById[id])
                            .filter((char) => !!char),
                        (char) => char.name
                    )}
                    <tr class="sized">
                        <td class="reputation text-overflow">
                            {reputation?.name || `Reputation #${reputationId}`}
                        </td>
                        <td class="characters">
                            {#each characters as character (character.id)}
                                <span class="class-{character.classId}">{character.name}</span>
                            {/each}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/each}
</div>
