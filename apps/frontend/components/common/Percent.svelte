<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class';

    let { percent }: { percent: number } = $props();

    let fancyPercent = $derived((Math.floor(percent * 10) / 10).toFixed(1));
</script>

<style lang="scss">
    span {
        font-size: 90%;
        word-spacing: -0.2ch;
    }
</style>

<span class="drop-shadow {getPercentClass(percent)}">
    {fancyPercent} %
</span>
