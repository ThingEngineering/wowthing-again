<script lang="ts">
    import find from 'lodash/find'
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { covenantOrder } from '@/data/covenant'
    import { staticStore, timeStore, userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import getProgress from '@/utils/get-progress'
    import { toNiceDuration, toNiceNumber } from '@/utils/to-nice'
    import type {
        Character,
        CharacterShadowlandsCovenant,
        CharacterShadowlandsCovenantFeature,
        StaticDataProgressCategory,
    } from '@/types'

    import Soulbind from './CharactersShadowlandsSoulbind.svelte'

    export let character: Character
    export let covenantId: number

    let characterCovenant: CharacterShadowlandsCovenant
    let campaignHave: number
    let campaignTotal: number
    let features: {maxRank: number, name: string, rank: number, researching: string}[]
    let renown: number
    $: {
        characterCovenant = character.shadowlands?.covenants?.[covenantId]

        const category: StaticDataProgressCategory = find(
            find(
                $staticStore.data.progress,
                (progress) => progress?.[0].slug === 'shadowlands'
            ),
            (category) => category?.name === 'Covenants'
        )
        const progress = getProgress(
            $userQuestStore.data,
            character,
            category,
            category.groups[covenantOrder.indexOf(covenantId)],
        )
        campaignHave = progress.have
        campaignTotal = progress.total

        renown = characterCovenant?.renown ?? 0

        features = []
        for (const [key, name, maxRank] of featureOrder) {
            const featureData = {
                maxRank,
                name,
                rank: 0,
                researching: '',
            }

            const characterFeature: CharacterShadowlandsCovenantFeature = characterCovenant?.[key]
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
                        featureData.researching = `Upgrades in <span class="status-shrug">${duration}</span>`
                    }
                }
            }

            features.push(featureData)
        }
    }

    const featureOrder: [string, string, number][] = [
        ['conductor', 'Anima Conductor', 3],
        ['missions', 'Command Table', 3],
        ['transport', 'Transport Network', 3],
        ['unique', 'Unique Feature', 5],
    ]
</script>

<style lang="scss">
    .covenant {
        display: flex;
        justify-content: space-between;
    }
    .info {
        width: 16rem;

        h2 {
            border-bottom: 1px solid $border-color;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            text-align: center;
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
    <div class="info">
        <h2>Information</h2>

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

        {#each features as feature, featureIndex}
            <div class="info-row">
                <div>{feature.name}</div>
                <div class="{getPercentClass(feature.rank / feature.maxRank * 100)}">Rank {feature.rank}</div>
            </div>

            {#if feature.researching}
                <div class="info-research">{@html feature.researching}</div>
            {/if}

            {#if featureIndex < (features.length - 1)}
                <div class="spacer"></div>
            {/if}
        {/each}
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
