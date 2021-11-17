import type { EpisodeExtended } from 'foxcasts-core/lib/types';

export type LineOptions = keyof Pick<
  EpisodeExtended,
  'title' | 'date' | 'description' | 'duration' | 'fileSize' | 'podcastTitle'
>;

export type FilterViewOptions = {
  title: LineOptions | null;
  subtitle: LineOptions | null;
};
