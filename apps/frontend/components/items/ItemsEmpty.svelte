<script lang="ts">
    let { opacity = null, text = '' }: { opacity?: string; text?: string } = $props();
</script>

<style lang="scss">
    td {
        padding: 2px;
    }
    div {
        background: var(--color-highlight-background);
        border: 2px solid var(--item-empty-border, var(--color-fail-border));
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        height: 44px;
        justify-content: center;
        line-height: 1.1;
        opacity: 0.6;
        text-align: center;
        vertical-align: center;
        width: 44px;
    }
</style>

<td>
    <div style:opacity>
        {@html text}
    </div>
</td>
