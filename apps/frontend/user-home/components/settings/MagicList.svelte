<script lang="ts">
    import { dndzone, type DndEvent } from 'svelte-dnd-action';

    import type { SettingsChoice } from '@/shared/stores/settings/types';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    export let icon;
    export let items: SettingsChoice[];
    export let onFunc: () => void;
    export let type: string;

    function onConsider(event: CustomEvent<DndEvent<SettingsChoice>>) {
        items = event.detail.items;
    }
    function onFinalize(event: CustomEvent<DndEvent<SettingsChoice>>) {
        items = event.detail.items;
        onFunc();
    }
</script>

<style lang="scss">
    .magic-list {
        background: $highlight-background;
        border-radius: var(--border-radius);
        flex: 1;
        height: var(--magic-max-height, 21rem);
        overflow-y: scroll;
        width: 100%;

        & :global(.selected:not(.dragged)) {
            background: $active-background !important;
        }
    }
    .magic-item {
        display: flex;
        justify-content: space-between;
        max-height: 2.1rem;
        max-width: 22rem;
        padding: 0.2rem 0.4rem;

        &:nth-child(even) {
            background: $table-alt-bg;
        }
        &:nth-child(odd) {
            background: $table-striped-alt-bg;
        }
        &:not(:first-child) {
            border-top: 1px solid var(--border-color);
        }
        &:last-child {
            border-bottom: 1px solid var(--border-color);
        }
        &:hover {
            background: $active-background;
        }

        & :global(svg) {
            color: #8cf;
        }
    }
</style>

<div
    class="magic-list"
    use:dndzone={{ items, type }}
    on:consider={onConsider}
    on:finalize={onFinalize}
>
    {#each items as item (item)}
        <div class="magic-item">
            <span class="name text-overflow">
                <ParsedText text={item.name} />
            </span>
            <IconifyIcon {icon} />
        </div>
    {/each}
</div>
