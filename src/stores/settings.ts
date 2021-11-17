import { writable } from 'svelte/store';
import { Settings, TextSize, Theme } from '../models';
import { getStorageItem, StorageKey } from '../services/storage';

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
