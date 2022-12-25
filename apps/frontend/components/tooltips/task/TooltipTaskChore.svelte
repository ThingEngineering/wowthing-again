<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { taskMap } from '@/data/tasks'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

    export let character: Character
    export let chores: [string, number, string?][]
    export let taskName: string

    const getFixedText = function(text: string): string {
        text = text.replace(/\[\[tier\d\]\]/, ':starFull:')
        return text
    }
</script>

<style lang="scss">
    .name {
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
    <table class="table-striped">
        <tbody>
            {#each chores as [choreName, status, statusText]}
                <tr>
                    <td
                        class="name"
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
                    <td class="error-text">
                        {#if status === 3}
                            {statusText}
                        {/if}
                    </td>
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
</div>
