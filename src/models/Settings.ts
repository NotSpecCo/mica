export enum TextSize {
  Smallest = 'smallest',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Largest = 'largest',
}

export type Settings = {
  warmth: number;
  textSize: TextSize;
  playbackSpeed: number;
  playbackSkipBack: number;
  playbackSkipForward: number;
};
