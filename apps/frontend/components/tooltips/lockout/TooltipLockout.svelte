<script lang="ts">
    import { difficultyMap } from '@/data/difficulty'
    import { staticStore } from '@/shared/stores/static'
    import type { Character, CharacterLockout, Difficulty } from '@/types'
    import type { StaticDataInstance } from '@/shared/stores/static/types'

    export let character: Character
    export let lockout: CharacterLockout

    let instance: StaticDataInstance
    let difficulty: Difficulty
    $: {
        instance = $staticStore.instances[lockout.id]
        difficulty = difficultyMap[lockout.difficulty]
    }
</script>

<style lang="scss">
    code {
        background: inherit;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        {instance.name}
        <code>[{difficulty.shortName}]</code>
        {lockout.defeatedBosses}/{lockout.maxBosses}
    </h5>
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
