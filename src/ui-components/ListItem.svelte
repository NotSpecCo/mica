<script lang="ts">
  import type { Selectable } from '../models';

  export let title: string;
  export let subtitle: string = undefined;
  export let selectable: Selectable;
</script>

<div
  class="root"
  class:selected={selectable.selectedId === selectable.id}
  data-selectable-id={selectable.id}
  data-selectable-shortcut={selectable.shortcut}
  on:itemselected={selectable.onSelect}
>
  {#if selectable.shortcut}
    <div class="shortcut">{selectable.shortcut}</div>
  {/if}
  <div class="container">
    <div class="title">{title}</div>
    {#if subtitle}
      <div class="subtitle">{subtitle}</div>
    {/if}
  </div>
</div>

<style>
  .root {
    padding: 4px 5px;
    display: flex;
    /* align-items: center; */
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    font-size: 1.5rem;
  }

  .selected {
    border-color: var(--primary-text-color);
  }

  .shortcut {
    margin: 0 5px 0 -5px;
    font-weight: 600;
  }

  .title,
  .subtitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .subtitle {
    font-size: 1.2rem;
    color: var(--secondary-text-color);
  }
</style>
