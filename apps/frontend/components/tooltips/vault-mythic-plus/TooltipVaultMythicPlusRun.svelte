<script lang="ts">
    import { dungeonMap } from '@/data/dungeon'
    import { getVaultItemLevel, getVaultQualityByItemLevel } from '@/utils/mythic-plus'
    import type { CharacterMythicPlusAddonRun, CharacterWeeklyProgress } from '@/types'

    export let index: number
    export let progress: CharacterWeeklyProgress[]
    export let run: CharacterMythicPlusAddonRun

    let cls: string
    let dungeonName: string
    let itemLevel: number
    let keyLevel: number

    $: {
        let prog: CharacterWeeklyProgress
        for (const thing of progress) {
            if (index === (thing.threshold - 1)) {
                prog = thing
                break
            }
        }

        if (prog) {
            if (prog.level > 0) {
                cls = 'vault-reward'
                dungeonName = run ? dungeonMap[run.mapId].name : 'Unknown dungeon'
                keyLevel = prog.level
            }
            else {
                cls = 'vault-more'
                const more = prog.threshold - prog.progress
                dungeonName = `Do ${more} more key${more !== 1 ? 's' : ''}`
            }
        }
        else if (index < progress[2].progress) {
            dungeonName = run ? dungeonMap[run.mapId].name : 'Unknown dungeon'
            keyLevel = run ? run.level : 0
        }

        if (keyLevel > 0) {
            itemLevel = getVaultItemLevel(keyLevel)[0]
        }
    }
</script>


<style lang="scss">
    tr {
        &.vault-more {
            color: #00ccff;
        }
        &.vault-reward {
            color: #1eff00;
        }
    }

    .key-level {
        min-width: 2.1rem;
        text-align: right;
        white-space: nowrap;
    }
    .dungeon-name {
        max-width: 10rem;
        min-width: 10rem;
        text-align: left;
        white-space: nowrap;
    }
    .item-level {
        max-width: 3rem;
        min-width: 3rem;
        white-space: nowrap;
    }
</style>

{#if dungeonName}
    <tr class="{cls}">
        {#if keyLevel}
            <td class="key-level">{keyLevel}</td>
            <td class="dungeon-name text-overflow">{dungeonName}</td>
            <td class="item-level quality{getVaultQualityByItemLevel(itemLevel)}">{itemLevel}</td>
        {:else if dungeonName}
            <td class="key-level">&nbsp;</td>
            <td class="dungeon-name">{dungeonName}</td>
            <td class="item-level"></td>
        {/if}
    </tr>
{/if}
