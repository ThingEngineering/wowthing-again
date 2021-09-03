<script lang="ts">
    export let cls = ''
    export let id: number

    let url: string
    $: {
        url = `https://www.wowhead.com/transmog-set=${id}`
    }
</script>

<style lang="scss">
    a {
        display: block;
    }
</style>

<a href="{url}" class="{cls}">
    <slot />
</a>
