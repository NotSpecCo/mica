<script lang="ts">
  import { joinClasses } from '../utils';

  export let display: 'block' | 'inline' = 'block';
  export let type: 'caption' | 'body' | 'bodyLarge' | 'titleSmall' | 'title' | 'titleLarge' =
    'body';
  export let color: 'primary' | 'secondary' | 'accent' = 'primary';
  export let decoration: 'none' | 'underline' = 'none';
  export let transform: 'none' | 'uppercase' | 'lowercase' = 'none';
  export let align: 'left' | 'center' | 'right' = 'left';
  export let padding: 'vertical' | 'horizontal' | 'both' | 'none' = 'both';
  export let wrap: 'wrap' | 'nowrap' = 'wrap';
</script>

<div
  class={joinClasses(
    display,
    type,
    color,
    decoration,
    transform,
    align,
    `padding-${padding}`,
    wrap
  )}
>
  <slot />
</div>

<style>
  .block {
    display: block;
  }
  .inline {
    display: inline;
    padding: 0;
  }

  .caption {
    font-size: 1.2rem;
    font-weight: 400;
  }
  .body {
    font-size: 1.4rem;
    font-weight: 400;
  }
  .bodyLarge {
    font-size: 1.6rem;
    font-weight: 400;
  }
  .titleSmall {
    font-size: 1.4rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .title {
    font-size: 1.6rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .titleLarge {
    font-size: 1.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .primary {
    color: var(--primary-text-color);
  }
  .secondary {
    color: var(--secondary-text-color);
  }
  .accent {
    color: var(--accent-text-color);
  }

  .underline {
    text-decoration: underline;
  }

  .lowercase {
    text-transform: lowercase;
  }
  .uppercase {
    text-transform: uppercase;
  }

  .left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }

  .padding-vertical {
    padding: 5px 0;
  }
  .padding-horizontal {
    padding: 0 5px;
  }
  .padding-both {
    padding: 5px;
  }
  .padding-none {
    padding: 0;
  }

  .wrap {
    white-space: initial;
  }

  .nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
