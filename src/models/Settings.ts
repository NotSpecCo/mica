export enum TextSize {
  Smallest = 'smallest',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Largest = 'largest',
}

export enum DisplayType {
  Normal = 'normal',
  Compact = 'compact',
  Hidden = 'hidden',
}

export type Settings = {
  warmth: number;
  textSize: TextSize;
  headerDisplay: DisplayType;
  footerDisplay: DisplayType;
  playbackSpeed: number;
  playbackSkipBack: number;
  playbackSkipForward: number;
};
