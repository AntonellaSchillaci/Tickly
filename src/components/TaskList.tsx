import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from './TaskItem';
import { Task } from '../../types';

type Props = {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isCompletedView?: boolean;
};

export default function TaskList({ tasks, onComplete, onDelete, isCompletedView }: Props) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onComplete={onComplete}
          onDelete={onDelete}
          isCompletedView={isCompletedView}
        />
      )}
    />
  );
}
