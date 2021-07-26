<script lang="ts">
    import type {CharacterMythicPlusAddonMap} from '@/types'

    export let addonMap: CharacterMythicPlusAddonMap

    let fortifiedInitial: number
    let fortifiedFinal: number
    let tyrannicalInitial: number
    let tyrannicalFinal: number
    $: {
        fortifiedInitial = addonMap.fortifiedScore?.score ?? 0
        tyrannicalInitial = addonMap.tyrannicalScore?.score ?? 0
        if (fortifiedInitial >= tyrannicalInitial) {
            fortifiedFinal = fortifiedInitial * 1.5
            tyrannicalFinal = tyrannicalInitial / 2
        }
        else {
            fortifiedFinal = fortifiedInitial / 2
            tyrannicalFinal = tyrannicalInitial * 1.5
        }
    }
</script>

<p>Overall score: {fortifiedFinal + tyrannicalFinal}</p>
<p>Fortified score: {fortifiedFinal} (base = {fortifiedInitial})</p>
<p>Tyrannical score: {tyrannicalFinal} (base = {tyrannicalInitial})</p>
