<script lang="ts">
    import type { Character } from '@/types'

    import Paperdoll from './CharactersGeneralPaperdoll.svelte'

    export let character: Character


</script>

<style lang="scss">
    .character-sheet {

    }
    .paperdoll {

    }
    .stats {

    }
</style>

<div class="character-sheet">
    <div class="paperdoll">
        <Paperdoll {character} />
    </div>

    <div class="stats">

    </div>
</div>
