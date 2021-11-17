<script lang="ts">
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
    const id = new URLSearchParams(val).get('selected');
    console.log('query string id', id);
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);
</script>

<View
  headerText="Episode"
  menuItems={[
    {
      id: 'menu_unsubscribe',
      label: 'Unsubscribe',
      action: () => console.log('unsubscribe'),
    },
  ]}
>
  <Typography type="titleSmall">{episode?.title}</Typography>
  <Typography>{episode?.description}</Typography>
</View>
