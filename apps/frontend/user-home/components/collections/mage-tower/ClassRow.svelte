<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { UserCount } from '@/types/user-count';
    import { getGenderedName } from '@/utils/get-gendered-name';

    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';

    type Props = {
        classData: [number, boolean][];
        classId: number;
    };
    let { classData, classId }: Props = $props();

    let cls = $derived(wowthingData.static.characterClassById.get(classId));
    let name = $derived(getGenderedName(cls.name));
</script>

<style lang="scss">
    .name {
        padding: 0.3rem 0.5rem;
        text-align: right;

        :global(> span) {
            font-size: 100%;
            margin-left: 0;
        }
    }
    .challenge {
        --image-border-width: 2px;

        padding: 0.4rem;
        text-align: center;

        .border-fail {
            filter: grayscale(100%) brightness(80%) sepia(100%) hue-rotate(-50deg) saturate(100%)
                contrast(0.9);
        }
    }
</style>

<tr>
    <td class="name">
        {name}
        <br />
        <CollectibleCount
            counts={new UserCount(
                classData.filter(([, has]) => has).length,
                classData.filter(([specIndex]) => specIndex !== undefined).length
            )}
        />
    </td>
    {#each classData as [specIndex, has], index (`${classId}-${index}`)}
        <td class="challenge b-l" class:faded={specIndex === undefined}>
            {#if specIndex !== undefined}
                {@const specId = cls.specializationIds[specIndex]}
                <span class:border-fail={!has} class:border-success={has}>
                    <SpecializationIcon {specId} size={40} border={2} />
                </span>
            {/if}
        </td>
    {/each}
</tr>
