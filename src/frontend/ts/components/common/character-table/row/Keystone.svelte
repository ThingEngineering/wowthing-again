<script lang="ts">
    import {getContext} from 'svelte'

    import {dungeonMap} from '@/data/dungeon'
    import type {Character, Dungeon} from '@/types'
    import getMythicPlusRunQuality from '@/utils/get-mythic-plus-run-quality'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    let dungeon: Dungeon = undefined
    $: {
        if (character.weekly?.keystoneDungeon) {
            dungeon = dungeonMap[character.weekly.keystoneDungeon]
        }
    }
</script>

<style lang="scss">
    @import 'scss/variables';

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
        padding-right: 0.7rem;
    }
</style>

{#if character.level >= 60 && dungeon}
    <TableIcon>
        <WowthingImage name="{dungeon.Icon}" size={20} border={1} />
    </TableIcon>
    <td class="level { getMythicPlusRunQuality(character.weekly.keystoneLevel) }">{ character.weekly.keystoneLevel }</td>
    <td class="dungeon">{ dungeon.Abbreviation }</td>
{:else}
    <td colspan="3"></td>
{/if}
