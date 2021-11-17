<script lang="ts">
  import type { Selectable } from '../models';

  export let value: string;
  export let disabled: boolean = false;
  export let type: 'text' | 'number' = 'text';
  export let placeholder: string;
  export let selectable: Selectable;

  let input: HTMLInputElement;
  $: if (selectable.selectedId === selectable.id) {
    input?.focus({ preventScroll: true });
  } else {
    input?.blur();
  }
</script>

<div
  class="root"
  class:selected={selectable.selectedId === selectable.id}
  data-selectable-id={selectable.id}
  data-selectable-shortcut={selectable.shortcut}
  on:itemselected={selectable.onSelect}
>
  <input
    class:selected={selectable.selectedId === selectable.id}
    {type}
    {value}
    {placeholder}
    {disabled}
    on:input
    bind:this={input}
  />
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    width: 100%;
  }
  input.selected {
    border-bottom: 2px solid var(--primary-text-color);
    font-weight: 600;
  }
</style>
