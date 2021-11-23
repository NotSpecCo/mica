<script lang="ts">
  import { onKeyPress } from '../hooks/onKeyPress';
  import type { Selectable } from '../models';
  import { selectedId } from '../stores/selectedId';
  import Icon, { IconSize } from './Icon.svelte';
  import SelectableBase from './SelectableBase.svelte';

  export let label: string;
  export let valueLabel: string = undefined;
  export let increment: number = 1;
  export let value: number;
  export let min: number;
  export let max: number;
  export let onChange: (value: any) => void;
  export let selectable: Selectable;

  function change(change: number): void {
    let nextValue = Math.round((value + change) * 100) / 100;
    if (nextValue < min) {
      nextValue = min;
    } else if (nextValue > max) {
      nextValue = max;
    }

    onChange(nextValue);
  }

  onKeyPress(
    {
      ArrowLeft: () => {
        if (selectable.id === $selectedId) {
          change(increment * -1);
          return true;
        }
        return false;
      },
      ArrowRight: () => {
        if (selectable.id === $selectedId) {
          change(increment);
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
      {`${value}${valueLabel || ''}`}
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
