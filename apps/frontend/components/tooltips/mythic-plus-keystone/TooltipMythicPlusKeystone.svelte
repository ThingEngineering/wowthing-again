<script lang="ts">
    import { Constants } from '@/data/constants'
    import getMythicPlusRunQuality, {getMythicPlusRunQualityAffix} from '@/utils/get-mythic-plus-run-quality'
    import { getWeeklyAffixes, isKeystoneUpgrade } from '@/utils/mythic-plus'
    import type { Character, CharacterMythicPlusAddonMapAffix, Dungeon, MythicPlusAffix } from '@/types'

    import AffixIcon from '@/components/images/AffixIcon.svelte'

    export let character: Character
    export let dungeon: Dungeon

    let affixes: MythicPlusAffix[]
    let isUpgrade = false
    let mapInfo: CharacterMythicPlusAddonMapAffix
    let scoreIncrease = 0
    $: {
        affixes = getWeeklyAffixes(character)
        if (affixes && dungeon) {
            ({isUpgrade, mapInfo, scoreIncrease} = isKeystoneUpgrade(character, Constants.mythicPlusSeason, dungeon.id))
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
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - M+ Keystone</h4>
    <table class="table-striped">
        <tbody>
            {#if dungeon && character.weekly?.keystoneLevel}
                <tr>
                    <td>
                        {dungeon.name}
                        <span class="{getMythicPlusRunQuality(character.weekly.keystoneLevel)}">{character.weekly.keystoneLevel}</span>
                    </td>
                </tr>

                <tr>
                    <td class="info">
                        {#if mapInfo}
                            <p>
                                Previous best {affixes[0].name} key:
                                <span class="{getMythicPlusRunQualityAffix(mapInfo)}">{mapInfo.level}</span>
                            </p>
                            {#if isUpgrade}
                                <p>Timing this key would be a score upgrade!</p>
                                <p>Expected score increase is <span class="status-success">{scoreIncrease}</span></p>
                            {/if}
                        {:else}
                            <p>This character has not run this dungeon on {affixes[0].name}</p>
                            <p>Expected score increase is <span class="status-success">{scoreIncrease}</span></p>
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
