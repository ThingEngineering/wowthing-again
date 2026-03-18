<script lang="ts">
    import { uiIcons } from '@/shared/icons';

    import IconifyWrapper from '../images/IconifyWrapper.svelte';

    type Props = {
        state: boolean;
        extraClass?: string; // = undefined
        useStatusColors?: boolean; // = false
    };
    let { state, extraClass, useStatusColors }: Props = $props();

    let sighClass = $derived(
        [useStatusColors ? `${state ? 'status-success' : 'status-fail'}` : '', extraClass]
            .filter((s) => !!s)
            .join(' ')
    );
</script>

<IconifyWrapper cls={sighClass} icon={state ? uiIcons.yes : uiIcons.no} />
