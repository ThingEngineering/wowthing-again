<script lang="ts">
    import { Constants } from '@/data/constants'
    import { staticStore } from '@/shared/stores/static'
    import { leftPad } from '@/utils/formatting'
    import {
        getRunQuality,
        getRunQualityAffix,
        getWeeklyAffixes,
        isKeystoneUpgrade
    } from '@/utils/mythic-plus'
    import type { Character, CharacterMythicPlusAddonMapAffix, Dungeon } from '@/types'
    import type { StaticDataKeystoneAffix } from '@/shared/stores/static/types'

    import AffixIcon from '@/shared/components/images/AffixIcon.svelte'

    export let character: Character
    export let dungeon: Dungeon

    let affixes: StaticDataKeystoneAffix[]
    let isUpgrade = false
    let mapInfo: CharacterMythicPlusAddonMapAffix
    let mapInfoAlt: CharacterMythicPlusAddonMapAffix
    let mapInfos: [StaticDataKeystoneAffix, CharacterMythicPlusAddonMapAffix][]
    let maxScoreIncrease = 0
    let minScoreIncrease = 0
    $: {
        affixes = getWeeklyAffixes(character)
        if (affixes && dungeon) {
            ({
                isUpgrade,
                mapInfo,
                mapInfoAlt,
                minScoreIncrease,
                maxScoreIncrease
            } = isKeystoneUpgrade(character, Constants.mythicPlusSeason, dungeon.id))
        }

        mapInfos = []
        const otherAffix = $staticStore.keystoneAffixes[affixes[0].id === 9 ? 10 : 9]
        if (affixes[0].slug === 'fortified') {
            mapInfos.push([affixes[0], mapInfo])
            mapInfos.push([otherAffix, mapInfoAlt])
        } else {
            mapInfos.push([otherAffix, mapInfoAlt])
            mapInfos.push([affixes[0], mapInfo])
        }
    }

    const getPlus = (info: CharacterMythicPlusAddonMapAffix): string => {
        const timedData = dungeon.getTimed(info?.durationSec * 1000)
        return '+'.repeat(timedData?.plus || 0)
    }
</script>

<style lang="scss">
    code {
        background: transparent;
    }
    .info {
        .view {
            justify-content: center;
        }
        p {
            margin: 0.4rem 0;
        }
    }
    .best-text {
        text-align: right;
        width: 9rem;
    }
    .best-key {
        width: 2rem;
    }
    .best-plus {
        text-align: left;
        width: 2.2rem;
    }
    .affixes {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.5rem 0.5rem;

        & :global(img:nth-child(n+2)) {
            margin-left: 5px;
        }
    }
    .score-increase {
        word-spacing: -0.4ch;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - M+ Keystone</h4>
    <table class="table-striped">
        <tbody>
            {#if dungeon && character.weekly?.keystoneLevel}
                <tr>
                    <td colspan="2">
                        {dungeon.name}
                        <span class="{getRunQuality(character.weekly.keystoneLevel)}">
                            {character.weekly.keystoneLevel}
                        </span>
                    </td>
                </tr>

                <tr>
                    <td class="info">
                        {#each mapInfos as [affix, info]}
                            <div class="view">
                                {#if info}
                                    {@const level = leftPad(info.level, 2)}
                                    <div class="best-text" class:status-success={affix.id === affixes[0].id}>
                                        Best {affix.name} key:
                                    </div>
                                    <div class="best-key">
                                        <code class="{getRunQualityAffix(info)}">{@html level}</code>
                                    </div>
                                    <div class="best-plus">{getPlus(info)}</div>
                                {:else}
                                    <div class="best-text" class:status-success={affix.id === affixes[0].id}>
                                        No {affix.name} score!
                                    </div>
                                    <div class="best-key"></div>
                                    <div class="best-plus"></div>
                                {/if}
                            </div>
                        {/each}
                    </td>
                </tr>
                
                {#if isUpgrade}
                    <tr>
                        <td class="info" colspan="2">
                            {#if minScoreIncrease > 0}
                                <p>This key would be a score upgrade!</p>
                            {:else}
                                <p>This key could be a score upgrade.</p>
                            {/if}
                            <p>Expected score increase is <span class="score-increase status-success">{minScoreIncrease} - {maxScoreIncrease}</span></p>
                        </td>
                    </tr>
                {/if}
            {:else}
                <tr>
                    <td colspan="2">This character has no keystone!</td>
                </tr>
            {/if}

            <tr>
                <td class="affixes" colspan="2">
                    {#each affixes as affix}
                        <AffixIcon {affix} /> {affix.name}
                    {/each}
                </td>
            </tr>
        </tbody>
    </table>
</div>
