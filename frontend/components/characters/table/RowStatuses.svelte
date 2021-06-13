<script lang="ts">
    import {getContext} from 'svelte'

    import {Constants} from '@/data/constants'
    import type {Character} from '@/types'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

</script>

<style lang="scss">
    td {
        padding-right: 0.7rem;
        white-space: nowrap;

        & :global(img) {
            border-radius: $border-radius;
            margin-top: -4px;
        }
    }
</style>

<td>
    {#if false && character.isResting && character.level < Constants.characterMaxLevel}
        <WowthingImage name="spell/140430" size={20} border={1} tooltip="Rested" />
    {/if}
    {#if character.isWarMode}
        <WowthingImage name="spell/304019" size={20} border={1} tooltip="War Mode" />
    {/if}
</td>
