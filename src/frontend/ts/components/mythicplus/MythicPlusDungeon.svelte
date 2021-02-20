<script lang="ts">
    import {dungeonMap} from '../../data/dungeon'
    import tippy from '../../utils/tippy'

    import WowthingImage from '../images/sources/WowthingImage.svelte'

    export let dungeonId: number = 0

    $: dungeon = dungeonMap[dungeonId]
</script>

<style lang="scss">
    @import 'scss/variables.scss';

    th {
        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding: 0.3rem 0;
        text-align: center;
        width: 4em;

        & :global(img) {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
    }
</style>

{#if dungeon !== undefined}
    <th use:tippy={dungeon.getTooltip()}>
        <WowthingImage size=48 name="{ dungeon.Icon }" border=1 />
    </th>
{:else}
    <th>&nbsp;</th>
{/if}
