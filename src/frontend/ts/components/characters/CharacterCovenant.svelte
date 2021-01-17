<script lang="ts">
    import {covenantMap} from '../../data/covenant'
    import {Character} from '../../types'
    import tippy from '../../utils/tippy'

    import WowthingImage from '../images/sources/WowthingImage.svelte'

    export let character: Character

    const covenant = character.shadowlands !== undefined ? covenantMap[character.shadowlands.covenantId] : undefined
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    div :global(img) {
        background: rgba(0x4d, 0x4e, 0x4f, 0.4);
        border-color: $border-color;
        border-radius: 8px;
    }
</style>

{#if covenant !== undefined}
    <div class="{'covenant' + character.shadowlands.covenantId}" use:tippy={covenant.getTooltip(character.shadowlands.renownLevel)}>
        <WowthingImage name={covenant.Icon} size="24" border="1" />
        {character.shadowlands.renownLevel}
    </div>
{:else}
    &nbsp;
{/if}
