<script lang="ts">
    import {Character} from '../../types'
    import WowthingImage from '../images/sources/WowthingImage.svelte'

    export let character: Character

    const jank = {
        1: {icon: 'covenant_kyrian', name: 'Kyrian'},
        2: {icon: 'covenant_venthyr', name: 'Venthyr'},
        3: {icon: 'covenant_night_fae', name: 'Night Fae'},
        4: {icon: 'covenant_necrolord', name: 'Necrolord'},
    }
    const covenant = jank[character.shadowlands.covenantId]
</script>

<style lang="scss">
    div :global(img) {
        border-width: 0;
    }
</style>

<div class="{'covenant' + character.shadowlands.covenantId}">
    <WowthingImage name={covenant.icon} size="24" border="1" tooltip="{covenant.name}" />
    {character.shadowlands.renownLevel}
    [{character.shadowlands.soulbindId}]
</div>
