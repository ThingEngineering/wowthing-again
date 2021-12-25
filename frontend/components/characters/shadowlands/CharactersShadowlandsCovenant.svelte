<script lang="ts">
    import { covenantMap } from '@/data/covenant'
    import { staticStore } from '@/stores'
    import type { Character, Covenant } from '@/types'

    import Soulbind from './CharactersShadowlandsSoulbind.svelte'

    export let character: Character
    export let covenantId: number

    let covenant: Covenant
    $: {
        covenant = covenantMap[covenantId]
    }
</script>

<style lang="scss">
    h2 {
        margin-bottom: 0.5rem;
    }
    .soulbinds {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
</style>

<h2>{covenant.name}</h2>

<div class="soulbinds">
    {#each $staticStore.data.soulbinds[covenantId] as soulbind}
        <Soulbind
            {character}
            {covenantId}
            {soulbind}
        />
    {/each}
</div>
