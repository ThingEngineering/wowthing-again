<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { taskMap } from '@/data/tasks'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let character: Character
    export let chores: [string, number][]
    export let taskName: string
</script>

<style lang="scss">
    .name {
        text-align: left;
    }
    .status {
        text-align: center;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{taskMap[taskName].name}</h5>
    <table class="table-striped">
        <tbody>
            {#each chores as [choreName, status]}
                <tr>
                    <td class="name">{choreName}</td>
                    <td class="status">
                        <IconifyIcon
                            extraClass="status-{['fail', 'shrug', 'success'][status]}"
                            icon={iconStrings[['starEmpty', 'starHalf', 'starFull'][status]]}
                        />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
