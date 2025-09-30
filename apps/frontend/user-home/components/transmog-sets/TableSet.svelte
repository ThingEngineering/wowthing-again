<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataTransmogGroupData } from '@/types/data/manual';

    import WowheadTransmogSetLink from '@/shared/components/links/WowheadTransmogSetLink.svelte';

    type Props = {
        set: ManualDataTransmogGroupData;
        setKey: string;
        setTitle: string;
        span: number; // = 1;
        subType: string;
    };
    let { set, setKey, setTitle, subType, span = 1 }: Props = $props();

    let slotHave = $derived(lazyState.transmog.slots[setKey]);
    let [have, percent, total] = $derived.by(() => {
        let retHave = 0;
        let retPercent = 0;
        let retTotal = 0;

        if (set && slotHave) {
            const stats = lazyState.transmog.stats[setKey];
            if (stats?.total > 0) {
                retHave = stats.have;
                retTotal = stats.total;
            } else {
                retHave = Object.values(slotHave).filter((s) => s[0] === true).length;
                retTotal = Object.keys(slotHave).length;
            }

            if (retTotal > 0) {
                retPercent = (retHave / retTotal) * 100;
            }
        }

        return [retHave, retPercent, retTotal];
    });
</script>

<style lang="scss">
    td {
        border-left: 1px solid var(--border-color);
        padding-left: 0.4rem;
        padding-right: 0.4rem;
        text-align: center;
        word-spacing: -0.2ch;
    }
    .blocky {
        display: inline-block;
        width: 4rem;
    }
</style>

{#snippet setStats()}
    <span class:blocky={span > 1}>
        {have} / {total}
    </span>
{/snippet}

{#if total > 0}
    <td
        class="tooltip-transmog-set {getPercentClass(percent)}"
        colspan={span}
        data-have={have}
        data-set-key={setKey}
        data-set-title={setTitle}
        data-sub-type={subType}
        data-total={total}
    >
        {#if set.wowheadSetId}
            <WowheadTransmogSetLink id={set.wowheadSetId} cls={getPercentClass(percent)}>
                {@render setStats()}
            </WowheadTransmogSetLink>
        {:else}
            {@render setStats()}
        {/if}
    </td>
{:else}
    <td class="quality0" colspan={span}>---</td>
{/if}
