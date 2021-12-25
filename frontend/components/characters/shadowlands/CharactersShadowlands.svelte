<script lang="ts">
    import { covenantOrder } from '@/data/covenant'
    import type { Character } from '@/types'

    import Covenant from './CharactersShadowlandsCovenant.svelte'

    export let character: Character
</script>

<style lang="scss">

</style>

{#each covenantOrder as covenantId}
    <Covenant
        {character}
        {covenantId}
    />
{/each}
