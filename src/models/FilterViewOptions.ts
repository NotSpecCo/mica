import type { EpisodeExtended } from 'foxcasts-core/lib/types';
import type { IconName } from '../ui-components/Icon.svelte';

export type LineOptions = keyof Pick<
  EpisodeExtended,
  'title' | 'date' | 'description' | 'duration' | 'fileSize' | 'podcastTitle'
>;

export type FilterViewOptions = {
  icon: IconName | null;
  title: LineOptions | null;
  subtitle: LineOptions | null;
};
