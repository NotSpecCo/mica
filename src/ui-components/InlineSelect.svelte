<script lang="ts">
  import { onKeyPress } from '../hooks/onKeyPress';
  import type { Option, Selectable } from '../models';
  import { getIndexWrap } from '../utils';
  import Icon, { IconSize } from './Icon.svelte';
  import SelectableBase from './SelectableBase.svelte';

  export let label: string;
  export let options: Option[];
  export let value: string;
  export let onChange: (value: any) => void;
  export let selectable: Selectable;

  function change(change: 1 | -1): void {
    const nextIndex = getIndexWrap(
      options,
      options.findIndex((a) => a.id === value),
      change
    );
    onChange(options[nextIndex].id);
  }

  onKeyPress(
    {
      ArrowLeft: () => {
        if (selectable.id === selectable.selectedId) {
          change(-1);
          return true;
        }
        return false;
      },
      ArrowRight: () => {
        if (selectable.id === selectable.selectedId) {
          change(1);
          return true;
        }
        return false;
      },
    },
    { stopPropagation: true, capture: true }
  );
</script>

<SelectableBase {selectable}>
  <div class="root">
    {label}
    <div class="flex" />
    <Icon icon="chevronLeft" size={IconSize.Small} />
    <div class="label">
      {options.find((a) => a.id === value)?.label}
    </div>
    <Icon icon="chevronRight" size={IconSize.Small} />
  </div>
</SelectableBase>

<style>
  .root {
    display: flex;
    align-items: center;
    padding: 7px 5px;
  }

  .flex {
    flex: 1;
  }
</style>
