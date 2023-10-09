<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantFeatureOrder, covenantFeatureReputation } from '@/data/covenant'
    import { timeStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import { toNiceDuration, toNiceNumber } from '@/utils/formatting'
    import type { Character, CharacterShadowlandsCovenant, CharacterShadowlandsCovenantFeature } from '@/types'

    import EmberCourt from './CharactersShadowlandsEmberCourt.svelte'
    import PathOfAscension from './CharactersShadowlandsPathOfAscension.svelte'
    import ReputationBar from '@/components/common/ReputationBar.svelte'
    import Soulbind from './CharactersShadowlandsSoulbind.svelte'
    import Soulshapes from './CharactersShadowlandsSoulshapes.svelte'
    import Stitchyard from './CharactersShadowlandsStitchyard.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let covenantId: number

    let characterCovenant: CharacterShadowlandsCovenant
    let features: {
        feature: CharacterShadowlandsCovenantFeature,
        key: string,
        maxRank: number,
        name: string,
        rank: number,
        researching: string
    }[]

    let anima: number
    let progress: number
    let renown: number
    let souls: number

    $: {
        characterCovenant = character.shadowlands?.covenants?.[covenantId]
        
        anima = characterCovenant?.anima ?? 0
        renown = characterCovenant?.renown ?? 0
        souls = characterCovenant?.souls ?? 0
        progress = character.currencies?.[1889]?.quantity ?? 0

        features = []
        for (const [key, name, maxRank] of covenantFeatureOrder) {
            const characterFeature = characterCovenant?.[key as keyof CharacterShadowlandsCovenant] as CharacterShadowlandsCovenantFeature

            const featureData = {
                feature: characterFeature,
                key,
                maxRank,
                name,
                rank: 0,
                researching: '',
            }

            if (characterFeature) {
                featureData.name = characterFeature.name
                featureData.rank = characterFeature.rank

                if (characterFeature.researchEnds > 0) {
                    const ends: DateTime = DateTime.fromSeconds(characterFeature.researchEnds)
                    if (ends <= $timeStore) {
                        featureData.rank++
                    }
                    else {
                        const duration = toNiceDuration(ends.diff($timeStore).toMillis())
                        featureData.rank++
                        featureData.researching = `<code class="status-shrug">${duration}</code> until&nbsp;`
                    }
                }
            }

            features.push(featureData)
        }
    }
</script>

<style lang="scss">
    .covenant {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
    }
    .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 22rem;
    }
    .info {
        --bar-height: 1.5rem;

        width: 22rem;

        /*h2 {
            border-bottom: 1px solid $border-color;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            text-align: center;
        }*/

        :global(.progress-container) {
            margin: 0.25rem 0 0 0;
            width: 100%;
        }
    }
    .info-row {
        display: flex;
        justify-content: space-between;

        &.large {
            font-size: 1.1rem;
        }
    }
    .info-icon {
        --image-border-width: 2px;
        --image-margin-top: -4px;

        width: 24%;

        &:nth-child(4) {
            width: 28%;
        }
    }
    .info-research {
        font-style: italic;
        text-align: right;
    }
    .spacer {
        border-bottom: 1px solid $border-color;
        margin: 0.5rem 0;
    }
    .soulbinds {
        display: flex;
        gap: 1rem;
    }
</style>

<div class="covenant">
    <div class="left">
        <div class="info">
            <div class="info-row large info-icons">
                <div class="info-icon" use:tippy={`${renown} Renown`}>
                    <WowthingImage
                        name="spell/370359"
                        size={40}
                        border={2}
                    />
                    <span class="drop-shadow {getPercentClass(renown / Constants.maxRenown * 100)}">
                        {renown}
                    </span>
                </div>

                <div
                    class="info-icon"
                    use:tippy={`${progress.toLocaleString()} Adventure Campaign Progress`}
                >
                    <WowthingImage
                        name="currency/1889"
                        size={40}
                        border={2}
                    />
                    <span class="drop-shadow {getPercentClass(progress / 20 * 100)}">
                        {toNiceNumber(progress)}
                    </span>
                </div>

                <div
                    class="info-icon"
                    use:tippy={`${souls.toLocaleString()} Redeemed Souls`}
                >
                    <WowthingImage
                        name="currency/1810"
                        size={40}
                        border={2}
                    />
                    <span class="drop-shadow">
                        {toNiceNumber(souls)}
                    </span>
                </div>

                <div
                    class="info-icon"
                    use:tippy={`${anima.toLocaleString()} Reservoir Anima`}
                >
                    <WowthingImage
                        name="currency/1813"
                        size={40}
                        border={2}
                    />
                    <span class="drop-shadow">
                        {toNiceNumber(anima)}
                    </span>
                </div>
            </div>

            <div class="spacer"></div>

            {#each features as featureData, featureIndex}
                <div class="info-row">
                    <div>{featureData.name}</div>
                    <div>
                        {#if featureData.researching}
                            {@html featureData.researching}
                        {/if}
                        <span class="{getPercentClass(featureData.rank / featureData.maxRank * 100)}">Rank {featureData.rank}</span>
                    </div>
                </div>

                {#if covenantFeatureReputation[`${covenantId}-${featureData.key}`]}
                    <ReputationBar
                        reputationId={covenantFeatureReputation[`${covenantId}-${featureData.key}`]}
                        {character}
                    />
                {/if}

                {#if featureData.key === 'unique'}
                    {#if covenantId === 1}
                        <PathOfAscension
                            {character}
                            feature={featureData.feature}
                        />
                    {:else if covenantId === 2}
                        <EmberCourt
                            {character}
                        />
                    {:else if covenantId === 4}
                        <Stitchyard
                            {character}
                            feature={featureData.feature}
                        />
                    {/if}
                {/if}

                {#if featureIndex < (features.length - 1)}
                    <div class="spacer"></div>
                {/if}
            {/each}

        </div>

        {#if covenantId === 3}
            <Soulshapes
                {character}
            />
        {/if}
    </div>

    <div class="soulbinds">
        {#each $staticStore.soulbinds[covenantId] as soulbind}
            <Soulbind
                {character}
                {covenantId}
                {soulbind}
            />
        {/each}
    </div>
</div>
