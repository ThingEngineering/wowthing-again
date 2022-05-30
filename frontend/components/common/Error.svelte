<script lang="ts">
    export let text: string
    export let title = 'Error'
</script>

<style lang="scss">
    div {
        background: fade-out($colour-fail, 0.75);
        padding: 1rem;
    }
    p {
        font-size: 120%;
        margin-bottom: 0;
    }
</style>

<div class="border">
    <h1>{title}</h1>
    <p>{text}</p>
</div>
