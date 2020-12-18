<script lang="ts">
    import type {Character} from '../../types'

    export let character: Character

    // 226 = mythic  5
    // 213 = heroic  4
    // 200 = normal  3
    // 187 = lfr     2
    // 174 = ?       1
    // 161 = ?       0
    const start = 148;
    const quality = Math.floor(Math.max(0, Math.min(6, (parseFloat(character.calculatedItemLevel) - start) / 13)))
</script>

<style lang="scss">
    td {
        position: relative;
        text-align: right;
        width: 4.1rem;
    }
    div {
        font-size: 0.8rem;
        left: 0.3rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
</style>

<td>
    <div>⚔</div>
    <span class="quality{quality}">{character.calculatedItemLevel}</span>
</td>
