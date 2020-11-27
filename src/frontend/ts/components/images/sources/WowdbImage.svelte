<script lang="ts">
    export let size
    export let name: string

    const px = (size === 'large' ? 56 : (size === 'medium' ? 36 : 16));
</script>

<img src="https://icons.wowdb.com/retail/{size}/{name}.jpg" width="{px}" height="{px}">
