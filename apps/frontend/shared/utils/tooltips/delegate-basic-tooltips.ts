import { delegate } from 'tippy.js';

import { defaultProps } from '@/shared/utils/tooltips/default-props';

export const delegateBasicTooltips = () => {
    const appNode = document.getElementById('app');
    return delegate(appNode, {
        target: '[data-tooltip]',
        ...defaultProps,
        allowHTML: true,
        content: '',
        onCreate: (instance) => {
            if (instance.reference === appNode) {
                return;
            }

            instance.setProps({
                onShow(instance) {
                    const ref = instance.reference as HTMLElement;
                    instance.setContent(ref.dataset.tooltip);
                },
            });
        },
    });
};
