<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { userStore } from '@/stores';
    import type { JournalDataInstance } from '@/types/data';

    export let instance: JournalDataInstance

    $: lockouts = $userStore.allLockouts.filter((lockout) => lockout.instanceId === instance.id);
</script>

<style lang="scss">
    .lockouts {
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    .lockout {
        display: flex;
        gap: 0.4rem;
    }
</style>

{#if lockouts}
    <div class="lockouts">
        {#each lockouts as lockout}
            <div class="lockout">
                <span>{lockout.difficulty.shortName}:</span>
                {#each sortBy(lockout.characters, (char) => char.name) as character}
                    <span class="class-{character.classId}">
                        {character.name}
                    </span>
                {/each}
            </div>
        {/each}
    </div>
{/if}
