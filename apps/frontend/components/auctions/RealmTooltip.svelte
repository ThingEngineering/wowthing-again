<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import type { StaticDataConnectedRealm } from '@/shared/stores/static/types';
    import CharacterTag from '@/user-home/components/character/CharacterTag.svelte';

    type Props = {
        ageInMinutes: number;
        connectedRealm: StaticDataConnectedRealm;
        price: number;
    };

    let { ageInMinutes = -1, connectedRealm, price = -1 }: Props = $props();

    let characters = $derived.by(() =>
        sortBy(
            userState.general.charactersByConnectedRealmId[connectedRealm.id] || [],
            (char) => -char.gold
        )
    );
    let goldPrice = $derived(price / 10000);
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
        background: var(--color-highlight-background);
        border-right: 1px solid var(--border-color);
    }
    .name {
        --width: 7rem;

        text-align: left;
    }
    .gold {
        --width: 6rem;

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
                    <CharacterTag {character} />
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
