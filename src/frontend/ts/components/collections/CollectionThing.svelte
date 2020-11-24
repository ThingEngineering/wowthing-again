<script lang="ts">
    import find from 'lodash/find'

    import BaseImage from '../images/BaseImage.svelte'
    import {getContext} from 'svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let things

    const { hasStore, totalStore } = getContext("collection")

    $: userHasThing = find(things, (t) => userHas[t])
    $: thingId = thingMap[userHasThing ?? find(things, (t) => t > 0)]

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
        margin-right: 2px;

        &.thing-yes {
            border: 2px solid #00ff00;
        }
        &.thing-no {
            border: 2px solid $border-color;
            opacity: 0.5;
        }
    }
</style>

<div class:thing-yes={userHasThing} class:thing-no={!userHasThing}>
    <a href="https://www.wowdb.com/{thingType}s/{thingId}">
        <BaseImage name="{thingType}_{thingId}" size="32" />
    </a>
</div>
