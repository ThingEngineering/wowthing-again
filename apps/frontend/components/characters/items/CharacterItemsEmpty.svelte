<script lang="ts">
    export let opacity: string = null;
    export let text = '';
</script>

<style lang="scss">
    div {
        background: $highlight-background;
        border: 2px solid lighten($color-fail, 15%);
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
