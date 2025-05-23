<script lang="ts">
    import { writable } from 'svelte/store'

    import { uiIcons } from '@/shared/icons';
    import { settingsStore } from '@/shared/stores/settings';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { SettingsTag } from '@/shared/stores/settings/types/tag';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    $: currentIds = ($settingsStore.tags || []).map((tag) => tag.id)

    const deleting = writable<number>(null)

    const newTag = () => {
        let newId = 0;
        for (let i = 30; i > 20; i--) {
            if (!currentIds.includes(i)) {
                newId = i
                break
            }
        }

        if (newId === 0) { return }

        const tag: SettingsTag = {
            id: newId,
            name: 'new-tag',
        }

        const newTags = ($settingsStore.tags || []).slice()
        newTags.push(tag)
        $settingsStore.tags = newTags
    }

    const deleteConfirmClick = (tagId: number) => {
        $deleting = null

        // Remove the tag from any characters that have it
        const mask = 1 << tagId
        for (const [characterId, flags] of getNumberKeyedEntries($settingsStore.characters.flags || {})) {
            if ((flags & mask) === mask) {
                $settingsStore.characters.flags[characterId] = flags ^ mask
            }
        }

        // Remove the tag
        $settingsStore.tags = $settingsStore.tags.filter((tag) => tag.id !== tagId)
    }
</script>

<style lang="scss">
    table {
        --image-margin-top: -4px;
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid $border-color;
    }
    .name {
        @include cell-width(12rem);
    }
    .icon {
        @include cell-width(1.2rem);

        :global(svg) {
            cursor: pointer;
        }
        :global(svg:focus) {
            outline: none;
        }
    }
    .deleting {
        border-bottom-width: 0;
        border-right-width: 0;
        padding-left: 1rem;

        :global(svg) {
            cursor: pointer;
        }
    }
    button {
        background: darken($color-success, 40%);
        border: 1px solid darken($color-success, 20%);
        border-radius: $border-radius;
        cursor: pointer;
        margin-top: 0.75rem;
    }
</style>

<div class="settings-block">
    <UnderConstruction />

    <h3>Tags</h3>

    <table class="table table-striped">
        <tbody>
            {#each $settingsStore.tags as tag}
                <tr>
                    <td class="name">
                        <TextInput
                            maxlength={16}
                            name="tag-{tag.id}"
                            bind:value={tag.name}
                        />
                    </td>
                    <td
                        class="icon"
                        class:border-right={$deleting === tag.id}
                    >
                        <IconifyIcon
                            extraClass="status-fail"
                            icon={uiIcons.no}
                            tooltip="Delete"
                            on:click={() => deleting.update((current) => current === tag.id ? null : tag.id)}
                        />
                    </td>
                    {#if $deleting === tag.id}
                        <td class="deleting">
                            Permanently delete?
                            <IconifyIcon
                                extraClass="status-fail"
                                icon={uiIcons.yes}
                                tooltip="Delete"
                                on:click={() => deleteConfirmClick(tag.id)}
                            />
                        </td>
                    {/if}
                </tr>
            {:else}
                <tr>
                    <td class="name">No tags!</td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if currentIds.length < 10}
        <button
            class="group-entry"
            on:click={newTag}
        >
            New Tag
        </button>
    {/if}
</div>
