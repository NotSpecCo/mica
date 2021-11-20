<script lang="ts">
  import type { Selectable } from '../models';
  import SelectableBase from './SelectableBase.svelte';

  export let text: string;
  export let disabled: boolean = false;
  export let selectable: Selectable;
</script>

<SelectableBase {selectable}>
  <div class="root" class:disabled>{text}</div>
</SelectableBase>

<style>
  .root {
    padding: 2px 5px;
  }
  .root.disabled {
    opacity: 0.5;
  }
</style>
