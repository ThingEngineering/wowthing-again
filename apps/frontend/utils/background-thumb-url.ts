import type { BackgroundImage } from '@/types';

export default function backgroundThumbUrl(background: BackgroundImage): string {
    const pos = background.filename.lastIndexOf('/');
    const thumb =
        background.filename.substring(0, pos + 1) +
        'thumb_' +
        background.filename.substring(pos + 1);
    return `https://img.wowthing.org/backgrounds/${thumb}`;
}
