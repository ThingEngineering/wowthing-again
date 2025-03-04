<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { classOrderMap } from '@/data/character-class';
    import { uiIcons } from '@/shared/icons';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import { leftPad } from '@/utils/formatting';
    import type { JournalDataInstance } from '@/types/data';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte';

    export let instance: JournalDataInstance;

    $: instanceId = instance.id === 1278 ? 110001 : instance.id;
    $: instanceLockouts = $userStore.allLockouts.filter(
        (lockout) => lockout.instanceId === instanceId,
    );
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

{#if instanceLockouts}
    <div class="lockouts">
        {#each instanceLockouts as instanceLockout}
            <div class="lockout">
                <span>{instanceLockout.difficulty.shortName}:</span>
                {#each sortBy( instanceLockout.characters, ([char]) => [leftPad(classOrderMap[char.classId], 2, '0'), char.name], ) as [character, lockout]}
                    {@const per = (lockout.defeatedBosses / lockout.maxBosses) * 100}
                    {@const status = per === 0 ? 0 : per < 100 ? 1 : 2}
                    <span
                        class="character class-{character.classId}"
                        use:componentTooltip={{
                            component: TooltipLockout,
                            props: { character, lockout },
                        }}
                    >
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
