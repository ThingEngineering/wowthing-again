<script lang="ts">
    import { difficultyMap } from '@/data/difficulty';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import getRaidVaultItemLevel from '@/utils/get-raid-vault-item-level';
    import type { CharacterWeeklyProgress } from '@/types';

    let { progress }: { progress: CharacterWeeklyProgress } = $props();

    let [cls, dungeonName, itemLevel] = $derived.by(() => {
        if (progress.progress >= progress.threshold) {
            return [
                'vault-reward',
                difficultyMap[progress.level].name,
                getRaidVaultItemLevel(progress)[0],
            ];
        } else {
            const more = progress.threshold - progress.progress;
            return ['vault-more', `Kill ${more} more boss${more === 1 ? '' : 'es'}`, 0];
        }
    });
</script>

<tr class={cls}>
    <td>{progress.threshold}x</td>
    <td class="dungeon-name">{dungeonName}</td>
    {#if itemLevel}
        <td class="item-level quality{getItemLevelQuality(itemLevel)}">{itemLevel}</td>
    {:else}
        <td></td>
    {/if}
</tr>
