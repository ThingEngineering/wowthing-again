<script lang="ts">
    import { uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { SettingsTag } from '@/shared/stores/settings/types/tag';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    let deleting = $state(0);

    let currentIds = $derived((settingsState.value.tags || []).map((tag) => tag.id));

    const newTag = () => {
        let newId = 0;
        for (let i = 30; i > 20; i--) {
            if (!currentIds.includes(i)) {
                newId = i;
                break;
            }
        }

        if (newId === 0) {
            return;
        }

        const tag: SettingsTag = {
            id: newId,
            name: 'new-tag',
        };

        const newTags = (settingsState.value.tags || []).slice();
        newTags.push(tag);
        settingsState.value.tags = newTags;
    };

    const deleteConfirmClick = (tagId: number) => {
        deleting = 0;

        // Remove the tag from any characters that have it
        const mask = 1 << tagId;
        for (const [characterId, flags] of getNumberKeyedEntries(
            settingsState.value.characters.flags || {}
        )) {
            if ((flags & mask) === mask) {
                settingsState.value.characters.flags[characterId] = flags ^ mask;
            }
        }

        // Remove the tag
        settingsState.value.tags = settingsState.value.tags.filter((tag) => tag.id !== tagId);
    };
</script>

<style lang="scss">
    table {
        --image-margin-top: -4px;
        --padding: 2;
    }
    tr:first-child td {
        border-top: 1px solid var(--border-color);
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
        border-radius: var(--border-radius);
        cursor: pointer;
        margin-top: 0.75rem;
    }
</style>

<div class="settings-block">
    <UnderConstruction />

    <h3>Tags</h3>

    <table class="table table-striped">
        <tbody>
            {#each settingsState.value.tags as tag (tag.id)}
                <tr>
                    <td class="name">
                        <TextInput maxlength={16} name="tag-{tag.id}" bind:value={tag.name} />
                    </td>
                    <td class="icon" class:border-right={deleting === tag.id}>
                        <IconifyIcon
                            extraClass="status-fail"
                            icon={uiIcons.no}
                            tooltip="Delete"
                            on:click={() => (deleting = deleting === tag.id ? 0 : tag.id)}
                        />
                    </td>
                    {#if deleting === tag.id}
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
        <button class="group-entry" onclick={newTag}>New Tag</button>
    {/if}
</div>
