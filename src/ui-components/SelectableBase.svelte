<script lang="ts">
  import type { Selectable } from '../models';

  export let selectable: Selectable;
</script>

<div
  class="root"
  class:selected={selectable.selectedId === selectable.id}
  data-selectable-id={selectable.id}
  data-selectable-shortcut={selectable.shortcut}
  on:itemselected={selectable.onSelect}
>
  <slot />
</div>

<style>
  .root {
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }

  .root.selected {
    border-color: var(--primary-text-color);
  }
</style>
