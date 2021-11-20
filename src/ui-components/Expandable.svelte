<script lang="ts">
  import type { Selectable } from '../models';
  import SelectableBase from '../ui-components/SelectableBase.svelte';

  export let selectable: Selectable;

  let expanded = false;
</script>

<div class="root">
  <div class="content" class:expanded>
    <slot />
  </div>
  {#if !expanded}
    <SelectableBase
      selectable={{
        ...selectable,
        onSelect: () => (expanded = true),
      }}
    >
      <div class="show-more" class:expanded>Show more</div>
    </SelectableBase>
  {/if}
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content {
    max-height: 65px;
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
    padding: 0 5px;
  }
  .show-more.expanded {
    display: none;
  }
</style>
