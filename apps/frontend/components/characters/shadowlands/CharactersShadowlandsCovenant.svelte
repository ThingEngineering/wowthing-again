<script lang="ts">
    import find from 'lodash/find'
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantFeatureOrder, covenantFeatureReputation, covenantOrder } from '@/data/covenant'
    import { manualStore, staticStore, timeStore, userQuestStore, userStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import getProgress from '@/utils/get-progress'
    import { toNiceDuration, toNiceNumber } from '@/utils/to-nice'
    import type { Character, CharacterShadowlandsCovenant, CharacterShadowlandsCovenantFeature } from '@/types'
    import type { ManualDataProgressCategory } from '@/types/data/manual'

    import EmberCourt from './CharactersShadowlandsEmberCourt.svelte'
    import PathOfAscension from './CharactersShadowlandsPathOfAscension.svelte'
    import ReputationBar from '@/components/common/ReputationBar.svelte'
    import Soulbind from './CharactersShadowlandsSoulbind.svelte'
    import Soulshapes from './CharactersShadowlandsSoulshapes.svelte'
    import Stitchyard from './CharactersShadowlandsStitchyard.svelte'

    export let character: Character
    export let covenantId: number

    let characterCovenant: CharacterShadowlandsCovenant
    let campaignHave: number
    let campaignTotal: number
    let features: {
        feature: CharacterShadowlandsCovenantFeature,
        key: string,
        maxRank: number,
        name: string,
        rank: number,
        researching: string
    }[]
    let renown: number
    $: {
        characterCovenant = character.shadowlands?.covenants?.[covenantId]

        const category: ManualDataProgressCategory = find(
            find(
                $manualStore.data.progressSets,
                (progress) => progress?.[0].slug === 'shadowlands'
            ),
            (category) => category?.name === 'Covenant Story'
        )
        const progress = getProgress(
            $staticStore.data,
            $userStore.data,
            null,
            $userQuestStore.data,
            character,
            category,
            category.groups[covenantOrder.indexOf(covenantId)],
        )
        campaignHave = progress.have
        campaignTotal = progress.total

        renown = characterCovenant?.renown ?? 0

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
            <div class="info-row large">
                <div>Renown</div>
                <div class="drop-shadow {getPercentClass(renown / Constants.maxRenown * 100)}">{renown}</div>
            </div>

            <div class="info-row large">
                <div>9.0 Campaign</div>
                <div class="drop-shadow {getPercentClass(campaignHave / campaignTotal * 100)}">{campaignHave} / {campaignTotal}</div>
            </div>

            <div class="spacer"></div>

            <div class="info-row large">
                <div>Anima</div>
                <div>{toNiceNumber(characterCovenant?.anima ?? 0)}</div>
            </div>

            <div class="info-row large">
                <div>Souls</div>
                <div>{toNiceNumber(characterCovenant?.souls ?? 0)}</div>
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
        {#each $staticStore.data.soulbinds[covenantId] as soulbind}
            <Soulbind
                {character}
                {covenantId}
                {soulbind}
            />
        {/each}
    </div>
</div>
