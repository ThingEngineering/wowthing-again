<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { taskMap } from '@/data/tasks'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let character: Character
    export let chores: [string, number, string?][]
    export let taskName: string
</script>

<style lang="scss">
    .name {
        text-align: left;
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
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{taskMap[taskName].name}</h5>
    <table class="table-striped">
        <tbody>
            {#each chores as [choreName, status, errorText]}
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
                    <td class="error-text">{errorText}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
