<script lang="ts">
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons';

    import IconifyWrapper from '../images/IconifyWrapper.svelte';
    import { questStatusClass } from '@/data/quests';
    import type { Icon } from '@/types/icons';

    type Props = {
        status: QuestStatus;
        cls?: string;
        useStatusColors?: boolean;
    };
    let { status, cls, useStatusColors }: Props = $props();

    let { icon, derivedClass } = $derived.by(() => {
        let retClass = [useStatusColors ? questStatusClass[status] : undefined, cls]
            .filter((s) => !!s)
            .join(' ');
        let retIcon: Icon;

        if (status === QuestStatus.NotStarted) {
            retIcon = uiIcons.starEmpty;
        } else if (status === QuestStatus.InProgress) {
            retIcon = uiIcons.starHalf;
        } else {
            retIcon = uiIcons.starFull;
        }

        return { icon: retIcon, derivedClass: retClass };
    });
</script>

<IconifyWrapper cls={derivedClass} {icon} />
