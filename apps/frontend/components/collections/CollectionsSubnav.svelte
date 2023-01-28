<script lang="ts">
    import active from "svelte-spa-router/active";

    import { rewardTypeIcons } from "@/data/icons";
    import { RewardType } from "@/enums";
    import {
        journalStore,
        settingsStore,
        userStore,
        userTransmogStore,
    } from "@/stores";
    import getPercentClass from "@/utils/get-percent-class";

    import IconifyIcon from "@/components/images/IconifyIcon.svelte";

    $: mountsPercent = $userStore.setCounts["mounts"]["OVERALL"].percent;
    $: petsPercent = $userStore.setCounts["pets"]["OVERALL"].percent;
    $: toysPercent = $userStore.setCounts["toys"]["OVERALL"].percent;

    const fancyPercent = (percent: number): string =>
        (Math.floor(percent * 10) / 10).toFixed(1);
</script>

<div class="subnav-wrapper wrapper-column">
    <nav class="subnav" id="collections-subnav">
        <a href={"#/collections/heirlooms"} use:active> Heirlooms </a>
        <a href={"#/collections/illusions"} use:active>
            <IconifyIcon
                icon={rewardTypeIcons[RewardType.Illusion]}
                dropShadow={true}
            />
            Illusions
        </a>
        <a href={"#/collections/mounts"} use:active={"/collections/mounts/*"}>
            <IconifyIcon
                icon={rewardTypeIcons[RewardType.Mount]}
                dropShadow={true}
            />
            Mounts
            <span class="drop-shadow percent {getPercentClass(mountsPercent)}">
                {fancyPercent(mountsPercent)} %
            </span>
        </a>
        <a href={"#/collections/pets"} use:active={"/collections/pets/*"}>
            <IconifyIcon
                icon={rewardTypeIcons[RewardType.Pet]}
                dropShadow={true}
            />
            Pets
            <span class="drop-shadow percent {getPercentClass(petsPercent)}">
                {fancyPercent(petsPercent)} %
            </span>
        </a>
        <a href={"#/collections/toys"} use:active={"/collections/toys/*"}>
            <IconifyIcon
                icon={rewardTypeIcons[RewardType.Toy]}
                dropShadow={true}
            />
            Toys
            <span class="drop-shadow percent {getPercentClass(toysPercent)}">
                {fancyPercent(toysPercent)} %
            </span>
        </a>
    </nav>
</div>

<style lang="scss">
    .subnav-wrapper {
        background: $body-background;
        padding-bottom: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .subnav {
        --image-margin-top: -0.2rem;

        font-size: 1.1rem;
    }
</style>
