<script lang="ts">
    import type { DateTime } from 'luxon'

    import { iconStrings } from '@/data/icons'
    import { timeStore } from '@/stores'
    import { toNiceDuration } from '@/utils/to-nice'
    import type { Character } from '@/types'
    import type { GlobalDailyQuest } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let callings: [GlobalDailyQuest, boolean][]
    export let character: Character
    export let resets: DateTime[]

    let remaining: string[]
    $: {
        remaining = resets.map((reset) => toNiceDuration(reset.diff($timeStore).toMillis()))
    }
</script>

<style lang="scss">
    .status {
        padding-right: 0;
        width: 2rem;
    }
    .name {
        text-align: left;
    }
    .remaining {
        text-align: right;
    }
    .description {
        max-width: 20rem;
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - Callings</h4>
    <table class="table-striped">
        <tbody>
            {#each callings as [daily, status], callingIndex}
                <tr>
                    <td class="status">
                        <IconifyIcon
                            extraClass="{status ? 'status-success' : 'status-fail'}"
                            icon={status ? iconStrings.yes : iconStrings.no}
                            scale="0.91"
                        />
                    </td>
                    {#if daily}
                        <td class="name quality{daily.quality}">{daily.name}</td>
                    {:else}
                        <td class="name">Unknown quest</td>
                    {/if}
                    <td class="remaining">
                        <code>{@html remaining[callingIndex]}</code>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="description" colspan="2">{daily?.description ?? '???'}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
