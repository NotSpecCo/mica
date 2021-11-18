<script lang="ts">
  import { differenceInMinutes, startOfDay } from 'date-fns';
  import { PlaybackStatus } from 'foxcasts-core/lib/enums';
  import type { EpisodeExtended, FilterList, Podcast } from 'foxcasts-core/lib/types';
  import { formatTime } from 'foxcasts-core/lib/utils';
  import { onDestroy, onMount } from 'svelte';
  import { push, querystring } from 'svelte-spa-router';
  import type { FilterViewOptions } from '../models';
  import { Core } from '../services/core';
  import { player } from '../stores/player';
  import Link from '../ui-components/Link.svelte';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  let newEpisodes: EpisodeExtended[] | undefined;
  let podcasts: Podcast[] | undefined;
  let filters: FilterList<FilterViewOptions>[] | undefined;

  onMount(() => {
    checkForNewEpisodes();

    Core.podcasts.queryAll({ isFavorite: 1 }).then((res) => (podcasts = res));
    getFilters();
  });

  let selectedId: string;
  const queryUnsub = querystring.subscribe((val) => {
    selectedId = new URLSearchParams(val).get('selected');
  });
  onDestroy(queryUnsub);

  async function checkForNewEpisodes(force = false) {
    const lastUpdate = localStorage.getItem('lastUpdate');

    if (force || !lastUpdate || differenceInMinutes(new Date(), new Date(lastUpdate)) > 60) {
      await Core.podcasts.checkForUpdates();
      localStorage.setItem('lastUpdate', new Date().toISOString());
    }

    newEpisodes = await Core.episodes.queryAll({
      afterDate: startOfDay(new Date()).toISOString(),
    });
  }

  async function getFilters() {
    const res = await Core.filters.queryAll<FilterViewOptions>();

    if (res.length === 0) {
      await Core.filters.add<FilterViewOptions>({
        title: 'Recent',
        query: { withinDays: 30, limit: 25 },
        isFavorite: 0,
        viewOptions: {
          title: 'title',
          subtitle: 'podcastTitle',
        },
      });
      await Core.filters.add<FilterViewOptions>({
        title: 'Favorites',
        query: { isFavorite: 1 },
        isFavorite: 0,
        viewOptions: {
          title: 'title',
          subtitle: 'podcastTitle',
        },
      });
      await Core.filters.add<FilterViewOptions>({
        title: 'In Progress',
        query: { playbackStatuses: [PlaybackStatus.InProgress] },
        isFavorite: 0,
        viewOptions: {
          title: 'title',
          subtitle: 'podcastTitle',
        },
      });
      filters = await Core.filters.queryAll<FilterViewOptions>();
    } else {
      filters = res;
    }
  }
</script>

<View
  headerText="Home"
  leftText=""
  menuItems={[
    {
      id: 'menu_refresh',
      label: 'Check for new episodes',
      closeAfterAction: true,
      action: () => checkForNewEpisodes(true),
    },
  ]}
>
  {#if $player.episode}
    <Typography type="titleSmall">Now Playing</Typography>
    <ListItem
      title={$player.episode.title}
      subtitle={`${formatTime($player.currentTime)} / ${formatTime($player.duration || 0)}`}
      selectable={{
        id: `player`,
        selectedId,
        onSelect: () => push(`/player`),
      }}
    />
  {/if}
  <Typography type="titleSmall">What's new?</Typography>
  {#if !newEpisodes}
    <Typography>Checking for new episodes...</Typography>
  {:else}
    {#each newEpisodes as episode (episode.id)}
      <ListItem
        title={episode.title}
        subtitle={episode.podcastTitle}
        selectable={{
          id: `episode_${episode.id}`,
          selectedId,
          onSelect: () => push(`/episodes/${episode.id}`),
        }}
      />
    {/each}
  {/if}
  <Typography type="titleSmall">Episodes</Typography>
  {#if !filters}
    <Typography>Loading...</Typography>
  {:else}
    {#each filters as filter (filter.id)}
      <ListItem
        title={filter.title}
        selectable={{
          id: `filter_${filter.id}`,
          selectedId,
          onSelect: () => push(`/episodes/filter/${filter.id}`),
        }}
      />
    {:else}
      <Typography>No filters</Typography>
    {/each}
  {/if}

  <Typography type="titleSmall">Podcasts</Typography>
  {#if !podcasts}
    <Typography>Loading...</Typography>
  {:else}
    {#each podcasts as podcast (podcast.id)}
      <ListItem
        title={podcast.title}
        selectable={{
          id: `podcast_${podcast.id}`,
          selectedId,
          onSelect: () => push(`/podcasts/${podcast.id}`),
        }}
      />
    {:else}
      <Typography style="italic">Favorite podcasts will appear here.</Typography>
    {/each}
    <Link
      text="View all"
      selectable={{
        id: 'viewAllPodcasts',
        selectedId,
        onSelect: () => push(`/podcasts`),
      }}
    />
  {/if}
  <Typography type="titleSmall">Other</Typography>
  <ListItem
    title="Settings"
    selectable={{
      id: 'settings',
      selectedId,
      onSelect: () => push(`/settings`),
    }}
  />
  <ListItem
    title="About"
    selectable={{
      id: 'about',
      selectedId,
      onSelect: () => push(`/about`),
    }}
  />
</View>

<style>
</style>
