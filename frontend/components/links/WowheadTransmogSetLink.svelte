<script lang="ts">
    export let cls = ''
    export let id: number

    let url
    $: {
        url = `https://www.wowhead.com/transmog-set=${id}`
    }
</script>

<a href="{url}" class="{cls}">
    <slot />
</a>
