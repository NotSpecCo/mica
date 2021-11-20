<script lang="ts">
  import { format, formatDuration } from 'date-fns';
  import { PlaybackStatus } from 'foxcasts-core/lib/enums';
  import type { EpisodeExtended } from 'foxcasts-core/lib/types';
  import { formatTime } from 'foxcasts-core/lib/utils';
  import { onDestroy, onMount } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import { load } from '../components/AudioPlayer.svelte';
  import { Core } from '../services/core';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  export let params: { episodeId: string };

  let episode: EpisodeExtended | undefined;

  onMount(async () => {
    episode = await Core.episodes.query({ id: Number(params.episodeId) });
  });

  let selectedId: string;
  const queryUnsub = querystring.subscribe((val) => {
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);
</script>

<View
  headerText={episode?.podcastTitle}
  menuItems={[
    {
      id: 'menu_stream',
      label: episode?.isDownloaded ? 'Play' : 'Stream',
      action: () => load(episode.id),
    },
    {
      id: 'menu_resume',
      label: `Resume at ${formatTime(episode?.progress)}`,
      hidden: episode?.progress === 0,
      action: () => load(episode.id, true),
    },
    {
      id: 'menu_favorite',
      label: episode?.isFavorite ? 'Remove from favorites' : 'Add to favorites',
      action: () =>
        Core.episodes
          .update(episode.id, {
            isFavorite: episode.isFavorite ? 0 : 1,
          })
          .then(() => {
            episode.isFavorite = episode.isFavorite ? 0 : 1;
          }),
    },
    {
      id: 'menu_played',
      label: 'Mark as played',
      action: () =>
        Core.episodes
          .update(episode.id, {
            playbackStatus: PlaybackStatus.Played,
            progress: episode.duration,
          })
          .then(() => {
            episode.playbackStatus = PlaybackStatus.Played;
            episode.progress = episode.duration;
          }),
    },
    {
      id: 'menu_unplayed',
      label: 'Mark as unplayed',
      action: () =>
        Core.episodes
          .update(episode.id, {
            playbackStatus: PlaybackStatus.Unplayed,
            progress: 0,
          })
          .then(() => {
            episode.playbackStatus = PlaybackStatus.Unplayed;
            episode.progress = 0;
          }),
    },
  ].filter((a) => !a.hidden)}
>
  {#if episode}
    <Typography type="titleSmall">{episode.title}</Typography>
    <Typography
      >This episode was released on {format(new Date(episode.date), 'cccc, MMMM do')} and is {formatDuration(
        {
          hours: Math.floor(episode.duration / 3600),
          minutes: Math.floor((episode.duration % 3600) / 60),
        },
        { format: ['hours', 'minutes'] }
      )} long.</Typography
    >
    <Typography>{episode.description}</Typography>
  {/if}
</View>
