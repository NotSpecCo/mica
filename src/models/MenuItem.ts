export type MenuItem = {
  id: string;
  label: string;
  inProgress?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  closeAfterAction?: boolean;
  action: () => Promise<void> | void;
};
