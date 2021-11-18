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
  let firstUpdate = !!options.initialSelectedId;
  let selectedId = options.initialSelectedId;

  if (selectedId) {
    callbacks.onChange?.(selectedId);
  }

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

    const allItems = Array.from(document.querySelectorAll(`[data-selectable-id]`)).map(
      (a: HTMLElement) => ({
        id: a.dataset.selectableId,
        shortcut: a.dataset.selectableShortcut,
        element: a,
      })
    );
    const currentIndex = allItems.findIndex((a) => a.id === selectedId);
    const nextItem = shortcutKeys.includes(ev.key)
      ? allItems.find((a) => a.shortcut === ev.key)
      : ev.key === 'Enter'
      ? allItems[currentIndex]
      : ev.key === 'ArrowDown'
      ? allItems[currentIndex + 1]
      : allItems[currentIndex - 1];

    selectedId = nextItem?.id;
    callbacks.onChange?.(nextItem?.id);

    if (ev.key === 'Enter' || shortcutKeys.includes(ev.key)) {
      nextItem?.element.dispatchEvent(new CustomEvent('itemselected'));
      return;
    }

    if (nextItem || !scrollContent(ev.key === 'ArrowUp' ? 'up' : 'down')) {
      return;
    }

    const nextItemWrapped = allItems[ev.key === 'ArrowUp' ? allItems.length - 1 : 0];
    selectedId = nextItemWrapped?.id;
    callbacks.onChange?.(nextItemWrapped?.id);
  }

  afterUpdate(() => {
    const success = scrollIntoView(selectedId, firstUpdate ? 'auto' : 'smooth');
    if (success) {
      firstUpdate = false;
    }
  });

  document.addEventListener('keydown', handleKeyPress, options.capture);

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyPress, options.capture);
  });
}

function scrollContent(direction: 'up' | 'down'): boolean {
  const scroller: HTMLElement = document.querySelector(`[data-selectable-scroller]`);
  if (!scroller) return true;

  scroller.scrollBy({
    top: (scroller.clientHeight / 3) * (direction === 'up' ? -1 : 1),
    behavior: 'smooth',
  });

  return (
    (direction === 'up' && scroller.scrollTop === 0) ||
    (direction === 'down' && scroller.scrollTop + scroller.clientHeight === scroller.scrollHeight)
  );
}

function scrollIntoView(selectableId: string, behavior: 'smooth' | 'auto' = 'smooth'): boolean {
  const scroller: HTMLElement = document.querySelector(`[data-selectable-scroller]`);
  const element: HTMLElement = document.querySelector(`[data-selectable-id="${selectableId}"]`);

  if (!scroller || !element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const topDiff = scroller.offsetTop - rect.top;
  const bottomDiff = rect.bottom - (scroller.offsetHeight + scroller.offsetTop);

  scroller.scrollBy({
    top: topDiff > 0 ? -topDiff : bottomDiff > 0 ? bottomDiff : 0,
    behavior,
  });

  return true;
}
