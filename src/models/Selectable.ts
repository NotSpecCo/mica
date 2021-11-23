export type Selectable = {
  id: string;
  shortcut?: string | number;
  selected?: boolean;
  onSelect?: () => void;
};
