<script lang="ts">
    import { Constants } from '@/data/constants'
    import {
        getRunQuality,
        getRunQualityAffix,
        getWeeklyAffixes,
        isKeystoneUpgrade
    } from '@/utils/mythic-plus'
    import type { Character, CharacterMythicPlusAddonMapAffix, Dungeon, MythicPlusAffix } from '@/types'

    import AffixIcon from '@/components/images/AffixIcon.svelte'

    export let character: Character
    export let dungeon: Dungeon

    let affixes: MythicPlusAffix[]
    let isUpgrade = false
    let mapInfo: CharacterMythicPlusAddonMapAffix
    let maxScoreIncrease = 0
    let minScoreIncrease = 0
    let plus = ''
    $: {
        affixes = getWeeklyAffixes(character)
        if (affixes && dungeon) {
            ({isUpgrade, mapInfo, minScoreIncrease, maxScoreIncrease} = isKeystoneUpgrade(character, Constants.mythicPlusSeason, dungeon.id))
            
            const timedData = dungeon.getTimed(mapInfo?.durationSec * 1000)
            plus = '+'.repeat(timedData?.plus || 0)
        }
    }
</script>

<style lang="scss">
    .info {
        p {
            margin: 0.4rem 0;
        }
    }
    .affixes {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.5rem 0.5rem;

        & :global(img:nth-child(n+2)) {
            margin-left: 5px;
        }
    }
    .status-success {
        word-spacing: -0.4ch;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - M+ Keystone</h4>
    <table class="table-striped">
        <tbody>
            {#if dungeon && character.weekly?.keystoneLevel}
                <tr>
                    <td>
                        {dungeon.name}
                        <span class="{getRunQuality(character.weekly.keystoneLevel)}">{character.weekly.keystoneLevel}</span>
                    </td>
                </tr>

                <tr>
                    <td class="info">
                        {#if mapInfo}
                            <p>
                                Previous best {affixes[0].name} key:
                                <span class="{getRunQualityAffix(mapInfo)}">{mapInfo.level}{plus}</span>
                            </p>
                            {#if isUpgrade}
                                {#if minScoreIncrease > 0}
                                    <p>This key would be a score upgrade!</p>
                                {:else}
                                    <p>This key could be a score upgrade.</p>
                                {/if}
                                <p>Expected score increase is <span class="status-success">{minScoreIncrease} - {maxScoreIncrease}</span></p>
                            {/if}
                        {:else}
                            <p>No {affixes[0].name} score!</p>
                            <p>Expected score increase is <span class="status-success">{minScoreIncrease} - {maxScoreIncrease}</span></p>
                        {/if}
                    </td>
                </tr>
            {:else}
                <tr>
                    <td>This character has no keystone!</td>
                </tr>
            {/if}

            <tr>
                <td class="affixes">
                    {#each affixes as affix}
                        <AffixIcon {affix} /> {affix.name}
                    {/each}
                </td>
            </tr>
        </tbody>
    </table>
</div>
