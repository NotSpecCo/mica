import type { EpisodeExtended } from 'foxcasts-core/lib/types';

export type PlaybackProgress = {
  episode: EpisodeExtended | undefined;
  playing: boolean;
  currentTime: number;
  duration: number;
};
