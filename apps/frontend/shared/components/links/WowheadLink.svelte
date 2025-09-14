<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let extraParams: Record<string, string> = {};
    export let extraClass: string = undefined;
    export let id: number;
    export let noTooltip = false;
    export let rename = false;
    export let toComments = false;
    export let tooltip: string = undefined;
    export let type: string;

    // TODO: hook up a setting to control links in new tabs

    let url = '';
    $: {
        url = `https://${settingsState.wowheadBaseUrl}/${type}=${id}`;

        if (Object.keys(extraParams || {}).length > 0) {
            url += '?';
            let first = true;
            for (const param in extraParams) {
                if (extraParams[param] === undefined || extraParams[param] === '') {
                    continue;
                }

                if (first) {
                    first = false;
                } else {
                    url += '&';
                }
                url += `${param}=${extraParams[param]}`;
            }
        }

        if (toComments) {
            url += '#comments';
        }
    }
</script>

{#if id > 0}
    <a
        class="text-overflow{extraClass ? ` ${extraClass}` : ''}"
        href={url}
        rel="noopener"
        target="_blank"
        data-tooltip={tooltip}
        data-disable-wowhead-tooltip={noTooltip ? 'true' : undefined}
        data-wh-rename-link={rename ? 'true' : undefined}
        on:click
    >
        <slot />
    </a>
{:else}
    <slot />
{/if}
