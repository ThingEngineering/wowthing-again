<script lang="ts">
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';

    import Select from '@/shared/components/forms/Select.svelte';

    const regionStrings: Record<number, string> = {
        [Region.US]: '[US] Americas & Oceania',
        [Region.EU]: '[EU] Europe',
        [Region.KR]: '[KR] Korea',
        [Region.TW]: '[TW] Taiwan',
    };
</script>

<div class="settings-block">
    <h2>Home</h2>

    <h3 class="space-me">Holidays Region</h3>

    <div class="setting">
        <Select
            name="general_holiday_region"
            bind:selected={settingsState.value.general.holidayRegion}
            options={userState.general.allRegions.map((region) => [region, regionStrings[region]])}
        />
        <p>
            Region to use for holiday start/end times. If you only have accounts in a single region
            you shouldn't need to change this.
        </p>
    </div>
</div>
