<script lang="ts">
  import type { SearchResult } from 'foxcasts-core/lib/types';
  import { onDestroy, onMount } from 'svelte';
  import { push, querystring, replace } from 'svelte-spa-router';
  import { Core } from '../services/core';
  import Input from '../ui-components/Input.svelte';
  import ListItem from '../ui-components/ListItem.svelte';
  import View from '../ui-components/View.svelte';

  let searchResults: SearchResult[] = [];

  onMount(() => {
    const q = new URLSearchParams($querystring).get('query');
    if (q) {
      search();
    }
  });

  let selectedId: string;
  let query: string;
  const queryUnsub = querystring.subscribe((val) => {
    const params = new URLSearchParams(val);
    selectedId = params.get('selected');
    query = params.get('query');
  });
  onDestroy(queryUnsub);

  function handleSearchInput(ev: InputEvent) {
    const q = new URLSearchParams();
    q.append('query', (ev.target as HTMLInputElement).value);
    q.append('selected', selectedId);

    replace(`/search?${q.toString()}`);
  }

  async function search() {
    searchResults = await Core.podcasts.search(query);
  }
</script>

<View
  headerText="Search"
  centerText={!selectedId ? '' : selectedId === 'search' ? 'Search' : 'Select'}
  menuItems={[
    {
      id: 'menu_clear',
      label: 'Clear search',
      closeAfterAction: true,
      action: () => console.log('clear search'),
    },
  ]}
>
  <div class="search">
    <Input
      value={query}
      placeholder="Search..."
      selectable={{
        id: 'search',
        selectedId,
        onSelect: search,
      }}
      on:input={handleSearchInput}
    />
  </div>
  {#each searchResults as result (result.podexId)}
    <ListItem
      title={result.title}
      selectable={{
        id: result.podexId.toString(),
        selectedId,
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
