import { mount } from 'svelte';
import { delegate } from 'tippy.js';
import type { ActionReturn } from 'svelte/action';

import { defaultProps } from '@/shared/utils/tooltips/default-props';

import Tooltip from './Tooltip.svelte';

export const delegatedTooltips = (node: HTMLElement): ActionReturn => {
    const delegateTaskTooltip = delegate(node, {
        target: '.tooltip-transmog-set',
        ...defaultProps,
        allowHTML: true,
        placement: 'left-start',
        content: '',
        onCreate: (instance) => {
            if (instance.reference === node) {
                return;
            }

            let cmp: Record<string, any> = null;
            instance.setProps({
                onShow(instance) {
                    if (cmp === null) {
                        const target = instance.popper.querySelector('.tippy-content');
                        target.replaceChildren();

                        const td = instance.reference as HTMLTableCellElement;
                        const tdData = td.dataset;
                        cmp = mount(Tooltip, {
                            target,
                            props: {
                                have: parseInt(tdData.have),
                                setKey: tdData.setKey,
                                setTitle: tdData.setTitle,
                                subType: tdData.subType,
                                total: parseInt(tdData.total),
                            },
                        });
                    }
                },
            });
        },
    });

    return {
        destroy: () => delegateTaskTooltip.destroy(),
    };
};
