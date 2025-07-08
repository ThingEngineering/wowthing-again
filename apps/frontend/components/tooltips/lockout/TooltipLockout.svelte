<script lang="ts">
    import { difficultyMap } from '@/data/difficulty';
    import { wowthingData } from '@/shared/stores/data';
    import type { CharacterLockout } from '@/types';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & { instanceId?: number; lockout: CharacterLockout };
    let { character, instanceId = 0, lockout }: Props = $props();

    let instance = $derived(wowthingData.static.instanceById.get(instanceId || lockout?.id));
    let difficulty = $derived(difficultyMap[lockout?.difficulty]);
</script>

<style lang="scss">
    code {
        background: inherit;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        {instance?.name || (instanceId ? `Instance #${instanceId}` : 'Unknown Instance')}
        {#if difficulty}
            <code>[{difficulty.shortName}]</code>
        {/if}
        {#if lockout}
            {lockout.defeatedBosses}/{lockout.maxBosses}
        {/if}
    </h5>
    <table class="table-tooltip-lockout table-striped">
        <tbody>
            {#each lockout?.bosses || [] as boss (boss.name)}
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
