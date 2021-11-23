import { writable } from 'svelte/store';

export const selectedId = writable<string | undefined>(undefined);
