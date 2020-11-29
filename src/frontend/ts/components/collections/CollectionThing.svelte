<script lang="ts">
    import find from 'lodash/find'

    import WowthingImage from '../images/sources/WowthingImage.svelte'
    import {getContext} from 'svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let things

    const { hasStore, totalStore } = getContext("collection")

    $: userHasThing = find(things, (t) => userHas[thingMap[t] || 0])
    $: origId = userHasThing ?? things[0]

    $: {
        if (userHasThing) {
            hasStore.update(n => n + 1)
        }
    }
    totalStore.update(n => n + 1)
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    div {
        display: inline-block;

        &.thing-yes {
            border: 2px solid #00ff00;
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
        <WowthingImage name="{thingType}_{origId}" size=32 />
    </a>
</div>
