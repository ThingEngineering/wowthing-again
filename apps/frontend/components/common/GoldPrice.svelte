<script lang="ts">
    import { leftPad } from '@/utils/formatting'

    export let value: number

    let gold: number
    let silver: number
    let copper: number
    $: {
        gold = Math.floor(value / 10000)
        silver = Math.floor(value % 10000 / 100)
        copper = value % 100
    }
</script>

<style lang="scss">
    pre {
        display: inline;

        + pre {
            margin-left: 0.5rem;
        }
    }
</style>

<pre>{gold.toLocaleString()}g</pre>
<pre>{@html leftPad(silver, 2)}s</pre>
<pre>{@html leftPad(copper, 2)}c</pre>
