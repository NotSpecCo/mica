export type MenuItem = {
  id: string;
  label: string;
  action: () => Promise<void> | void;
};
