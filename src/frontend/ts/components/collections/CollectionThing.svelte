<script lang="ts">
    import find from 'lodash/find'

    import BaseImage from '../images/BaseImage.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let things

    $: userHasThing = find(things, (t) => userHas[t])
    $: thingId = thingMap[userHasThing ?? things[0]]
</script>

<style lang="scss">
    div {
        display: inline-block;
        margin-right: 2px;

        &.thing-yes {
            border: 1px solid #00ff00;
        }
        &.thing-no {
            border: 1px solid #ff0000;
        }
    }
</style>

<div class:thing-yes={userHasThing} class:thing-no={!userHasThing}>
    <a href="https://www.wowhead.com/{thingType}={thingId}">
        <BaseImage name="{thingType}_{thingId}" size="32" />
    </a>
</div>
