<script lang="ts">
    import { itemLevelQuality, remixItemLevelQuality } from '@/data/item-level-quality';

    let { remix }: { remix?: boolean } = $props();

    let qualities = $derived(remix ? remixItemLevelQuality : itemLevelQuality);
</script>

<style lang="scss">
    .wowthing-tooltip {
        max-width: 7rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>Item Levels</h4>
    <table class="table table-striped">
        <tbody>
            {#each qualities as [itemLevel, quality] (quality)}
                <tr>
                    <td class="quality{quality}">{itemLevel}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
