<script lang="ts">
    import { itemLevelQuality } from '@/data/item-level-quality';
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
            {#each itemLevelQuality as [itemLevel, quality] (quality)}
                <tr>
                    <td class="quality{quality}">{itemLevel}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
