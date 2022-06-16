<script lang="ts">
    import type {Character, Dungeon} from '@/types'
    import {Constants} from '@/data/constants'
    import {dungeonMap} from '@/data/dungeon'
    import { timeStore } from '@/stores'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'
    import {getNextWeeklyReset} from '@/utils/get-next-reset'
    import { isKeystoneUpgrade } from '@/utils/mythic-plus'
    import { tippyComponent } from '@/utils/tippy'

    import Tooltip from '@/components/tooltips/mythic-plus-keystone/TooltipMythicPlusKeystone.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

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
    .dungeon {
    }
    .upgrade {
        color: #ff88ff;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    <td
        use:tippyComponent={{
            component: Tooltip,
            props: {character, dungeon}
        }}
    >
        {#if dungeon}
            <div class="flex-wrapper">
                <span
                    class="level {getMythicPlusRunQuality(character.weekly.keystoneLevel)}"
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
