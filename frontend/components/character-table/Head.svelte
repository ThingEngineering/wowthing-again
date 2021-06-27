<script lang="ts">
    import { getContext } from 'svelte'

    import { data as settings } from '@/stores/settings'

    import HeadSpacer from './head/Spacer.svelte'

    let endSpacer: boolean
    $: endSpacer = getContext('endSpacer')
</script>

<style lang="scss">
    .icon {
        @include cell-width($width-icon, 0px);
    }
    .level {
        @include cell-width($width-level, 0.4rem);

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
        {#if $settings.general.showRaceIcon}
            <th class="icon"></th>
        {/if}

        {#if $settings.general.showClassIcon}
            <th class="icon"></th>
        {/if}

        {#if $settings.general.showSpecIcon}
            <th class="icon"></th>
        {/if}

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
