<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { settingsStore } from '@/user-home/stores/settings'

    export let extraParams: Record<string, string> = {}
    export let id: number
    export let noTooltip = false
    export let rename = false
    export let toComments = false
    export let tooltip: string = undefined
    export let type: string

    // TODO: hook up a setting to control links in new tabs

    let url = ''
    $: {
        url = `https://${settingsStore.wowheadBaseUrl}/${type}=${id}`

        if (Object.keys(extraParams || {}).length > 0) {
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
        href="{url}"
        rel="noopener"
        target="_blank"
        data-disable-wowhead-tooltip="{noTooltip ? 'true' : undefined}"
        data-wh-rename-link="{rename ? 'true' : undefined}"
        on:click
        use:basicTooltip={tooltip}
   >
        <slot />
    </a>
{:else}
    <slot />
{/if}
