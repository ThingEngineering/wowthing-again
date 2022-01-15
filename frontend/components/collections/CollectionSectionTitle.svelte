<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import type { UserCount } from '@/types'

    import Count from '@/components/collections/CollectionCount.svelte'

    export let count: UserCount
    export let title: string

    let percent: number
    $: {
        percent = Math.floor((count?.have ?? 0) / (count?.total ?? 1) * 100)
    }
</script>

<h3 class="{getPercentClass(percent)}">
    {title}
    <Count counts={count} />
    <slot />
</h3>
