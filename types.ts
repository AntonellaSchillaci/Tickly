export interface Task {
    id: string;
    text: string;
    completed?: boolean;
    reminderTime?: Date | null;
  }
  