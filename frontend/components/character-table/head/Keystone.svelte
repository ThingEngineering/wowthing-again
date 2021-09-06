<script lang="ts">
    import type { MythicPlusAffix } from '@/types'

    export let affixes: MythicPlusAffix[]
</script>

<style lang="scss">
    th {
        @include cell-width($width-keystone);

        vertical-align: bottom;
    }
</style>

<th>Keystone</th>
