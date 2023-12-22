<script lang="ts">
    import ListView from 'svelte-sortable-flat-list-view'

    import { uiIcons } from '@/shared/icons'
    import type { SettingsChoice } from '@/shared/stores/settings/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'

    export let active: SettingsChoice[]
    export let inactive: SettingsChoice[]
    export let key: string
    export let onFunc: () => void
    export let title: string = undefined

    const keyType = `item/${key}`
    const keyFunc = (item: SettingsChoice) => item.key
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        & :global(.column:first-child svg) {
            color: $color-success;
        }
        & :global(.column:last-child svg) {
            color: $color-fail;
        }
    }

    .columns {
        flex: 1;

        h3 {
            border-bottom-width: 0;
            border-top-width: 0;
            margin-bottom: 0;
            text-align: center;
        }
    }

    .column {
        border: 1px solid $border-color;
        display: flex;
        flex: 1;
        flex-direction: column;
        max-height: var(--magic-max-height, 21rem);
        min-height: var(--magic-min-height, none);
        overflow-y: auto;

        & :global(.defaultListView) {
            background: $highlight-background;
            border-radius: $border-radius;
            flex: 1;
            width: 100%;

            & :global(.ListItemView) {
                animation: none !important;
            }

            & :global(.selected:not(.dragged)) {
                background: $active-background !important;
            }

            & :global(svg) {
                color: #8cf;
                margin-top: 0.2rem;
                position: absolute;
                right: 0.1rem;
            }
        }
    }
</style>

<div class="columns">
    {#if title}
        <h3>{title}</h3>
    {/if}
    
    <div class="wrapper">
        <div class="column">
            <ListView
                Key={keyFunc}
                List={active}
                Operations="copy"
                PanSpeed={0}
                SelectionLimit={1}
                DataToOffer={{ [keyType]: '' }}
                TypesToAccept={{ [keyType]: 'all' }}
                sortable={true}
                withTransitions={false}
                on:inserted-items={onFunc}
                on:removed-items={onFunc}
                on:sorted-items={onFunc}
                let:Item
            >
                <span class="name">
                    <ParsedText text={Item.name} />
                </span>
                <IconifyIcon icon={uiIcons.yes} />
            </ListView>
        </div>

        <div class="column">
            <ListView
                Key={keyFunc}
                List={inactive}
                Operations="copy"
                PanSpeed={0}
                SelectionLimit={1}
                DataToOffer={{ [keyType]: '' }}
                TypesToAccept={{ [keyType]: 'all' }}
                sortable={true}
                withTransitions={false}
                let:Item
            >
                <span class="name">
                    <ParsedText text={Item.name} />
                </span>
                <IconifyIcon icon={uiIcons.no} />
            </ListView>
        </div>
    </div>
</div>
