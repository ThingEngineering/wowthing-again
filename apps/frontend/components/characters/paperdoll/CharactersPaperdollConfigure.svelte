<script lang="ts">
    import debounce from 'lodash/debounce'

    import type { Character } from '@/types'

    import BackgroundSelector from '@/components/common/BackgroundSelector.svelte'
    import RangeInput from '@/shared/forms/RangeInput.svelte'

    export let backgroundBrightness: number
    export let backgroundSaturation: number
    export let character: Character
    export let selected: number

    let first = true
    let status = ''

    $: debouncedSave(selected, backgroundBrightness, backgroundSaturation)

    const getValue = (value: number): string => value === -1 ? 'Def' : `${value * 10}%`

    const debouncedSave = debounce(async (id: number, brightness: number, saturation: number) => {
        if (first) {
            first = false
            return
        }

        status = 'Saving...'

        const form = {
            backgroundId: id,
            backgroundBrightness: brightness,
            backgroundSaturation: saturation,
        }
        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        
        const response = await fetch(`/api/character/${character.id}/configuration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify(form),
        })

        if (response.ok) {
            status = 'Saved!'
        }
        else {
            status = 'ERROR!'
        }
    }, 500)
</script>

<style lang="scss">
    .configure {
        margin-top: 0.5rem;
    }
    .inputs {
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
    .status {
        margin-left: 1rem;
    }
    p {
        margin-bottom: 0;
    }
</style>

<div class="configure">
    <div class="inputs">
        <RangeInput
            name="brightness"
            label={`Brightness <code>${getValue(backgroundBrightness)}</code>`}
            min={-1}
            max={10}
            bind:value={backgroundBrightness}
        />

        <RangeInput
            name="saturation"
            label={`Saturation <code>${getValue(backgroundSaturation)}</code>`}
            min={-1}
            max={10}
            bind:value={backgroundSaturation}
        />

        <span class="status">{status}</span>
    </div>

    <BackgroundSelector
        bind:selected
        showDefault={true}
    />
    
    <p>You can change your default background in <a href="#/settings/characters">Settings > Characters</a></p>
</div>
