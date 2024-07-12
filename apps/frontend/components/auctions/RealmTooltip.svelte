<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { userStore } from '@/stores';
    import type { StaticDataConnectedRealm } from '@/shared/stores/static/types';

    export let ageInMinutes: number = -1;
    export let connectedRealm: StaticDataConnectedRealm;
    export let price: number = -1

    $: characters = sortBy(
        $userStore.charactersByConnectedRealm[connectedRealm.id] || [],
        (char) => -char.gold
    );
    $: goldPrice = price / 10000;
    $: console.log(price, goldPrice);
</script>

<style lang="scss">
    .wowthing-tooltip {
        max-width: 25rem;
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
    <h4 class="text-overflow">
        {connectedRealm.realmNames.join(' / ')}
    </h4>
    {#if goldPrice > 0}
        <h5>
            {goldPrice.toLocaleString()} g
        </h5>
    {/if}

    <table class="table-striped">
        <tbody>
            {#each characters.slice(0, 3) as character}
                <tr>
                    {#if userStore.useAccountTags}
                        <td class="tag">
                            {character.account.tag}
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

