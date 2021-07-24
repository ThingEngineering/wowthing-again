<script lang="ts">
    import { getContext } from 'svelte'

    import { data as settings } from '@/stores/settings'

    import HeadIcon from './head/Icon.svelte'
    import HeadSpacer from './head/Spacer.svelte'

    let endSpacer: boolean
    let iconComponents: any[]
    $: {
        endSpacer = getContext('endSpacer')

        iconComponents = []
        if ($settings.general.showRaceIcon) {
            iconComponents.push(HeadIcon)
        }
        if ($settings.general.showClassIcon) {
            iconComponents.push(HeadIcon)
        }
        if ($settings.general.showSpecIcon) {
            iconComponents.push(HeadIcon)
        }
    }
</script>

<style lang="scss">
    .level {
        @include cell-width($width-level);

        text-align: right;
    }
    .name {
        @include cell-width($width-name);
    }
    .realm {
        @include cell-width($width-realm);
    }
</style>

<thead>
    <tr>
        {#each iconComponents as iconComponent, iconIndex}
            <HeadIcon padLeft={iconIndex === 0 ? null : '0px'} padRight={iconIndex === (iconComponents.length - 1) ? null : '0px'} />
        {/each}

        <th class="level"></th>
        <th class="name"></th>

        {#if $settings.general.showRealm}
            <th class="realm"></th>
        {/if}

        <slot />

        {#if endSpacer === true}
            <HeadSpacer />
        {/if}
    </tr>
</thead>
