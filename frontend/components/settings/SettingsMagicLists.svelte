<script lang="ts">
    import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'
    import ListView from 'svelte-sortable-flat-list-view'

    import type { SettingsChoice } from '@/types'

    export let active: SettingsChoice[]
    export let inactive: SettingsChoice[]
    export let key: string
    export let onFunc: () => void
    export let title: string

    const keyType = `item/${key}`

    const keyFunc = (item: SettingsChoice) => item.key
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        gap: 0.5rem;

        & :global(svg) {
            margin-right: -4px;
        }
        & :global(.column:first-child svg) {
            color: $colour-success;
        }
        & :global(.column:last-child svg) {
            color: $colour-fail;
        }
    }

    .columns {
        flex: 1;

        h3 {
            text-align: center;
        }
    }

    .column {
        display: flex;
        flex: 1;
        flex-direction: column;

        & :global(.defaultListView) {
            background: $highlight-background;
            border: 1px solid $border-color;
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
                margin-top: 7px;
            }
        }
    }
</style>

<div class="columns">
    <h3>{title}</h3>
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
                {Item.name}
                <Fa fw icon={faCheck} pull="right" />
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
                {Item.name}
                <Fa fw icon={faTimes} pull="right" />
            </ListView>
        </div>
    </div>
</div>
