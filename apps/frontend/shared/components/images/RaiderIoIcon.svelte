<script lang="ts">
    export let size: number
    export let border = 0

    const actualSize = size + border * 2
</script>

<img
    src="https://img.wowthing.org/misc/raider_io.svg"
    width={actualSize}
    height={actualSize}
    alt="RaiderIO icon"
    loading="lazy"
/>
