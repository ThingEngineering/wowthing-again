<script lang="ts">
    import getItemLevelQuality from '@/utils/get-item-level-quality'
    import type { Character } from '@/types'

    export let character: Character
    export let tierPieces: [string, number][]
</script>

<style lang="scss">
    .slot {
        text-align: left;
    }
    .itemLevel {
        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Tier Set Pieces</h5>
    <table class="table-striped">
        <tbody>
            {#each tierPieces as [slot, itemLevel]}
                <tr>
                    <td class="slot">{slot}</td>
                    <td class="itemLevel quality{getItemLevelQuality(itemLevel)}">
                        {#if itemLevel > 0}
                            {itemLevel}
                        {:else}
                            &mdash;
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
