import type { IconifyIcon } from '@iconify/types';
import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

export type ComponentIcon = Component<SvelteHTMLElements['svg']>;
export type Icon = Component<SvelteHTMLElements['svg']> | IconifyIcon;
