<script lang="ts">
    export let counts: { have: number; total: number }

    let per: number
    $: {
        per = (counts.have / counts.total) * 100
    }
</script>

<style type="scss">
    span {
        word-spacing: -0.2ch;
    }
</style>

<span>
    <em class="quality{Math.floor(per / 25) + 1}">{counts.have}</em> /
    <em class="quality{Math.floor(per / 25) + 1}">{counts.total}</em>
</span>
