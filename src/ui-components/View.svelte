<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { location, querystring, replace } from 'svelte-spa-router';
  import { onKeyPress } from '../hooks/onKeyPress';
  import { onNavigate } from '../hooks/onNavigate';
  import type { MenuItem } from '../models';
  import ListItem from './ListItem.svelte';

  export let headerText: string;
  export let menuOpen: boolean = false;
  export let menuItems: MenuItem[] = [];
  export let leftText: string = '';
  export let centerText: string = 'Select';
  export let rightText: string = menuItems.length > 0 ? 'Menu' : '';

  const dispatch = createEventDispatcher();

  let selectedMenuId: string;

  onNavigate(
    {
      onChange: (id) => {
        if (menuOpen && !id) {
          selectedMenuId = undefined;
        } else if (id?.startsWith('menu_')) {
          selectedMenuId = id;
        } else {
          replace(id ? `${$location}?selected=${id}` : $location);
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
      SoftRight: () => {
        selectedMenuId = undefined;
        menuOpen = !menuOpen;
      },
      Backspace: () => {
        // If on the main screen, let KaiOS minimize the app
        if (window.location.pathname.includes('/podcasts')) {
          return false;
        }
        window.history.back();
      },
    },
    {}
  );
</script>

<div class="root">
  <header>{`${headerText || '\u00A0'}${menuOpen ? ' Menu' : ''}`}</header>
  <main class="content" data-selectable-scroller>
    {#if menuOpen}
      {#each menuItems as menuItem, i}
        <ListItem
          title={menuItem.label}
          selectable={{
            id: `menu_${menuItem.id}`,
            selectedId: selectedMenuId,
            shortcut: i + 1 <= 9 ? i + 1 : undefined,
            onSelect: menuItem.action,
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
    font-size: 1.3rem;
    font-weight: 500;
    text-transform: uppercase;
    padding: 5px;
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
