import type { StaticDataEnchantment } from '@/shared/stores/static/types/enchantment';

export function getEnchantmentText(id: number, enchant: StaticDataEnchantment): string {
    if (!enchant) {
        return `Enchant #${id}`;
    }

    let text = enchant.name;
    const values = enchant.values;

    if (values?.length > 0) {
        for (let i = 0; i < values.length; i++) {
            text = text.replace(`$k${i + 1}`, values[i].toString());
        }
    }

    return text;
}
