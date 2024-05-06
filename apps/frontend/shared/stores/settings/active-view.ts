import { location } from 'svelte-spa-router'
import { derived, type Readable } from 'svelte/store'

import { browserStore } from '../browser'
import { settingsStore } from './store'
import type { SettingsView } from './types'


