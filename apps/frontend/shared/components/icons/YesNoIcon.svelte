<script lang="ts">
    import { uiIcons } from '@/shared/icons'

    import IconifyIcon from '../images/IconifyIcon.svelte'

    export let extraClass: string = undefined
    export let state: boolean
    export let useStatusColors = false

    let sighClass: string
    $: {
        sighClass = useStatusColors ? `${state ? 'status-success' : 'status-fail'}` : ''
        if (extraClass) {
            sighClass = `${sighClass} ${extraClass}`
        }
    }
</script>

<IconifyIcon
    extraClass={sighClass}
    icon={state ? uiIcons.yes : uiIcons.no}
/>
