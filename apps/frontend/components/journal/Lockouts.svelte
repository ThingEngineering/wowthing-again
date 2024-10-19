<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { classOrderMap } from '@/data/character-class';
    import { uiIcons } from '@/shared/icons';
    import { userStore } from '@/stores';
    import type { JournalDataInstance } from '@/types/data';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    export let instance: JournalDataInstance

    $: instanceId = instance.id === 1278 ? 110001 : instance.id;
    $: lockouts = $userStore.allLockouts.filter((lockout) => lockout.instanceId === instanceId);
</script>

<style lang="scss">
    .lockouts {
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    .lockout {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
    }
    .character {
        --image-margin-top: -4px;

        white-space: nowrap;
    }
</style>

{#if lockouts}
    <div class="lockouts">
        {#each lockouts as lockout}
            <div class="lockout">
                <span>{lockout.difficulty.shortName}:</span>
                {#each sortBy(lockout.characters, ([char]) => classOrderMap[char.classId]) as [character, killed, total]}
                    {@const status = killed === 0 ? 0 : (killed < total ? 1 : 2)}
                    <span class="character class-{character.classId}">
                        <IconifyIcon
                            extraClass="status-{['fail', 'shrug', 'success'][status]}"
                            icon={[uiIcons.starEmpty, uiIcons.starHalf, uiIcons.starFull][status]}
                        />
                        {character.name}
                    </span>
                {/each}
            </div>
        {/each}
    </div>
{/if}
