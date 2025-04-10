<script lang="ts">
    import { lazyStore } from '@/stores';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import getPercentClass from '@/utils/get-percent-class';
    import type { TransmogSlotData } from '@/stores/lazy/transmog';
    import type { ManualDataTransmogGroupData } from '@/types/data/manual';

    import Tooltip from '@/user-home/components/transmog-sets/Tooltip.svelte';
    import WowheadTransmogSetLink from '@/shared/components/links/WowheadTransmogSetLink.svelte';

    export let set: ManualDataTransmogGroupData;
    export let setKey: string;
    export let setTitle: string;
    export let span = 1;
    export let subType: string;

    let have: number;
    let percent: number;
    let total: number;
    let slotHave: TransmogSlotData;
    let spanElement: HTMLElement;
    $: {
        have = 0;
        percent = 0;
        total = 0;

        slotHave = $lazyStore.transmog.slots[setKey];
        if (!set || !slotHave) {
            break $;
        }

        const stats = $lazyStore.transmog.stats[setKey];
        if (stats?.total > 0) {
            have = stats.have;
            total = stats.total;
        } else {
            have = Object.values(slotHave).filter((s) => s[0] === true).length;
            total = Object.keys(slotHave).length;
        }

        if (total > 0) {
            percent = (have / total) * 100;
        }
    }
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
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
