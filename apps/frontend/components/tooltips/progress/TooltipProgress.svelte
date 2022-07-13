<script lang="ts">
    import some from 'lodash/some'

    import type { Character } from '@/types'
    import type { ManualDataProgressData, ManualDataProgressGroup } from '@/types/data/manual'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let datas: ManualDataProgressData[]
    export let descriptionText: Record<number, string>
    export let group: ManualDataProgressGroup
    export let haveIndexes: number[]
    export let showCurrency = 0

    let cls: string
    $: {
        cls = some(datas, (data, i) => {
            const desc = descriptionText[i] || data.description
            if (desc && desc.length > 20) {
                return true
            }
        }) ? 'long' : 'short'
    }
</script>

<style lang="scss">
    .progress {
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
    .bottom {
        --image-border-width: 1px;
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
                        {haveIndexes.indexOf(dataIndex) >= 0 ? '✔' : '❌'}
                    </td>
                    <td class="name">
                        {data.name}
                        {#if description && haveIndexes.indexOf(dataIndex) === -1}
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

    {#if showCurrency > 0}
        {@const characterCurrency = character.currencies?.[showCurrency]}
        {#if characterCurrency}
            <div class="bottom">
                <WowthingImage
                    name="currency/{showCurrency}"
                    size={20}
                    border={1}
                />
                {characterCurrency.quantity.toLocaleString()}
            </div>
        {/if}
    {/if}
</div>
