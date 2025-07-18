<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Language } from '@/enums/language';
    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getAccountCharacters from '@/utils/get-account-characters';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import Select from '@/shared/components/forms/Select.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';
    import { userState } from '@/user-home/state/user';

    let apiKey = $state('');

    async function onClick(event: Event) {
        event.preventDefault();

        const xsrf = document.getElementById('app').getAttribute('data-xsrf');
        const response = await fetch('/api/api-key-get', {
            headers: {
                RequestVerificationToken: xsrf,
            },
        });

        const obj = await response.json();
        apiKey = obj['key'];

        setTimeout(() => {
            apiKey = '';
        }, 8000);
    }
</script>

<style lang="scss">
    table {
        width: 100%;
    }
    th {
        background: $highlight-background;
        padding: 0.2rem 0.3rem;
    }

    .account-id {
        @include cell-width(7rem);
    }
    .account-tag {
        @include cell-width(4rem);

        text-align: center;
    }
    .account-enabled {
        @include cell-width(4rem);

        text-align: center;
    }
    .account-characters {
        @include cell-width(100%);

        code {
            word-spacing: -0.5ch;
        }
    }

    .api-key {
        align-items: center;
        display: flex;
        gap: 1rem;
        width: 100%;

        :first-child {
            flex: 0 0 18rem;
        }

        button {
            background: #0f2f0f;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            display: block;
            font-size: 1.2rem;
            margin: 0.3rem auto 0;
        }
        span {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            color: #00ccff;
            display: inline-block;
            font-size: 0.92rem;
            height: 100%;
            margin-top: 0.3rem;
            text-align: center;
        }

        p {
            flex: 1;
            margin: 0;
        }
    }
</style>

<div class="settings-block">
    <h3>Language</h3>

    <div class="setting">
        <Select
            name="general_language"
            bind:selected={settingsState.value.general.language}
            options={[
                [Language.deDE, '[deDE] Deutsch'],
                [Language.enUS, '[enUS] English'],
                [Language.esES, '[esES] Español (EU)'],
                [Language.esMX, '[esMX] Español (Latino)'],
                [Language.frFR, '[frFR] Français'],
                [Language.itIT, '[itIT] Italiano'],
                [Language.ptBR, '[ptBR] Português (Brasil)'],
                [Language.ruRU, '[ruRU] Русский'],
            ]}
        />
        <p>
            <strong>NOTE:</strong> this is a very new feature and only used in some places, work is ongoing.
        </p>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <Checkbox
            bind:value={settingsState.value.general.useEnglishRealmNames}
            name="general_useEnglishRealmNames"
        >
            Prefer English realm names (eg "[EU] Greymane" instead of "[EU] Седогрив")
        </Checkbox>
    </div>
</div>

<div class="settings-block">
    <h3 class="space-me">User Name</h3>

    <div class="setting">
        <TextInput
            name="general_DesiredAccountName"
            maxlength={32}
            placeholder="Desired user name"
            bind:value={settingsState.value.general.desiredAccountName}
        />
        <div>
            <p>
                If you would like to change your user name, change this and save changes. Your user
                name is currently: <code>{document.getElementById('user-name').innerText}</code>
            </p>
            <p>
                Your account will get renamed at some point in the future, log out/in to check.
                Pinging Freddie on Discord to remind him to do this regularly might help!
            </p>
        </div>
    </div>
</div>

<div class="settings-block">
    <h3 class="space-me">API Key</h3>

    <div class="api-key">
        {#if apiKey}
            <span>{apiKey}</span>
        {:else}
            <button onclick={onClick}>Reveal API Key</button>
        {/if}

        <p>
            Use this API key with <a href="https://github.com/ThingEngineering/wowthing-sync"
                >WoWthing Sync</a
            >
            to automate the uploading of your <code>WoWthing_Collector.lua</code>
            files.
        </p>
    </div>
</div>

<div class="settings-block">
    <h3 class="space-me">WoW Accounts</h3>

    <p>
        Tag is some short text that will display on character tables if "Account tag" is in your
        Common layout.
    </p>

    <table class="table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tag</th>
                <th>Enabled</th>
                <th>Characters</th>
            </tr>
        </thead>
        <tbody>
            {#each sortBy(Object.values(userState.general.accountById), (a) => a.accountId) as account (account.id)}
                {@const accountState = settingsState.value.accounts?.[account.id]}
                {@const accountCharacters = getAccountCharacters(account.id)}
                <tr>
                    <td class="account-id">
                        <code>{Region[account.region]}</code>
                        {account.accountId}
                    </td>
                    <td class="account-tag">
                        <TextInput
                            name="account_tag_${account.id}"
                            maxlength={4}
                            bind:value={accountState.tag}
                        />
                    </td>
                    <td class="account-enabled">
                        <Checkbox
                            name="account_enabled_${account.id}"
                            bind:value={accountState.enabled}
                        />
                    </td>
                    <td class="account-characters">
                        {#each accountCharacters as character, characterIndex (character.id)}
                            {characterIndex > 0 ? ', ' : ''}
                            <span class="class-{character.classId}">{character.name}</span>
                        {/each}
                        <code
                            class:status-fail={accountCharacters.length == 65}
                            class:status-shrug={accountCharacters.length > 45 &&
                                accountCharacters.length < 65}
                        >
                            ({accountCharacters.length} / 65)</code
                        >
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="setting full-width">
        <Checkbox
            name="characters_hideDisabledAccounts"
            bind:value={settingsState.value.characters.hideDisabledAccounts}
            >Hide characters on disabled accounts</Checkbox
        >
    </div>
</div>
