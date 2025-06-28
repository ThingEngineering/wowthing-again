<script lang="ts">
    import { Constants } from '@/data/constants';
    import { dungeonMap } from '@/data/dungeon';
    import { timeStore } from '@/shared/stores/time';
    import { getNextWeeklyReset } from '@/utils/get-next-reset';
    import { getRunQuality, isKeystoneUpgrade } from '@/utils/mythic-plus';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/mythic-plus-keystone/TooltipMythicPlusKeystone.svelte';

    let { character }: CharacterProps = $props();

    let dungeon = $derived.by(() => {
        if (character.weekly?.keystoneDungeon) {
            const resetTime = getNextWeeklyReset(
                character.weekly.keystoneScannedAt,
                character.realm.region
            );
            if (resetTime > $timeStore) {
                return dungeonMap[character.weekly.keystoneDungeon];
            }
        }
    });
    let isUpgrade = $derived.by(
        () => isKeystoneUpgrade(character, Constants.mythicPlusSeason, dungeon.id).isUpgrade
    );
</script>

<style lang="scss">
    td {
        @include cell-width($width-keystone, $paddingRight: 0.1rem);

        border-left: 1px solid var(--border-color);
    }
    span {
        display: inline-block;
    }
    .flex-wrapper {
        gap: 0.3rem;
        justify-content: flex-start;
    }
    .level {
        min-width: $width-keystone-level;
        width: $width-keystone-level;
        text-align: right;
    }
    .upgrade {
        color: #ff88ff;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    <td
        use:componentTooltip={{
            component: Tooltip,
            props: { character, dungeon },
        }}
    >
        {#if dungeon}
            <div class="flex-wrapper">
                <span class="level {getRunQuality(character.weekly.keystoneLevel)}"
                    >{character.weekly.keystoneLevel}</span
                >
                <span class="dungeon" class:upgrade={isUpgrade}>{dungeon.abbreviation}</span>
            </div>
        {/if}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
