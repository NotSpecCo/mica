export type Selectable = {
  id: string;
  shortcut?: string | number;
  selectedId: string;
  onSelect?: () => void;
};
