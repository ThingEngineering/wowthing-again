<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'

    import { iconStrings } from '@/data/icons'
    import { taskMap } from '@/data/tasks'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

    type choreArray = [string, number, string?]

    export let character: Character
    export let chores: choreArray[]
    export let taskName: string

    let anyErrors: boolean
    let choreSets: Array<choreArray[]>
    $: {
        choreSets = []

        if (taskName === 'dfProfessionWeeklies') {
            choreSets.push(chores.slice(0, 1))

            const grouped = groupBy(chores.slice(1), (chore) => chore[0].split(' ')[0])
            const keys = Object.keys(grouped)
            keys.sort()
            for (const key of keys) {
                choreSets.push(grouped[key])
            }
        }
        else {
            choreSets.push(chores)
        }

        anyErrors = some(choreSets, (choreSet) => some(choreSet, ([,, errorText]) => !!errorText))
    }

    const getFixedText = function(text: string): string {
        text = text.replace(/\[\[tier\d\]\]/, ':starFull:')
        return text
    }
</script>

<style lang="scss">
    table {
        &:not(:last-child) {
            border-bottom: 1px solid $border-color;
        }

        + table {
            border-top: 1px solid $border-color;
            margin-top: 0.75rem;
        }
    }
    .name {
        direction: rtl; // not happy with this but ugh
        max-width: 14rem;
        min-width: 11rem;
        text-align: left;
        white-space: nowrap;
    }
    .status {
        //padding-left: 0;
        //padding-right: 0;
        text-align: center;
        width: 1rem;
    }
    .error-text {
        font-size: 0.95rem;
        text-align: left;
        width: 7rem;
    }
    .status-text {
        color: #ddd;
        font-size: 0.95rem;
        padding-left: 0.7rem;
        text-align: left;
    }
    .tier2 {
        :global(span[data-string="starFull"]) {
            color: rgb(215, 215, 215);
        }
    }
    .tier3 {
        :global(span[data-string="starFull"]) {
            color: rgb(255, 215, 0);
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{taskMap[taskName].name}</h5>

    {#each choreSets as choreSet}
        <table class="table-striped">
            <tbody>
                {#each choreSet as [choreName, status, statusText]}
                    <tr>
                        <td
                            class="name text-overflow"
                            class:status-shrug={status === 3}
                        >
                            {choreName}
                        </td>
                        <td class="status">
                            <IconifyIcon
                                extraClass="status-{['fail', 'shrug', 'success', 'fail'][status]}"
                                icon={iconStrings[['starEmpty', 'starHalf', 'starFull', 'lock'][status]]}
                            />
                        </td>
                        {#if anyErrors}
                            <td class="error-text">
                                {#if status === 3}
                                    {statusText}
                                {/if}
                            </td>
                        {/if}
                    </tr>

                    {#if status === 1 && statusText}
                        <tr>
                            <td
                                class="status-text"
                                class:tier2={statusText.includes('[[tier2]]')}
                                class:tier3={statusText.includes('[[tier3]]')}
                                colspan="3"
                            >
                                &ndash;
                                <ParsedText text={getFixedText(statusText)} />
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    {/each}
</div>
