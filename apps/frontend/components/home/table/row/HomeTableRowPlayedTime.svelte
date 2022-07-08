<script lang="ts">
    import { toNiceDuration } from '@/utils/to-nice'

    export let playedTotal: number

    let played: string
    $: {
        played = toNiceDuration(playedTotal * 1000)
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-played);

        text-align: right;
    }
    code {
        background: none;
    }
</style>

<td>
    <code>{@html played}</code>
</td>
