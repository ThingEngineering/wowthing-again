<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataTransmogGroupData } from '@/types/data/manual';

    import Tooltip from '@/user-home/components/transmog-sets/Tooltip.svelte';
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

    let spanElement = $state<HTMLElement>(null);
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

{#if total > 0}
    <td
        class={getPercentClass(percent)}
        colspan={span}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                have,
                set,
                setTitle,
                slotHave,
                subType,
                total,
            },
            tippyProps: {
                allowHTML: true,
                getReferenceClientRect: () => spanElement.getBoundingClientRect(),
                placement: 'left-end',
            },
        }}
    >
        {#if set.wowheadSetId}
            <WowheadTransmogSetLink id={set.wowheadSetId} cls={getPercentClass(percent)}>
                <span bind:this={spanElement} class:blocky={span > 1}>
                    {have} / {total}
                </span>
            </WowheadTransmogSetLink>
        {:else}
            <span bind:this={spanElement} class:blocky={span > 1}>
                {have} / {total}
            </span>
        {/if}
    </td>
{:else}
    <td class="quality0" colspan={span}>---</td>
{/if}
