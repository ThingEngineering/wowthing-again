<script lang="ts">
    import find from 'lodash/find'

    import { covenantOrder } from '@/data/covenant'
    import { staticStore, userQuestStore } from '@/stores'
    import getProgress from '@/utils/get-progress'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { Character, CharacterShadowlandsCovenant, StaticDataProgressCategory } from '@/types'

    import Soulbind from './CharactersShadowlandsSoulbind.svelte'

    export let character: Character
    export let covenantId: number

    let characterCovenant: CharacterShadowlandsCovenant
    let campaignHave: number
    let campaignTotal: number
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
    }
</script>

<style lang="scss">
    .covenant {
        display: flex;
        justify-content: space-between;
    }
    .info {
        width: 15rem;

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
            <div>{characterCovenant?.renown ?? 0}</div>
        </div>

        <div class="info-row large">
            <div>9.0 Campaign</div>
            <div>{campaignHave} / {campaignTotal}</div>
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
            <div>{characterCovenant?.conductor?.name ?? 'Conductor'}</div>
            <div>Rank {characterCovenant?.conductor?.rank ?? 0}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.missions?.name ?? 'Mission Table'}</div>
            <div>Rank {characterCovenant?.missions?.rank ?? 0}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.transport?.name ?? 'Transport Feature'}</div>
            <div>Rank {characterCovenant?.transport?.rank ?? 0}</div>
        </div>

        <div class="info-row">
            <div>{characterCovenant?.unique?.name ?? 'Unique Feature'}</div>
            <div>Rank {characterCovenant?.unique?.rank ?? 0}</div>
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
