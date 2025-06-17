<script lang="ts">
    import { leftPad } from '@/utils/formatting';

    let { value }: { value: number } = $props();

    let gold = $derived(Math.floor(value / 10000));
    let silver = $derived(Math.floor((value % 10000) / 100));
    let copper = $derived(value % 100);
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
