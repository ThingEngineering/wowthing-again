<script lang="ts">
    export let counts: { have: number, total: number }

    $: per = counts.have / counts.total * 100
</script>

<em class="quality{ Math.floor(per / 25) + 1 }">{ counts.have }</em> / <em class="quality{ Math.floor(per / 25) + 1 }">{ counts.total }</em>
