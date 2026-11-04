<script lang="ts">
    import type { TextAreaEventProps } from '@/types/props';

    type Props = TextAreaEventProps & {
        value: string;
        disabled?: boolean;
        placeholder?: string;
        rows?: number;
    };
    let { value = $bindable(), disabled, placeholder, rows = 4, onclick }: Props = $props();
</script>

<style lang="scss">
    textarea {
        width: 100%;
    }
</style>

<textarea {disabled} {placeholder} {rows} {onclick} bind:value></textarea>
