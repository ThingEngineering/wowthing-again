<script lang="ts">
    import { Constants } from '@/data/constants'
    import { dungeonMap } from '@/data/dungeon'
    import type { Character, CharacterMythicPlusRun, Dungeon } from '@/types'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let dungeon: Dungeon = undefined
    let tooltip: string
    let upgrade = false
    $: {
        if (character.weekly?.keystoneDungeon) {
            dungeon = dungeonMap[character.weekly.keystoneDungeon]
            // FIXME set active season somewhere
            const run: CharacterMythicPlusRun | undefined =
                character.mythicPlus?.seasons[Constants.mythicPlusSeason]?.[dungeon.id]?.[0]
            if (
                run?.timed !== true ||
                (run?.timed === true &&
                    character.weekly.keystoneLevel > run.keystoneLevel)
            ) {
                upgrade = true
            }

            tooltip = `${character.name} has a ${dungeon.name} +${character.weekly.keystoneLevel} key`
            if (upgrade) {
                tooltip += "<br><br>It's a Raider.IO score upgrade!"
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-flex();
    }
    span {
        display: inline-block;
    }
    .level {
        min-width: $table-width-key-level;
        width: $table-width-key-level;
        padding-left: 0.1rem;
        padding-right: 0.3rem;
        text-align: right;
    }
    .dungeon {
        min-width: $table-width-key-dungeon;
        width: $table-width-key-dungeon;
    }
    .upgrade {
        color: #ff88ff;
        //filter: drop-shadow(0 0 2px darken(#ff88ff, 30%));
    }
</style>

{#if character.level === Constants.characterMaxLevel && dungeon}
    <td use:tippy={{allowHTML: true, content: tooltip}}>
        <WowthingImage name={dungeon.icon} size={20} border={1} />
        <span class="level {getMythicPlusRunQuality(character.weekly.keystoneLevel)}">{character.weekly.keystoneLevel}</span>
        <span class="dungeon" class:upgrade>{dungeon.abbreviation}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
