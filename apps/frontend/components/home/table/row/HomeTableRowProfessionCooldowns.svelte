<script lang="ts">
    import { DateTime } from 'luxon'

    import { professionCooldowns } from '@/data/professions/cooldowns'
    import { settingsStore, timeStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, ProfessionCooldown } from '@/types'

    import Tooltip from '@/components/tooltips/profession-cooldowns/TooltipProfessionCooldowns.svelte'

    export let character: Character

    let anyHalf: boolean
    let anyFull: boolean
    let cooldowns: ProfessionCooldown[]
    let have: number
    let total: number
    $: {
        anyHalf = false
        anyFull = false
        cooldowns = []
        have = 0
        total = 0

        for (const cooldownData of professionCooldowns) {
            if ($settingsStore.professions.cooldowns[cooldownData.key] === false) {
                continue
            }

            const charCooldown = character.professionCooldowns?.[cooldownData.key]
            if (!charCooldown) {
                continue
            }

            let seconds = 0
            for (const [tierSeconds, tierSubProfessionId, tierTraitId, tierMinimum] of cooldownData.cooldown) {
                if (seconds === 0) {
                    seconds = tierSeconds
                }
                else {
                    const charTrait = character.professionTraits?.[tierSubProfessionId]?.[tierTraitId]
                    if (charTrait && charTrait >= tierMinimum) {
                        seconds = tierSeconds
                    }
                }
            }

            const [charNext, , charMax] = charCooldown
            let [, charHave] = charCooldown
            let charFull: DateTime = undefined

            // if the next charge timestamp is in the past, add up to max charges and work
            // out when this character will be full
            if (charNext > 0) {
                charFull = DateTime.fromSeconds(charNext + ((charMax - charHave - 1) * seconds))
                const diff = Math.floor($timeStore.diff(DateTime.fromSeconds(charNext)).toMillis() / 1000)
                if (diff > 0) {
                    charHave = Math.min(charMax, charHave + 1 + Math.floor(diff / seconds))
                }
            }

            have += charHave
            total += charMax

            const per = charHave / charMax * 100
            if (per === 100) {
                anyFull = true
            }
            else if (per >= 50) {
                anyHalf = true
            }

            cooldowns.push({
                data: cooldownData,
                have: charHave,
                max: charMax,
                full: charFull,
                seconds,
            })
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 4rem);

        border-left: 1px solid $border-color;
        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

{#if total > 0}
    <td
        class:status-shrug={anyHalf && !anyFull}
        class:status-fail={anyFull}
        use:tippyComponent={{
            component: Tooltip,
            props: {
                character,
                cooldowns,
            },
        }}
    >
        {#if total > 0}
            {have} / {total}
        {/if}
    </td>
{:else}
    <td></td>
{/if}
