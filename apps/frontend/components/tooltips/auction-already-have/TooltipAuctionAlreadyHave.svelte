<script lang="ts">
    import { iconLibrary, itemLocationIcons } from '@/shared/icons'
    import type { HasNameAndRealm, UserItem } from '@/types/shared'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'

    export let hasItems: [HasNameAndRealm, UserItem[]][]
</script>

<style lang="scss">
    table {
        --padding: 2;

        width: auto;
    }
    td {
        text-align: left;
        white-space: nowrap;
    }
    .location {
        @include cell-width(1.1rem);

        :global(svg) {
            margin-top: -4px;
        }
    }
    .bag {
        @include cell-width(2rem, $maxWidth: 5rem);
    }
    .slot {
        @include cell-width(3rem, $maxWidth: 6rem);
    }
    .character-name {
        @include cell-width(4rem, $maxWidth: 15rem);
    }
    .realm-name {
        @include cell-width(4rem, $maxWidth: 12rem);
    }
</style>

<div class="wowthing-tooltip">
    <h4>Existing Items</h4>
    <table class="table table-striped">
        <tbody>
            {#each hasItems as [owner, items]}
                {#each items as item}
                    <tr>
                        <td class="location drop-shadow">
                            <IconifyIcon
                                icon={iconLibrary[itemLocationIcons[item.location]]}
                                scale="0.9"
                            />
                        </td>
                        <td class="bag">{item.containerName}</td>
                        <td class="slot">Slot {item.slot}</td>
                        <td class="character-name">{owner.name}</td>
                        <td class="realm-name">{owner.realm.name}</td>
                    </tr>
                {/each}
            {/each}
        </tbody>
    </table>
</div>
