<script lang="ts">
    import {Constants} from '@/data/constants'
    import type {CharacterWeeklyUghQuest} from '@/types'
    //import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let cls: string
    export let icon: string
    export let ughQuest: CharacterWeeklyUghQuest

    let text = ''
    if (ughQuest.status === 2) {
        text = 'Done'
    }
    else if (ughQuest.status === 1) {
        if (ughQuest.type === 'progressbar') {
            text = `${ughQuest.have} %`
        }
        else {
            text = `${ughQuest.have} / ${ughQuest.need}`
        }
    }
    else {
        text = 'Get!'
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-ugh-quest);

        white-space: nowrap;
        word-spacing: -0.2ch;

        &.anima {
            @include cell-width($width-ugh-anima);
        }
    }

    span {
        display: inline-block;
        flex: 1;
        margin-left: 0.3rem;

        &.status2 {
            color: #1eff00;
        }
        &.status1 {
            color: #ffff00;
            text-align: right;
        }
        &.status0 {
            color: #ff1e00;
        }
    }
</style>

<td class="{cls}">
    <div class="flex-wrapper">
        <WowthingImage name={icon} size={20} border={1} />
        <span class="status{ughQuest.status}">{text}</span>
    </div>
</td>
