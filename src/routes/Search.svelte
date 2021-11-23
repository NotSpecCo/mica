<script lang="ts">
  import type { SearchResult } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { push, querystring, replace } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import { selectedId } from '../stores/selectedId';
  import Input from '../ui-components/Input.svelte';
  import ListItem from '../ui-components/ListItem.svelte';
  import Typography from '../ui-components/Typography.svelte';
  import View from '../ui-components/View.svelte';

  let searchResults: SearchResult[] = [];
  let searching = false;

  onMount(() => {
    const q = new URLSearchParams($querystring).get('query');
    if (q) {
      search();
    }
  });

  let query: string;
  const queryUnsub = querystring.subscribe((val) => {
    const params = new URLSearchParams(val);
    query = params.get('query');
  });
  onDestroy(queryUnsub);

  function handleSearchInput(ev: InputEvent) {
    const q = new URLSearchParams($querystring);
    q.set('query', (ev.target as HTMLInputElement).value);
    replace(`/search?${q.toString()}`);
  }

  async function search() {
    if (searching) return;

    searching = true;
    searchResults = [];
    searchResults = await Core.podcasts.search(query);
    searching = false;
  }
</script>

<View
  headerText="Search"
  centerText={!$selectedId ? '' : $selectedId === 'search' ? 'Search' : 'Select'}
  menuItems={[
    {
      id: 'menu_clear',
      label: 'Clear search',
      closeAfterAction: true,
      action: () => {
        searchResults = [];
        replace(`/search`);
      },
    },
  ]}
>
  <div class="search">
    <Input
      value={query}
      placeholder="Search..."
      selectable={{
        id: 'search',
        onSelect: search,
      }}
      on:input={handleSearchInput}
    />
  </div>
  {#if searching}
    <Typography>Searching...</Typography>
  {/if}
  {#each searchResults as result (result.podexId)}
    <ListItem
      title={result.title}
      selectable={{
        id: result.podexId.toString(),
        onSelect: () => push(`/podcasts/preview?podexId=${result.podexId}`),
      }}
    />
  {/each}
</View>

<style>
  .search {
    margin-bottom: 5px;
  }
</style>
