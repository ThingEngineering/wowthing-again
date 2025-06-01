<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { userStore } from '@/stores';
    import type { StaticDataConnectedRealm } from '@/shared/stores/static/types';

    export let ageInMinutes: number = -1;
    export let connectedRealm: StaticDataConnectedRealm;
    export let price: number = -1;

    $: characters = sortBy(
        $userStore.charactersByConnectedRealm[connectedRealm.id] || [],
        (char) => -char.gold,
    );
    $: goldPrice = price / 10000;
</script>

<style lang="scss">
    .wowthing-tooltip {
        max-width: 25rem;
    }
    h4 {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
    }
    .realm {
        white-space: nowrap;
    }
    .realm-separator {
        color: #999 !important;
        padding-left: 0.2rem;
    }
    .tag {
        background: $highlight-background;
        border-right: 1px solid $border-color;
        padding-left: $width-padding;
        padding-right: $width-padding;
    }
    .name {
        @include cell-width(7rem);

        text-align: left;
    }
    .gold {
        @include cell-width(6rem);

        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>
        {#each connectedRealm.realmNames as realmName, nameIndex (realmName)}
            <span class="realm">
                {realmName}{#if nameIndex < connectedRealm.realmNames.length - 1}<span
                        class="realm-separator">/</span
                    >{/if}
            </span>
        {/each}
    </h4>
    {#if goldPrice > 0}
        <h5>
            {goldPrice.toLocaleString()} g
        </h5>
    {/if}

    <table class="table-striped">
        <tbody>
            {#each characters.slice(0, 3) as character (character.id)}
                <tr>
                    {#if settingsState.useAccountTags}
                        <td class="tag">
                            {settingsState.value.accounts?.[character.accountId]?.tag}
                        </td>
                    {/if}
                    <td class="name">
                        {character.name}
                    </td>
                    {#if connectedRealm.realmNames.length > 1}
                        <td class="realm">
                            {character.realm.name}
                        </td>
                    {/if}
                    <td
                        class="gold"
                        class:status-warn={goldPrice >= 0 && goldPrice > character.gold}
                    >
                        {character.gold.toLocaleString()} g
                    </td>
                </tr>
            {:else}
                <tr>
                    <td>No characters on this realm group!</td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if ageInMinutes >= 0}
        <div class="bottom">
            Data is {ageInMinutes} minute{ageInMinutes === 1 ? '' : 's'} old
            {#if ageInMinutes > 60}
                - refresh!
            {/if}
        </div>
    {/if}
</div>
