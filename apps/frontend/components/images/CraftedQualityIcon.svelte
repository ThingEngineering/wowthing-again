<script lang="ts">
    export let quality: number
</script>

<style lang="scss">
    img {
        --shadow-color: rgba(70, 70, 70, 0.5);

        height: 26px;
        margin-top: var(--image-margin-top, 0);
    }
    .crafted-quality-2 {
        height: 24px;
    }
    .crafted-quality-5 {

        //--shadow-color: rgb(255, 127, 0, 0.3);

        height: 22px;
    }
</style>

{#if quality > 0}
    <img
        src="https://img.wowthing.org/misc/crafting-{quality}.png"
        alt="Crafted Quality {quality}"
        class="crafted-quality-{quality} drop-shadow"
        loading="lazy"
    />
{/if}
