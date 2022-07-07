<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { userQuestStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress } from '@/types/data'
    import type { StaticDataProgressGroup } from '@/types/data/static'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Tooltip from '@/components/tooltips/progress-raid-skip/TooltipProgressRaidSkip.svelte'

    export let character: Character
    export let group: StaticDataProgressGroup

    let progresses: {cls: string, completed: boolean, difficulty: string, progressQuest: UserQuestDataCharacterProgress}[]
    $: {
        progresses = []
        for (const difficulty of ['mythic', 'heroic', 'normal']) {
            const questKey = group.data[difficulty][0].name
            const progressQuest = $userQuestStore.data.characters[character.id]?.progressQuests?.[questKey]

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
        use:tippyComponent={{
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
                        icon={iconStrings.yes}
                    />
                {:else if progress.progressQuest === undefined}
                    <IconifyIcon
                        icon={iconStrings.no}
                    />
                {:else}
                    {progress.progressQuest.have} / {progress.progressQuest.need}
                {/if}
            </div>
        {/each}
    </div>
</td>
