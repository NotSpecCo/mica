<script lang="ts">
  import { format } from 'date-fns';
  import type { EpisodeExtended, FilterList } from 'foxcasts-core/lib/types';
  import { formatFileSize, formatTime } from 'foxcasts-core/lib/utils';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import type { FilterViewOptions, LineOptions } from '../models';
  import { Core } from '../services/core';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  export let params: { filterId: string };

  let filter: FilterList<FilterViewOptions> | undefined;
  let episodes: EpisodeExtended[] | undefined;

  onMount(async () => {
    filter = await Core.filters.get<FilterViewOptions>({ id: Number(params.filterId) });
    episodes = await Core.episodes.queryAll(filter.query);
  });

  function getText(episode: EpisodeExtended, field: LineOptions | null): string | undefined {
    if (field === 'date') {
      return format(new Date(episode.date), 'cccc, MMM do');
    } else if (field === 'description') {
      return episode.description;
    } else if (field === 'duration') {
      return formatTime(episode.duration);
    } else if (field === 'fileSize') {
      return formatFileSize(episode.fileSize);
    } else if (field === 'podcastTitle') {
      return episode.podcastTitle;
    } else if (field === 'title') {
      return episode.title;
    } else {
      return undefined;
    }
  }
</script>

<View headerText={filter?.title}>
  {#if !episodes}
    <Typography>Loading...</Typography>
  {:else}
    {#each episodes as episode (episode.id)}
      <ListItem
        title={getText(episode, filter.viewOptions.title)}
        subtitle={getText(episode, filter.viewOptions.subtitle)}
        selectable={{
          id: episode.id.toString(),
          onSelect: () => push(`/episodes/${episode.id}`),
        }}
      />{:else}
      <Typography>No episodes</Typography>
    {/each}
  {/if}
</View>
