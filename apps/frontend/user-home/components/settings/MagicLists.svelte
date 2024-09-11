<script lang="ts">
    import { uiIcons } from '@/shared/icons'
    import type { SettingsChoice } from '@/shared/stores/settings/types'

    import MagicList from './MagicList.svelte'

    export let activeNumberIds: number[] = undefined
    export let activeStringIds: string[] = undefined
    export let choices: SettingsChoice[]
    export let key: string
    export let saveInactive = false
    export let title: string = undefined

    let activeItems: SettingsChoice[] = (activeNumberIds !== undefined
        ? activeNumberIds.map((id) => choices.find((item) => item.id === id.toString()))
        : activeStringIds.map((id) => choices.find((item) => item.id === id))
    ).filter((item) => !!item)
    let inactiveItems: SettingsChoice[] = choices.filter((item) => activeNumberIds !== undefined
        ? !activeNumberIds.includes(parseInt(item.id))
        : !activeStringIds.includes(item.id))

    function onActiveChange() {
        if (!saveInactive) {
            if (activeNumberIds !== undefined) {
                activeNumberIds = activeItems.map((item) => parseInt(item.id))
            } else {
                activeStringIds = activeItems.map((item) => item.id)
            }
        }
    }
    function onInactiveChange() {
        if (saveInactive) {
            if (activeNumberIds !== undefined) {
                activeNumberIds = activeItems.map((item) => parseInt(item.id))
            } else {
                activeStringIds = activeItems.map((item) => item.id)
            }
        }
    }
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
        height: var(--magic-max-height, 21rem);
        max-height: var(--magic-max-height, 21rem);
        min-height: var(--magic-min-height, none);
    }
</style>

<div class="columns">
    {#if title}
        <h3>{title}</h3>
    {/if}
    
    <div class="wrapper">
        <div class="column">
            {#if saveInactive}
                <MagicList
                    bind:items={inactiveItems}
                    icon={uiIcons.yes}
                    type={key}
                    onFunc={onInactiveChange}
                />
            {:else}
                <MagicList
                    bind:items={activeItems}
                    icon={uiIcons.yes}
                    type={key}
                    onFunc={onActiveChange}
                />
            {/if}
        </div>

        <div class="column">
            {#if saveInactive}
                <MagicList
                    bind:items={activeItems}
                    icon={uiIcons.no}
                    type={key}
                    onFunc={onActiveChange}
                />
            {:else}
                <MagicList
                    bind:items={inactiveItems}
                    icon={uiIcons.no}
                    type={key}
                    onFunc={onInactiveChange}
                />
            {/if}
        </div>
    </div>
</div>
