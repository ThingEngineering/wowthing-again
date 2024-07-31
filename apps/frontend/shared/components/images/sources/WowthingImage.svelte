<script lang="ts">
    import Image from '../Image.svelte'

    export let border = 0
    export let cls: string = undefined
    export let lazy = true
    export let name: string
    export let size: number
    export let tooltip: string = undefined

    const actualSize = size + (border * 2)

    $: {
        if (name === 'currency/0') {
            name = 'item/135464' // Bulging Sack of Gold
        }
    }
</script>

<Image
    src="https://img.wowthing.org/{size}/{name}.webp"
    alt={name}
    size={actualSize}
    {cls}
    {lazy}
    {tooltip}
/>
