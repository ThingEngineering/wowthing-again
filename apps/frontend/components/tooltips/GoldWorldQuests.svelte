<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { zoneMap } from '@/user-home/components/world-quests/data';
    import { toNiceDuration } from '@/utils/formatting';
    import type { Character } from '@/types';

    export let active: [number, number, number, number][];
    export let character: Character;
</script>

<style lang="scss">
    table {
        --padding: 2;
    }
    .expires {
        --width: 2.2rem;
    }
    .zone {
        --width: 5rem;

        text-align: left;
    }
    .quest {
        --width: 10rem;

        text-align: left;
    }
    .gold {
        --width: 1.5rem;

        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Active Gold WQs</h5>
    <table class="table table-striped">
        <tbody>
            {#each active as [zoneId, questId, expires, gold]}
                <tr>
                    <td class="expires sized">
                        <code class={expires < 86400000 ? 'status-warn' : 'status-shrug'}>
                            {@html toNiceDuration(expires)}
                        </code>
                    </td>
                    <td class="zone sized b-l text-overflow"
                        >{zoneMap[zoneId]?.name || `Zone #${zoneId}`}</td
                    >
                    <td class="quest sized b-l text-overflow">
                        {wowthingData.static.questNameById.get(questId) || `Quest #${questId}`}
                    </td>
                    <td class="gold sized b-l">{gold}g</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
