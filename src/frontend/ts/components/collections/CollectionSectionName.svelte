<script lang="ts">
    import {getContext} from 'svelte'

    import {data as userData} from '../../stores/user-store'
    import {StaticDataSetCategory} from '../../types'

    export let section: StaticDataSetCategory
    export let slug: string

    const {route} = getContext("collection")
    $: counts = $userData.setCounts[route][`${slug}_${section.Slug}`]
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    h3 {
        margin: 0;
        padding: 0.25rem 0.5rem;
        width: 100%;
        background: $highlight-background;
        border-bottom: 1px solid $border-color;
        border-top-left-radius: $thing-border-radius;
        border-top-right-radius: $thing-border-radius;
    }
    span {
        font-size: 0.9rem;
        font-weight: normal;
    }
    em {
        color: mix($body-text, #00ff00, 80%);
    }
</style>

<h3>{section.Name} <span>[ <em>{ counts.have }</em> / <em>{ counts.total }</em> ]</span></h3>
