<script lang="ts">
    import some from 'lodash/some'

    import { covenantFeatureCost } from '@/data/covenant'
    import { ProgressDataType } from '@/enums'
    import { achievementStore, userAchievementStore } from '@/stores'
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
    let dataChunks: [ManualDataProgressData, number][][]
    $: {
        cls = some(datas, (data, i) => {
            const desc = descriptionText[i] || data.description
            if (desc && desc.length > 20) {
                return true
            }
        }) ? 'long' : 'short'

        // Special cases
        if (group.name === 'Valorous Appearances') {
            const cheev = $achievementStore.achievement[datas[1].ids[0]]
            const rootTree = $achievementStore.criteriaTree[cheev.criteriaTreeId]
            const charCheev = $userAchievementStore.addonAchievements[character.id]?.[cheev.id]
            const newDesc = {...descriptionText}
            if (charCheev?.earned !== true) {
                for (let childIndex = 0; childIndex < rootTree.children.length; childIndex++) {
                    const childTree = $achievementStore.criteriaTree[rootTree.children[childIndex]]
                    newDesc[1] += `<br>${charCheev?.criteria?.[childIndex] > 0 ? '✔' : '❌'} ${childTree.description}`
                }
            }
            descriptionText = newDesc
        }
        else if (datas.length === 1 && datas[0].type === ProgressDataType.SlCovenant) {
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
        else {
            showCurrencies = group.currencies || []
        }

        // Split data
        dataChunks = [[]]
        for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
            const data = datas[dataIndex]
            if (data.name === 'separator') {
                dataChunks.push([])
                continue
            }

            dataChunks[dataChunks.length - 1].push([data, dataIndex])
        }
    }
</script>

<style lang="scss">
    table:not(:last-child) {
        border-bottom: 1px solid $border-color;
    }
    table + table {
        border-top: 1px solid $border-color;
        margin-top: 1rem;
    }
    .progress {
        @include cell-width(1.2rem);

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

    {#each dataChunks as dataChunk}
        <table class="table-striped">
            <tbody>
                {#each dataChunk as [data, dataIndex]}
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
    {/each}

    {#if showCurrencies?.length > 0 && !(showCurrencies.length === 1 && showCurrencies[0] === 0)}
        <div class="bottom">
            {#each showCurrencies as currencyId}
                <span>
                    {#if currencyId > 1000000}
                        <WowthingImage
                            name="item/{currencyId - 1000000}"
                            size={20}
                            border={1}
                        />
                        {(character.getItemCount(currencyId - 1000000)).toLocaleString()}
                    {:else}
                        <WowthingImage
                            name="currency/{currencyId}"
                            size={20}
                            border={1}
                        />
                        {(character.currencies?.[currencyId]?.quantity ?? 0).toLocaleString()}
                    {/if}
                </span>
            {/each}
        </div>
    {/if}
</div>
