import { genProfile } from "../test/profiles";
import { EventDispatcher } from "../utils/EventDisppatcher";
import { Ticker } from "../utils/Ticker";
import type { Profile } from "./interfaces/profile";
import { FertilizerItem } from "./items/FertilizerItem";
import { PlantItem } from "./items/PlantItem";
import { Branch } from "./plant-parts/Branch";
import { Flower } from "./plant-parts/Flower";
import { Leaf } from "./plant-parts/Leaf";
import { Seed } from "./plant-parts/Seed";
import { Canvas2DRenderer } from "./plant-renderers/Canvas2DRenderer";
import { REGISTRIES } from "./registries";

let profile: Profile;

export function getProfile() {
    laodOrCreateProfile();
    return profile;
}

function laodOrCreateProfile() {
    if (!profile) {
        profile = genProfile();
    }
}

let ticker: Ticker;

export function getTicker() {
    if (!ticker) {
        ticker = new Ticker(1000, getProfile().time);
        ticker.on(() => {
            const profile = getProfile();
            profile.time += 1;
            profile.garden.forEach(plant => plant.tick());
            profileChangedEventDispatcher.emit(profile)
        });
    }
    return ticker;
}

export function convertGameTimeToDate(gameTime: number): Date {
    return new Date(new Date(2022, 1).getTime() + gameTime * 1000 * 1000 / 20);
}

export function convertAgeToDate(age: number): Date {
    return new Date(age * 1000 * 1000 / 20);
}

let profileChangedEventDispatcher = new EventDispatcher<Profile>();

export function getProfileChangedEventDispatcher() {
    return profileChangedEventDispatcher;
}

function init() {
    REGISTRIES.PLANT_PART_TYPE.register('seed', Seed.TYPE);
    REGISTRIES.PLANT_PART_TYPE.register('branch', Branch.TYPE);
    REGISTRIES.PLANT_PART_TYPE.register('leaf', Leaf.TYPE);
    REGISTRIES.PLANT_PART_TYPE.register('flower', Flower.TYPE);

    REGISTRIES.PLANT_PART_NUMBER.register(Seed.TYPE.num, Seed.TYPE);
    REGISTRIES.PLANT_PART_NUMBER.register(Branch.TYPE.num, Branch.TYPE);
    REGISTRIES.PLANT_PART_NUMBER.register(Leaf.TYPE.num, Leaf.TYPE);
    REGISTRIES.PLANT_PART_NUMBER.register(Flower.TYPE.num, Flower.TYPE);

    REGISTRIES.ITEM_TYPE.register('plant', PlantItem.TYPE);
    REGISTRIES.ITEM_TYPE.register('fertilizer', FertilizerItem.TYPE);

    REGISTRIES.PLANT_RENDERER.register('2d', new Canvas2DRenderer());
}

init();