<script lang="ts">
    import { Constants } from '@/data/constants';
    import { characterNameTooltipChoices } from '@/data/settings';
    import { settingsStore } from '@/shared/stores/settings'
    import { timeStore } from '@/shared/stores/time'
    import { userStore } from '@/stores'
    import { toNiceDuration } from '@/utils/formatting'
    import { getCharacterRested } from '@/utils/get-character-rested'
    import getRaiderIoColor from '@/utils/get-raider-io-color'
    import type { Character } from '@/types'

    import CurrentLocation from '@/components/home/table/row/HomeTableRowCurrentLocation.svelte'
    import ItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import Keystone from '@/components/character-table/row/Keystone.svelte'
    import LastSeenAddon from '@/components/character-table/row/LastSeenAddon.svelte';

    export let character: Character

    $: enabledChoices = characterNameTooltipChoices
        .filter((choice) => !$settingsStore.characters.disabledNameTooltip.includes(choice.id));
</script>

<style lang="scss">
    td:first-child {
        @include cell-width(6rem, $paddingRight: 0.5rem);

        border-right: 1px solid $border-color;
        text-align: right;
    }
    table {
        :global(td:last-child) {
            @include cell-width(15rem, $maxWidth: 20rem, $paddingLeft: 0.5rem);

            text-align: left !important;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - {character.realm.name}</h4>

    {#if character.guildId && !$settingsStore.characters.disabledNameTooltip.includes('guild')}
        {@const guild = $userStore.guildMap[character.guildId]}
        <h5>
            {#if guild}
                &lt;{guild.name || 'Unknown Guild'}&gt;
                {guild.realm.name}
            {:else}
                &lt;Unknown Guild #{character.guildId}&gt;
            {/if}
        </h5>
    {/if}

    <table class="table-striped">
        <tbody>
            {#each enabledChoices as { id }}
                {#if id === 'currentLocation'}
                    <tr>
                        <td>Current loc.</td>
                        <CurrentLocation {character} />
                    </tr>

                {:else if id === 'hearthLocation'}
                    <tr>
                        <td>Hearth loc.</td>
                        <td>{character.hearthLocation || '---'}</td>
                    </tr>

                {:else if id === 'itemLevel'}
                    <tr>
                        <td>Item level</td>
                        <ItemLevel {character} />
                    </tr>

                {:else if id === 'last'}
                    <tr>
                        <td>Addon seen</td>
                        <LastSeenAddon {character} />
                    </tr>
                    <tr>
                        <td>API update</td>
                        <td>
                            {#if character.lastApiUpdate}
                                {@const diff = $timeStore.diff(character.lastApiUpdate).toMillis()}
                                <code>{@html toNiceDuration(diff)}</code> ago
                            {:else}
                                ???
                            {/if}
                        </td>
                    </tr>

                {:else if id === 'mythicPlusKeystone'}
                    <tr>
                        <td>M+ key</td>
                        <Keystone {character} />
                    </tr>

                {:else if id === 'mythicPlusScore'}
                    {@const scores = character.raiderIo?.[Constants.mythicPlusSeason]}
                    {@const tiers = $userStore.raiderIoScoreTiers?.[Constants.mythicPlusSeason]}
                    {@const overallScore = character.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] || scores?.['all'] || 0}
                    <tr>
                        <td>M+ score</td>
                        <td style:color={getRaiderIoColor(tiers, overallScore)}>
                            {overallScore.toFixed(1)}
                        </td>
                    </tr>

                {:else if id === 'playedTime'}
                    <tr>
                        <td>Played time</td>
                        <td>
                            <code>{@html toNiceDuration(character.playedTotal * 1000).replace('&nbsp;', '')}</code>
                        </td>
                    </tr>

                {:else if id === 'restedXp' && character.level < Constants.characterMaxLevel}
                    {@const [rested, restedRemaining] = getCharacterRested($timeStore, character)}
                    <tr>
                        <td>Rested XP</td>
                        <td>
                            {rested}
                            {#if restedRemaining}
                                <span> | {@html restedRemaining}</span>
                            {/if}
                        </td>
                    </tr>

                {/if}
            {/each}
        </tbody>
    </table>
</div>
