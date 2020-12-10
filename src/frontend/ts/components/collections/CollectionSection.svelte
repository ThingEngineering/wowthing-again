<script lang="ts">
    import find from 'lodash/find'
    import {getContext, setContext} from 'svelte'

    import CollectionGroup from './CollectionGroup.svelte'
    import CollectionSectionName from './CollectionSectionName.svelte'
    import {data as userData} from '../../stores/user-store'

    export let slug: string

    const {route, sets, thingMap, thingType, userHas} = getContext('collection')
    $: sections = find(sets, (s) => s !== null && s[0].Slug === slug)
    $: counts = $userData.setCounts[route][slug]
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    .section {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;

        & + section {
            margin-top: 1rem;
        }
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem 0 0 0.75rem;
    }
</style>

{#each sections as section}
    <div class="section">
        {#if section.Name}
            <CollectionSectionName slug={slug} section={section} />
        {/if}
        <div class="container">
            {#each section.Groups as group, i (`${thingType}-${slug}-${i}`)}
                <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
            {/each}
        </div>
    </div>
{/each}
