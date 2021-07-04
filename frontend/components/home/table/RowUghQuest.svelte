<script lang="ts">
    import type {CharacterWeeklyUghQuest} from '@/types'
    //import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let cls: string = undefined
    export let icon: string
    export let ughQuest: CharacterWeeklyUghQuest

    let status = ''
    let text = ''
    $: {
        if (ughQuest.status === 2) {
            status = 'success'
            text = 'Done'
        } else if (ughQuest.status === 1) {
            status = 'shrug'
            if (ughQuest.type === 'progressbar') {
                text = `${ughQuest.have} %`
            } else {
                text = `${ughQuest.have} / ${ughQuest.need}`
            }
        } else {
            status = 'fail'
            text = 'Get!'
        }
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

        &.status-shrug {
            text-align: right;
        }
    }
</style>

<td class="{cls}">
    <div class="flex-wrapper">
        <WowthingImage name={icon} size={20} border={1} />
        <span class="status-{status}">{text}</span>
    </div>
</td>
