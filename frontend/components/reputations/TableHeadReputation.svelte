<script lang="ts">
    import tippy from '@/utils/tippy'

    import type { StaticDataReputationSet, TippyProps } from '@/types'

    import WowdbImage from '@/components/images/sources/WowdbImage.svelte'

    export let reputation: StaticDataReputationSet

    let tooltip: TippyProps
    $: {
        tooltip = {
            allowHTML: true,
            content: reputation.both
                ? reputation.both.name
                : `[A] ${reputation.alliance.name}<br>[H] ${reputation.horde.name}`,
        }
    }
</script>

<style lang="scss">
    th {
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding: 0.3rem 0;
        min-width: $reputation-width-cell;
        width: $reputation-width-cell;
    }
    div {
        display: inline-block;
        position: relative;
        height: 36px;
        width: 36px;
    }
    .split-no {
        border: 2px solid lighten($border-color, 20%);
    }
    .split-yes :global(img:first-child) {
        border: 2px solid $alliance-border;
        clip-path: polygon(0 0, 0 100%, 100% 0);
    }
    .split-yes :global(img:last-child) {
        border: 2px solid $horde-border;
        clip-path: polygon(100% 100%, 0 100%, 100% 0);
        position: absolute;
        bottom: 0;
        right: 0;
        //margin-top: -64px;
    }
</style>

<th use:tippy={tooltip}>
    {#if reputation.both}
        <div class="split-no">
            <WowdbImage name={reputation.both.icon} size="medium" />
        </div>
    {:else}
        <div class="split-yes">
            <WowdbImage name={reputation.alliance.icon} size="medium" />
            <WowdbImage name={reputation.horde.icon} size="medium" />
        </div>
    {/if}
</th>
