<script lang="ts">
    export let text: string;
    export let title = 'Error';
</script>

<style lang="scss">
    div {
        padding: 1rem;
    }
    p {
        font-size: 120%;
        margin-bottom: 0;
    }
</style>

<div class="bg-fail border">
    <h1>{title}</h1>
    <p>{text}</p>
</div>
