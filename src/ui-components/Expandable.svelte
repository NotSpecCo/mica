<script lang="ts">
  import type { Selectable } from '../models';

  export let selectable: Selectable;

  let expanded = false;
</script>

<div class="root">
  <div class="content" class:expanded>
    <slot />
  </div>
  {#if !expanded}
    <div
      class="show-more"
      class:selected={selectable.selectedId === selectable.id}
      class:expanded
      data-selectable-id={selectable.id}
      data-selectable-shortcut={selectable.shortcut}
      on:itemselected={() => (expanded = true)}
    >
      Show more
    </div>
  {/if}
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content {
    max-height: 60px;
    overflow: hidden;
    position: relative;
  }
  .content::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    display: block;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.85), 30%, rgba(255, 255, 255, 0));
  }
  .content.expanded {
    max-height: inherit;
  }
  .content.expanded::before {
    display: none;
  }
  .show-more {
    text-align: center;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    width: 50%;
  }
  .show-more.selected {
    /* font-weight: 700; */
    border-color: var(--primary-text-color);
  }
  .show-more.expanded {
    display: none;
  }
</style>
