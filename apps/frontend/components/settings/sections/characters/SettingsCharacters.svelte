<script lang="ts">
    import { data as settings } from '@/stores/settings'

    import BackgroundSelector from '@/components/common/BackgroundSelector.svelte'
</script>

<style lang="scss">

</style>

<div class="thing-container settings-container">
    <h2>Characters</h2>

    <h3>Default Background</h3>
    <BackgroundSelector
        bind:selected={$settings.characters.defaultBackground}
    />
</div>
