<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { ManualDataReputationSet } from '@/types/data/manual';
    import AccountWide from './AccountWide.svelte';

    type RepSetData = [ManualDataReputationSet[], number][];

    let { slug }: { slug: string } = $props();

    let category = $derived(wowthingData.manual.reputationSets.find((r) => r?.slug === slug));

    let [accountSets, characterSets] = $derived.by(() => {
        const accountRet: RepSetData = [];
        const characterRet: RepSetData = [];

        const reputationSets = category?.reputations || [];
        for (let setIndex = 0; setIndex < reputationSets.length; setIndex++) {
            const reputationSet = reputationSets[setIndex];
            const hasAccountWide = reputationSet.some(
                (rep) => wowthingData.static.reputationById.get(rep.both?.id)?.accountWide
            );
            (hasAccountWide ? accountRet : characterRet).push([reputationSet, setIndex]);
        }

        return [accountRet, characterRet];
    });
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: flex-start;
    }
</style>

<div class="flex-wrapper">
    {#if accountSets.length > 0}
        <AccountWide {accountSets} {slug} />
    {/if}
</div>
