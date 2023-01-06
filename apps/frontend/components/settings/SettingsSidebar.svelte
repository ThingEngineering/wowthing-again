<script lang="ts">
    import { achievementStore, journalStore, manualStore, staticStore, userStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import type { Account, FancyStoreFetchOptions, Settings, SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    export const categories: SidebarItem[] = [
        {
            name: 'Account',
            slug: 'account',
        },
        {
            name: 'Layout',
            slug: 'layout',
            children: [
                {
                    name: 'Lockouts',
                    slug: 'lockouts',
                },
                {
                    name: 'Tasks',
                    slug: 'tasks',
                },
            ],
        },
        {
            name: 'Privacy',
            slug: 'privacy',
        },
        null,
        {
            name: 'Characters',
            slug: 'characters',
            children: [
                {
                    name: 'Pin',
                    slug: 'pin',
                },
                {
                    name: 'Sort',
                    slug: 'sort',
                },
                {
                    name: 'Toggles',
                    slug: 'toggles',
                },
            ],
        },
        null,
        {
            name: 'Achievements',
            slug: 'achievements',
        },
        {
            name: 'Auctions',
            slug: 'auctions',
            children: [
                {
                    name: 'Custom Categories',
                    slug: 'custom',
                }
            ],
        },
        {
            name: 'Collections',
            slug: 'collections',
        },
        {
            name: 'History',
            slug: 'history',
        },
        {
            name: 'Transmog',
            slug: 'transmog',
        },
    ]

    let buttonText = 'Save changes'
    async function saveOnClick() {
        buttonText = 'Saving...'

        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        const data = {
            accounts: $userStore.accounts,
            settings: $settingsStore,
        }

        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            const json = await response.json()
            const settings = json.settings as Settings
            settingsStore.set(settings)

            userStore.update(state => {
                for (const account of json.accounts as Account[]) {
                    state.accounts[account.id] = account
                }
                return state
            })
            buttonText = 'Saved!'

            const fetchOptions: Partial<FancyStoreFetchOptions> = {
                language: settings.general.language,
                evenIfLoaded: true,
                onlyIfLoaded: true,
            }
            await Promise.all([
                achievementStore.fetch(fetchOptions),
                journalStore.fetch(fetchOptions),
                manualStore.fetch(fetchOptions),
                staticStore.fetch(fetchOptions),
            ])

            setTimeout(() => { buttonText = 'Save changes'}, 1000)
        }
    }
</script>

<style lang="scss">
    button {
        background: $button-success;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        cursor: pointer;
        font-size: 1.1rem;
        margin-top: 1rem;
        width: 100%;
    }
</style>

<Sidebar
    alwaysExpand={true}
    baseUrl="/settings"
    items={categories}
    width="10rem"
>
    <svelte:fragment slot="after">
        <button on:click|preventDefault={saveOnClick}>{buttonText}</button>
    </svelte:fragment>
</Sidebar>
