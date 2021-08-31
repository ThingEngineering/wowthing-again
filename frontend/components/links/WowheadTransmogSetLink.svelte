<script lang="ts">
    export let cls = ''
    export let id: number

    let url
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
