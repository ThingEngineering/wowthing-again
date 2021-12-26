<script lang="ts">
    import find from 'lodash/find'

    import { Constants } from '@/data/constants'
    import { covenantOrder } from '@/data/covenant'
    import { staticStore, userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import getProgress from '@/utils/get-progress'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { Character, CharacterShadowlandsCovenant, StaticDataProgressCategory } from '@/types'

    import Soulbind from './CharactersShadowlandsSoulbind.svelte'

    export let character: Character
    export let covenantId: number

    let characterCovenant: CharacterShadowlandsCovenant
    let campaignHave: number
    let campaignTotal: number
    let rankConductor: number
    let rankMissions: number
    let rankTransport: number
    let rankUnique: number
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
        rankConductor = characterCovenant?.conductor?.rank ?? 0
        rankMissions = characterCovenant?.missions?.rank ?? 0
        rankTransport = characterCovenant?.transport?.rank ?? 0
        rankUnique = characterCovenant?.unique?.rank ?? 0
    }
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

        <div class="info-row">
            <div>{characterCovenant?.conductor?.name ?? 'Anima Conductor'}</div>
            <div class="{getPercentClass(rankConductor / 3 * 100)}">Rank {rankConductor}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.missions?.name ?? 'Command Table'}</div>
            <div class="{getPercentClass(rankMissions / 3 * 100)}">Rank {rankMissions}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.transport?.name ?? 'Transport Network'}</div>
            <div class="{getPercentClass(rankTransport / 3 * 100)}">Rank {rankTransport}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.unique?.name ?? 'Unique Feature'}</div>
            <div class="{getPercentClass(rankUnique / 5 * 100)}">Rank {rankUnique}</div>
        </div>
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
