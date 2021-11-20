<script lang="ts">
  import type { Podcast } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { push, querystring } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import ListItem from '../ui-components/ListItem.svelte';
  import View from '../ui-components/View.svelte';

  let podcasts: Podcast[] | undefined;

  onMount(async () => {
    podcasts = await Core.podcasts.queryAll({});
  });

  let selectedId: string;

  const queryUnsub = querystring.subscribe((val) => {
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);

  async function seedData(): Promise<void> {
    try {
      // Need to do one at a time so KaiOS can handle it
      await Core.podcasts.subscribe({ feedUrl: 'https://feed.syntax.fm/rss' });
      await Core.podcasts.subscribe({ feedUrl: 'https://shoptalkshow.com/feed/podcast' });
      await Core.podcasts.subscribe({ feedUrl: 'https://feeds.simplecast.com/JoR28o79' }); // React Podcast
      await Core.podcasts.subscribe({
        feedUrl: 'https://feeds.feedwrench.com/js-jabber.rss',
      });
      await Core.podcasts.subscribe({ feedUrl: 'https://feeds.megaphone.fm/vergecast' });

      console.log('seed success');
      podcasts = await Core.podcasts.queryAll({});
    } catch (err) {
      console.error('Failed to seed data', err);
    }
  }
</script>

<View
  headerText="Podcasts"
  menuItems={[
    {
      id: 'menu_seed',
      label: 'Seed podcasts',
      closeAfterAction: true,
      action: () => seedData(),
    },
    {
      id: 'menu_add',
      label: 'Add podcasts',
      action: () => push('/search'),
    },
    {
      id: 'menu_import',
      label: 'Import OPML file',
      action: () => push('/podcasts/import'),
    },
  ]}
>
  {#if podcasts === undefined}
    Loading...
  {:else if podcasts.length === 0}
    No podcasts
  {:else}
    {#each podcasts as podcast (podcast.id)}
      <ListItem
        title={podcast.title}
        selectable={{
          id: podcast.id.toString(),
          selectedId,
          onSelect: () => push(`/podcasts/${podcast.id}`),
        }}
      />
    {/each}
  {/if}
</View>

<style>
  /* your styles go here */
</style>
