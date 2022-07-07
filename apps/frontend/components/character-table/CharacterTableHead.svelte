<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'

    import HeadIcon from './head/Icon.svelte'
</script>

<style lang="scss">
    .level {
        @include cell-width($width-level);

        text-align: right;
    }
    .name {
        @include cell-width($width-name, $maxWidth: $width-name-max);
    }
    .realm {
        @include cell-width($width-realm, $maxWidth: $width-realm-max);
    }
</style>

<thead>
    <tr>
        {#each $settings.layout.commonFields as field}
            {#if field === 'accountTag' && userStore.useAccountTags}
                <th></th>

            {:else if field.startsWith('characterIcon')}
                <HeadIcon />

            {:else if field === 'characterLevel'}
                <th class="level"></th>

            {:else if field === 'characterName'}
                <th class="name"></th>

            {:else if field === 'realmName'}
                <th class="realm"></th>
            {/if}
        {/each}

        <slot />
    </tr>
</thead>
