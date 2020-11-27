<script lang="ts">
    import WowdbImage from '../images/sources/WowdbImage.svelte'

    export let reputation
</script>

<style lang="scss">
    @import 'scss/variables.scss';

    th {
        text-align: center;
        width: 4em;
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

<th>
    {#if reputation.Both}
        <div class="split-no">
            <WowdbImage name={reputation.Both.Icon} size="medium" />
        </div>
    {:else}
        <div class="split-yes">
            <WowdbImage name={reputation.Alliance.Icon} size="medium" />
            <WowdbImage name={reputation.Horde.Icon} size="medium" />
        </div>
    {/if}
</th>
