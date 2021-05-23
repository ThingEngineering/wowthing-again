<script lang="ts">
    export let counts: { have: number, total: number }

    $: per = counts.have / counts.total * 100
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

    em {
        //color: mix($body-text, #00ff00, 80%);
    }
</style>

<em class="quality{ Math.floor(per / 25) + 1 }">{ counts.have }</em> / <em class="quality{ Math.floor(per / 25) + 1 }">{ counts.total }</em>
