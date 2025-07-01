<script lang="ts">
    import type { Snippet } from 'svelte';

    import ParsedText from './parsed-text/ParsedText.svelte';

    type Props = {
        children: Snippet;
        subTitle: string;
        title: string;
    };
    let { children, subTitle, title }: Props = $props();
</script>

<div class="wowthing-tooltip">
    <h4>
        <ParsedText text={title} />
    </h4>

    {#if subTitle}
        <h5>
            <ParsedText text={subTitle} />
        </h5>
    {/if}

    <table>
        <tbody>
            {@render children()}
        </tbody>
    </table>
</div>
