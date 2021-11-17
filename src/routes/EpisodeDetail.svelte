<script lang="ts">
  import { PlaybackStatus } from 'foxcasts-core/lib/enums';
  import type { EpisodeExtended } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  export let params: { episodeId: string };

  let episode: EpisodeExtended | undefined;

  onMount(async () => {
    episode = await Core.episodes.query({ id: Number(params.episodeId) });
    console.log('episode', episode);
  });

  let selectedId: string;
  const queryUnsub = querystring.subscribe((val) => {
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);
</script>

<View
  headerText="Episode"
  menuItems={[
    {
      id: 'menu_stream',
      label: episode?.isDownloaded ? 'Play' : 'Stream',
      action: () => console.log('stream/play episode'),
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
  ]}
>
  <Typography type="titleSmall">{episode?.title}</Typography>
  <Typography>{episode?.description}</Typography>
</View>
