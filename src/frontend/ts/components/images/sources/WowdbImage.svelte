<script lang="ts">
    export let size: string
    export let name: string
    export let border: string = '0'

    const actualSize = (size === 'large' ? 56 : (size === 'medium' ? 36 : 16)) + (parseInt(border) * 2);
</script>

<img src="https://icons.wowdb.com/retail/{size}/{name}.jpg" width="{actualSize}" height="{actualSize}" loading="lazy">
