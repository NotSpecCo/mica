<script lang="ts">
  import type { Selectable } from '../models';

  export let text: string;
  export let disabled: boolean = false;
  export let selectable: Selectable;
</script>

<div
  class="root"
  class:selected={selectable.selectedId === selectable.id}
  class:disabled
  data-selectable-id={selectable.id}
  data-selectable-shortcut={selectable.shortcut}
  on:itemselected={selectable.onSelect}
>
  {text}
</div>

<style>
  .root {
    padding: 2px 5px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }
  .root.selected {
    border-color: var(--primary-text-color);
  }
  .root.disabled {
    opacity: 0.5;
  }
</style>
