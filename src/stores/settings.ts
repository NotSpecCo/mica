import { writable } from 'svelte/store';
import { Settings, TextSize, Theme } from '../models';
import { getStorageItem, setStorageItem, StorageKey } from '../services/storage';

const defaultSettings: Settings = {
  theme: Theme.Light,
  textSize: TextSize.Medium,
  playbackSpeed: 1,
  playbackSkipBack: 10,
  playbackSkipForward: 30,
};

const storedSettings = getStorageItem<Settings>(StorageKey.Settings);

export const settings = writable<Settings>({
  ...defaultSettings,
  ...storedSettings,
});

export function updateSetting<T extends keyof Settings>(key: T, value: Settings[T]): void {
  settings.update((sett) => {
    const newVal = { ...sett, [key]: value };
    setStorageItem(StorageKey.Settings, newVal);
    return newVal;
  });
}
