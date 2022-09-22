<script lang="ts">
    import some from 'lodash/some'

    import { covenantFeatureCost } from '@/data/covenant'
    import { ProgressDataType } from '@/types/enums'
    import type { Character } from '@/types'
    import type { ManualDataProgressData, ManualDataProgressGroup } from '@/types/data/manual'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let datas: ManualDataProgressData[]
    export let descriptionText: Record<number, string>
    export let group: ManualDataProgressGroup
    export let haveIndexes: number[]
    export let iconOverride: string
    export let nameOverride: Record<number, string>
    export let showCurrencies: number[] = []

    let cls: string
    $: {
        cls = some(datas, (data, i) => {
            const desc = descriptionText[i] || data.description
            if (desc && desc.length > 20) {
                return true
            }
        }) ? 'long' : 'short'

        if (datas.length === 1 && datas[0].type === ProgressDataType.SlCovenant) {
            const currentRank = parseInt(descriptionText[0].split(' ')[1].split('/')[0])
            const isSpecial = datas[0].value === 4
            const prices = covenantFeatureCost[datas[0].value]

            const newDatas: ManualDataProgressData[] = []
            const newDescriptionText: Record<number, string> = {}
            const newHaveIndexes: number[] = []

            for (let rank = 1; rank <= (isSpecial ? 5 : 3); rank++) {
                newDatas.push({
                    ...datas[0],
                    name: `Rank ${rank}`,
                })

                newDescriptionText[rank - 1] = `{priceShort:${prices[rank - 1][0]}|1810}&nbsp;&nbsp;{priceShort:${prices[rank - 1][1]}|1813}`

                if (currentRank >= rank) {
                    newHaveIndexes.push(rank - 1)
                }
            }

            cls = 'short'
            datas = newDatas
            descriptionText = newDescriptionText
            haveIndexes = newHaveIndexes
            showCurrencies = [1810, 1813]
        }
    }
</script>

<style lang="scss">
    .progress {
        padding-right: 0;
        vertical-align: top;
    }
    .name {
        padding-right: 1rem;
        text-align: left;

        :global(.description-short) {
            color: #00ccff;
            white-space: nowrap; 
        }
        :global(.description-long) {
            color: #00ccff;
            display: block;
            margin-top: 0;
        }
    }
    .wowthing-tooltip {
        --image-border-width: 1px;
    }
    .bottom {
        span + span {
            margin-left: 0.5rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{group.name}</h5>

    <table class="table-striped">
        <tbody>
            {#each datas as data, dataIndex}
                {@const description = descriptionText[dataIndex] || data.description}
                <tr>
                    <td class="progress">
                        {#if iconOverride}
                            <WowthingImage
                                name="{iconOverride}"
                                size={20}
                                border={1}
                            />
                        {:else}
                            {haveIndexes.indexOf(dataIndex) >= 0 ? '✔' : '❌'}
                        {/if}
                    </td>
                    <td class="name">
                        <ParsedText text={nameOverride[dataIndex] || data.name} />

                        {#if description && (
                            haveIndexes.indexOf(dataIndex) === -1 ||
                            datas[0].type === ProgressDataType.GarrisonTree
                        )}
                            {#if cls === 'short'}&ndash;{/if}
                            <ParsedText
                                cls="description-{cls}"
                                text={description}
                             />
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if showCurrencies?.length > 0 && !(showCurrencies.length === 1 && showCurrencies[0] === 0)}
        <div class="bottom">
            {#each showCurrencies as currencyId}
                {@const characterCurrency = character.currencies?.[currencyId]}
                <span>
                    <WowthingImage
                        name="currency/{currencyId}"
                        size={20}
                        border={1}
                    />
                    {(characterCurrency?.quantity ?? 0).toLocaleString()}
                </span>
            {/each}
        </div>
    {/if}
</div>
