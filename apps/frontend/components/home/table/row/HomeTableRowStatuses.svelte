<script lang="ts">
    import { DateTime } from 'luxon';

    import { Constants } from '@/data/constants';
    import { openables } from '@/data/openables';
    import { contractAuras } from '@/data/reputation';
    import { durationAuras, staticAuras } from '@/data/spells';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import { wowthingData } from '@/shared/stores/data';
    import { toNiceDuration } from '@/utils/formatting';
    import type { Character } from '@/types';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let character: Character;

    let images: [string, string, string?][];
    $: {
        images = [];

        if (character.auras?.[418563] !== undefined) {
            images.push([Constants.icons.anniversary, 'Anniversary Buff']);
        }

        for (const [spellId, spellName] of durationAuras) {
            const aura = character.auras?.[spellId];
            if (aura) {
                const lines = [spellName];
                let hours = 0;
                let minutes = 0;

                if (aura.duration) {
                    minutes = aura.duration / 60;
                    hours = minutes / 60;
                } else if (aura.expires) {
                    const expires = DateTime.fromSeconds(aura.expires);
                    if (expires > $timeStore) {
                        const milliseconds = expires.diff($timeStore).toMillis();
                        minutes = milliseconds / 1000 / 60;
                        hours = minutes / 60;
                    }
                }

                if (hours > 0 || minutes > 0) {
                    const timeText =
                        minutes < 100 ? `${Math.floor(minutes)}m` : `${Math.round(hours)}h`;
                    const iconText = aura.stacks > 0 ? aura.stacks.toString() : timeText;

                    if (aura.stacks > 0) {
                        lines.push(`${aura.stacks} stacks`);
                    }
                    lines.push(`${timeText} remaining`);

                    images.push([
                        `spell/${spellId}`,
                        `<div class="center">${lines.join('<br>')}</div>`,
                        iconText,
                    ]);
                }
            }
        }

        for (let auraIndex = 0; auraIndex < staticAuras.length; auraIndex++) {
            const [spellId, auraTooltip] = staticAuras[auraIndex];
            const aura = character.auras?.[spellId];
            if (aura) {
                images.push([
                    `spell/${spellId}`,
                    `<div class="center">${auraTooltip}</div>`,
                    auraIndex <= 7 ? (auraIndex + 1).toString() : null,
                ]);
            }
        }

        if (character.level < Constants.characterMaxLevel) {
            if (character.chromieTime) {
                images.push([Constants.icons.chromieTime, 'Chromie Time']);
            }
            if (character.isResting) {
                images.push([Constants.icons.resting, 'Resting']);
            }
        }

        if (character.isWarMode) {
            images.push([Constants.icons.warMode, 'War Mode']);
        }

        for (const spellId in contractAuras) {
            if (character.auras?.[spellId]?.expires > 0) {
                const diff = DateTime.fromSeconds(character.auras[spellId].expires)
                    .diff($timeStore)
                    .toMillis();
                if (diff <= 0) {
                    continue;
                }

                const niceRemaining = toNiceDuration(diff).replace('&nbsp;', '');
                const [reputationId, rank] = contractAuras[spellId];
                const reputation = wowthingData.static.reputationById.get(reputationId);
                images.push([
                    `spell/${spellId}`,
                    `<div class="center">{craftedQuality:${rank}} ${reputation.name}<br>${niceRemaining} remaining</div>`,
                ]);
            }
        }

        const openableItems: [number, number][] = [];
        openables.forEach((itemId) => {
            const itemCount = character.getItemCount(itemId);
            if (itemCount > 0) {
                openableItems.push([itemId, itemCount]);
            }
        });

        if (openableItems.length > 0) {
            openableItems.sort((a, b) => {
                const aItem = wowthingData.items.items[a[0]];
                const bItem = wowthingData.items.items[b[0]];
                if (!aItem || !bItem) {
                    return 0;
                }

                if (aItem.quality !== bItem.quality) {
                    return aItem.quality - bItem.quality;
                }
                return aItem.name.localeCompare(bItem.name);
            });

            const lines: string[] = [];
            for (const [itemId, itemCount] of openableItems) {
                lines.push(`${itemCount}x {itemWithIcon:${itemId}}`);
            }

            images.push([
                'item/163633',
                `<div>${lines.join('<br>')}</div>`,
                openableItems.reduce((a, b) => a + b[1], 0).toString(),
            ]);
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(var(--width, 0));

        border-left: 1px solid $border-color;
        white-space: nowrap;

        & :global(img) {
            border-radius: $border-radius;

            &:not(:first-child) {
                margin-left: 3px;
            }
        }
    }
    .flex-wrapper {
        --image-margin-top: -4px !important;

        justify-content: start;
        gap: 3px;
    }
    .status-icon {
        position: relative;
    }
    .pill {
        bottom: -2px;
        font-size: 85%;
        left: 50%;
        opacity: 0.9;
        pointer-events: none;
        position: absolute;
        transform: translateX(-50%);

        &.small-text {
            font-size: 70%;
            padding: 0 1px 1px 1px;
        }
    }
</style>

<td style:--width="calc((22px * {images.length}) + (3px * ({images.length} - 1)))">
    <div class="flex-wrapper">
        {#each images as [icon, tooltip, iconText]}
            <div class="status-icon">
                <WowthingImage name={icon} size={20} border={1} {tooltip} />

                {#if iconText}
                    <span class="pill" class:small-text={iconText.length >= 3}>
                        {iconText}
                    </span>
                {/if}
            </div>
        {/each}
    </div>
</td>
