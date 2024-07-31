<script lang="ts">
    import { Constants } from '@/data/constants'
    import { settingsStore } from '@/shared/stores/settings'
    import { getCharacterLevel } from '@/utils/get-character-level'
    import { leftPad } from '@/utils/formatting'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/character-level/TooltipCharacterLevel.svelte'

    export let character: Character

    let fancyLevel: string
    $: {
        const levelData = getCharacterLevel(character)
        if (levelData.level < Constants.characterMaxLevel) {
            fancyLevel = `${leftPad(levelData.level, 2, '&nbsp;')}.${levelData.partial}`
        }
        else {
            fancyLevel = `${leftPad(levelData.level, 2, '&nbsp;')}&nbsp;&nbsp;`
        }
    }
</script>

<style lang="scss">
    code {
        line-height: 1;
        background: none;
    }
</style>

{#if $settingsStore.layout.showPartialLevel}
    <td
        class="level-partial"
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
            },
        }}
    >
        <code>{@html fancyLevel}</code>
    </td>
{:else}
    <td class="level">
        {Math.max(character.level, character.addonLevel)}
    </td>
{/if}
