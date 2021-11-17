export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum TextSize {
  Smallest = 'smallest',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Largest = 'largest',
}

export type Settings = {
  theme: Theme;
  textSize: TextSize;
  playbackSpeed: number;
  playbackSkipBack: number;
  playbackSkipForward: number;
};
