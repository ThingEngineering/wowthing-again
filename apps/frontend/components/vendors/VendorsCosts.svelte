<script lang="ts">
    import { getCurrencyCosts } from '@/utils/get-currency-costs';

    import CurrencyLink from '@/shared/components/links/CurrencyLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { costs }: { costs: Record<number, number> } = $props();
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
        {#each getCurrencyCosts(costs, true, true) as [linkType, linkId, value] (`${linkType}-${linkId}`)}
            <div>
                <CurrencyLink
                    currencyId={linkType === 'currency' ? linkId : undefined}
                    itemId={linkType === 'item' ? linkId : undefined}
                >
                    <WowthingImage name="{linkType}/{linkId}" size={20} border={0} />
                    {value}
                </CurrencyLink>
            </div>
        {/each}
    </span>
{/if}
