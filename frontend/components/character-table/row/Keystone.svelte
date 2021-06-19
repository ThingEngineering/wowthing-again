<script lang="ts">
    import { getContext } from 'svelte'

    import { Constants } from '@/data/constants'
    import { dungeonMap } from '@/data/dungeon'
    import type { Character, CharacterMythicPlusRun, Dungeon } from '@/types'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    let dungeon: Dungeon = undefined
    let upgrade = false
    $: {
        if (character.weekly?.keystoneDungeon) {
            dungeon = dungeonMap[character.weekly.keystoneDungeon]
            // FIXME set active season somewhere
            const run: CharacterMythicPlusRun | undefined =
                character.mythicPlus?.seasons[5]?.[dungeon.id]?.[0]
            if (
                run?.timed !== true ||
                (run?.timed === true &&
                    character.weekly.keystoneLevel > run.keystoneLevel)
            ) {
                upgrade = true
            }
        }
    }
</script>

<style lang="scss">
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
    <TableIcon>
        <WowthingImage name={dungeon.icon} size={20} border={1} />
    </TableIcon>
    <td class="level {getMythicPlusRunQuality(character.weekly.keystoneLevel)}"
        >{character.weekly.keystoneLevel}</td
    >
    <td class="dungeon" class:upgrade>
        {dungeon.abbreviation}
    </td>
{:else}
    <TableIcon />
    <td class="level">&nbsp;</td>
    <td class="dungeon">&nbsp;</td>
{/if}
