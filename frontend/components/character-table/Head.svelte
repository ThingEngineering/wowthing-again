<script lang="ts">
    import { getContext } from 'svelte'

    import { data as settings } from '@/stores/settings'

    let endSpacer: boolean
    $: endSpacer = getContext('endSpacer')
</script>

<style lang="scss">
    tr :global(th) {
        background: $thing-background;
    }
    .spacer {
        min-width: $character-width-spacer;
        width: $character-width-spacer;
    }
    .icon {
        min-width: $character-width-icon;
        width: $character-width-icon;
    }
    .level {
        padding-left: 0.5rem;
        text-align: right;
        min-width: $character-width-level;
        width: $character-width-level;
    }
    .name {
        padding-left: 0.5rem;
        min-width: $character-width-name;
        width: $character-width-name;
    }
    .realm {
        min-width: $character-width-realm;
        width: $character-width-realm;
    }
</style>

<thead>
    <tr>
        {#if $settings.general.showRaceIcon}
            <th class="icon" />
        {/if}
        {#if $settings.general.showClassIcon}
            <th class="icon" />
        {/if}
        {#if $settings.general.showSpecIcon}
            <th class="icon" />
        {/if}
        <th class="level" />
        <th class="name" />
        {#if $settings.general.showRealm}
            <th class="realm" />
        {/if}
        <slot />
        {#if endSpacer === true}
            <th class="spacer" />
        {/if}
    </tr>
</thead>
