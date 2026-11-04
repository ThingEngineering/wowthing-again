<script lang="ts">
    let { size, border = 0 }: { size: number; border?: number } = $props();

    let actualSize = $derived(size + border * 2);
</script>

<img
    src="https://img.wowthing.org/misc/raider_io.svg"
    width={actualSize}
    height={actualSize}
    alt="RaiderIO icon"
    loading="lazy"
/>
