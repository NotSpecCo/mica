<script lang="ts">
  import { IconSize } from '../enums/icon';
  import type { IconName, Selectable } from '../models';
  import Icon from './Icon.svelte';
  import SelectableBase from './SelectableBase.svelte';

  export let icon: IconName = undefined;
  export let title: string;
  export let subtitle: string = undefined;
  export let selectable: Selectable;
</script>

<SelectableBase {selectable}>
  <div class="root">
    {#if icon}
      <div class="icon">
        <Icon {icon} size={IconSize.Small} />
      </div>
    {/if}
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
</SelectableBase>

<style>
  .root {
    padding: 4px 5px;
    display: flex;
    font-size: 1.5rem;
  }

  .shortcut {
    margin: 0 5px 0 -5px;
    font-weight: 600;
  }

  .icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 5px;
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
