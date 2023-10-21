<script lang="ts">
    import { onMount } from 'svelte'

    import { renameRequestsStore } from './store'
    import { iconLibrary } from '@/icons'
    import type { RenameRequest } from './types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    let renameRequests: RenameRequest[]

    onMount(async () => renameRequests = await renameRequestsStore.fetch())

    async function approveRequest(userId: number) {
        const success = await renameRequestsStore.approve(userId)
        if (success) {
            renameRequests = renameRequests.filter((rr) => rr.id !== userId)
        }
    }
    async function declineRequest(userId: number) {
        const success = await renameRequestsStore.decline(userId)
        if (success) {
            renameRequests = renameRequests.filter((rr) => rr.id !== userId)
        }
    }
</script>

<style lang="scss">
    table {
        --padding: 2;
    }
    td {
        white-space: nowrap;
    }
    .id {
        @include cell-width(4rem, $maxWidth: 6rem);

        text-align: right;
    }
    .name {
        @include cell-width(5rem, $maxWidth: 10rem);
    }
    .action {
        @include cell-width(1.5rem);

        text-align: center;

        :global(svg) {
            cursor: pointer;
        }
    }
</style>

{#if !renameRequests}
    L O A D I N G . . .
{:else}
    <table class="table table-striped">
        <thead>
            <tr>
                <th class="id">ID</th>
                <th class="name">Username</th>
                <th class="name">Desired</th>
                <th class="action"></th>
                <th class="action"></th>
            </tr>
        </thead>
        <tbody>
            {#each renameRequests as renameRequest}
                <tr>
                    <td class="id">{renameRequest.id}</td>
                    <td class="name">{renameRequest.userName}</td>
                    <td class="name">{renameRequest.desiredAccountName}</td>
                    <td class="action status-success">
                        <IconifyIcon
                            icon={iconLibrary.mdiCheck}
                            tooltip={'Approve request'}
                            on:click={async () => await approveRequest(renameRequest.id)}
                        />
                    </td>
                    <td class="action status-fail">
                        <IconifyIcon
                            icon={iconLibrary.mdiClose}
                            tooltip={'Decline request'}
                            on:click={async () => await declineRequest(renameRequest.id)}
                        />
                    </td>
                </tr>
            {:else}
                <tr>
                    <td class="name" colspan="5">Nobody to rename!</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
