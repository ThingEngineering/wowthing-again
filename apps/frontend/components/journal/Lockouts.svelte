<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { classOrderMap } from '@/data/character-class';
    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty';
    import { uiIcons } from '@/shared/icons';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import { leftPad } from '@/utils/formatting';
    import type { Character, CharacterLockout } from '@/types';
    import type { JournalDataInstance } from '@/types/data';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte';

    let { instance }: { instance: JournalDataInstance } = $props();

    let byDifficulty = $derived.by(() => {
        const instanceId = instance.id === 1278 ? 110001 : instance.id;
        let ret: Record<number, [Character, CharacterLockout][]> = {};

        const allLockouts = userState.general.allLockouts.filter(
            (lockout) => lockout.instanceId === instanceId
        );
        for (const lockout of allLockouts) {
            for (const characterLockout of lockout.characters) {
                (ret[characterLockout[1].difficulty] ||= []).push(characterLockout);
            }
        }
        return ret;
    });
</script>

<style lang="scss">
    .lockouts {
        gap: 0.5rem;
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    .lockout {
        display: flex;
        flex-wrap: wrap;
        gap: 0.1rem 0.4rem;
    }
    .character {
        --image-margin-top: -4px;

        white-space: nowrap;
    }
</style>

{#if byDifficulty}
    <div class="lockouts wrapper-column">
        {#each journalDifficultyOrder as difficultyId}
            {@const lockouts = byDifficulty[difficultyId] || []}
            {#if lockouts.length > 0}
                {@const difficulty = difficultyMap[difficultyId]}
                <div class="lockout">
                    <span>{difficulty.shortName}:</span>
                    {#each sortBy( lockouts, ([char]) => [leftPad(classOrderMap[char.classId], 2, '0'), char.name] ) as [character, lockout]}
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
                                icon={[uiIcons.starEmpty, uiIcons.starHalf, uiIcons.starFull][
                                    status
                                ]}
                            />
                            {character.name}
                        </span>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
{/if}
