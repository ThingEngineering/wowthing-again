<script lang="ts">
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import { getWorldTier } from '@/utils/vault/get-world-tier';
    import type { CharacterWeeklyProgress } from '@/types'

    export let progress: CharacterWeeklyProgress

    let cls: string
    let dungeonName: string
    let itemLevel: number

    $: {
        if (progress.progress >= progress.threshold) {
            cls = 'vault-reward'
            dungeonName = 'Activities/Delves'
            itemLevel = getWorldTier(progress.level)[0]
        }
        else {
            const more = progress.threshold - progress.progress
            cls = 'vault-more'
            dungeonName = `Do ${more} more ${more === 1 ? 'activity/delve' : 'activities/delves'}`
        }
    }
</script>

<tr class="{cls}">
    <td>{progress.threshold}x</td>
    <td class="dungeon-name">{dungeonName}</td>
    {#if itemLevel}
        <td class="item-level quality{getItemLevelQuality(itemLevel)}">{itemLevel}</td>
    {:else}
        <td></td>
    {/if}
</tr>
