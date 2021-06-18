<script lang="ts">
    import { getContext } from 'svelte'

    import type { Character } from '@/types'

    const character: Character = getContext('character')
</script>

<style lang="scss">
    td {
        padding-left: 0.1rem;
        padding-right: 0.7rem;
        text-align: right;
        width: 2rem;
    }
</style>

<td>{character.gold.toLocaleString()} g</td>
