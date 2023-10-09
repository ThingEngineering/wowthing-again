<script lang="ts">
    import { settingsStore } from '@/stores'

    import BackgroundSelector from '@/components/common/BackgroundSelector.svelte'
    import RangeInput from '@/shared/forms/RangeInput.svelte'
    
    let filter: string
    $: {
        filter = [
            `brightness(${$settingsStore.characters.defaultBackgroundBrightness / 10})`,
            `saturate(${$settingsStore.characters.defaultBackgroundSaturation / 10})`,
        ].join(' ')
    }

    const getValue = (value: number): string => value === -1 ? 'Def' : `${value * 10}%`
</script>

<style lang="scss">
    .background-sliders {
        align-items: center;
        display: flex;
        margin-bottom: 0.5rem;

        :global(fieldset:not(:first-child)) {
            margin-left: 1.5rem;
        }
        :global(input) {
            width: 8rem;
        }
    }
    .backgrounds-wrapper {
        :global(img) {
            filter: var(--filter, unset);
        }
    }
</style>

<div class="settings-block">
    <h3>Default Background</h3>

    <div class="background-sliders">
        <RangeInput
            name="brightness"
            label={`Brightness <code>${getValue($settingsStore.characters.defaultBackgroundBrightness)}</code>`}
            min={0}
            max={10}
            bind:value={$settingsStore.characters.defaultBackgroundBrightness}
        />

        <RangeInput
            name="saturation"
            label={`Saturation <code>${getValue($settingsStore.characters.defaultBackgroundSaturation)}</code>`}
            min={0}
            max={10}
            bind:value={$settingsStore.characters.defaultBackgroundSaturation}
        />
    </div>

    <div
        class="backgrounds-wrapper"
        style:--filter={filter}
    >
        <BackgroundSelector
            bind:selected={$settingsStore.characters.defaultBackgroundId}
        />
    </div>
</div>
