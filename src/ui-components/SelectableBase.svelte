<script lang="ts">
  import type { Selectable } from '../models';
  import { selectedId } from '../stores/selectedId';

  export let selectable: Selectable;
</script>

<div
  class="root"
  class:selected={selectable.selected || ($selectedId && selectable.id === $selectedId)}
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
