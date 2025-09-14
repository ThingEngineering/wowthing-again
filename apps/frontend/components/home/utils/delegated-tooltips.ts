import { mount } from 'svelte';
import { delegate } from 'tippy.js';
import type { ActionReturn } from 'svelte/action';

import { defaultProps } from '@/shared/utils/tooltips/default-props';

import TooltipTaskRow from '@/components/tooltips/task/TooltipTaskRow.svelte';

export const delegatedTooltips = (node: HTMLElement): ActionReturn => {
    const delegateTaskTooltip = delegate(node, {
        target: '.tooltip-task',
        ...defaultProps,
        allowHTML: true,
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
                        cmp = mount(TooltipTaskRow, {
                            target,
                            props: {
                                characterId: parseInt(tdData.characterId),
                                fullTaskName: tdData.fullTaskName,
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
