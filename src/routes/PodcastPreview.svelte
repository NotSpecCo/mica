<script lang="ts">
  import type { ApiEpisode, ApiPodcast } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import Expandable from '../ui-components/Expandable.svelte';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  let podexId: number | undefined;
  let feedUrl: string | undefined;

  let podcast: ApiPodcast | undefined;
  let episodes: ApiEpisode[] = [];
  let subscribed = false;

  onMount(async () => {
    podcast = await Core.podcasts.fetch(podexId ? Number(podexId) : null, feedUrl);
    episodes = await Core.episodes.fetch(podexId ? Number(podexId) : null, feedUrl, 20);
    Core.podcasts.query({ podexId: Number(podexId), feedUrl }).then((res) => (subscribed = !!res));
  });

  const queryUnsub = querystring.subscribe((val) => {
    const params = new URLSearchParams(val);
    podexId = Number(params.get('podexId')) || undefined;
    feedUrl = params.get('feedUrl');
  });
  onDestroy(queryUnsub);
</script>

<View
  headerText={podcast?.title}
  menuItems={[
    {
      id: 'menu_subscribe',
      label: subscribed ? 'Unsubscribe' : 'Subscribe',
      closeAfterAction: true,
      action: async () => {
        if (subscribed) {
          await Core.podcasts.unsubscribe({ podexId, feedUrl });
          subscribed = false;
        } else {
          await Core.podcasts.subscribe({ podexId, feedUrl }, 50);
          subscribed = true;
        }
      },
    },
  ]}
>
  {#if podcast}
    <Expandable
      selectable={{
        id: 'showMoreDesc',
      }}
    >
      <Typography>{podcast?.description}</Typography>
    </Expandable>
    <Typography type="titleSmall" transform="uppercase">Episodes</Typography>
  {/if}
  {#each episodes as episode (episode.podexId)}
    <ListItem
      title={episode.title}
      selectable={{
        id: episode.podexId.toString(),
      }}
    />
  {/each}
</View>
