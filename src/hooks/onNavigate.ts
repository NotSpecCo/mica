import { afterUpdate, onDestroy } from 'svelte';

type Options = {
  capture?: boolean;
  initialSelectedId?: string;
  disabled: boolean;
};
export function onNavigate(
  callbacks: { onChange?: (id: string) => void; onSelect?: (id: string) => void },
  options: Options
) {
  let selectedId = options.initialSelectedId;

  if (selectedId) callbacks.onChange?.(selectedId);

  function handleKeyPress(ev: KeyboardEvent): void {
    // Check if valid key
    const target = ev.target as HTMLElement | null;
    const shortcutKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const dpadKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    if (
      options.disabled ||
      ![...dpadKeys, ...shortcutKeys].includes(ev.key) ||
      (shortcutKeys.includes(ev.key) && target?.tagName.toLowerCase() === 'input')
    )
      return;

    ev.preventDefault();

    if (ev.key === 'Enter') {
      const element: HTMLElement = document.querySelector(`[data-selectable-id="${selectedId}"]`);
      element?.dispatchEvent(new CustomEvent('itemselected'));
    } else if (shortcutKeys.includes(ev.key)) {
      const element: HTMLElement = document.querySelector(`[data-selectable-shortcut="${ev.key}"]`);
      if (element) {
        selectedId = element.dataset.selectableId;
        callbacks.onChange?.(selectedId);
        element.dispatchEvent(new CustomEvent('itemselected'));
      }
    } else {
      const elements: HTMLElement[] = Array.from(document.querySelectorAll(`[data-selectable-id]`));
      const index = elements.findIndex((a) => a.dataset.selectableId === selectedId);
      let newIndex = ev.key === 'ArrowUp' ? index - 1 : index + 1;

      if (newIndex <= -1 && ev.key === 'ArrowUp' && !scroll('up')) {
        console.log('not at top yet');
        selectedId = undefined;
        callbacks.onChange?.(selectedId);
        return;
      } else if (newIndex === elements.length && ev.key === 'ArrowDown' && !scroll('down')) {
        console.log('not at bottom yet');
        return;
      }

      if (index === -1 && ev.key === 'ArrowUp') {
        newIndex = elements.length - 1;
      } else if (newIndex < -1) {
        newIndex = -1;
      } else if (newIndex > elements.length - 1) {
        newIndex = 0;
      }

      selectedId = elements[newIndex]?.dataset.selectableId;
      callbacks.onChange?.(selectedId);
    }
  }

  afterUpdate(() => {
    const scroller: HTMLElement = document.querySelector(`[data-selectable-scroller]`);
    const element: HTMLElement = document.querySelector(`[data-selectable-id="${selectedId}"]`);
    if (scroller && element) {
      scrollIntoView(scroller, element);
    }
  });

  document.addEventListener('keydown', handleKeyPress, options.capture);

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyPress, options.capture);
  });
}

function scroll(direction: 'up' | 'down'): boolean {
  const scroller: HTMLElement = document.querySelector(`[data-selectable-scroller]`);
  if (!scroller) return true;

  scroller.scrollBy({
    top: (scroller.clientHeight / 3) * (direction === 'up' ? -1 : 1),
    behavior: 'smooth',
  });

  if (direction === 'up' && scroller.scrollTop === 0) {
    return true;
  } else if (
    direction === 'down' &&
    scroller.scrollTop + scroller.clientHeight === scroller.scrollHeight
  ) {
    return true;
  } else {
    return false;
  }
}

function scrollIntoView(
  scroller: HTMLElement,
  element: HTMLElement,
  behavior: 'smooth' | 'auto' = 'smooth'
): void {
  const rect = element.getBoundingClientRect();

  if (rect.top - scroller.offsetTop < 0) {
    scroller.scroll({
      top: scroller.scrollTop + rect.top - scroller.offsetTop,
      behavior,
    });
    return;
  }

  const diff = rect.bottom - (scroller.offsetHeight + scroller.offsetTop);

  if (diff > 0) {
    scroller.scroll({ top: scroller.scrollTop + diff, behavior });
  }
}
