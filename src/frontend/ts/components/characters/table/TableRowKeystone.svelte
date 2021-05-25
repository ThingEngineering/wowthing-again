<script lang="ts">
    import {getContext} from 'svelte'

    import {dungeonMap} from '../../../data/dungeon'
    import type {Character, Dungeon} from '../../../types'
    import getMythicPlusRunQuality from '../../../utils/get-mythic-plus-run-quality'

    import TableIcon from '../../common/TableIcon.svelte'
    import WowthingImage from '../../images/sources/WowthingImage.svelte'
    import TableRowVault from './TableRowVault.svelte'

    const character: Character = getContext('character')

    let dungeon: Dungeon = undefined
    $: {
        if (character.weekly?.keystoneDungeon) {
            dungeon = dungeonMap[character.weekly.keystoneDungeon]
        }
    }
</script>

<style lang="scss">
    .level {
        text-align: right;
        padding-left: 0.1rem;
        padding-right: 0.3rem;
        width: 1.6rem;
    }
    .dungeon {
        padding-right: 0.7rem;
    }
</style>

{#if dungeon}
    <TableIcon>
        <WowthingImage name="{dungeon.Icon}" size={20} border={1} />
    </TableIcon>
    <td class="level { getMythicPlusRunQuality(character.weekly.keystoneLevel) }">{ character.weekly.keystoneLevel }</td>
    <td class="dungeon">{ dungeon.Abbreviation }</td>
    {#key character}
        <TableRowVault />
    {/key}
{:else}
    <td colspan="3"></td>
{/if}
