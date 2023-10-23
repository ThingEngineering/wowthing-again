<script lang="ts">
    import { uiIcons } from '@/shared/icons'

    import IconifyIcon from '../images/IconifyIcon.svelte'

    export let extraClass: string = undefined
    export let state: boolean
</script>

<IconifyIcon
    icon={state ? uiIcons.yes : uiIcons.no}
    {extraClass}
/>
