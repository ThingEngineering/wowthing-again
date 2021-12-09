<script lang="ts">
    export let counts: { have: number; total: number }

    let per: number
    $: {
        per = (counts.have / counts.total) * 100
    }
</script>

<style lang="scss">
    span {
        font-size: 90%;
        font-weight: normal;
        margin-left: 0.4rem;
        word-spacing: -0.2ch;
    }
</style>

<span>
    <em class="quality{Math.floor(per / 25) + 1}">{counts.have}</em> /
    <em class="quality{Math.floor(per / 25) + 1}">{counts.total}</em>
</span>
