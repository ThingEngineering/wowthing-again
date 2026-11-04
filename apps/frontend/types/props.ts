import type { Snippet } from 'svelte';
import type { DOMAttributes } from 'svelte/elements';

import type { Character } from './character';
import type { TippyProps } from '@/shared/utils/tooltips/types';

export type CharacterProps = {
    character: Character;
};

export type ChildrenProp = {
    children?: Snippet;
};

export type ButtonEventProps = Pick<DOMAttributes<HTMLButtonElement>, 'onclick'>;
export type InputEventProps = Pick<DOMAttributes<HTMLInputElement>, 'onchange' | 'oninput'>;
export type TextAreaEventProps = Pick<DOMAttributes<HTMLTextAreaElement>, 'onclick'>;

export type SlugsProps = {
    slug1: string;
    slug2?: string;
    slug3?: string;
    slug4?: string;
    slug5?: string;
    slug6?: string;
    slug7?: string;
    slug8?: string;
    slug9?: string;
};

export type ParamsSlugsProps = {
    params: SlugsProps;
};

export type SortableProps = {
    getSortState: (prefix?: string) => number;
    setSortState: (prefix?: string) => void;
};

export type ImageProps = {
    size: number;
    border?: number;
    cls?: string;
    tooltip?: TippyProps | string;
};
