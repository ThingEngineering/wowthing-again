<script lang="ts">
    import type { Snippet } from 'svelte';

    import { iconLibrary } from '@/shared/icons';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    type Props = {
        name: string;
        value: boolean;
        children?: Snippet;
        disabled?: boolean;
        textClass?: string;
    };
    let { children, disabled, name, textClass, value = $bindable() }: Props = $props();
</script>

<style lang="scss">
    label {
        & :global(svg) {
            margin-top: -4px;
        }
    }
</style>

<fieldset class="fancy-checkbox" class:disabled data-state={value}>
    <label for="input-{name}" class="text-overflow">
        <input id="input-{name}" {name} type="checkbox" bind:checked={value} on:change {disabled} />
        <IconifyIcon
            icon={value ? iconLibrary.mdiCheckboxOutline : iconLibrary.mdiCheckboxBlankOutline}
        />
        <span class="text {textClass || ''}">
            {@render children?.()}
        </span>
    </label>
</fieldset>
