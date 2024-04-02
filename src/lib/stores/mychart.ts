import { readable, writable, derived } from 'svelte/store';

export const selectedEpoch = writable(210);
export const selectedEpoch2 = derived(selectedEpoch, $selectedEpoch => '' + $selectedEpoch);
export const AxisYvar = derived(selectedEpoch, $selectedEpoch => 'hours_' + $selectedEpoch);

export const donutWidth = writable(0);
export const donutHeight = writable(0);

export const colorTheme = writable('🌛 Night');


export const radiusTest = writable('3');

export const grpStakeData = writable();

export const windowWidth = writable(0);
export const windowHeight = writable(0);

export const utxoCat = writable('delegated');