<script lang="ts">
    import type { StaticDataSubProfessionTraitNode } from '@/shared/stores/static/types';

    import Self from './CharacterProfessionsTraitsNode.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        indent: number;
        node: StaticDataSubProfessionTraitNode;
        traits: Record<number, number>;
    };
    let { indent, node, traits }: Props = $props();

    let value = $derived(traits?.[node.nodeId] || 0);
</script>

<style lang="scss">
    td {
        padding: 0.2rem 0.4rem;
    }
    .name {
        --image-border-width: 1px;
        --image-margin-top: -2px;
    }
    .number {
        text-align: right;
        width: 2.2rem;

        &:last-child {
            padding-right: 0.6rem;
        }
    }
    .slash {
        padding: 0.2rem 0;
        width: 0.3rem;
    }
</style>

<tr
    class:status-fail={value === 0}
    class:status-shrug={value > 0 && value - 1 < node.rankMax}
    class:status-success={value > node.rankMax}
    data-id={node.nodeId}
>
    <td class="name" style:padding-left={`${indent * 1 + 0.5}rem`}>
        <WowthingImage name="trait-node/{node.unlockEntryId}" border={1} size={16} />
        {node.name}
    </td>
    <td class="number">{Math.max(0, value - 1)}</td>
    <td class="slash">/</td>
    <td class="number">{node.rankMax}</td>
</tr>
{#each node.children || [] as childNode (childNode)}
    <Self indent={indent + 1} node={childNode} {traits} />
{/each}
