<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { location, pop, push, querystring, replace } from 'svelte-spa-router';
  import { onKeyPress } from '../hooks/onKeyPress';
  import { onNavigate } from '../hooks/onNavigate';
  import type { MenuItem } from '../models';
  import { selectedId } from '../stores/selectedId';
  import ListItem from './ListItem.svelte';

  export let headerText: string;
  export let menuOpen: boolean = false;
  export let menuItems: MenuItem[] = [];
  export let leftText: string = 'Home';
  export let centerText: string = 'Select';
  export let rightText: string = menuItems.length > 0 ? 'Menu' : '';

  const dispatch = createEventDispatcher();

  let selectedMenuId: string;

  let queryStringUnsub;
  onMount(() => {
    queryStringUnsub = querystring.subscribe((val) => {
      selectedId.set(new URLSearchParams(val).get('selected') || undefined);
    });
  });

  onDestroy(() => {
    queryStringUnsub();
    selectedId.set(undefined);
  });

  onNavigate(
    {
      onChange: (id) => {
        if (menuOpen && !id) {
          selectedMenuId = undefined;
        } else if (id?.startsWith('menu_')) {
          selectedMenuId = id;
        } else {
          const params = new URLSearchParams($querystring);
          if (id) {
            params.set('selected', id);
          } else {
            params.delete('selected');
          }
          replace(`${$location}?${params.toString()}`);
          dispatch('itemchanged', { id });
        }
      },
    },
    {
      disabled: false,
      initialSelectedId: new URLSearchParams($querystring).get('selected'),
    }
  );

  onKeyPress(
    {
      SoftLeft: () => {
        if ($location !== '/') {
          push('/');
        }
      },
      SoftRight: () => {
        if (menuItems.length === 0) return;
        selectedMenuId = undefined;
        menuOpen = !menuOpen;
      },
      Backspace: () => {
        if (menuOpen) {
          menuOpen = false;
          return;
        }

        // If on the main screen, let KaiOS minimize the app
        if ($location === '/') {
          return false;
        }
        pop();
      },
    },
    { stopPropagation: true }
  );

  async function handleAction(menuItem: MenuItem) {
    if (menuItems.some((a) => a.inProgress) || menuItem.disabled) return;

    menuItems = menuItems.map((a) => (a.id === menuItem.id ? { ...a, inProgress: true } : a));
    await menuItem.action();
    menuItems = menuItems.map((a) => (a.id === menuItem.id ? { ...a, inProgress: false } : a));

    if (menuItem.closeAfterAction) {
      menuOpen = false;
    }
  }
</script>

<div class="root">
  <header>{`${headerText || '\u00A0'}${menuOpen ? ' Menu' : ''}`}</header>
  <main class="content" data-selectable-scroller>
    {#if menuOpen}
      {#each menuItems as menuItem, i}
        <ListItem
          title={`${menuItem.label}${menuItem.inProgress ? '...' : ''}`}
          selectable={{
            id: `menu_${menuItem.id}`,
            selected: `menu_${menuItem.id}` === selectedMenuId,
            shortcut: i + 1 <= 9 ? i + 1 : undefined,
            onSelect: () => handleAction(menuItem),
          }}
        />
      {/each}
    {:else}
      <slot />
    {/if}
  </main>
  <footer>
    <div class="left">{leftText}</div>
    <div class="center">{centerText}</div>
    <div class="right">{rightText}</div>
  </footer>
</div>

<style>
  .root {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }

  header {
    border-bottom: 1px solid var(--primary-text-color);
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    padding: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  main {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px;
  }

  footer {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    padding: 3px 7px 2px 7px;
  }

  footer > div {
    flex: 1;
  }
  footer > .left {
    text-align: left;
  }
  footer > .center {
    text-align: center;
    font-weight: 700;
  }
  footer > .right {
    text-align: right;
  }
</style>
