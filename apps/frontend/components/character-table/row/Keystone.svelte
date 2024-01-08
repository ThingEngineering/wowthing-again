<script lang="ts">
    import { Constants } from '@/data/constants'
    import { dungeonMap } from '@/data/dungeon'
    import { timeStore } from '@/shared/stores/time'
    import { getNextWeeklyReset } from '@/utils/get-next-reset'
    import { getRunQuality, isKeystoneUpgrade } from '@/utils/mythic-plus'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character, Dungeon } from '@/types'

    import Tooltip from '@/components/tooltips/mythic-plus-keystone/TooltipMythicPlusKeystone.svelte'

    export let character: Character

    let dungeon: Dungeon = undefined
    let isUpgrade = false
    $: {
        if (character.weekly?.keystoneDungeon) {
            const resetTime = getNextWeeklyReset(character.weekly.keystoneScannedAt, character.realm.region)
            if (resetTime > $timeStore) {
                dungeon = dungeonMap[character.weekly.keystoneDungeon]
                ;({isUpgrade} = isKeystoneUpgrade(character, Constants.mythicPlusSeason, dungeon.id))
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-keystone, $paddingRight: 0.1rem);

        border-left: 1px solid $border-color;
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
            props: {character, dungeon}
        }}
    >
        {#if dungeon}
            <div class="flex-wrapper">
                <span
                    class="level {getRunQuality(character.weekly.keystoneLevel)}"
                >{character.weekly.keystoneLevel}</span>
                <span
                    class="dungeon"
                    class:upgrade={isUpgrade}
                >{dungeon.abbreviation}</span>
            </div>
        {/if}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
