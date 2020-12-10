<script lang="ts">
    import find from 'lodash/find'
    import {getContext, setContext} from 'svelte'

    import CollectionGroup from './CollectionGroup.svelte'
    import CollectionSectionName from './CollectionSectionName.svelte'
    import {data as userData} from '../../stores/user-store'

    export let slug: string

    const {route, sets, thingMap, thingType, userHas} = getContext('collection')
    $: sections = find(sets, (s) => s[0].Slug === slug)
    $: counts = $userData.setCounts[route][slug]
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    section {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;
        display: flex;
        flex-wrap: wrap;

        & + section {
            margin-top: 1rem;
        }
    }
</style>

{#each sections as section}
    <section>
        {#if section.Name}
            <CollectionSectionName slug={slug} section={section} />
        {/if}
        {#each section.Groups as group, i (`${thingType}-${slug}-${i}`)}
            <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
        {/each}
    </section>
{/each}
