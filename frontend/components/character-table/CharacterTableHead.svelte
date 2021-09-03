<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'

    import HeadIcon from './head/Icon.svelte'

    let iconComponents: any[]
    $: {
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
        {#if userStore.useAccountTags}
            <td></td>
        {/if}

        {#each iconComponents as iconComponent, iconIndex}
            <svelte:component this={iconComponent} padLeft={iconIndex === 0 ? null : '0px'} padRight={iconIndex === (iconComponents.length - 1) ? null : '0px'} />
        {/each}

        <th class="level"></th>
        <th class="name"></th>

        {#if $settings.general.showRealm}
            <th class="realm"></th>
        {/if}

        <slot />
    </tr>
</thead>
