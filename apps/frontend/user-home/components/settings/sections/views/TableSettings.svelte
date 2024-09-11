<script lang="ts">
    import { commonChoices, homeChoices } from '../../data'
    import type { SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView
</script>

<style lang="scss">
    .common-columns {
        --magic-min-height: 11.4rem;
        --magic-max-height: 11.4rem;
    }
    .home-columns {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

<div class="settings-block common-columns">
    <MagicLists
        key="common"
        title="Common columns"
        choices={commonChoices}
        bind:activeStringIds={view.commonFields}
    />
</div>

<div class="settings-block home-columns">
    <MagicLists
        key="home"
        title="Home columns"
        choices={homeChoices}
        bind:activeStringIds={view.homeFields}
    />
</div>
