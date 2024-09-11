<script lang="ts">
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView

    const groupByChoices: SettingsChoice[] = [
        {id: 'account', name: 'Account ID'},
        {id: 'enabled', name: 'Account status'},
        {id: 'faction', name: 'Faction'},
        {id: 'guild', name: 'Guild'},
        {id: 'maxlevel', name: 'Max level'},
        {id: 'pinned', name: 'Pinned'},
        {id: 'realm', name: 'Connected realm'},
    ]
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 11.4rem;
        --magic-max-height: 11.4rem;

        :global(.columns h3) {
            border-top: none;
            padding-top: 0;
        }
    }
</style>

<div class="settings-block">
    <MagicLists
        key="group-by"
        title="Group Characters By"
        choices={groupByChoices}
        bind:activeStringIds={view.groupBy}
    />
</div>
