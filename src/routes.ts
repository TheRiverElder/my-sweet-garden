import GardenPage from './components/pages/GardenPage.svelte';
import ShopPage from './components/pages/ShopPage.svelte';
import StoragePage from './components/pages/StoragePage.svelte';
import ProfilePage from './components/pages/ProfilePage.svelte';
import LabPage from './components/pages/LabPage.svelte';
import TestPage from './components/pages/TestPage.svelte';

export default {
    // '/': PlantListPage,
    '/garden': GardenPage,
    '/shop': ShopPage,
    '/storage': StoragePage,
    '/profile': ProfilePage,
    '/lab': LabPage,
    '/test': TestPage,
};