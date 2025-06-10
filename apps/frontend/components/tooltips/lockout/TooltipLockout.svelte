<script lang="ts">
    import { difficultyMap } from '@/data/difficulty';
    import { wowthingData } from '@/shared/stores/data';
    import type { StaticDataInstance } from '@/shared/stores/static/types';
    import type { Character, CharacterLockout, Difficulty } from '@/types';

    export let character: Character;
    export let instanceId = 0;
    export let lockout: CharacterLockout;

    let instance: StaticDataInstance;
    let difficulty: Difficulty;
    $: {
        instance = wowthingData.static.instanceById.get(lockout?.id || instanceId);
        difficulty = difficultyMap[lockout?.difficulty];
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
        {#if difficulty}
            <code>[{difficulty.shortName}]</code>
        {/if}
        {#if lockout}
            {lockout.defeatedBosses}/{lockout.maxBosses}
        {/if}
    </h5>
    <table class="table-tooltip-lockout table-striped">
        <tbody>
            {#each lockout?.bosses || [] as boss}
                <tr class:status-success={boss.dead} class:status-fail={!boss.dead}>
                    <td class="boss-name">{boss.name}</td>
                    <td>{boss.dead ? 'Dead' : 'Alive'}</td>
                </tr>
            {:else}
                <tr class="status-fail">
                    <td class="boss-name">No lockout!</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
