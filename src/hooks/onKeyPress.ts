import { onDestroy } from 'svelte';

interface Options {
  capture?: boolean;
  stopPropagation?: boolean;
  disabled?: boolean;
  allowInInputs?: boolean;
}

type NavKey =
  | 'Escape'
  | 'SoftLeft'
  | 'SoftRight'
  | 'Backspace'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter';

export function onKeyPress(
  actions: { [key in NavKey]?: (ev: KeyboardEvent) => any },
  options: Options = {}
) {
  const keys = [
    'Escape',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Enter',
    'SoftLeft',
    'SoftRight',
    'Backspace',
  ];

  function parseKey(ev: KeyboardEvent): string {
    // Simulate soft keys for testing purposes
    if (ev.shiftKey && ev.key === 'ArrowLeft') {
      return 'SoftLeft';
    }
    if (ev.shiftKey && ev.key === 'ArrowRight') {
      return 'SoftRight';
    }
    return ev.key;
  }

  function handleKeyPress(ev: KeyboardEvent): void {
    const key = parseKey(ev);

    if (
      options.disabled ||
      !keys.includes(key) ||
      ((ev.target as HTMLElement).tagName === 'INPUT' && !options.allowInInputs)
    ) {
      return;
    }

    const action = actions[key as NavKey];
    if (!action) {
      return;
    }

    const handled = action(ev);
    if (handled === false) {
      return;
    }

    if (options.stopPropagation) {
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  }

  document.addEventListener('keydown', handleKeyPress, options.capture);

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyPress, options.capture);
  });
}
