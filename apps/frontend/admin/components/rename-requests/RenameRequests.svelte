<script lang="ts">
    import { onMount } from 'svelte';

    import { renameRequestsStore } from './store';
    import { iconLibrary } from '@/shared/icons';
    import type { RenameRequest } from './types';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    let renameRequests: RenameRequest[];

    onMount(async () => (renameRequests = await renameRequestsStore.fetch()));

    async function approveRequest(userId: number) {
        const success = await renameRequestsStore.approve(userId);
        if (success) {
            renameRequests = renameRequests.filter((rr) => rr.id !== userId);
        }
    }
    async function declineRequest(userId: number) {
        const success = await renameRequestsStore.decline(userId);
        if (success) {
            renameRequests = renameRequests.filter((rr) => rr.id !== userId);
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
        --width: 6rem;

        text-align: right;
    }
    .name {
        --width: 20rem;
    }
    .action {
        --width: 1.5rem;

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
                <th class="id sized">ID</th>
                <th class="name sized">Username</th>
                <th class="name sized">Desired</th>
                <th class="action sized"></th>
                <th class="action sized"></th>
            </tr>
        </thead>
        <tbody>
            {#each renameRequests as renameRequest}
                <tr>
                    <td class="id sized">{renameRequest.id}</td>
                    <td class="name sized">{renameRequest.userName}</td>
                    <td class="name sized" class:status-fail={renameRequest.inUse}
                        >{renameRequest.desiredAccountName}</td
                    >
                    <td class="action sized status-success">
                        {#if !renameRequest.inUse}
                            <IconifyIcon
                                icon={iconLibrary.mdiCheck}
                                tooltip={'Approve request'}
                                on:click={async () => await approveRequest(renameRequest.id)}
                            />
                        {/if}
                    </td>
                    <td class="action sized status-fail">
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
