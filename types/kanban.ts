//types/kanban.ts
export type Priority = 'low' | 'medium' | 'high';
export type Tag = {
  id: string;
  label: string;
};
export type Task = {
  id: string;
  title: string;
  description?: string;
  tags?: Tag[];
  assignee?: { id: string; name: string; initials?: string };
  priority?: Priority;
  progress?: number;
};
export type List = {
  id: string;
  title: string;
  color?: string;
  tasks: Task[];
};

export type BoardUI = {
  id: string;
  title: string;
  list: List[];
};
