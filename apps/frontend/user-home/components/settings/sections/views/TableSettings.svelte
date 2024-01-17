<script lang="ts">
    import debounce from 'lodash/debounce'

    import { commonChoices, homeChoices } from '../../data'
    import type { SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView

    const commonActive = view.commonFields
        .map((field) => commonChoices.filter((c) => c.key === field)[0])
        .filter((field) => !!field)
    const commonInactive = commonChoices.filter((field) => commonActive.indexOf(field) === -1)

    const homeActive = view.homeFields
        .map((field) => homeChoices.filter((c) => c.key === field)[0])
        .filter((field) => !!field)
    const homeInactive = homeChoices.filter((field) => homeActive.indexOf(field) === -1)

    const onCommonChange = debounce(() => {
        view.commonFields = commonActive.map((field) => field.key)
    })
    const onHomeChange = debounce(() => {
        view.homeFields = homeActive.map((field) => field.key)

        document.dispatchEvent(new CustomEvent('homeFieldsUpdated', { detail: view.homeFields }))
    })
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
        onFunc={onCommonChange}
        active={commonActive}
        inactive={commonInactive}
    />
</div>

<div class="settings-block home-columns">
    <MagicLists
        key="home"
        title="Home columns"
        onFunc={onHomeChange}
        active={homeActive}
        inactive={homeInactive}
    />
</div>
