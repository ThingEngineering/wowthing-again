<script lang="ts">
    import { covenantMap } from '@/data/covenant'
    import type { Character } from '@/types'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character

    const covenant =
        character.shadowlands !== undefined
            ? covenantMap[character.shadowlands.covenantId]
            : undefined
</script>

<style lang="scss">
    div :global(img) {
        background: rgba(77, 78, 79, 0.4);
    }
</style>

{#if covenant !== undefined}
    <div
        class={'covenant' + character.shadowlands.covenantId}
        use:tippy={covenant.getTooltip(character.shadowlands.renownLevel)}
    >
        <WowthingImage
            name={covenant.icon}
            size={24}
            border={1}
        />{character.shadowlands.renownLevel}
    </div>
{:else}
    &nbsp;
{/if}
