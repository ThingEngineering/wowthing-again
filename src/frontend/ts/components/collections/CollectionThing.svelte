<script lang="ts">
    import find from 'lodash/find'

    import type {Dictionary} from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let thingType: string
    export let thingMap: Dictionary<number>
    export let userHas: Dictionary<number>
    export let things: number[] = []

    let userHasThing: number | undefined
    let origId: number
    $: {
        userHasThing = find(things, (value: number): boolean => userHas[thingMap[value] || -1] !== undefined)
        origId = userHasThing ?? things[0]
    }
</script>

<style lang="scss">
    div {
        display: inline-block;

        &.thing-yes {
            border: 2px solid #44aa44;
        }
        &.thing-no {
            border: 2px solid $border-color;
            opacity: 0.5;
        }
    }
    div:not(:first-of-type) {
        margin-left: 2px;
    }
</style>

<div class:thing-yes={userHasThing} class:thing-no={!userHasThing}>
    <a href="https://www.wowdb.com/{thingType}s/{origId}">
        <WowthingImage name="{thingType}/{origId}" size={40} />
    </a>
</div>
