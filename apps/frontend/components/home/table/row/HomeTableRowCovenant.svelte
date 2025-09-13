<script lang="ts">
    import { Constants } from '@/data/constants';
    import { covenantMap, covenantOrder } from '@/data/covenant';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/covenant/TooltipCovenant.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { character }: CharacterProps = $props();

    let characterCovenants = $derived(character?.shadowlands?.covenants || {});
    let covenant = $derived(covenantMap[character?.shadowlands?.covenantId]);
</script>

<style lang="scss">
    td {
        border-left: 1px solid var(--border-color);

        &.current {
            @include cell-width($width-covenant);
        }
        &.all {
            @include cell-width($width-covenant-all);

            .flex-wrapper {
                gap: calc(0.4rem - 4px);
                justify-content: center;

                a,
                span {
                    display: inline-block;
                    text-align: center;
                    width: 26px;
                }
                a {
                    color: $body-text;

                    &:hover {
                        color: $link-color;
                    }

                    &.active {
                        border: 1px solid var(--color-shrug);
                        border-radius: var(--border-radius);
                        line-height: 1.3;
                    }
                }
            }
        }
    }
</style>

<td
    class={settingsState.value.layout.covenantColumn}
    use:componentTooltip={{
        component: Tooltip,
        props: { character },
    }}
>
    <div class="flex-wrapper">
        {#if settingsState.value.layout.covenantColumn === 'current'}
            {#if covenant !== undefined}
                <WowthingImage name={covenant.icon} size={20} border={1} />
                <span
                    class:status-success={character.shadowlands.renownLevel >= Constants.maxRenown}
                    >{character.shadowlands.renownLevel}</span
                >
            {/if}
        {:else}
            {#each covenantOrder as covenantId (covenantId)}
                {#if characterCovenants[covenantId]}
                    <a
                        href="#/characters/{character.realm
                            .slug}/{character.name}/shadowlands/{covenantMap[covenantId].slug}"
                        class:active={covenantId === character.shadowlands?.covenantId}
                        class:status-success={characterCovenants[covenantId].renown ===
                            Constants.maxRenown}>{characterCovenants[covenantId].renown}</a
                    >
                {:else}
                    <span class="status-fail">---</span>
                {/if}
            {/each}
        {/if}
    </div>
</td>
