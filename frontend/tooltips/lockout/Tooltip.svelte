<script lang="ts">
    import {difficultyMap} from '@/data/difficulty'
    import {extraInstanceMap} from '@/data/dungeon'
    import { data as staticData } from '@/stores/static'
    import type {Character, CharacterLockout, Difficulty, StaticDataInstance} from '@/types'

    export let character: Character
    export let lockout: CharacterLockout

    let instance: StaticDataInstance
    let difficulty: Difficulty
    $: {
        instance = $staticData.instances[lockout.id] || extraInstanceMap[lockout.id]
        difficulty = difficultyMap[lockout.difficulty]
        console.log(character, lockout, instance, difficulty)
    }
</script>

<div class="wowthing-tooltip">
    <h4 class="no-border">{instance.name}</h4>
    <h5>{difficulty.name} - {lockout.defeatedBosses}/{lockout.maxBosses}</h5>
    <table class="table-tooltip-lockout table-striped">
        <tbody>
            {#each lockout.bosses as boss}
                <tr class:status-success={boss.dead} class:status-fail={!boss.dead}>
                    <td class="boss-name">{boss.name}</td>
                    <td>{boss.dead ? 'Dead' : 'Alive'}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
