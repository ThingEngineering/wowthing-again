<script lang="ts">
    import type { CharacterProps } from '@/types/props';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import RaceIcon from '@/shared/components/images/RaceIcon.svelte';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    .info {
        --image-border-width: 2px;

        margin-top: 0.5rem;
        padding: 0.3wrem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{character.realm.name}</h5>
    <div class="info">
        <div class="faction{character.faction}">
            <RaceIcon border={2} size={32} {character} />
            <ClassIcon border={1} size={32} {character} />
        </div>
        <div>Level {character.level}</div>
    </div>
</div>
