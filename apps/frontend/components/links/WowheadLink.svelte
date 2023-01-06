<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'
    import tippy from '@/utils/tippy'

    export let extraParams: Record<string, string> = {}
    export let id: number
    export let noTooltip = false
    export let toComments = false
    export let rename = false
    export let tooltip: string = undefined
    export let type: string

    let url = ''
    $: {
        url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/${type}=${id}`

        if (Object.keys(extraParams).length > 0) {
            url += '?'
            let first = true
            for (const param in extraParams) {
                if (extraParams[param] === undefined || extraParams[param] === '') {
                    continue
                }

                if (first) {
                    first = false
                }
                else {
                    url += '&'
                }
                url += `${param}=${extraParams[param]}`
            }
        }
        
        if (toComments) {
            url += '#comments'
        }
    }
</script>

{#if id > 0}
    <a
        on:click
        href="{url}"
        data-disable-wowhead-tooltip="{noTooltip ? 'true' : undefined}"
        data-wh-rename-link="{rename ? 'true' : undefined}"
        use:tippy={tooltip}
   >
        <slot />
    </a>
{:else}
    <slot />
{/if}
