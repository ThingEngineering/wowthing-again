<script lang="ts">
    import {dungeonMap} from '@/data/dungeon'
    import type {CharacterWeeklyProgress} from '@/types'
    import getMythicPlusVaultItemLevel from '@/utils/get-mythic-plus-vault-item-level'

    export let index: number
    export let progress: CharacterWeeklyProgress[]
    export let run: number[]

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
                dungeonName = run ? dungeonMap[run[0]].name : 'Unknown dungeon'
                keyLevel = prog.level
            }
            else {
                cls = 'vault-more'
                const more = prog.threshold - prog.progress
                dungeonName = `Do ${more} more key${more !== 1 ? 's' : ''}`
            }
        }
        else if (index < progress[2].progress) {
            dungeonName = run ? dungeonMap[run[0]].name : 'Unknown dungeon'
            keyLevel = run ? run[1] : 0
        }

        if (keyLevel > 0) {
            itemLevel = getMythicPlusVaultItemLevel(keyLevel)
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
        max-width: 2.1rem;
        text-align: right;
        white-space: nowrap;
    }
    .dungeon-name {
        max-width: 15rem;
        text-align: left;
        white-space: nowrap;
    }
    .item-level {
        max-width: 3rem;
        white-space: nowrap;
    }

    .do-some {
        width: 15rem;
        white-space: nowrap;
    }
</style>

{#if dungeonName}
    <tr class="{cls}">
        {#if keyLevel}
            <td class="key-level">{keyLevel}</td>
            <td class="dungeon-name">{dungeonName}</td>
            <td class="item-level">{itemLevel}</td>
        {:else if dungeonName}
            <td class="key-level">&nbsp;</td>
            <td class="dungeon-name">{dungeonName}</td>
            <td class="item-level"></td>
        {/if}
    </tr>
{/if}
