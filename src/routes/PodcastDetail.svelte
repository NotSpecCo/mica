<script lang="ts">
  import type { EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
  import { onMount } from 'svelte';
  import { pop, push } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import Expandable from '../ui-components/Expandable.svelte';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  export let params: { podcastId: string };

  let podcast: Podcast | undefined;
  let episodes: EpisodeExtended[] = [];

  onMount(async () => {
    podcast = await Core.podcasts.query({ id: Number(params.podcastId) });
    episodes = await Core.episodes.queryAll({ podcastIds: [Number(params.podcastId)], limit: 20 });
  });
</script>

<View
  headerText={podcast?.title}
  menuItems={[
    {
      id: 'menu_unsubscribe',
      label: 'Unsubscribe',
      action: () => Core.podcasts.unsubscribe({ id: podcast?.id }).then(() => pop()),
    },
    {
      id: 'menu_favorite',
      label: podcast?.isFavorite ? 'Remove from favorites' : 'Add to favorites',
      action: () =>
        Core.podcasts.update(podcast.id, { isFavorite: podcast?.isFavorite ? 0 : 1 }).then(() => {
          podcast.isFavorite = podcast?.isFavorite ? 0 : 1;
        }),
    },
  ]}
>
  <Expandable
    selectable={{
      id: 'showMoreDesc',
    }}
  >
    <Typography>{podcast?.description}</Typography>
  </Expandable>
  <Typography type="titleSmall" transform="uppercase">Episodes</Typography>
  {#each episodes as episode (episode.id)}
    <ListItem
      title={episode.title}
      selectable={{
        id: episode.id.toString(),
        onSelect: () => push(`/episodes/${episode.id}`),
      }}
    />
  {/each}
</View>
