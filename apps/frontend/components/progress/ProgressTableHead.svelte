<script lang="ts">
    import { progressState } from '@/stores/local-storage'
    import tippy from '@/utils/tippy'
    import type { ManualDataProgressGroup } from '@/types/data/manual'

    import CovenantIcon from '@/components/images/CovenantIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
import { covenantNameMap } from '@/data/covenant';

    export let group: ManualDataProgressGroup
    export let slugKey: string
    export let sortKey: string
    export let sortingBy: boolean

    let covenantName: string
    let icons: string[]
    let onClick: (event: Event) => void
    $: {
        icons = (group.icon || '').split(' ')
        onClick = function(event: Event) {
            event.preventDefault()
            $progressState.sortOrder[slugKey] = sortingBy ? null : sortKey
        }

        covenantName = ''
        const firstPart = group.name.startsWith('Night Fae') ? 'Night Fae' : group.name.split(' ')[0]
        if (covenantNameMap[firstPart]) {
            covenantName = firstPart
        }
    }
</script>

<style lang="scss">
    th {
        --image-border-color: $border-color;
        --image-border-radius: $border-radius;
        --image-border-width: 1px;

        @include cell-width($width-progress, $maxWidth: $width-progress-max);

        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: $width-padding;
        padding-top: $width-padding;
        text-align: center;
    }
    div {
        position: relative;
    }
    .pill {
        bottom: 0px;
    }
    .covenant-icon {
        --image-border-color: #cccc00;
        --image-border-radius: 50%;
        --image-border-width: 2px;

        background: $thing-background;
        border-radius: 50%;
        position: absolute;
        top: -7px;
        left: -7px;
    }
</style>

<th
    on:click={onClick}
    use:tippy={group.name}
>
    <div class="split-icon-{icons.length === 2 ? 'yes' : 'no'}">
        {#if icons.length === 2}
            <WowthingImage
                name={icons[0]}
                size={40}
                border={2}
            />
            <WowthingImage
                name={icons[1]}
                size={40}
                border={2}
            />
        {:else}
            <WowthingImage
                name={icons[0]}
                size={40}
                border={2}
            />
        {/if}

        {#if sortingBy}
            <TableSortedBy />
        {/if}

        {#if group.iconText}
            <span class="pill abs-center">
                <ParsedText text={group.iconText} />
            </span>
        {/if}

        {#if covenantName}
            <span class="covenant-icon">
                <CovenantIcon
                    {covenantName}
                    size={24}
                />
            </span>
        {/if}
    </div>
</th>
