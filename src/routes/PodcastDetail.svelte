<script lang="ts">
  import type { EpisodeExtended, Podcast } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { push, querystring } from 'svelte-spa-router';
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
    console.log('podcast', podcast, episodes);
  });

  let selectedId: string;
  const queryUnsub = querystring.subscribe((val) => {
    const id = new URLSearchParams(val).get('selected');
    console.log('query string id', id);
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);
</script>

<View
  headerText={podcast?.title}
  menuItems={[
    {
      id: 'menu_unsubscribe',
      label: 'Unsubscribe',
      action: () => console.log('unsubscribe'),
    },
  ]}
>
  <Expandable
    selectable={{
      id: 'showMoreDesc',
      selectedId,
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
        selectedId,
        onSelect: () => push(`/episodes/${episode.id}`),
      }}
    />
  {/each}
</View>

<style>
  /* your styles go here */
</style>
