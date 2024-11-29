<script lang="ts">
    import { uiIcons } from '@/shared/icons'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { userQuestStore } from '@/stores'
    import type { Character } from '@/types'
    import type { UserQuestData, UserQuestDataCharacterProgress } from '@/types/data'
    import type { ManualDataProgressGroup } from '@/types/data/manual'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import Tooltip from '@/components/tooltips/progress-raid-skip/TooltipProgressRaidSkip.svelte'

    export let character: Character
    export let group: ManualDataProgressGroup

    const perCharacter: string[] = [
        'CN',
        'SoD',
        'SFO',
        'ADH',
        'ASC',
        'VoI',
    ];

    let progresses: {cls: string, completed: boolean, difficulty: string, progressQuest: UserQuestDataCharacterProgress}[]
    $: {
        progresses = []
        for (const difficulty of ['mythic', 'heroic', 'normal']) {
            const questKey = group.data[difficulty][0].name
            let progressQuest: UserQuestDataCharacterProgress

            progressQuest = $userQuestStore.characters[character.id]?.progressQuests?.[questKey]

            if (progressQuest?.status !== 2 && !perCharacter.includes(group.iconText)) {
                for (const character of Object.values($userQuestStore.characters)) {
                    const maybeQuest = character.progressQuests?.[questKey];
                    if (maybeQuest?.status === 2) {
                        progressQuest = maybeQuest;
                        break;
                    }
                }
            }

            let cls: string
            if (progresses.length > 0 && progresses[progresses.length - 1].completed) {
                cls = 'status-success'
            }
            else if (progressQuest === undefined) {
                cls = 'status-fail'
            }
            else if (progressQuest.status === 2) {
                cls = 'status-success'
            }
            else {
                cls = 'status-shrug'
            }

            progresses.push({
                cls,
                completed: cls === 'status-success',
                difficulty,
                progressQuest,
            })
        }

        progresses.reverse()
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        padding-bottom: 0;
        padding-top: 0;
    }
    .flex-wrapper {
        :global(svg) {
            margin-top: -2px;
        }

        div {
            text-align: center;
            width: 2.4rem;
            word-spacing: -0.2ch;
        }
    }
</style>

<td>
    <div
        class="flex-wrapper"
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                group,
                progresses,
            }
        }}
    >
        {#each progresses as progress}
            <div class="{progress.cls}">
                {#if progress.completed}
                    <IconifyIcon
                        icon={uiIcons.yes}
                    />
                {:else if progress.progressQuest === undefined}
                    <IconifyIcon
                        icon={uiIcons.no}
                    />
                {:else}
                    {progress.progressQuest.objectives?.[0]?.have ?? 0}
                    /
                    {progress.progressQuest.objectives?.[0]?.need ?? 4}
                {/if}
            </div>
        {/each}
    </div>
</td>
