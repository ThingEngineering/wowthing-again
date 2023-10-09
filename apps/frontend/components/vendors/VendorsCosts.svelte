<script lang="ts">
    import { itemStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import { getCurrencyCosts } from '@/utils/get-currency-costs'

    import CurrencyLink from '@/shared/links/CurrencyLink.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    export let costs: Record<number, number>    
</script>

<style lang="scss">
    .costs {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        color: $body-text;
        display: flex;
        flex-wrap: wrap;
        //font-size: 90%;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-left: auto;
        padding-left: 1rem;
    }
</style>

{#if costs}
    <span class="costs">
        {#each getCurrencyCosts($itemStore, $staticStore, costs, true, true) as [linkType, linkId, value]}
            <div>
                <CurrencyLink
                    currencyId={linkType === 'currency' ? linkId : undefined}
                    itemId={linkType === 'item' ? linkId : undefined}
                >
                    <WowthingImage
                        name="{linkType}/{linkId}"
                        size={20}
                        border={0}
                    />
                    {value}
                </CurrencyLink>
            </div>
        {/each}
    </span>
{/if}
