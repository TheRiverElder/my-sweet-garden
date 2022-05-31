

import NormalItemCard from "./NormalItemCard.svelte";

export const itemRenderers = {};

export function getItemRenderer(id: string) {
    return itemRenderers[id] || NormalItemCard;
}